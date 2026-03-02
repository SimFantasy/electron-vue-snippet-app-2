import { z } from 'zod'

// 分类表单验证
export const categorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空').max(48, '分类名称最多48个字符'),
  key: z
    .string()
    .min(1, '分类标识不能为空')
    .max(24, '分类标识最多24个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z0-9-]+$/i, '分类标识只能包含中文、字母、数字和连字符')
})

export type CategoryFormType = z.infer<typeof categorySchema>
