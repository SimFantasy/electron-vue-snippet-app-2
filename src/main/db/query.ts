import type {
  Category,
  Code,
  CreateCategoryInput,
  CreateCodeInput,
  UpdateCategoryInput,
  UpdateCodeInput,
  QueryOptions
} from '@shared/types'

import { getDB } from './connect'

/**
 * 分类查询 Category
 */

// 获取所有分类
export async function getCategories(): Promise<Category[]> {
  const db = getDB()
  return await db('categories').select('*').orderBy('sort_order', 'asc').orderBy('created_at', 'desc')
}

// 创建分类
export async function createCategory(data: CreateCategoryInput): Promise<number> {
  const db = getDB()
  const [id] = await db('categories').insert({
    ...data,
    created_at: new Date(),
    updated_at: new Date()
  })

  return id
}

// 批量更新分类排序
export async function updateCategoriesSortOrder(sortedIds: number[]): Promise<void> {
  const db = getDB()

  // 使用事务
  await db.transaction(async (trx) => {
    for (let i = 0; i < sortedIds.length; i++) {
      await trx('categories').where('id', sortedIds[i]).update({
        sort_order: i,
        updated_at: new Date()
      })
    }
  })
}

// 更新分类
export async function updateCategory(id: number, data: UpdateCategoryInput): Promise<number> {
  const db = getDB()
  return await db('categories')
    .where('id', id)
    .update({
      ...data,
      updated_at: new Date()
    })
}

// 批量更新代码片段分类
export async function batchUpdateCategory(codeIds: number[], categoryId: number): Promise<number> {
  const db = getDB()

  if (codeIds.length === 0) return 0

  // 使用事务确保
  return await db.transaction(async (trx) => {
    const result = await trx('codes').whereIn('id', codeIds).where('is_deleted', false).update({
      category_id: categoryId,
      updated_at: new Date()
    })

    return result
  })
}

// 将某个分类下的所有代码片段移动到未分类（用于删除分类时）
export async function moveCodesToUncategorized(categoryId: number): Promise<number> {
  const db = getDB()

  return await db('codes').where('category_id', categoryId).where('is_deleted', false).update({
    category_id: 0,
    updated_at: new Date()
  })
}

// 删除分类
export async function removeCategory(id: number): Promise<number> {
  const db = getDB()
  return await db('categories').where('id', id).del()
}

/**
 * 代码片段查询 Code
 */

// 解析搜索字符串，提取key和关键字
function parseSearchKeyword(search: string): { key: string | null; search: string | null } {
  if (!search || !search.trim()) {
    return { key: null, search: null }
  }

  // 匹配：key:search 格式，key不能包含空格
  const match = search.match(/^([^:\s/]+):(.*)$/)

  if (match) {
    const [, key, rest] = match
    return {
      key: key.trim(),
      search: rest.trim() || null
    }
  }

  // 没有分隔符，直接搜索
  return { key: null, search: search.trim() }
}

// 获取所有代码片段
export async function getCodes(options: QueryOptions = {}): Promise<Code[]> {
  const db = getDB()

  let categoryId = options.categoryId
  let searchKeyword = options.search

  // 如果传入了 Search，解析 key:search 格式
  if (searchKeyword) {
    const { key, search } = parseSearchKeyword(searchKeyword)

    if (key) {
      const category = await db('categories').where('key', key).first()

      if (category) {
        categoryId = category.id
        searchKeyword = search || undefined
      }
    } else {
      searchKeyword = search || undefined
    }
  }

  let query = db('codes').select('*')

  // 默认不查询已软删除的代码
  // const isDeleted = options.isDeleted ?? false
  // query = query.where('is_deleted', isDeleted)
  if (options.isDeleted !== undefined) {
    query = query.where('is_deleted', options.isDeleted)
  }

  // 按分类筛选
  if (categoryId !== undefined) {
    query = query.where('category_id', categoryId)
  }

  // 按收藏状态筛选
  if (options.isFavorited !== undefined) {
    query = query.where('is_favorited', options.isFavorited)
  }

  // 按关键字搜索
  if (searchKeyword) {
    query = query.where((builder) => {
      builder.where('title', 'like', `%${searchKeyword}%`).orWhere('tags', 'like', `%${searchKeyword}%`)
    })
  }

  const orderBy = options.orderBy || 'created_at'
  const order = options.order || 'desc'
  query = query.orderBy(orderBy, order)

  if (options.limit) {
    query = query.limit(options.limit)
    if (options.offset) {
      query = query.offset(options.offset)
    }
  }

  return await query
}

// 根据ID获取代码片段
export async function getCodeById(id: number): Promise<Code | undefined> {
  const db = getDB()
  return await db('codes').where('id', id).first()
}

