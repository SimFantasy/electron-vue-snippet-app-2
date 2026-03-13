<script lang="ts" setup name="CodeEditor">
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { indentWithTab } from '@codemirror/commands'

import { useSettings } from '@/composables'
import { loadLanguage, defaultLanguage } from './language-config'
import { loadTheme, getFontCSS, defaultTheme, defaultFontSize, defaultFont } from './theme-config'

/**
 * Defines
 */
// Props
const { language = defaultLanguage, readonly = false } = defineProps<{
  language: string
  readonly?: boolean
}>()

// Models
const content = defineModel<string>()

// Emits
const emit = defineEmits<{
  onCursorChange: [line: number, column: number]
  onLineCount: [count: number]
  onContentChange: [content: string]
}>()

/**
 * Hooks
 */
const { editorSettings, appearanceSettings } = useSettings()

/**
 * States
 */
// 编辑器容器 DOM 引用
const editorRef = useTemplateRef<HTMLDivElement>('editorContainer')
// CodeMirror 编辑器示例
const editorView = shallowRef<EditorView>()
// 动态重配置（语言、主题、可编辑状态）
const languageConf = new Compartment()
const themeConf = new Compartment()
const editableConf = new Compartment()

/**
 * Getters
 */
// 当前编辑器语言
const currentLanguage = computed(() => language || defaultLanguage)
// 当前主题
const currentTheme = computed(() => appearanceSettings.value?.theme || defaultTheme)
// 当前字体
const currentFont = computed(() => editorSettings.value?.fontFamily || defaultFont)
// 当前字体大小
const currentFontSize = computed(() => editorSettings.value?.fontSize || defaultFontSize)
// 是否显示行号
const showLineNumbers = computed(() => editorSettings.value?.showLineNumbers ?? true)
// 是否高亮当前行
const hightlightActiveLine = computed(() => editorSettings.value?.hightlightActiveLine ?? true)

/**
 * Actions
 */
// 创建编辑器实例
const createEditor = async () => {
  if (!editorRef.value) return

  // 动态加载语言
  const languageSupport = await loadLanguage(currentLanguage.value)

  // 动态加载主题
  const theme = await loadTheme(currentTheme.value)

  // 创建编辑器状态
  const state = EditorState.create({
    doc: content.value,
    extensions: [
      basicSetup,
      // 根据设置决定是否显示行号
      showLineNumbers.value ? lineNumbers() : [],
      // 根据设置决定是否高亮当前行
      hightlightActiveLine.value ? [highlightActiveLine(), highlightActiveLineGutter()] : [],
      // Tab缩进
      keymap.of([indentWithTab]),
      // 语言支持
      languageConf.of(languageSupport || []),
      // 主题
      themeConf.of(theme || []),
      // 可编辑状态
      editableConf.of(EditorView.editable.of(!readonly)),
      // 监听文档变化和光标位置变化
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newValue = update.state.doc.toString()

          // 更新内容
          emit('onContentChange', newValue)
          // 更新行数统计
          emit('onLineCount', update.state.doc.lines)
        }

        // 监听光标位置变化
        if (update.selectionSet) {
          const { head } = update.state.selection.main
          const line = update.state.doc.lineAt(head)
          const column = head - line.from + 1
          emit('onCursorChange', line.number, column)
        }
      }),
      // 编辑器基础样式
      EditorView.theme(getFontCSS(currentFont.value, currentFontSize.value))
    ]
  })

  // 创建编辑器视图
  editorView.value = new EditorView({
    state,
    parent: editorRef.value
  })

  // 应用字体样式
  // applyFontStyle()

  // 初始化时发送行数
  emit('onLineCount', state.doc.lines)
}

// // 应用字体样式
// const applyFontStyle = () => {
//   if (!editorRef.value) return

//   const styleId = 'code-editor-font-style'
//   let styleEl = document.getElementById(styleId)

//   if (!styleEl) {
//     styleEl = document.createElement('style')
//     styleEl.id = styleId
//     document.head.appendChild(styleEl)
//   }

//   styleEl.textContent = getFontCSS(currentFont.value, currentFontSize.value)
// }

// 更新编辑器语言
const handleUpdateLanguage = async () => {
  if (!editorView.value) return

  const languageSupport = await loadLanguage(currentLanguage.value)
  if (languageSupport) {
    editorView.value.dispatch({
      effects: languageConf.reconfigure(languageSupport)
    })
  }
}

// 更新编辑器主题
const handleUpdateTheme = async () => {
  if (!editorView.value) return

  const theme = await loadTheme(currentTheme.value)
  if (theme) {
    editorView.value.dispatch({
      effects: themeConf.reconfigure(theme || [])
    })
  }
}

// 更新编辑器内容
const handleUpdateContent = () => {
  if (!editorView.value) return

  const currentContent = editorView.value.state.doc.toString()
  if (currentContent !== content.value) {
    editorView.value.dispatch({
      changes: {
        from: 0,
        to: currentContent.length,
        insert: content.value
      }
    })
  }
}

// 获取当前光标位置
const getCursorPosition = () => {
  if (!editorView.value) return { line: 1, column: 1 }

  const { head } = editorView.value.state.selection.main
  const line = editorView.value.state.doc.lineAt(head)

  return {
    line: line.number,
    column: head - line.from + 1
  }
}

// 获取总行数
const getLineCount = () => {
  if (!editorView.value) return 1
  return editorView.value.state.doc.lines
}

// 聚焦编辑器
const focustEditor = () => {
  editorView.value?.focus()
}

/**
 * Watches
 */
// 监听语言变化
watch(() => language, handleUpdateLanguage)

// 监听主题变化
watch(() => appearanceSettings.value?.theme, handleUpdateTheme)

// 监听字体变化
watch(
  () => currentFont.value,
  () => {
    // 重新创建编辑器以应用字体变化
    editorView.value?.destroy()
    createEditor()
  }
)

// 监听字号变化
watch(
  () => currentFontSize.value,
  () => {
    // 重新创建编辑器以应用字号变化
    editorView.value?.destroy()
    createEditor()
  }
)

// 监听外部内容变化
watch(() => content.value, handleUpdateContent)

/**
 * Lifecycles
 */
// 组件挂载完成后创建编辑器
onMounted(() => createEditor())
// 组件销毁时销毁编辑器
onUnmounted(() => editorView.value?.destroy())

/**
 * Exposes
 */
// 暴露给父组件的接口
defineExpose({
  getCursorPosition, // 获取当前光标位置
  getLineCount, // 获取总行数
  focustEditor // 聚焦编辑器
})
</script>

<template>
  <div ref="editorContainer" class="code-editor"></div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.code-editor {
  @apply w-full h-full;
}
</style>
