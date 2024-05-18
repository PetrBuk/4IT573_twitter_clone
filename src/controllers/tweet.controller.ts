import { Request, Response } from 'express'

import { tweetInsertSchema } from '~db/schema'

import { TweetService } from '~services/tweet.service'

import { htmlResponseType, safeRequestHandler } from '~/utils'
import { idParamSchema } from '~/utils/validation'

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
      const tweets = await TweetService.getTweets(res.locals.session.user.id)

      if (htmlResponseType(req)) {
        return res.render('partials/main_wall/feed', {
          tweets
        })
      }

      res.json(tweets)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Something went wrong' })
    }
  }

  static getTweet = safeRequestHandler(
    { params: idParamSchema },
    async (req, res) => {
      try {
        const tweet = await TweetService.getTweet(
          res.locals.session.user.id,
          req.params.id
        )
        res.json(tweet)
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
      }
    }
  )

  static updateTweet = safeRequestHandler(
    { params: idParamSchema, body: tweetInsertSchema },
    async (req, res) => {
      try {
        const tweet = await TweetService.updateTweet(req.params.id, req.body)
        res.json(tweet)
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
      }
    }
  )

  static deleteTweet = safeRequestHandler(
    { params: idParamSchema },
    async (req, res) => {
      try {
        const tweet = await TweetService.deleteTweet(req.params.id)
        res.json(tweet)
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
      }
    }
  )

  static async reply(req: Request, res: Response) {
    try {
      const user = res.locals.session.user

      if (!user) return res.status(401).json({ error: 'Unauthorized' })

      const reply = await TweetService.addTweet({
        text: req.body.text,
        userId: user.id,
        replyId: req.params.id
      })

      if (htmlResponseType(req)) {
        // ToDo: Send the created tweet html here maybe?
        res.header('HX-Refresh', 'true')

        return res.send()
      }

      res.json(reply)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Something went wrong' })
    }
  }
}
