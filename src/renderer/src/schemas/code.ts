import { z } from 'zod'

// 代码片段表单验证
export const codeSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(128, '标题不能超过128个字符'),
  content: z.string().min(1, '内容不能为空'),
  category_id: z.number().int().optional(),
  tags: z.array(z.string()).optional(),
  language: z.string().optional()
})

export type CodeFormType = z.infer<typeof codeSchema>
