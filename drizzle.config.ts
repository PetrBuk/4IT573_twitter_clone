import { type Config } from 'drizzle-kit'

export default {
  schema: './src/database/schema/index.ts',
  dialect: 'postgresql',
  out: 'drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL as string
  }
} satisfies Config
