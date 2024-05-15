import { Router } from 'express'

import { BookmarkService } from '~services/bookmark.service'
import { TweetService } from '~services/tweet.service'

export const webRouter = Router()

webRouter.get('/bookmarks', async (_req, res) => {
  const session = res.locals.session

  const bookmarks = await BookmarkService.getBookmarks(session.user.id)

  res.render('pages/bookmarks', {
    title: 'Bookmarks',
    user: session.user,
    tweets: bookmarks
  })
})

webRouter.get('/:id', async (req, res) => {
  const session = res.locals.session

  const tweet = await TweetService.getTweet(session.user.id, req.params.id)

  const replies = await TweetService.getReplies(req.params.id)

  // ToDo: Add not found page
  if (!tweet) return res.redirect('/')

  res.render('pages/tweet', {
    title: 'Tweet details',
    user: session.user,
    tweet,
    replies
  })
})

webRouter.get('/', async (_req, res) => {
  const session = res.locals.session

  const tweets = await TweetService.getTweets(session.user.id)

  res.render('pages/index', {
    title: 'Home',
    user: session.user,
    tweets: tweets
  })
})
