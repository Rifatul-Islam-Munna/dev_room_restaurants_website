import { Hono } from 'hono'

import MenuItem from '@/model/MenuItem'
import { authMiddleware } from '../middleware/auth'
import { connectDB } from '@/lib/db'
import Order from '@/model/order'



const dashboard = new Hono()

dashboard.get('/stats', authMiddleware, async (c) => {
  try {
    await connectDB()

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const [totalOrders, pendingOrders, menuItems, revenueTodayAgg] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: 'Pending' }),
        MenuItem.countDocuments(),
        Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfDay,
                $lte: endOfDay,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$pricing.total' },
            },
          },
        ]),
      ])

    const revenueToday = revenueTodayAgg[0]?.total || 0

    return c.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        revenueToday,
        menuItems,
      },
    })
  } catch (error: any) {
    return c.json(
      {
        success: false,
        message: error.message || 'Failed to fetch dashboard stats',
      },
      500
    )
  }
})

export default dashboard