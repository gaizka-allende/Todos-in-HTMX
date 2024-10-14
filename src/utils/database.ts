import Knex from 'knex'
import dotenv from 'dotenv'
dotenv.config()

export const hostname = process.env.DATABASE_HOSTNAME
export const port = Number(process.env.DATABASE_PORT)
export const name = process.env.DATABASE_NAME
export const username = process.env.DATABASE_USERNAME
export const password = process.env.DATABASE_PASSWORD
export const poolMin = Number(process.env.DATABASE_POOL_MIN)
export const poolMax = Number(process.env.DATABASE_POOL_MAX)
export const poolIdle = Number(process.env.DATABASE_POOL_IDLE)

export const knex = Knex({
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
