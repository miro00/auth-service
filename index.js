const express = require('express')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redis = require('redis')
const db = require('./models')
const fs = require('fs')
const path = require('path')

const app = express()
const redisClient = redis.createClient()

require('dotenv').config()

const port = process.env.PORT

app.use(cors({
  origin: ['http://localhost:3000', "http://192.168.1.144:3000"],
  credentials: true
}))

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: false,
  secret: process.env.SECRET,
  resave: false,
  cookie: {
    sameSite: 'strict',
  }
}))

db.sequelize.sync()
  .then(() => {
    console.log('✔ Подключение к серверу MySQL успешно установлено')
  })

app.use(passport.initialize())
app.use(passport.session())

fs
  .readdirSync(path.join(__dirname, 'routes'))
  .filter(file => {
    return (file.indexOf('.') !== 0)
    && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    app.use(`/auth/${file.split('.')[0]}`, require(`${path.join(__dirname, 'routes', file)}`))
  })

app.listen(port, () => {
  console.log(`✔ Сервер запущен на порту:`, "\x1b[35m", `${port}`, '\x1b[0m');
})