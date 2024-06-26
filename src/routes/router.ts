import { ExpressAuth } from '@auth/express'
import { Router } from 'express'

import { authConfig } from '~/utils/auth'

import { followRouter } from './api/follow.route'
import { tweetRouter } from './api/tweet.route'
import { webRouter } from './web/pages'

export const appRouter = Router()

/** Auth.js handler */
appRouter.use('/api/auth/*', ExpressAuth(authConfig))

/** API routes */
appRouter.use('/api/tweet', tweetRouter)
appRouter.use('/api/follow', followRouter)

/** Web pages routes */
appRouter.use('/', webRouter)
