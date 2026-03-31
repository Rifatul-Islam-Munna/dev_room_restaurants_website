import { createMiddleware } from 'hono/factory'
import { verifyToken } from '@/lib/jwt'

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('access_token')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, message: 'No token provided' }, 401)
  }

  const token = authHeader?.trim()

  try {
    const decoded = await verifyToken(token)
    c.set('user', decoded) 
    await next()
  } catch {
    return c.json({ success: false, message: 'Invalid or expired token' }, 401)
  }
})