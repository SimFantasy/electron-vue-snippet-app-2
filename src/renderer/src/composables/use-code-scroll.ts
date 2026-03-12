import type { Ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

interface UseCodeScrollOptions {
  containerRef: Ref<HTMLElement | null> // 滚动容器
  loadMore: () => Promise<void> // 加载更多方法
  hasMore: Ref<boolean> // 是否有更多数据
  isLoading: Ref<boolean> // 是否正在加载更多数据
  threshold?: number // 距离底部多少距离时触发加载更多
  debounceDelay?: number // 防抖延迟时间
}

export function useCodeScroll(options: UseCodeScrollOptions) {
  // 解构出参数
  const { containerRef, loadMore, hasMore, isLoading, threshold = 100, debounceDelay = 200 } = options

  /**
   * States
   */
  // 标记是否正在加载（互斥锁）
  let isLoadingMore = false

  /**
   * Actions
   */

  // 滚动加载更多
  const handleScroll = useDebounceFn(async () => {
    // 检查是否满足加载条件
    if (isLoadingMore || !containerRef.value || !hasMore.value || isLoading.value) return

    const container = containerRef.value
    // 计算滚动条距离底部的距离
    const scrollBottom = container.scrollTop + container.clientHeight
    // 计算触发加载更多的阈值
    const triggerThreshold = container.scrollHeight - threshold

    // 检查是否滚动到底部阈值
    if (scrollBottom >= triggerThreshold) {
      isLoadingMore = true
      try {
        await loadMore()
      } finally {
        isLoadingMore = false
      }
    }
  }, debounceDelay)

  /**
   * Lifecycles
   */
  // 组件挂载时，添加滚动事件监听
  onMounted(() => containerRef.value?.addEventListener('scroll', handleScroll))
  // 组件销毁时，移除滚动事件监听
  onUnmounted(() => containerRef.value?.removeEventListener('scroll', handleScroll))

  return {
    containerRef
  }
}
