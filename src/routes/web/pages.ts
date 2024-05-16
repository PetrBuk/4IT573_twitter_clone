import { Router } from 'express'

import { BookmarkService } from '~services/bookmark.service'
import { TweetService } from '~services/tweet.service'
import { UserService } from '~services/user.service'

export const webRouter = Router()

webRouter.get('/bookmarks', async (_req, res) => {
  const session = res.locals.session
  const userId = session.user.id

  const users = await UserService.getUsers(userId)
  const bookmarks = await BookmarkService.getBookmarks(userId)

  res.render('pages/bookmarks', {
    title: 'Bookmarks',
    user: session.user,
    users: users,
    tweets: bookmarks
  })
})

webRouter.get('/tweet/:id', async (req, res) => {
  const session = res.locals.session
  const userId = session.user.id

  const users = await UserService.getUsers(userId)
  const tweet = await TweetService.getTweet(userId, req.params.id)
  const replies = await TweetService.getReplies(userId, req.params.id)

  // ToDo: Add not found page
  if (!tweet) return res.redirect('/')

  res.render('pages/tweet', {
    title: 'Tweet details',
    user: session.user,
    users: users,
    tweet,
    replies
  })
})

webRouter.get('/', async (_req, res) => {
  const session = res.locals.session
  const userId = session.user.id

  const users = await UserService.getUsers(userId)
  const tweets = await TweetService.getTweets(userId)

  res.render('pages/index', {
    title: 'Home',
    user: session.user,
    users: users,
    tweets: tweets
  })
})
