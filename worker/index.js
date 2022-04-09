import keys from './keys.js'
import redis from 'redis'

const redisClient = redis.createClient({
  url: `redis://${keys.redisHost}:${keys.redisPort}`,
  retry_strategy: () => 1000,
})
const sub = redisClient.duplicate()
await redisClient.connect()
await sub.connect()

function fib(index) {
  if (index < 2) return 1
  return fib(index - 1) + fib(index - 2)
}

sub.subscribe('insert', async (message) => {
  await redisClient.hSet('values', message, fib(parseInt(message)))
})
