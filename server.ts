import { ExpressAuth } from '@auth/express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import { authenticatedUser } from '~/middlewares/auth'
import { authConfig } from '~/utils/auth'

const PORT = process.env.PORT || 3000
const URL = process.env.SERVER_URL || 'http://localhost:3000'
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'disposedcookiesecret'

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(COOKIE_SECRET))
app.enable('trust proxy')
// CORS ignore
// app.use( (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
//   res.header('Access-Control-Allow-Credentials', 'true')
//   res.header('Set-Cookie', 'true')
//   next()
// })

/** Auth session middleware */
app.use(authenticatedUser)

/** Auth.js handler */
app.use('/api/auth/*', ExpressAuth(authConfig))

app.get('/', async (_req, res) => {
  const session = res.locals.session

  res.render('pages/index', {
    title: 'Twitter Clone',
    user: session.user,
  })
})

export const server = app.listen(PORT, () => {
  console.log(`Server running on ${URL}`)
})
