import { AlgorithmTypes, sign, verify } from 'hono/jwt'

const JWT_SECRET = process.env.JWT_SECRET as string

if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined in .env')

export const signToken = (payload: { id: string; email: string }) => {
  return sign({ ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, JWT_SECRET,AlgorithmTypes.HS256) 
}

export const verifyToken = (token: string) => {
  return verify(token, JWT_SECRET,AlgorithmTypes.HS256)
}