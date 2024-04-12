import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'

const PORT = process.env.PORT || 3000
const URL = process.env.SERVER_URL || 'http://localhost:3000'
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'disposedcookiesecret'

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(COOKIE_SECRET))
// CORS ignore
app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Set-Cookie', 'true')
  next()
})

app.get('/', async (_req, res) => {
  res.render('pages/index', {
    title: 'Twitter Clone',
  })
})

export const server = app.listen(PORT, () => {
  console.log(`Server running on ${URL}`)
})
