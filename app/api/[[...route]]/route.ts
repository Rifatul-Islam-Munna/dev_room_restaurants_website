import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { compress } from 'hono/compress'
import { swaggerUI } from '@hono/swagger-ui'
import users from '@/server/routes/users'
import categories from '@/server/routes/Category'
import menuItems from '@/server/routes/MenuItem'
const app = new Hono().basePath('/api')
 import { swagger } from 'hono-swagger-ui'
import upload from '@/model/upload'
app.use(compress())
app.route('/user',users)
app.route('/category',categories)
app.route('/menu-item',menuItems)
app.route('/upload',upload)
app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})
const swaggerD = swagger(app, {
  title: 'My API',
  version: '1.0.0',
})
app.use('*', swaggerD.init())
await swaggerD.enableAutoScan('./app')
app.get('/ui', swaggerUI({ url: '/doc' }))

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)