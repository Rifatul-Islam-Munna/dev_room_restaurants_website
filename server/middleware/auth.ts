import { createMiddleware } from 'hono/factory'
import { verifyToken } from '@/lib/jwt'

export const authMiddleware = createMiddleware(async (c, next) => {
  const access_token = c.req.header('access_token')

  if (!access_token) {
    return c.json({ success: false, message: 'No token provided' }, 401)
  }

  try {
    const decoded = await verifyToken(access_token.trim())
    c.set('user', decoded)
    await next()
  } catch {
    return c.json({ success: false, message: 'Invalid or expired token' }, 401)
  }
})