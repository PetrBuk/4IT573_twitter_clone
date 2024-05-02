import { getSession } from '@auth/express'
import { NextFunction, Request, Response } from 'express'

import { authConfig } from '~/utils/auth'

export async function authenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = await getSession(req, authConfig)

  if (!session?.user && !req.url.includes('/api/auth')) {
    return res.redirect('/api/auth/signin')
  }

  res.locals.session = session

  next()
}
