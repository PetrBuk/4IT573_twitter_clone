import { NextFunction, Request, Response } from 'express'

import { FollowService } from '~services/follow.service'
import { UserService } from '~services/user.service'

import { htmlResponseType } from '~/utils'

export class FollowController {
  static async followUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.session.user

      if (!user) return res.status(401).json({ error: 'Unauthorized' })

      const tweet = await UserService.getUser(user.id, req.params.id as string)

      if (!tweet) return res.status(404).json({ error: 'User not found' })

      const followed = await FollowService.checkIfFollowed(
        user.id,
        req.params.id as string
      )

      if (followed) {
        await FollowService.unfollowUser(user.id, req.params.id as string)
      } else {
        await FollowService.followUser(user.id, req.params.id as string)
      }

      if (htmlResponseType(req)) {
        return res.render('partials/users/follow_button', {
          user: { ...tweet, isFollowed: !followed }
        })
      }

      return res.json({ message: 'Success' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}
