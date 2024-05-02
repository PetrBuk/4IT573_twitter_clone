import { ExpressAuth } from '@auth/express'
import { Router } from 'express'
import { authConfig } from '~/utils/auth'
import { webRouter } from './web/pages'
import { tweetRouter } from './api/tweet.route'

export const appRouter = Router()

/** Auth.js handler */
appRouter.use('/api/auth/*', ExpressAuth(authConfig))

/** Web pages routes */
appRouter.use('/', webRouter)

/** API routes */
appRouter.use('/api/tweet', tweetRouter)
