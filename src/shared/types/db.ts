// 分类表
export interface Category {
  id: number
  name: string
  key: string
  created_at: Date | string
  updated_at: Date | string
}

// 代码片段表
export interface Code {
  id: number
  title: string
  content: string
  tags: string // JSON字符串
  category_id: number
  language: string // 代码语言类型
  created_at: Date | string
  updated_at: Date | string
}

// 创建分类输入
export interface CreateCategoryInput {
  name: string
}

// 更新分类输入
export interface UpdateCategoryInput {
  name?: string
  key?: string
}

// 创建代码片段输入
export interface CreateCodeInput {
  title: string
  content: string
  tags?: string | string[]
  category_id?: number
  language?: string
  is_favorited?: boolean
}

// 更新代码片段输入
export interface UpdateCodeInput {
  title?: string
  content?: string
  tags?: string | string[]
  category_id?: number
  language?: string
  is_favorited?: boolean
  is_deleted?: boolean
}

// 查询选项
export interface QueryOptions {
  categoryId?: number
  search?: string
  orderBy?: string
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
  isDeleted?: boolean // 是否包含已删除的记录
  isFavorited?: boolean // 是否只显示收藏的记录
}
