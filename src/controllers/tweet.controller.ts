import { Request, Response } from 'express'
import { safeRequestHandler } from '~/utils'
import { TweetInsert, tweetInsertSchema } from '~db/schema'
import { TweetService } from '~services/tweet.service'

export class TweetController {
  static addTweet = safeRequestHandler<
    Record<string, never>,
    TweetInsert,
    Record<string, never>
  >({ body: tweetInsertSchema }, async (req, res, next) => {
    try {
      const user = res.locals.session.user

      const tweedData = tweetInsertSchema.parse(req.body)
      const tweet = await TweetService.addTweet({
        ...tweedData,
        userId: user.id
      })
      res.json(tweet?.[0])
    } catch (err) {
      next(err)
    }
  })

  static async getTweets(req: Request, res: Response) {
    try {
      const tweets = await TweetService.getTweets()
      res.json(tweets)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Something went wrong' })
    }
  }

  static async getTweet(req: Request, res: Response) {
    try {
      const tweet = await TweetService.getTweet(req.params.id || '')
      res.json(tweet)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Something went wrong' })
    }
  }

  static async updateTweet(req: Request, res: Response) {
    try {
      const tweet = await TweetService.updateTweet(
        req.params.id || '',
        req.body
      )
      res.json(tweet)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Something went wrong' })
    }
  }

  static async deleteTweet(req: Request, res: Response) {
    try {
      const tweet = await TweetService.deleteTweet(req.params.id || '')
      res.json(tweet)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Something went wrong' })
    }
  }
}
