import { NextFunction, Request, Response } from 'express'

import { LikeService } from '~services/like.service'
import { TweetService } from '~services/tweet.service'

import { htmlResponseType, safeRequestHandler } from '~/utils'
import { idParamSchema } from '~/utils/validation'

export class LikeController {
  static likeTweet = safeRequestHandler(
    { params: idParamSchema },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = res.locals.session.user

        if (!user) return res.status(401).json({ error: 'Unauthorized' })

        let tweet = await TweetService.getTweet(
          user.id,
          req.params.id as string
        )

        if (!tweet) return res.status(404).json({ error: 'Tweet not found' })

        const liked = await LikeService.checkIfLiked(
          user.id,
          req.params.id as string
        )

        if (liked) {
          await LikeService.unlikeTweet(user.id, req.params.id as string)
        } else {
          await LikeService.likeTweet(user.id, req.params.id as string)
        }

        tweet = await TweetService.getTweet(user.id, req.params.id as string)

        if (htmlResponseType(req)) {
          return res.render('partials/main_wall/like_button', {
            tweet: { ...tweet, isLiked: !liked }
          })
        }

        return res.json({ message: 'Success' })
      } catch (err) {
        console.log(err)
        next(err)
      }
    }
  )
}
