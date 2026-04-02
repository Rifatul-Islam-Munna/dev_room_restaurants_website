import { Hono } from 'hono'
import { mkdir, writeFile } from 'fs/promises'
import sharp from 'sharp'
import { authMiddleware } from '@/server/middleware/auth'
import { getRuntimeUploadPath, runtimeUploadDir } from '@/lib/upload-storage'


const upload = new Hono()

upload.post('/image', authMiddleware, async (c) => {
  try {
    const body = await c.req.parseBody()
    const file = body.file

    if (!file || !(file instanceof File)) {
      return c.json(
        { success: false, message: 'Image file is required' },
        400
      )
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

    if (!allowedTypes.includes(file.type)) {
      return c.json(
        {
          success: false,
          message: 'Only jpg, jpeg, png and webp images are allowed',
        },
        400
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.webp`

    const outputPath = getRuntimeUploadPath(fileName)

    await mkdir(runtimeUploadDir, { recursive: true })

    const resizedImage = await sharp(buffer)
      .resize(800, 800, {
        fit: 'cover',
      })
      .webp({ quality: 80 })
      .toBuffer()

    await writeFile(outputPath, resizedImage)

    const imageUrl = `/uploads/${fileName}`

    return c.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        fileName,
        imageUrl,
      },
    })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to upload image'
    return c.json({ success: false, message }, 500)
  }
})

export default upload