// 创建代码片段
export async function createCode(data: CreateCodeInput): Promise<number> {
  const db = getDB()

  const tags = Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags || '[]'

  const [id] = await db('codes').insert({
    title: data.title,
    content: data.content,
    tags,
    category_id: data.category_id || 0,
    language: data.language || 'javascript',
    is_favorited: data.is_favorited || false,
    is_deleted: false,
    created_at: new Date(),
    updated_at: new Date()
  })

  return id
}

// 更新代码片段
export async function updateCode(id: number, data: UpdateCodeInput): Promise<number> {
  const db = getDB()
  const updateData: Record<string, unknown> = {
    updated_at: new Date()
  }

  if (data.title !== undefined) updateData.title = data.title
  if (data.content !== undefined) updateData.content = data.content
  if (data.tags !== undefined) updateData.tags = Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags
  if (data.category_id !== undefined) updateData.category_id = data.category_id
  if (data.language !== undefined) updateData.language = data.language
  if (data.is_favorited !== undefined) updateData.is_favorited = data.is_favorited
  if (data.is_deleted !== undefined) updateData.is_deleted = data.is_deleted

  return await db('codes').where('id', id).update(updateData)
}

// 硬删除代码片段
export async function removeCode(id: number): Promise<number> {
  const db = getDB()

  return await db('codes').where('id', id).del()
}

// 软删除代码片段
export async function softRemoveCode(id: number): Promise<number> {
  const db = getDB()

  const result = await db('codes').where('id', id).where('is_deleted', false).update({
    is_deleted: true,
    updated_at: new Date()
  })

  return result
}

// 恢复已软删除的代码片段
export async function restoreCode(id: number): Promise<number> {
  const db = getDB()

  return await db('codes').where('id', id).where('is_deleted', true).update({
    is_deleted: false,
    updated_at: new Date()
  })
}

// 获取回收站中的代码片段
export async function getTrashCodes(): Promise<Code[]> {
  const db = getDB()

  return await db('codes').where('is_deleted', true).orderBy('updated_at', 'desc')
}

// 清空回收站
export async function clearTrash(): Promise<number> {
  const db = getDB()

  // 获取需要删除数据
  const count = await db('codes').where('is_deleted', true).count('* as count').first()

  // 执行删除
  await db('codes').where('is_deleted', true).del()

  return Number((count?.count as string) || '0')
}

// 获取收藏夹中的代码片段
export async function getFavorites(): Promise<Code[]> {
  const db = getDB()

  return await db('codes').where('is_deleted', false).where('is_favorited', true).orderBy('updated_at', 'desc')
}

// 切换收藏状态
export async function toggleFavorite(id: number): Promise<boolean> {
  const db = getDB()

  const code = await db('codes').where('id', id).where('is_deleted', false).first('is_favorited')

  if (!code) return false

  const newStatus = !code.is_favorited
  await db('codes').where('id', id).update({
    is_favorited: newStatus,
    updated_at: new Date()
  })

  return newStatus
}

// 搜索分类下的代码片段
export async function searchCode(keyword: string, categoryId?: number, isDeleted?: boolean): Promise<Code[]> {
  const db = getDB()
  let query = db('codes').where((builder) => {
    builder.where('title', 'like', `%${keyword}%`).orWhere('tags', 'like', `%${keyword}%`)
  })

  if (!isDeleted) {
    query = query.where('is_deleted', false)
  }

  if (categoryId !== undefined) {
    query = query.andWhere('category_id', categoryId)
  }

  return await query.orderBy('created_at', 'desc')
}

// 获取代码片段数
export async function getCodesCount(categoryId?: number, isDeleted?: boolean): Promise<number> {
  const db = getDB()
  let query = db('codes').count('* as count')

  if (!isDeleted) {
    query = query.where('is_deleted', false)
  }

  if (categoryId !== undefined) {
    query = query.where('category_id', categoryId)
  }

  const result = await query.first<{ 'count(*)': string }>()
  return parseInt(result?.['count(*)'] || '0', 10)
}

// 根据tag查询代码片段
export async function getCodeByTag(tag: string): Promise<Code[]> {
  const db = getDB()

  return await db('codes')
    .where('is_deleted', false)
    .whereRaw(`json_array_length(tags) > 0`)
    .whereRaw(`exists (select 1 from json_each(tags) where json_each.value = ? )`, [tag])
    .orderBy('created_at', 'desc')
}

// 获取所有唯一的标签列表
export async function getTags(): Promise<string[]> {
  const db = getDB()

  // 查询所有非删除的代码片段标签
  const codes = await db('codes').where('is_deleted', false).whereNotNull('tags').select('tags')

  // 提取合并所有标签
  const allTags = new Set<string>()

  codes.forEach((code) => {
    try {
      const tags = JSON.parse(code.tags || '[]')
      if (Array.isArray(tags)) {
        tags.forEach((tag: string) => {
          if (tag && typeof tag === 'string') {
            // 统一转为小写
            allTags.add(tag.toLowerCase().trim())
          }
        })
      }
    } catch (error) {
      console.log('解析标签失败', code.tags)
    }
  })

  return Array.from(allTags).sort()
}
