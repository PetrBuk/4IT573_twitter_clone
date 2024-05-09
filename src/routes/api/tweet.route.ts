import { Router } from 'express'

import { TweetController } from '~/controllers/tweet.controller'

export const tweetRouter = Router()

tweetRouter.post('/', TweetController.addTweet)
tweetRouter.get('/', TweetController.getTweets)
tweetRouter.get('/:id', TweetController.getTweet)
tweetRouter.put('/:id', TweetController.updateTweet)
tweetRouter.delete('/:id', TweetController.deleteTweet)
tweetRouter.post('/reply/:id', TweetController.reply)
