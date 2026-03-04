import { getDB } from './connect'
import { createCategory, createCode } from './query'

// 初始化种子数据
export async function seedDatabase() {
  const db = getDB()

  // 检查是否已有数据
  const categoriesCount = await db('categories').count('* as count').first()
  const codesCount = await db('codes').count('* as count').first()

  if (Number(categoriesCount?.count) > 0 || Number(codesCount?.count) > 0) {
    console.log('[Seed] 数据库已有数据，跳过种子数据初始化')
    return
  }

  console.log('[Seed] 开始初始化种子数据...')

  try {
    // 1. 创建示例分类
    const categories = [
      { name: '前端开发', key: 'f' },
      { name: '后端开发', key: 'b' },
      { name: '工具脚本', key: 't' },
      { name: 'SQL查询', key: 'sql' },
      { name: 'Vue', key: 'vue' },
      { name: 'Node', key: 'node' },
      { name: 'React', key: 'react' },
      { name: 'Next', key: 'next' },
      { name: 'Nuxt', key: 'nuxt' },
      { name: 'Prisma', key: 'prisma' },
      { name: 'GraphQL', key: 'graphql' },
      { name: 'TypeScript', key: 'typescript' },
      { name: 'Drizzle', key: 'drizzle' },
      { name: 'NestJS', key: 'nest' },
      { name: 'Electron', key: 'electron' },
      { name: 'tauri', key: 'tauri' },
      { name: 'Flutter', key: 'flutter' },
      { name: 'Dart', key: 'dart' },
      { name: 'Elysia', key: 'elysia' },
      { name: 'Svelte', key: 'svelte' },
      { name: 'Angular', key: 'angular' },
      { name: 'SolidJs', key: 'solid' },
      { name: 'TailwindCSS', key: 'tailwind' }
    ]

    const categoryIds: number[] = []
    for (const cat of categories) {
      const id = await createCategory(cat)
      categoryIds.push(id)
      console.log(`[Seed] 创建分类: ${cat.name} (ID: ${id})`)
    }

    // 2. 创建示例代码片段
    const codes = [
      {
        title: 'JavaScript防抖函数',
        content: `function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}`,
        tags: ['javascript', 'utils', '性能优化'],
        category_id: categoryIds[0], // 前端开发
        language: 'javascript'
      },
      {
        title: 'Vue3组合式函数示例',
        content: `import { ref, onMounted, onUnmounted } from 'vue'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  function updatePosition(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', updatePosition))
  onUnmounted(() => window.removeEventListener('mousemove', updatePosition))

  return { x, y }
}`,
        tags: ['vue', 'typescript', 'composable'],
        category_id: categoryIds[0],
        language: 'typescript'
      },
      {
        title: 'Node.js读取文件',
        content: `const fs = require('fs').promises;

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    console.log('文件内容:', data);
    return data;
  } catch (error) {
    console.error('读取文件失败:', error);
    throw error;
  }
}`,
        tags: ['nodejs', 'filesystem'],
        category_id: categoryIds[1], // 后端开发
        language: 'javascript'
      },
      {
        title: 'Python列表推导式',
        content: `# 基本列表推导式
squares = [x**2 for x in range(10)]

# 带条件的列表推导式
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# 字典推导式
square_dict = {x: x**2 for x in range(5)}`,
        tags: ['python', 'basics'],
        category_id: categoryIds[1],
        language: 'python'
      },
      {
        title: 'Git常用命令',
        content: `# 查看状态
git status

# 添加文件到暂存区
git add filename
git add .  # 添加所有修改

# 提交更改
git commit -m "提交信息"

# 推送到远程
git push origin main

# 拉取更新
git pull origin main`,
        tags: ['git', '版本控制', '命令行'],
        category_id: categoryIds[2], // 工具脚本
        language: 'shell'
      },
      {
        title: 'MySQL常用查询',
        content: `-- 查询所有表
SHOW TABLES;

-- 查询表结构
DESCRIBE table_name;

-- 条件查询
SELECT * FROM users WHERE age > 18 AND status = 'active';

-- 多表联查
SELECT u.name, o.order_id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01';`,
        tags: ['mysql', 'database', 'sql'],
        category_id: categoryIds[3], // SQL查询
        language: 'sql'
      }
    ]

    for (const code of codes) {
      const id = await createCode(code)
      console.log(`[Seed] 创建代码片段: ${code.title} (ID: ${id})`)
    }

    console.log('[Seed] 种子数据初始化完成！')
  } catch (error) {
    console.error('[Seed] 初始化种子数据失败:', error)
    throw error
  }
}
