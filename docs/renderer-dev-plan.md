# SimSnippet 渲染进程开发规划文档

> 版本：MVP v1.0
> 目标：快速实现核心功能的第一个可用版本

---

## 1. 架构设计

### 1.1 目录结构

```
src/renderer/src/
├── views/                          # 路由页面（仅路由入口）
│   ├── index.vue                  # 搜索框页面
│   └── manage.vue                 # 管理页面
├── components/                     # 组件
│   ├── searchbar/                 # 搜索框页面组件
│   │   ├── searchbar-main.vue
│   │   ├── searchbar-result.vue
│   │   └── searchbar-result-item.vue
│   ├── manager/                   # 管理页面组件
│   │   ├── manager-header.vue
│   │   ├── manager-sidebar.vue
│   │   ├── manager-content.vue
│   │   └── manager-detail.vue
│   ├── category/                  # 分类相关组件
│   ├── code/                      # 代码片段相关组件
│   └── settings/                  # 设置相关组件
├── stores/                         # Pinia 状态管理
│   ├── modules/
│   │   ├── search.ts              # 搜索状态
│   │   ├── category.ts            # 分类状态
│   │   ├── code.ts                # 代码片段状态
│   │   ├── tag.ts                 # 标签状态
│   │   └── settings.ts            # 设置状态
│   └── index.ts
├── composables/                    # 组合式函数（业务逻辑）
│   ├── useSearch.ts               # 搜索逻辑
│   ├── useCategory.ts             # 分类逻辑（含拖拽排序）
│   ├── useCode.ts                 # 代码片段逻辑（含无限滚动）
│   ├── useSettings.ts             # 设置逻辑（含主题切换）
│   └── useWindow.ts               # 窗口控制
├── router/
├── utils/
└── i18n/                          # 多语言（搜索框示例）
```

### 1.2 分层职责

| 层级            | 职责                   | 技术选型                     |
| --------------- | ---------------------- | ---------------------------- |
| **Views**       | 路由页面容器，负责布局 | Vue SFC                      |
| **Components**  | UI 展示和交互处理      | Vue SFC + NuxtUI             |
| **Composables** | 业务逻辑封装           | Vue Composition API + VueUse |
| **Store**       | 数据状态管理           | Pinia + useAsyncState        |
| **API**         | 主进程通信             | window.api.\*                |

---

## 2. Store 模块

### 2.1 设计原则

- 使用 **VueUse useAsyncState** 管理异步请求状态
- Store 只负责数据状态和基础 CRUD
- 业务逻辑在 Composables 中处理

### 2.2 useSearchStore

**States:**

- `keyword`: 搜索关键字
- `results`: 搜索结果列表
- `selectedIndex`: 当前选中索引
- `isSearching`: 是否搜索中

**Actions:**

- `search(keyword)` - 执行搜索
- `selectNext()` - 选择下一个
- `selectPrev()` - 选择上一个
- `selectByIndex(index)` - 选择指定索引
- `confirmSelection()` - 确认选择并复制
- `clearSearch()` - 清空搜索

**Getters:**

- `selectedCode` - 当前选中的代码片段
- `hasResults` - 是否有搜索结果

### 2.3 useCategoryStore

**States:**

- `categories`: 分类列表
- `currentCategoryId`: 当前选中的分类ID
- `isLoading`: 加载状态

**Actions:**

- `loadCategories()` - 加载所有分类（useAsyncState）
- `createCategory(data)` - 创建分类
- `updateCategory(id, data)` - 更新分类
- `deleteCategory(id)` - 删除分类
- `reorderCategories(sortedIds)` - 重新排序分类
- `setCurrentCategory(id)` - 设置当前分类

**Getters:**

- `currentCategory` - 当前选中的分类
- `categoryCount` - 分类总数

### 2.4 useCodeStore

**States:**

- `codes`: 代码片段列表
- `currentCodeId`: 当前选中的代码片段ID
- `currentCode`: 当前编辑的代码片段
- `isLoading`: 加载状态
- `pagination`: 分页信息 { page, pageSize, total, hasMore }
- `filter`: 筛选条件 { categoryId, isDeleted, isFavorited }

**Actions:**

- `loadCodes(options, reset?)` - 加载代码片段列表
- `loadMore()` - 加载更多（用于无限滚动）
- `createCode(data)` - 创建代码片段
- `updateCode(id, data)` - 更新代码片段
- `deleteCode(id, hard?)` - 删除代码片段（软/硬删除）
- `restoreCode(id)` - 从回收站恢复
- `emptyTrash()` - 清空回收站
- `toggleFavorite(id)` - 切换收藏状态
- `batchUpdateCategory(ids, categoryId)` - 批量修改分类
- `setCurrentCode(id)` - 设置当前代码片段

