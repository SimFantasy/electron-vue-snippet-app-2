<script lang="ts" setup name="CodeEditor">
import { EditorView, keymap, lineNumbers } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { indentWithTab } from '@codemirror/commands'
import { useAppStore } from '@/stores'
import { loadLanguage, defaultLanguage } from './language-config'
import { loadTheme, getFontCSS, defaultTheme, defaultFont, defaultFontSize } from './theme-config'

/**
 * Defines
 */
interface Props {
  modelValue: string
  language?: string
  readonly?: boolean
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: defaultLanguage,
  readonly: false,
  height: '100%'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

/**
 * Hooks
 */
const appStore = useAppStore()
const { codeEditorTheme, codeEditorFontSize, codeEditorFontFamily } = storeToRefs(appStore)

/**
 * Refs
 */
const editorRef = ref<HTMLDivElement>()
const editorView = shallowRef<EditorView>()
const languageConf = new Compartment()
const themeConf = new Compartment()
const editableConf = new Compartment()

/**
 * States
 */
// 当前语言
const currentLanguage = computed(() => props.language || defaultLanguage)

// 当前主题
const currentTheme = computed(() => codeEditorTheme.value || defaultTheme)

// 当前字体
const currentFont = computed(() => codeEditorFontFamily.value || defaultFont)

// 当前字号
const currentFontSize = computed(() => codeEditorFontSize.value || defaultFontSize)

/**
 * Actions
 */
// 创建编辑器
const createEditor = async () => {
  if (!editorRef.value) return

  // 加载语言支持
  const languageSupport = await loadLanguage(currentLanguage.value)

  // 加载主题
  const theme = await loadTheme(currentTheme.value)

  // 创建编辑器状态
  const state = EditorState.create({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      lineNumbers(),
      keymap.of([indentWithTab]),
      languageConf.of(languageSupport || []),
      themeConf.of(theme || []),
      editableConf.of(EditorView.editable.of(!props.readonly)),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          emit('update:modelValue', update.state.doc.toString())
        }
      }),
      EditorView.theme({
        '&': {
          height: props.height
        },
        '.cm-scroller': {
          overflow: 'auto'
        }
      })
    ]
  })

  // 创建编辑器视图
  editorView.value = new EditorView({
    state,
    parent: editorRef.value
  })

  // 应用字体样式
  applyFontStyles()
}

// 应用字体样式
const applyFontStyles = () => {
  if (!editorRef.value) return

  const styleId = 'code-editor-font-style'
  let styleEl = document.getElementById(styleId)

  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = styleId
    document.head.appendChild(styleEl)
  }

  styleEl.textContent = getFontCSS(currentFont.value, currentFontSize.value)
}

// 更新语言
const updateLanguage = async () => {
  if (!editorView.value) return

  const languageSupport = await loadLanguage(currentLanguage.value)
  if (languageSupport) {
    editorView.value.dispatch({
      effects: languageConf.reconfigure(languageSupport)
    })
  }
}

// 更新主题
const updateTheme = async () => {
  console.log('updateTheme called, theme:', currentTheme.value) // 加这行调试
  if (!editorView.value) return

  const theme = await loadTheme(currentTheme.value)

  editorView.value.dispatch({
    effects: themeConf.reconfigure(theme || [])
  })
}

// 更新编辑器内容
const updateContent = () => {
  if (!editorView.value) return

  const currentContent = editorView.value.state.doc.toString()
  if (currentContent !== props.modelValue) {
    editorView.value.dispatch({
      changes: {
        from: 0,
        to: currentContent.length,
        insert: props.modelValue
      }
    })
  }
}

/**
 * Watchers
 */
// 监听语言变化
watch(() => props.language, updateLanguage)

// 监听主题变化
watch(() => currentTheme.value, updateTheme)

// 监听字体变化
watch(() => currentFont.value, applyFontStyles)

// 监听字号变化
watch(() => currentFontSize.value, applyFontStyles)

// 监听外部值变化
watch(() => props.modelValue, updateContent)

/**
 * Lifecycle
 */
onMounted(() => {
  createEditor()
})

onUnmounted(() => {
  editorView.value?.destroy()
})
</script>

<template>
  <div ref="editorRef" class="code-editor"></div>
</template>

<style scoped>
.code-editor {
  @apply w-full h-full;
}
</style>
