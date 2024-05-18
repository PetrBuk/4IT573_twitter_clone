import { NextFunction, Request, Response } from 'express'

import { BookmarkService } from '~services/bookmark.service'
import { TweetService } from '~services/tweet.service'

import { htmlResponseType, safeRequestHandler } from '~/utils'
import { idParamSchema } from '~/utils/validation'

export class BookmarkController {
  static bookmarkTweet = safeRequestHandler(
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

        const bookmarked = await BookmarkService.checkIfBookmarked(
          user.id,
          req.params.id as string
        )

        if (bookmarked) {
          await BookmarkService.unbookmarkTweet(
            user.id,
            req.params.id as string
          )
        } else {
          await BookmarkService.bookmarkTweet(user.id, req.params.id as string)
        }

        tweet = await TweetService.getTweet(user.id, req.params.id as string)

        if (htmlResponseType(req)) {
          return res.render('partials/main_wall/bookmark_button', {
            tweet: { ...tweet, isBookmarked: !bookmarked }
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
