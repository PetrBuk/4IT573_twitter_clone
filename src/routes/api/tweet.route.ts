import { Router } from 'express'

import { LikeController } from '~/controllers/like.controller'
import { RetweetController } from '~/controllers/retweet.controller'
import { TweetController } from '~/controllers/tweet.controller'

export const tweetRouter = Router()

tweetRouter.post('/', TweetController.addTweet)
tweetRouter.get('/', TweetController.getTweets)
tweetRouter.get('/:id', TweetController.getTweet)
tweetRouter.put('/:id', TweetController.updateTweet)
tweetRouter.delete('/:id', TweetController.deleteTweet)
tweetRouter.post('/reply/:id', TweetController.reply)
tweetRouter.post('/like/:id', LikeController.likeTweet)
tweetRouter.post('/retweet/:id', RetweetController.retweetTweet)
