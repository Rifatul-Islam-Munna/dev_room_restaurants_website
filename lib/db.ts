import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in .env')
}

let cached = global.mongoose as {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  // Already connected — reuse it
  if (cached.conn) {
    console.log(' MongoDB: Using cached connection')
    return cached.conn
  }

  if (!cached.promise) {
    console.log(' MongoDB: Connecting to', MONGODB_URI.replace(/:\/\/.*@/, '://***@')) 
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  try {
    cached.conn = await cached.promise
    console.log(' MongoDB: Connected to', mongoose.connection.name) // prints DB name
  } catch (error) {
    cached.promise = null  
    console.error(' MongoDB: Connection failed', error)
    throw error
  }

  return cached.conn
}