import { NextFunction, Request, Response } from 'express'

import { LikeService } from '~services/like.service'

import { htmlResponseType } from '~/utils'

export class LikeController {
  static async likeTweet(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.session.user

      if (!user) return res.status(401).json({ error: 'Unauthorized' })

      const liked = await LikeService.checkIfLiked(
        user.id,
        req.params.id as string
      )

      if (liked) {
        await LikeService.unlikeTweet(user.id, req.params.id as string)

        if (htmlResponseType(req)) {
          res.header('HX-Refresh', 'true')

          return res.end()
        }

        return res.json({ message: 'Unliked' })
      } else {
        await LikeService.likeTweet(user.id, req.params.id as string)

        if (htmlResponseType(req)) {
          res.header('HX-Refresh', 'true')

          return res.end()
        }

        return res.json({ message: 'Liked' })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}
