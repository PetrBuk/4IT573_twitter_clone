import { DrizzleAdapter } from '@auth/drizzle-adapter'
import GitHub from '@auth/express/providers/github'

import { db } from '~db/config'

export const authConfig = { adapter: DrizzleAdapter(db), providers: [GitHub] }
