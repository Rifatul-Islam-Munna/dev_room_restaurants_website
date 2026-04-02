import { Hono } from 'hono'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/db'

import MenuItem from '@/model/MenuItem'
import { authMiddleware } from '../middleware/auth'
import Order from '@/model/order'
import User from '@/model/User'


const orders = new Hono()

const DELIVERY_FEE = 50
const TAX_RATE = 0.05
const ACTIVE_ORDER_STATUSES = ['Pending', 'Preparing', 'Serving'] as const
const COMPLETED_ORDER_STATUS = 'Completed' as const
const CANCELLED_ORDER_STATUS = 'Cancelled' as const
const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback


orders.post('/', authMiddleware, async (c) => {
  try {
    await connectDB()

    const user = c.get('user') // from authMiddleware

    const { customer, delivery, items, paymentMethod, notes } =
      await c.req.json()

    // Basic validation
    if (!customer?.name || !customer?.email || !customer?.phone) {
      return c.json(
        { success: false, message: 'customer name, email and phone are required' },
        400
      )
    }

    if (!delivery?.street || !delivery?.area || !delivery?.city || !delivery?.postalCode) {
      return c.json(
        { success: false, message: 'delivery street, area, city and postalCode are required' },
        400
      )
    }

    if (!Array.isArray(items) || items.length === 0) {
      return c.json(
        { success: false, message: 'Order must contain at least one item' },
        400
      )
    }

    // Validate each menuItemId against DB and build order items
    const orderItems = []

    for (const item of items) {
      if (!item.menuItemId || !item.quantity || item.quantity < 1) {
        return c.json(
          { success: false, message: 'Each item must have a valid menuItemId and quantity' },
          400
        )
      }

      const menuItem = await MenuItem.findById(item.menuItemId)

      if (!menuItem) {
        return c.json(
          { success: false, message: `Menu item not found: ${item.menuItemId}` },
          404
        )
      }

      if (!menuItem.available) {
        return c.json(
          { success: false, message: `Menu item is currently unavailable: ${menuItem.name}` },
          400
        )
      }

      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        subtitle: menuItem.subtitle ?? '',
        price: menuItem.price,         // always take price from DB, never trust client
        quantity: item.quantity,
        image: menuItem.image ?? '',
        category: menuItem.category ?? '',
      })
    }

    // Compute totals server-side
    const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0)
    const taxAmount = Math.round(subtotal * TAX_RATE)
    const total = subtotal + taxAmount + DELIVERY_FEE
    const itemCount = orderItems.reduce((s, i) => s + i.quantity, 0)

    // Generate IDs
    const timestamp = Date.now()
    const orderId = `ORD-${timestamp.toString().slice(-8)}`
    const orderNumber = `#SR-${Math.floor(1000 + Math.random() * 9000)}`

    const order = await Order.create({
      id: orderId,
      orderNumber,

      customer: {
        userId: user?.id ?? undefined,   
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },

      delivery: {
        street: delivery.street,
        area: delivery.area,
        city: delivery.city ?? 'Dhaka',
        postalCode: delivery.postalCode,
        notes: delivery.notes ?? '',
        type: delivery.type ?? 'delivery',
        tableNumber: delivery.tableNumber ?? '',
      },

      items: orderItems,
      itemCount,

      pricing: {
        subtotal,
        taxRate: TAX_RATE,
        taxAmount,
        deliveryFee: DELIVERY_FEE,
        total,
      },

      status: 'Pending',
      estimatedDeliveryTime: '30-45 minutes',

      paymentMethod: paymentMethod ?? 'Cash on Delivery',
      paymentStatus: 'paid',

      notes: notes ?? '',
    })

    return c.json(
      {
        success: true,
        message: 'Order placed successfully',
        data: order,
      },
      201
    )
  } catch (error: unknown) {
    return c.json(
      { success: false, message: getErrorMessage(error, 'Failed to place order') },
      500
    )
  }
})



