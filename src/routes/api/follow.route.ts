import { Router } from 'express'

import { FollowController } from '~/controllers/follow.controller'

export const followRouter = Router()

followRouter.post('/:id', FollowController.followUser)
