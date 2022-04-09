import keys from './keys.js'
import pkg from 'pg'
const { Pool } = pkg
import redis from 'redis'

// Express App Setup
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// Postgres Client Setup
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
})
pgClient.on('error', () => console.log('Lost PG connection'))

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (NUMBER INT)')
  .catch((err) => console.log(err))

// Redis Client Setup
const redisClient = redis.createClient({
  url: `redis://${keys.redisHost}:${keys.redisPort}`,
  retry_strategy: () => 1000,
})
const redisPublisher = redisClient.duplicate()

// Express route handlers
app.get('/', (req, res) => {
  res.send('Hi')
})

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values')

  res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
  const values = await redisClient.hGetAll('values')
  res.send(values)
})

app.post('/values', async (req, res) => {
  const index = req.body.index

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high')
  }

  await redisClient.hSet('values', index, 'Nothing yet!')
  await redisPublisher.publish('insert', index)
  await pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

  res.send({ working: true })
})

app.listen(5000, async (err) => {
  await redisClient.connect()
  await redisPublisher.connect()
  console.log('Hi there!')
})