**Getters:**

- `trashCodes` - 回收站代码片段
- `favoriteCodes` - 收藏的代码片段
- `uncategorizedCodes` - 未分类的代码片段
- `filteredCodes` - 根据筛选条件过滤后的代码

### 2.5 useTagStore

**States:**

- `tags`: 所有标签列表
- `isLoading`: 加载状态

**Actions:**

- `loadTags()` - 加载所有标签（useAsyncState）
- `refreshTags()` - 刷新标签列表

**Getters:**

- `tagCount` - 标签总数

### 2.6 useSettingsStore

**States:**

- `settings`: 所有设置数据
- `isLoading`: 加载状态
- `isSettingsOpen`: 设置弹窗是否打开

**Actions:**

- `loadSettings()` - 加载所有设置（useAsyncState）
- `updateSetting(section, key, value)` - 更新单个设置
- `updateSettings(section, data)` - 批量更新设置
- `resetSettings()` - 重置为默认设置
- `openSettings()` - 打开设置弹窗
- `closeSettings()` - 关闭设置弹窗
- `applyTheme(theme)` - 应用主题到编辑器

**Getters:**

- `generalSettings` - 通用设置
- `appearanceSettings` - 外观设置（含主题）
- `editorSettings` - 编辑器设置
- `shortcutSettings` - 快捷键设置
- `storageSettings` - 存储设置

---

## 3. Composables

### 3.1 useSearch

**功能:**

- 搜索输入防抖（useDebounceFn）
- 键盘事件处理（上下键、回车、ESC）
- 结果选择和确认

**返回:**

- 搜索相关状态和操作方法

### 3.2 useCategory

**功能:**

- 分类 CRUD 操作封装
- 分类拖拽排序（VueUse useSortable）
- 删除分类时的确认和代码迁移逻辑

**依赖:**

- VueUse `useSortable` - 实现拖拽排序

**返回:**

- 分类列表、当前分类、操作方法

### 3.3 useCode

**功能:**

- 代码片段 CRUD 操作封装
- 无限滚动加载（VueUse useInfiniteScroll）
- 收藏、删除、恢复操作
- 实时更新处理

**依赖:**

- VueUse `useInfiniteScroll` - 实现无限滚动
- VueUse `useClipboard` - 复制代码内容

**返回:**

- 代码列表、当前代码、分页信息、操作方法

### 3.4 useSettings

**功能:**

- 设置加载和保存
- 主题切换和应用
- CodeMirror 主题同步
- 快捷键注册

**依赖:**

- CodeMirror 主题配置（来自主进程 store）

**返回:**

- 设置数据、操作方法、主题相关方法

### 3.5 useWindow

**功能:**

- 窗口控制（最小化、最大化、关闭）
- 窗口置顶设置
- 搜索框位置管理

**返回:**

- 窗口状态和操作方法

---

## 4. 核心功能实现

### 4.1 分类拖拽排序

**技术方案:**

- 使用 VueUse `useSortable`
- 拖拽完成后调用 `window.api.category.reorder(sortedIds)`
- 实时更新 Store 中的分类顺序

**实现要点:**

- 在分类列表容器上应用 useSortable
- 监听排序变化事件
- 调用 API 更新后端排序
- 刷新分类列表

### 4.2 代码片段无限滚动

**技术方案:**

- 使用 VueUse `useInfiniteScroll`
- 在列表底部放置一个触发元素
- 当元素可见时自动加载下一页

**实现要点:**

- 在 Store 中维护 pagination 状态
- 使用 useInfiniteScroll 监听底部元素
- 加载更多时调用 `store.loadMore()`
- 合并新数据到现有列表

### 4.3 编辑器主题切换

**技术方案:**

- CodeMirror 6 主题系统
- 从主进程 store 获取主题配置
- 动态切换编辑器主题

**实现要点:**

- 在 useSettings 中监听主题变化
- 根据 theme 值加载对应的 CodeMirror 主题
- 应用主题到所有编辑器实例
- 同步更新应用整体配色（通过 CSS Variables）

**主题映射:**
主进程 store 中已配置的主题：

- 'material-light', 'github-light', 'tomorrow', 'solarized-light'
- 'material-dark', 'github-dark', 'tomorrow-night', 'solarized-dark', 'one-dark', 'dracula', 'monokai'

---

## 5. 多语言配置（搜索框示例）

### 5.1 语言文件

```typescript
// src/i18n/lang/zh-CN/searchbar.ts
export default {
  search: {
    placeholder: '输入关键字搜索代码片段...',
    noResults: '没有找到匹配的代码片段',
    shortcutHint: '按 ↑↓ 选择，Enter 复制',
    manageBtn: '管理'
  }
}
```

### 5.2 使用方式

