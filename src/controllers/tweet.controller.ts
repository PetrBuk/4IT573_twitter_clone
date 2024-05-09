import { Request, Response } from 'express'

import { tweetInsertSchema } from '~db/schema'

import { TweetService } from '~services/tweet.service'

import { htmlResponseType, safeRequestHandler } from '~/utils'

export class TweetController {
  static addTweet = safeRequestHandler(
    { body: tweetInsertSchema.omit({ userId: true }) },
    async (req, res, next) => {
      try {
        const user = res.locals.session.user

        if (!user) return res.status(401).json({ error: 'Unauthorized' })

        const tweet = await TweetService.addTweet({
          text: req.body.text,
          userId: user.id
        })

        if (htmlResponseType(req)) {
          // ToDo: Send the created tweet html here maybe?
          res.header('HX-Refresh', 'true')

          return res.send()
        }

        res.json(tweet)
      } catch (err) {
        console.log(err)
        next(err)
      }
    }
  )

  static async getTweets(req: Request, res: Response) {
    try {
      const tweets = await TweetService.getTweets()

      if (htmlResponseType(req)) {
        return res.render('partials/main_wall/feed', { tweets })
      }

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
