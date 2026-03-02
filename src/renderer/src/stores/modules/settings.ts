import type { AppStore } from '@shared/types'
import { useAsyncState } from '@vueuse/core'

export const useSettingsStore = defineStore('settings', () => {
  /**
   * States
   */
  // 所有设置数据
  const settings = ref<AppStore | null>(null)

  // 设置窗是否显示
  const isSettingsOpen = ref(false)

  // 当前应用的主题名称
  const currentTheme = ref('github-light')

  /**
   * Getters
   */
  // 通用设置
  const generalSettings = computed(() => settings.value?.general)

  // 外观设置
  const appearanceSettings = computed(() => settings.value?.appearance)

  // 编辑器设置
  const editorSettings = computed(() => settings.value?.editor)

  // 快捷键设置
  const shortcutSettings = computed(() => settings.value?.shortcut)

  // 存储设置
  const storageSettings = computed(() => settings.value?.storage)

  /**
   * Actions
   */
  // 加载所有设置
  const { isLoading, execute: loadSettings } = useAsyncState(() => window.api.store.get(), null, {
    immediate: false,
    onSuccess: (res) => {
      if (res) {
        settings.value = res
        currentTheme.value = res.appearance.theme
      }
    }
  })

  // 更新单个设置项
  const updateSetting = async <K extends keyof AppStore>(section: K, key: keyof AppStore[K], value: AppStore[K][typeof key]) => {
    await window.api.store.set(section, key, value)

    // 更新本地状态
    if (settings.value) {
      settings.value[section] = {
        ...settings.value[section],
        [key]: value
      }
    }
  }

  // 批量更新设置
  const updateSettings = async <K extends keyof AppStore>(section: K, data: Partial<AppStore[K]>): Promise<void> => {
    await window.api.store.set(section, data)

    // 更新本地状态
    if (settings.value) {
      settings.value[section] = {
        ...settings.value[section],
        ...data
      } as AppStore[K]
    }
  }

  // 重置设置为默认值
  const resetSettings = async () => {
    const defaults = await window.api.store.getDefault()

    await window.api.store.set('general', defaults.general)
    await window.api.store.set('appearance', defaults.appearance)
    await window.api.store.set('editor', defaults.editor)
    await window.api.store.set('shortcut', defaults.shortcut)
    await window.api.store.set('storage', defaults.storage)

    // 重新加载设置
    await loadSettings()
  }

  // 打开设置弹窗
  const openSettings = () => {
    isSettingsOpen.value = true
  }

  // 关闭设置弹窗
  const closeSettings = () => {
    isSettingsOpen.value = false
  }

  // 应用主题到编辑器
  const applyTheme = (theme: string) => {
    currentTheme.value = theme
  }

  return {
    // States
    settings,
    isSettingsOpen,
    currentTheme,
    isLoading,

    // Getters
    generalSettings,
    appearanceSettings,
    editorSettings,
    shortcutSettings,
    storageSettings,

    // Actions
    loadSettings,
    updateSetting,
    updateSettings,
    resetSettings,
    openSettings,
    closeSettings,
    applyTheme
  }
})
