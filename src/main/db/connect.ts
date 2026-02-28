import type { Knex } from 'knex'

import { join, dirname } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'

import { app } from 'electron'
import { knex } from 'knex'

// 默认数据库文件路径
const defaultDbPath = join(app.getPath('userData'), 'data.db')

// 当前数据库实例
let dbInstance: Knex | null = null

// 当前数据库路径
let currentDbPath: string = defaultDbPath

// 创建数据库连接
export function createConnection(dbPath: string = defaultDbPath): Knex {
  const dbDir = dirname(dbPath)

  // 如果数据库目录不存在，则创建
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }
  // 如果数据库目录存在，则赋值给当前数据库路径
  currentDbPath = dbPath

  // 创建数据库实例
  dbInstance = knex({
    client: 'better-sqlite3',
    connection: { filename: currentDbPath },
    useNullAsDefault: true
  })

  return dbInstance
}

// 获取当前数据库实例
export function getDB(): Knex {
  if (!dbInstance) {
    return createConnection()
  }
  return dbInstance
}

// 获取当前数据库路径
export function getCurrentDbPath(): string {
  return currentDbPath
}

// 关闭数据库连接
export async function closeConnection(): Promise<void> {
  if (dbInstance) {
    await dbInstance.destroy()
    dbInstance = null
  }
}

// 重新连接数据库
export async function reconnect(newDbPath: string): Promise<Knex> {
  await closeConnection()
  return createConnection(newDbPath)
}
