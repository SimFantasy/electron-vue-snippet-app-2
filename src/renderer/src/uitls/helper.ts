import dayjs from 'dayjs'

// 格式化日期
export function formatDate(date: Date | string | number, format: string = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}

// 将 hex 颜色转换为 rgba
export function hexToRgba(hex: string, alpha: number): string {
  // 移除 # 前缀
  hex = hex.replace(/^#/, '')

  // 处理简写格式 (#fff -> #ffffff)
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('')
  }

  // 解析 rgb 值
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
