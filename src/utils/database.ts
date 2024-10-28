import Knex from 'knex'
import dotenv from 'dotenv'
dotenv.config()

const databaseClient = process.env.DATABASE_CLIENT

if (!databaseClient) {
  throw new Error('DATABASE_CLIENT environment variable is required')
}

let knex: Knex.Knex<any, unknown[]> | null = null

if (databaseClient.toLowerCase() === 'sqlite3') {
  if (!process.env.DATABASE_FILENAME) {
    throw new Error('DATABASE_FILENAME environment variable is required')
  }
  knex = Knex({
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_FILENAME,
    },
  })
} else if (databaseClient.toLowerCase() === 'pg') {
  const hostname = process.env.DATABASE_HOSTNAME
  const port = Number(process.env.DATABASE_PORT)
  const name = process.env.DATABASE_NAME
  const username = process.env.DATABASE_USERNAME
  const password = process.env.DATABASE_PASSWORD
  const poolMin = Number(process.env.DATABASE_POOL_MIN)
  const poolMax = Number(process.env.DATABASE_POOL_MAX)
  const poolIdle = Number(process.env.DATABASE_POOL_IDLE)

  knex = Knex({
    client: 'pg',
    connection: {
      user: username,
      password: password,
      host: hostname,
      port: port,
      database: name,
    },
    pool: {
      min: poolMin,
      max: poolMax,
      idleTimeoutMillis: poolIdle,
    },
    acquireConnectionTimeout: 2000,
  })
}

export default knex