orders.get('/', authMiddleware, async (c) => {
  try {
    await connectDB()

    const user = c.get('user')

    const id = c.req.query('id')
    const status = c.req.query('status')
    const userId = c.req.query('userId')
    const paymentStatus = c.req.query('paymentStatus')
    const search = c.req.query('search')
    const page = Number(c.req.query('page') || 1)
    const limit = Number(c.req.query('limit') || 10)

    
    if (id) {
      const order = await Order.findOne({ id })
        .populate('customer.userId', 'name email')
        .populate('items.menuItemId', 'name image price')

      if (!order) {
        return c.json({ success: false, message: 'Order not found' }, 404)
      }

      return c.json({ success: true, data: order })
    }

    const filter: Record<string, unknown> = {}

   
    if (user?.role !== 'admin') {
      filter['customer.userId'] = user.id
    } else if (userId) {
      filter['customer.userId'] = userId
    }

    if (status) {
      filter.status = status
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus
    }

    if (search) {
      filter.$or = [
        { id: { $regex: search, $options: 'i' } },
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
      ]
    }

    const safePage = page > 0 ? page : 1
    const safeLimit = limit > 0 ? limit : 10
    const skip = (safePage - 1) * safeLimit

    const [orderList, total] = await Promise.all([
      Order.find(filter)
        .populate('customer.userId', 'name email')
        .populate('items.menuItemId', 'name image price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      Order.countDocuments(filter),
    ])

    return c.json({
      success: true,
      data: orderList,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
        hasNextPage: safePage * safeLimit < total,
        hasPrevPage: safePage > 1,
      },
    })
  } catch (error: unknown) {
    return c.json(
      { success: false, message: getErrorMessage(error, 'Failed to fetch orders') },
      500
    )
  }
})
orders.get('/active', authMiddleware, async (c) => {
  try {
    await connectDB()

    const authUser = c.var.user
    const userId = authUser?.id || authUser?._id

    if (!userId) {
      return c.json(
        { success: false, message: 'Unauthorized user not found' },
        401
      )
    }

    const customerUserId = mongoose.isValidObjectId(String(userId))
      ? new mongoose.Types.ObjectId(String(userId))
      : userId
    const userOrderMatch = {
      'customer.userId': customerUserId,
    }

    const [user, activeOrders, summary] = await Promise.all([
      User.findById(userId)
        .select('name email phone image address createdAt')
        .lean(),

      Order.find({
        ...userOrderMatch,
        status: { $in: ACTIVE_ORDER_STATUSES },
      })
        .sort({ createdAt: -1 })
        .lean(),

      Order.aggregate([
        {
          $match: userOrderMatch,
        },
        {
          $facet: {
            totalOrders: [{ $count: 'count' }],
            cancelledOrders: [
              { $match: { status: CANCELLED_ORDER_STATUS } },
              { $count: 'count' },
            ],
            totalSpent: [
              { $match: { status: COMPLETED_ORDER_STATUS } },
              {
                $group: {
                  _id: null,
                  total: { $sum: '$pricing.total' },
                },
              },
            ],
          },
        },
      ]),
    ])

    const totalOrders = summary[0]?.totalOrders[0]?.count ?? 0
    const cancelledOrders = summary[0]?.cancelledOrders[0]?.count ?? 0
    const totalSpent = summary[0]?.totalSpent[0]?.total ?? 0

    return c.json({
      success: true,
      data: {
        user,
        activeOrders,
        totalOrders,
        cancelledOrders,
        totalSpent,
      },
    })
  } catch (error: unknown) {
    return c.json(
      {
        success: false,
        message: getErrorMessage(error, 'Failed to fetch active orders'),
      },
      500
    )
  }
})


orders.patch('/', authMiddleware, async (c) => {
  try {
    await connectDB()

    const user = c.get('user')
    const body = await c.req.json()
    const id = body?.id || c.req.query('id')

    if (!id) {
      return c.json(
        { success: false, message: 'Order id is required in body or query' },
        400
      )
    }

    const order = await Order.findOne({ id })

    if (!order) {
      return c.json({ success: false, message: 'Order not found' }, 404)
    }

    const adminOnlyFields = ['status', 'paymentStatus', 'estimatedDeliveryTime'] as const
    const isAdminOnlyUpdate = adminOnlyFields.some((field) => body[field] !== undefined)

    if (isAdminOnlyUpdate && user?.role !== 'admin') {
      return c.json(
        { success: false, message: 'Only admins can update order status or payment details' },
        403
      )
    }

    const allowedFields = ['status', 'paymentStatus', 'notes', 'estimatedDeliveryTime'] as const

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        order[key] = body[key]
      }
    }

    order.updatedAt = new Date()
    await order.save()

    return c.json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    })
  } catch (error: unknown) {
    return c.json(
      { success: false, message: getErrorMessage(error, 'Failed to update order') },
      500
    )
  }
})



orders.delete('/', authMiddleware, async (c) => {
  try {
    await connectDB()

    const id = c.req.query('id')

    if (!id) {
      return c.json(
        { success: false, message: 'Order id is required in query' },
        400
      )
    }

    const order = await Order.findOne({ id })

    if (!order) {
      return c.json({ success: false, message: 'Order not found' }, 404)
    }

    // only allow deletion of Pending orders (business rule)
    if (order.status !== 'Pending') {
      return c.json(
        {
          success: false,
          message: `Cannot delete an order with status "${order.status}". Only Pending orders can be cancelled.`,
        },
        400
      )
    }

    order.status = CANCELLED_ORDER_STATUS
    order.updatedAt = new Date()
    await order.save()

    return c.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    })
  } catch (error: unknown) {
    return c.json(
      { success: false, message: getErrorMessage(error, 'Failed to cancel order') },
      500
    )
  }
})

export default orders
