import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { compress } from 'hono/compress'
import users from '@/server/routes/users'
const app = new Hono().basePath('/api')
 
app.use(compress())
app.route('/user',users)
app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)