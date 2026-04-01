import { Hono } from 'hono'
import { connectDB } from '@/lib/db'
import MenuItem from '@/model/MenuItem'
import { authMiddleware } from '../middleware/auth'

const menuItems = new Hono()


menuItems.post('/', authMiddleware, async (c) => {
  try {
    await connectDB()

    const {
      name,
      subtitle,
      description,
      price,
      category,
      image,
      chefsPick,
      available,
    } = await c.req.json()

    if (!name || !subtitle || price === undefined || !category || !image) {
      return c.json(
        {
          success: false,
          message: 'name, subtitle, price, category and image are required',
        },
        400
      )
    }

    const menuItem = await MenuItem.create({
      name,
      subtitle,
      description,
      price,
      category,
      image,
      chefsPick: chefsPick ?? false,
      available: available ?? true,
    })

    return c.json(
      {
        success: true,
        message: 'Menu item created successfully',
        data: menuItem,
      },
      201
    )
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})


menuItems.get('/', async (c) => {
  try {
    await connectDB()

    const id = c.req.query('id')
    const category = c.req.query('category')
    const available = c.req.query('available')
    const chefsPick = c.req.query('chefsPick')
    const search = c.req.query('search')
    const page = Number(c.req.query('page') || 1)
    const limit = Number(c.req.query('limit') || 10)

    // single item by id
    if (id) {
      const item = await MenuItem.findById(id)

      if (!item) {
        return c.json({ success: false, message: 'Menu item not found' }, 404)
      }

      return c.json({
        success: true,
        data: item,
      })
    }

    const filter: any = {}

    if (category) {
      filter.category = category
    }

    if (available !== undefined) {
      filter.available = available === 'true'
    }

    if (chefsPick !== undefined) {
      filter.chefsPick = chefsPick === 'true'
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ]
    }

    const safePage = page > 0 ? page : 1
    const safeLimit = limit > 0 ? limit : 10
    const skip = (safePage - 1) * safeLimit

    const [items, total] = await Promise.all([
      MenuItem.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      MenuItem.countDocuments(filter),
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


menuItems.patch('/', authMiddleware, async (c) => {
  try {
    await connectDB()

    const id = c.req.query('id')

    if (!id) {
      return c.json(
        { success: false, message: 'Menu item id is required in query' },
        400
      )
    }

    const body = await c.req.json()

    const item = await MenuItem.findById(id)

    if (!item) {
      return c.json({ success: false, message: 'Menu item not found' }, 404)
    }

    const allowedFields = [
      'name',
      'subtitle',
      'description',
      'price',
      'category',
      'image',
      'chefsPick',
      'available',
    ]

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        item[key] = body[key]
      }
    }

    await item.save()

    return c.json({
      success: true,
      message: 'Menu item updated successfully',
      data: item,
    })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})


menuItems.delete('/', authMiddleware, async (c) => {
  try {
    await connectDB()

    const id = c.req.query('id')

    if (!id) {
      return c.json(
        { success: false, message: 'Menu item id is required in query' },
        400
      )
    }

    const item = await MenuItem.findById(id)

    if (!item) {
      return c.json({ success: false, message: 'Menu item not found' }, 404)
    }

    await item.deleteOne()

    return c.json({
      success: true,
      message: 'Menu item deleted successfully',
    })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

export default menuItems