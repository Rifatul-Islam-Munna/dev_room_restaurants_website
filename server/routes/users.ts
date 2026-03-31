import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'

import { signToken } from '@/lib/jwt'

import User from '@/model/User'
import { authMiddleware } from '../middleware/auth'

const users = new Hono()


users.post('/register', async (c) => {
  try {
    await connectDB()
    const { fullName, email, phoneNumber, password } = await c.req.json()

   
    const existing = await User.findOne({ email })
    if (existing) {
      return c.json({ success: false, message: 'Email already in use' }, 409)
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
    })

    return c.json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    }, 201)
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})


users.post('/login', async (c) => {
  try {
    await connectDB()
    const { email, password } = await c.req.json()

   
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return c.json({ success: false, message: 'Invalid credentials' }, 401)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return c.json({ success: false, message: 'Invalid credentials' }, 401)
    }

    const access_token = await signToken({
      id: user._id.toString(),
      email: user.email,
    })

    return c.json({
      success: true,
      message: 'Login successful',
      access_token,
      user:user
    })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})


users.get('/me', authMiddleware, async (c) => {
  try {
    await connectDB()
    const { id } = c.get('user') as { id: string; email: string }

    const user = await User.findById(id)
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }

    return c.json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
      },
    })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

users.get('/:id', authMiddleware, async (c) => {
  try {
    await connectDB()
    const id = c.req.param('id')

    const user = await User.findById(id)
    if (!user) {
      return c.json({ success: false, message: 'User not found' }, 404)
    }

    return c.json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
      },
    })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

export default users