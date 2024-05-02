import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

const connection = postgres(process.env.DATABASE_URL as string)

export const isDBConnected = async () => {
  try {
    await connection`SELECT NOW()`
    return true
  } catch (error) {
    return false
  }
}

export const db = drizzle(postgres(process.env.DATABASE_URL as string), {
  schema
})
