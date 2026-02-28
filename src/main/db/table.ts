import { getDB } from './connect'

// 初始化数据库表结构
export async function initTables() {
  const db = getDB()

  // 创建分类表
  const hasCategoriesTable = await db.schema.hasTable('categories')
  if (!hasCategoriesTable) {
    await db.schema.createTable('categories', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable().comment('分类名称')
      table.string('key').defaultTo('').unique().comment('分类标识')
      table.timestamp('created_at').defaultTo(db.fn.now()).comment('创建时间')
      table.timestamp('updated_at').defaultTo(db.fn.now()).comment('更新时间')
    })
    console.log('创建分类表成功')
  }

  // 创建代码片段表
  const hasCodesTable = await db.schema.hasTable('codes')
  if (!hasCodesTable) {
    await db.schema.createTable('codes', (table) => {
      table.increments('id').primary()
      table.string('title').notNullable().comment('标题')
      table.string('description').defaultTo('').comment('描述')
      table.text('content').notNullable().comment('代码内容')
      table.json('tags').defaultTo([]).comment('标签')
      table.integer('category_id').defaultTo(0).comment('分类ID, 0表示未分类')
      table.string('language').defaultTo('javascript').comment('代码语言')
      table.boolean('is_favorited').defaultTo(false).comment('是否收藏')
      table.boolean('is_deleted').defaultTo(false).comment('是否删除')
      table.timestamp('created_at').defaultTo(db.fn.now()).comment('创建时间')
      table.timestamp('updated_at').defaultTo(db.fn.now()).comment('更新时间')

      // 索引
      table.index('category_id', 'idx_codes_category_id')
      table.index('created_at', 'idx_codes_created_at')
      table.index('is_favorited', 'idx_codes_is_favorited')
      table.index('is_deleted', 'idx_codes_is_deleted')

      console.log('codes表创建成功')
    })
  }
}

// 删除所有表（重置数据库）
export async function dropTables() {
  const db = getDB()

  const hasCodesTable = await db.schema.hasTable('codes')
  if (hasCodesTable) {
    await db.schema.dropTable('codes')
    console.log('删除codes表成功')
  }
  const hasCategoriesTable = await db.schema.hasTable('categories')
  if (hasCategoriesTable) {
    await db.schema.dropTable('categories')
    console.log('删除categories表成功')
  }
}

// 检查表是否存在
export async function hasTable(tableName: string): Promise<boolean> {
  const db = getDB()
  return await db.schema.hasTable(tableName)
}

// 分类触发器，当分类被删除时，将其下所有代码片段的分类ID设置为0
export async function setupCategoryDeleteTrigger() {
  const db = getDB()

  // 检查触发器是否存在
  const triggerName = 'trg_category_delete'
  const result = await db.raw(`SELECT name FROM sqlite_master WHERE type='trigger' AND name=?`, [
    triggerName
  ])

  if (result.length === 0) {
    await db.raw(`
      CREATE TRIGGER IF NOT EXISTS ${triggerName} AFTER DELETE ON categories
      BEGIN
      UPDATE codes SET category_id = 0 WHERE category_id = OLD.id;
      END;
    `)
    console.log('创建分类删除触发器成功')
  }
}
