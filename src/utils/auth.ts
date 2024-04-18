import GitHub  from '@auth/express/providers/github'
import { DrizzleAdapter } from '@auth/drizzle-adapter'

import { db } from '~db/config'

export const authConfig = { adapter: DrizzleAdapter(db), providers: [GitHub] }
