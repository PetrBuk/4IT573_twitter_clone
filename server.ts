import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'

import { isDBConnected } from '~db/config'

import { appRouter } from '~routes/router'

import { authenticatedUser } from '~/middlewares/auth'

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
app.use(appRouter)

export const server = app.listen(PORT, () => {
  console.log(`Server running on ${URL}`)

  isDBConnected().then((connected) => {
    if (!connected) {
      console.error('⚠⚠⚠ DATABASE NOT CONNECTED! ⚠⚠⚠')
    }
  })
})