```vue
<template>
  <input :placeholder="$t('search.placeholder')" />
  <p v-if="!hasResults">{{ $t('search.noResults') }}</p>
</template>
```

---

## 6. 开发顺序

### Phase 1: Store 模块（Day 1）

**目标:** 完成所有 Store 模块的搭建

- [x] useSearchStore - 完善搜索状态
- [ ] useCategoryStore - 分类状态（含排序字段）
- [ ] useCodeStore - 代码片段状态（含分页）
- [ ] useTagStore - 标签状态
- [ ] useSettingsStore - 设置状态

### Phase 2: Composables（Day 2）

**目标:** 完成业务逻辑封装

- [ ] useSearch - 搜索逻辑
- [ ] useCategory - 分类逻辑（含拖拽排序 useSortable）
- [ ] useCode - 代码逻辑（含无限滚动 useInfiniteScroll）
- [ ] useSettings - 设置逻辑（含主题切换）
- [ ] useWindow - 窗口控制

### Phase 3: 搜索框 UI（Day 3）

**目标:** 完成搜索框功能

- [ ] 搜索输入和防抖
- [ ] 搜索结果展示
- [ ] 键盘导航（上下键、回车、ESC）
- [ ] 复制到剪贴板（useClipboard）
- [ ] 打开管理页面按钮
- [ ] 多语言示例（中文）

### Phase 4: 管理页面 - 分类（Day 4）

**目标:** 完成分类管理功能

- [ ] 分类列表展示
- [ ] 分类拖拽排序（useSortable）
- [ ] 创建分类
- [ ] 重命名分类
- [ ] 删除分类（含代码迁移）

### Phase 5: 管理页面 - 代码列表（Day 5）

**目标:** 完成代码列表功能

- [ ] 代码片段列表展示
- [ ] 无限滚动加载（useInfiniteScroll）
- [ ] 按分类筛选
- [ ] 关键字搜索
- [ ] 右键菜单（删除、收藏）- 使用 NuxtUI

### Phase 6: 管理页面 - 代码详情（Day 6）

**目标:** 完成代码编辑功能

- [ ] CodeMirror 6 编辑器集成
- [ ] 编辑器主题切换
- [ ] 代码编辑表单（标题、分类、标签）
- [ ] 实时更新
- [ ] 代码统计（行数、列数）
- [ ] 标签输入 - 使用 NuxtUI InputTag

### Phase 7: 快捷导航 & 回收站（Day 7）

**目标:** 完成快捷导航和回收站

- [ ] 全部代码片段
- [ ] 未分类
- [ ] 收藏夹
- [ ] 回收站（代码列表、恢复、清空）

---

## 7. 技术选型汇总

| 功能         | 技术方案                       | 说明                    |
| ------------ | ------------------------------ | ----------------------- |
| 异步状态管理 | VueUse `useAsyncState`         | 简化 loading/error 处理 |
| 防抖         | VueUse `useDebounceFn`         | 搜索输入防抖            |
| **无限滚动** | VueUse `useInfiniteScroll`     | 滚动加载更多            |
| **拖拽排序** | VueUse `useSortable`           | 分类拖拽排序            |
| 剪贴板       | VueUse `useClipboard`          | 复制代码内容            |
| 右键菜单     | NuxtUI `ContextMenu`           | 使用 NuxtUI 组件        |
| 标签输入     | NuxtUI `InputTag`              | 使用 NuxtUI 组件        |
| 代码编辑器   | **CodeMirror 6**               | 轻量级编辑器            |
| 编辑器主题   | CodeMirror Themes + Store 配置 | 动态切换                |
| 表单验证     | Zod                            | 已在主进程使用          |
| 应用主题     | CSS Variables                  | 动态切换主题颜色        |

---

## 8. 注意事项

1. **分层清晰**: Store 只存数据，Composables 处理业务，Components 处理 UI
2. **VueUse 优先**: 优先使用 VueUse 提供的组合式函数，避免重复造轮子
3. **主题同步**: 编辑器主题和应用主题需要同步切换
4. **错误处理**: 统一在 Composables 中处理错误，UI 层只负责展示
5. **性能优化**: 大列表使用无限滚动，搜索使用防抖
6. **类型安全**: 所有 API 调用使用 TypeScript 类型

---

## 9. 后续优化方向（V2）

- [ ] 标签云展示
- [ ] 代码片段拖拽排序
- [ ] 导入/导出功能
- [ ] 代码片段分享
- [ ] 更多编辑器功能（代码折叠、迷你地图等）
- [ ] 代码截图功能
- [ ] 设置同步
- [ ] 完善多语言（繁体中文、英文）

---

**文档版本**: 1.1
**创建日期**: 2024-03-01
**最后更新**: 2024-03-01
