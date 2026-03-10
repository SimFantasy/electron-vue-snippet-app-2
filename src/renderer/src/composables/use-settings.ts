import type { AppStore, SearchbarPosition, AppLanguage, ColorMode } from '@shared/types'
import type { CodeMirrorTheme } from '@shared/constants'

import { useDebounceFn, useColorMode, useCssVar } from '@vueuse/core'
import { codemirrorThemes, getThemeColors } from '@shared/constants'
import { useSettingsStore } from '@/stores'

export function useSettings() {
  /**
   * Hooks
   */
  const settingsStore = useSettingsStore()
  const toast = useToast()
  const colorMode = useColorMode({
    storageKey: 'simsnippet-theme-mode',
    emitAuto: false // 禁用自动监听主题变化
  })

  /**
   * States
   */
  // 结构settingsStore中的状态
  const {
    settings,
    isLoading,
    currentTheme,
    generalSettings,
    appearanceSettings,
    editorSettings,
    shortcutSettings,
    storageSettings
  } = storeToRefs(settingsStore)

  // 设置弹窗显示状态
  const isSettingsVisible = ref(false)
  // 当前激活设置标签页
  const activeTab = ref<'genenal' | 'appearance' | 'editor' | 'shortcut' | 'storage'>('genenal')
  // 是否正在保存
  const isSaving = ref(false)
  // 系统字体列表
  const systemFonts = ref<string[]>([])
  // 是否正在加载字体
  const isLoadingFonts = ref(false)

  // CSS变量管理
  const bgPrimary = useCssVar('--layout-bg-primary')
  const bgSecondary = useCssVar('--layout-bg-secondary')
  const textPrimary = useCssVar('--layout-text-primary')
  const textSecondary = useCssVar('--layout-text-secondary')
  const activeBg = useCssVar('--layout-active-bg')
  const activeText = useCssVar('--layout-active-text')
  const border = useCssVar('--layout-border')

  // 预设字体列表
  const presetFonts = ref([
    { label: 'Fira Code', value: 'Fira Code' },
    { label: 'Source Code Pro', value: 'Source Code Pro' },
    { label: 'JetBrains Mono', value: 'JetBrains Mono' }
  ])

  /**
   * Getters
   */

  // 根据当前主题模式获取可用的主题列表
  const availableThemes = computed(() => {
    const mode = appearanceSettings.value?.themeMode || 'system'

    if (mode === 'light') {
      return codemirrorThemes.light
    } else if (mode === 'dark') {
      return codemirrorThemes.dark
    }

    // system模式返回所有
    return [...codemirrorThemes.light, ...codemirrorThemes.dark]
  })

  // 当前主题配色方案
  const currentThemeColors = computed(() => getThemeColors(currentTheme.value) || getThemeColors('github-light'))

  // 是否为深色主题(检查当前主题是否在深色模式列表中)
  const isDarkMode = computed(() => codemirrorThemes.dark.includes(currentTheme.value))

  // 当前使用的字体选项
  const fontOptions = computed(() => {
    if (editorSettings.value?.useSystemFont) {
      // 返回系统字体列表
      return systemFonts.value.map((font) => ({ label: font, value: font }))
    }
    return presetFonts.value
  })

  /**
   * Actions
   */
  // 用用主题到整个应用
  const applyTheme = (theme: string) => {
    // 更新Store
    settingsStore.applyTheme(theme)

    // 判断是否为深色主题
    const isDark = codemirrorThemes.dark.includes(theme as CodeMirrorTheme)

    // 设置主题模式
    colorMode.value = isDark ? 'dark' : 'light'

    // 设置HTML data-theme属性
    document.documentElement.setAttribute('data-theme', theme)
    // 设置html class 属性
    document.documentElement.classList.toggle('dark', isDark)

    // 应用主题配色到CSS变量
    const colors = getThemeColors(theme as CodeMirrorTheme)
    if (colors) {
      bgPrimary.value = colors.primaryBg
      bgSecondary.value = colors.secondaryBg
      textPrimary.value = colors.primaryText
      textSecondary.value = colors.secondaryText
      activeBg.value = colors.activeBg
      activeText.value = colors.activeText
      border.value = colors.border
    }

    // 触发编辑器主题更新事件
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme, isDark } }))
  }

  // 加载所有设置
  const loadSettings = async () => {
    await settingsStore.loadSettings()

    // 应用当前主题
    if (appearanceSettings.value?.theme) {
      applyTheme(appearanceSettings.value.theme)
    }
  }

  // 防抖保存函数（修改设置后延迟500ms保存）
  const debouncedSave = useDebounceFn(async <K extends keyof AppStore>(section: K, key: string, value: any) => {
    isSaving.value = true

    try {
      await settingsStore.updateSetting(section, key as any, value)
    } catch (error) {
      console.log('[Hooks] 保存设置失败:', error)
      toast.add({ title: '保存设置失败', color: 'error' })
    } finally {
      isSaving.value = false
    }
  }, 500)

  // 通用设置 ==============================

  // 通用设置更新
  const updateGeneralSetting = <K extends keyof NonNullable<typeof generalSettings.value>>(
    key: K,
    value: NonNullable<typeof generalSettings.value>[K]
  ) => {
    // 乐观更新
    if (settings.value?.general) {
      ;(settings.value.general as any)[key] = value
    }

    // 防抖保存
    debouncedSave('general', key, value)
  }

  // 设置开机是否启动
  const updateAutoLaunch = (enabled: boolean) => updateGeneralSetting('autoLaunch', enabled)

  // 设置应用启动时是否隐藏搜索框
  const updateHideOnStartup = (enabled: boolean) => updateGeneralSetting('hideOnStartup', enabled)

  // 设置搜索框失去焦点是否自动隐藏
  const updateAutoHideOnBlur = (enabled: boolean) => updateGeneralSetting('autoHideOnBlur', enabled)

  // 设置是否显示系统托盘
  const updateShowSystemTray = (enabled: boolean) => updateGeneralSetting('showSystemTray', enabled)

  // 设置搜索框始终置顶
  const updateSearchbarAlwayOnTop = (enabled: boolean) => updateGeneralSetting('searchbarAlwaysOnTop', enabled)

  // 设置搜索框显示位置
  const updateSearchbarPosition = (postion: SearchbarPosition) => updateGeneralSetting('searchbarPosition', postion)

  // 设置搜索框自定义位置坐标
  const updateCustomSearchbarPosition = (x: number, y: number) => updateGeneralSetting('customSearchbarPosition', { x, y })

  // 设置应用语言
  const updateAppLanguage = (lang: AppLanguage) => {
    updateGeneralSetting('language', lang)
    // TODO: i18n 语言切换
    // i18n.global.locale.value = lang
  }

  // 外观设置 ==============================

  // 更新外观设置
  const updateAppearanceSetting = <K extends keyof NonNullable<typeof appearanceSettings.value>>(
    key: K,
    value: NonNullable<typeof appearanceSettings.value>[K]
  ) => {
    // 乐观更新
    if (settings.value?.appearance) {
      ;(settings.value.appearance as any)[key] = value
    }
    // 防抖保存
    debouncedSave('appearance', key, value)
  }

  // 设置主题
  const updateTheme = (theme: string) => {
    updateAppearanceSetting('theme', theme)
    applyTheme(theme)
  }

  // 根据主题模式自动选择合适的主题
  const applyThemeMode = (mode: ColorMode) => {
    let theme: string

    if (mode === 'light') {
      theme = 'github-light'
    } else if (mode === 'dark') {
      theme = 'github-dark'
    } else {
      theme = colorMode.value === 'dark' ? 'github-dark' : 'github-light'
    }

    updateTheme(theme)
  }

  // 设置主题模式
  const updateThemeMode = (mode: ColorMode) => {
    updateAppearanceSetting('themeMode', mode)
    // 更新hooks
    colorMode.value = mode === 'system' ? 'auto' : mode
    // 应用主题
    applyThemeMode(mode)
  }

  // 更新搜索框背景设置
  const updateSearchbarBackground = (settings: Partial<NonNullable<typeof appearanceSettings.value>['searchbar']>) => {
    const current = appearanceSettings.value?.searchbar
    if (current) {
      updateAppearanceSetting('searchbar', { ...current, ...settings })
    }
  }

  // 打开文件选择器搜索框背景图
  const selectSearchbarBackground = async () => {
    const result = await window.api.background.select('searchbar')
    if (result) {
      updateSearchbarBackground({ backgroundImage: result })
    }
  }

  // 更新管理界面背景设置
  const updatemanagerBackground = (settings: Partial<NonNullable<typeof appearanceSettings.value>['manager']>) => {
    const current = appearanceSettings.value?.manager
    if (current) {
      updateAppearanceSetting('manager', { ...current, ...settings })
    }
  }

  // 打开文件选择器选择管理界面背景图
  const selectManagerBackground = async () => {
    const result = await window.api.background.select('manager')
    if (result) {
      updatemanagerBackground({ backgroundImage: result })
    }
  }

  // 编辑器设置 ==============================

  // 更新编辑器设置
  const updateEditorSetting = <K extends keyof NonNullable<typeof editorSettings.value>>(
    key: K,
    value: NonNullable<typeof editorSettings.value>[K]
  ) => {
    // 乐观更新
    if (settings.value?.editor) {
      ;(settings.value.editor as any)[key] = value
    }
    // 防抖保存
    debouncedSave('editor', key, value)

    // 触发编辑器设置更新事件
    window.dispatchEvent(new CustomEvent('editor-settings-change', { detail: { key, value } }))
  }

  // 设置编辑器字体
  const updateEditorFontFamily = (fontFamily: string) => updateEditorSetting('fontFamily', fontFamily)

  // 加载系统字体列表
  const loadSystemFonts = async () => {
    // 已经加载过了，直接返回
    if (systemFonts.value.length > 0) return

    isLoadingFonts.value = true
    try {
      const fonts = await window.api.font.getSystemFonts()
      if (fonts) {
        systemFonts.value = fonts
      }
    } catch (error) {
      console.log('[Hooks] 加载系统字体失败:', error)
      toast.add({ title: '加载系统字体失败', color: 'error' })
    } finally {
      isLoadingFonts.value = false
    }
  }

  // 切换是否使用该系统字体
  const toggleUseSystemFont = async (enabled: boolean) => {
    // 加载系统字体
    if (enabled) {
      await loadSystemFonts()
    }

    // 更新设置
    updateEditorSetting('useSystemFont', enabled)

    // 如果切换到系统字体，默认选择第一个系统字体
    if (enabled && systemFonts.value.length > 0) {
      updateEditorFontFamily(systemFonts.value[0])
    } else if (!enabled) {
      updateEditorFontFamily('Fira Code')
    }
  }

  // 设置编辑器字号
  const updateEditorFontSize = (fontSize: number) => updateEditorSetting('fontSize', fontSize)

  // 设置缩进空格
  const updateEditorTabSize = (tabSize: number) => updateEditorSetting('tabSize', tabSize)

  // 设置是否自动换行
  const updateEditorWordWrap = (enabled: boolean) => updateEditorSetting('wordWrap', enabled)

  // 设置是佛u显示行号
  const updateEditorShowLineNumbers = (enabled: boolean) => updateEditorSetting('showLineNumbers', enabled)

  // 设置代码片段默认语言
  const updateEditorDefaultLanguage = (language: string) => updateEditorSetting('defaultLanguage', language)

  // 存储设置 ==============================

  // 更新存储设置
  const updateStorageSetting = <K extends keyof NonNullable<typeof storageSettings.value>>(
    key: K,
    value: NonNullable<typeof storageSettings.value>[K]
  ) => {
    // 乐观更新
    if (settings.value?.storage) {
      ;(settings.value.storage as any)[key] = value
    }
    // 防抖保存
    debouncedSave('storage', key, value)
  }

  // 打开文件选择器选择存储位置
  const selectDataDirectory = async () => {
    const result = await window.api.database.selectDirectory()
    if (result) {
      updateStorageSetting('databasePath', result)
    }
  }

  // 快捷键设置 ==============================

  // 更新快捷键设置
  const updateShortcutSettings = <K extends keyof NonNullable<typeof shortcutSettings.value>>(
    key: K,
    value: NonNullable<typeof shortcutSettings.value>[K]
  ) => {
    // 乐观更新
    if (settings.value?.shortcut) {
      ;(settings.value.shortcut as any)[key] = value
    }
    // 防抖保存
    debouncedSave('shortcut', key, value)
  }

  // 弹窗设置 ==============================
  // 打开设置弹窗
  const openSettingsDialog = (tab?: typeof activeTab.value) => {
    if (tab) activeTab.value = tab
    isSettingsVisible.value = true
  }

  // 关闭设置弹窗
  const closeSettingsDialog = () => {
    isSettingsVisible.value = false
  }

  // 切换当前标签页
  const swtictTab = (tab: typeof activeTab.value) => {
    activeTab.value = tab
  }

  // 重置设置为默认值
  const resetSettings = async () => {
    try {
      await settingsStore.resetSettings()
      // 应用默认主题
      if (appearanceSettings.value?.theme) {
        applyTheme(appearanceSettings.value.theme)
      }
      // 重置toast
      toast.add({ title: '重置设置成功', color: 'success' })
    } catch (error) {
      console.log('[Hooks] 重置设置失败:', error)
      toast.add({ title: '重置设置失败', color: 'error' })
    }
  }

  /**
   * Watchers
   */
  watch(colorMode, (newMode) => {
    if (appearanceSettings.value?.themeMode === 'system') {
      const theme = newMode === 'dark' ? 'github-dark' : 'github-light'
      updateTheme(theme)
    }
  })

  return {
    // Stasts
    isSettingsVisible,
    activeTab,
    isSaving,
    systemFonts,
    isLoadingFonts,
    presetFonts,

    bgPrimary,
    bgSecondary,
    textPrimary,
    textSecondary,
    activeBg,
    activeText,
    border,

    // Getters
    settings,
    isLoading,
    currentTheme,

    generalSettings,
    appearanceSettings,
    editorSettings,
    shortcutSettings,
    storageSettings,

    availableThemes,
    currentThemeColors,
    isDarkMode,
    fontOptions,

    // Actions
    applyTheme,
    loadSettings,
    debouncedSave,

    updateGeneralSetting,
    updateAutoLaunch,
    updateHideOnStartup,
    updateAutoHideOnBlur,
    updateShowSystemTray,
    updateSearchbarAlwayOnTop,
    updateSearchbarPosition,
    updateCustomSearchbarPosition,
    updateAppLanguage,

    updateAppearanceSetting,
    updateTheme,
    applyThemeMode,
    updateThemeMode,
    updateSearchbarBackground,
    selectSearchbarBackground,
    updatemanagerBackground,
    selectManagerBackground,

    updateEditorSetting,
    updateEditorFontFamily,
    loadSystemFonts,
    toggleUseSystemFont,
    updateEditorFontSize,
    updateEditorTabSize,
    updateEditorWordWrap,
    updateEditorShowLineNumbers,
    updateEditorDefaultLanguage,

    updateStorageSetting,
    selectDataDirectory,

    updateShortcutSettings,

    openSettingsDialog,
    closeSettingsDialog,

    swtictTab,
    resetSettings,
    colorMode
  }
}
