// 分类表
export interface Category {
  id: number
  name: string
  key: string
  sort_order: number // 排序，数字越小越靠前
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
  is_deleted: boolean // 是否已删除
  is_favorited: boolean // 是否已收藏
  created_at: Date | string
  updated_at: Date | string
}

// 创建分类输入
export interface CreateCategoryInput {
  name: string
  key?: string
  sort_order?: number
}

// 更新分类输入
export interface UpdateCategoryInput {
  name?: string
  key?: string
  sort_order?: number
}

// 批量更新代码片段分类
export interface BatchUpdateCategoryInput {
  codeIds: number[] // 要更新的代码片段ID数组
  categoryId: number // 要更新到的分类ID(0为未分类)
}

// 创建代码片段输入
export interface CreateCodeInput {
  title: string
  content: string
  sort_order?: number
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
  tags?: string // 按标签筛选
}
