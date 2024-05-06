import { AuthConfig } from '@auth/core'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import GitHub from '@auth/express/providers/github'

import { db } from '~db/config'

export const authConfig: AuthConfig = {
  adapter: DrizzleAdapter(db),
  providers: [GitHub],
  callbacks: {
    async session({ session }) {
      return session
    }
  }
}
