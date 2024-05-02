import { Router } from 'express'

export const webRouter = Router()

webRouter.get('/', async (_req, res) => {
  const session = res.locals.session

  res.render('pages/index', {
    title: 'Twitter Clone',
    user: session.user
  })
})
