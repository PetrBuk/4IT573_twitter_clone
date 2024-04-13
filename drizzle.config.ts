import { type Config } from 'drizzle-kit'

export default {
  schema: './src/database/schema/index.ts',
  driver: 'pg',
  out: 'drizzle',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
} satisfies Config
