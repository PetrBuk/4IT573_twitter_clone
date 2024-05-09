import { Router } from 'express'

import { TweetService } from '~services/tweet.service'

export const webRouter = Router()

webRouter.get('/:id', async (req, res) => {
  const session = res.locals.session

  const tweet = await TweetService.getTweet(req.params.id)

  const replies = await TweetService.getReplies(req.params.id)

  // ToDo: Add not found page
  if (!tweet) return res.redirect('/')

  res.render('pages/tweet', {
    title: 'Twitter Clone - Tweet details',
    user: session.user,
    tweet,
    replies
  })
})

webRouter.get('/', async (_req, res) => {
  const session = res.locals.session

  const tweets = await TweetService.getTweets()

  res.render('pages/index', {
    title: 'Twitter Clone',
    user: session.user,
    tweets
  })
})
