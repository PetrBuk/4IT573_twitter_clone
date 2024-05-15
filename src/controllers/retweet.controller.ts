import { NextFunction, Request, Response } from 'express'

import { RetweetService } from '~services/retweet.service'
import { TweetService } from '~services/tweet.service'

import { htmlResponseType } from '~/utils'

export class RetweetController {
  static async retweetTweet(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.session.user

      if (!user) return res.status(401).json({ error: 'Unauthorized' })

      let tweet = await TweetService.getTweet(req.params.id as string)

      if (!tweet) return res.status(404).json({ error: 'Tweet not found' })

      const retweeted = await RetweetService.checkIfRetweeted(
        user.id,
        req.params.id as string
      )

      if (retweeted) {
        await RetweetService.unretweetTweet(user.id, req.params.id as string)
      } else {
        await RetweetService.retweetTweet(user.id, req.params.id as string)
      }

      tweet = await TweetService.getTweet(req.params.id as string)

      if (htmlResponseType(req)) {
        return res.render('partials/main_wall/retweet_button', {
          tweet: { ...tweet, isRetweeted: !retweeted }
        })
      }

      return res.json({ message: 'Success' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}
