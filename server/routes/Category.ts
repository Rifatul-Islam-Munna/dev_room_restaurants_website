import { Hono } from 'hono'
import { connectDB } from '@/lib/db'
import Category from '@/model/Category'
import { authMiddleware } from '../middleware/auth'

const categories = new Hono()

// Create category
categories.post('/', authMiddleware, async (c) => {
  try {
    await connectDB()

    const { name, slug, sortOrder, isActive } = await c.req.json()

    if (!name || !slug) {
      return c.json(
        {
          success: false,
          message: 'name and slug are required',
        },
        400
      )
    }

    const existing = await Category.findOne({
      $or: [{ name }, { slug }],
    })

    if (existing) {
      return c.json(
        {
          success: false,
          message: 'Category name or slug already exists',
        },
        409
      )
    }

    const category = await Category.create({
      name,
      slug,
      sortOrder: sortOrder ?? 0,
      isActive: isActive ?? true,
    })

    return c.json(
      {
        success: true,
        message: 'Category created successfully',
        data: category,
      },
      201
    )
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// Get categories with query, filters and pagination
categories.get('/', async (c) => {
  try {
    await connectDB()

    const id = c.req.query('id')
    const slug = c.req.query('slug')
    const isActive = c.req.query('isActive')
    const search = c.req.query('search')
    const page = Number(c.req.query('page') || 1)
    const limit = Number(c.req.query('limit') || 10)

    // get single category by id
    if (id) {
      const category = await Category.findById(id)

      if (!category) {
        return c.json({ success: false, message: 'Category not found' }, 404)
      }

      return c.json({
        success: true,
        data: category,
      })
    }

    // get single category by slug
    if (slug) {
      const category = await Category.findOne({ slug })

      if (!category) {
        return c.json({ success: false, message: 'Category not found' }, 404)
      }

      return c.json({
        success: true,
        data: category,
      })
    }

    const filter: any = {}

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true'
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ]
    }

    const safePage = Math.max(page, 1)
    const safeLimit = Math.min(Math.max(limit, 1), 50)
    const skip = (safePage - 1) * safeLimit

    const [items, total] = await Promise.all([
      Category.find(filter)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      Category.countDocuments(filter),
    ])

    return c.json({
      success: true,
      data: items,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
        hasNextPage: safePage * safeLimit < total,
        hasPrevPage: safePage > 1,
      },
    })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// Update category by query id, only updates provided fields
categories.patch('/', authMiddleware, async (c) => {
  try {
    await connectDB()

    const id = c.req.query('id')

    if (!id) {
      return c.json(
        { success: false, message: 'Category id is required in query' },
        400
      )
    }

    const body = await c.req.json()

    const category = await Category.findById(id)

    if (!category) {
      return c.json({ success: false, message: 'Category not found' }, 404)
    }

    if (body.slug && body.slug !== category.slug) {
      const existingSlug = await Category.findOne({
        slug: body.slug,
        _id: { $ne: id },
      })

      if (existingSlug) {
        return c.json(
          { success: false, message: 'Slug already in use' },
          409
        )
      }
    }

    if (body.name && body.name !== category.name) {
      const existingName = await Category.findOne({
        name: body.name,
        _id: { $ne: id },
      })

      if (existingName) {
        return c.json(
          { success: false, message: 'Category name already in use' },
          409
        )
      }
    }

    const allowedFields = ['name', 'slug', 'sortOrder', 'isActive']

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        category[key] = body[key]
      }
    }

    await category.save()

    return c.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// Delete category by query id
categories.delete('/', authMiddleware, async (c) => {
  try {
    await connectDB()

    const id = c.req.query('id')

    if (!id) {
      return c.json(
        { success: false, message: 'Category id is required in query' },
        400
      )
    }

    const category = await Category.findById(id)

    if (!category) {
      return c.json({ success: false, message: 'Category not found' }, 404)
    }

    await category.deleteOne()

    return c.json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

export default categories