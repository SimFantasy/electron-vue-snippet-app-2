export const IPC_KEYS = {
  /**
   * 窗口控制
   */
  WINDOW_OPEN: 'window-open', // 打开指定窗口
  WINDOW_CLOSE: 'window-close', // 关闭指定窗口
  WINDOW_MINIMIZE: 'window-minimize', // 最小化窗口
  WINDOW_MAXIMIZE: 'window-maximize', // 最大化窗口
  WINDOW_RESTORE: 'window-restore', // 还原窗口
  WINDOW_CLOSE_CURRENT: 'window-close-current', // 关闭当前窗口
  WINDOW_SET_ALWAYS_ON_TOP: 'window-set-always-on-top', // 设置窗口置顶

  /**
   * 数据库相关
   */
  DB_GET_PATH: 'db-get-path', // 获取当前数据库路径
  DB_SELECT_DIRECTORY: 'db-select-directory', // 选择数据库目录
  DB_SET_PATH: 'db-set-path', // 设置当前数据库路径
  DB_INIT: 'db-init', // 初始化数据库

  /**
   * 分类
   */
  CATEGORY_GET_ALL: 'category-get-all', // 获取所有分类
  CATEGORY_CREATE: 'category-create', // 创建分类
  CATEGORY_UPDATE: 'category-update', // 更新分类
  CATEGORY_DELETE: 'category-delete', // 删除分类
  CATEGOR_UPDATE_SORT_ORDER: 'category-reorder', // 更新分类排序

  /**
   * 代码片段
   */
  CODE_GET_ALL: 'code-get-all', // 获取所有代码片段
  CODE_GET_BY_ID: 'code-get-by-id', // 根据ID获取代码片段
  CODE_CREATE: 'code-create', // 创建代码片段
  CODE_UPDATE: 'code-update', // 更新代码片段
  CODE_BATCH_UPDATE_CATEGORY: 'code-batch-update-category', // 批量更新代码片段分类
  CODE_MOVE_TO_UNCATEGORIZED: 'code-move-to-uncategorized', // 移动到未分类
  CODE_DELETE: 'code-delete', // 硬删除代码片段
  CODE_SOFT_DELETE: 'code-soft-delete', // 软删除代码片段
  CODE_RESTORE: 'code-restore', // 恢复代码片段
  CODE_GET_TRASH: 'code-get-trash', // 获取回收站中的代码片段
  CODE_CLEAR_TRASH: 'code-clear-trash', // 清空回收站
  CODE_GET_FAVORITE: 'code-get-favorite', // 获取收藏中的代码片段
  CODE_TOGGLE_FAVORITE: 'code-toggle-favorite', // 收藏/取消收藏代码片段
  CODE_SEARCH: 'code-search', // 搜索代码片段
  CODE_GET_COUNT: 'code-get-count', // 获取代码片段总数
  CODE_GET_BY_TAG: 'code-get-by-tag', // 根据标签获取代码片段
  CODE_GET_ALL_TAGS: 'code-get-all-tags', // 获取所有标签

  /**
   * 快捷键
   */
  SHORTCUT_IS_REGISTERED: 'is-registered', // 检查快捷键是否注册
  SHORTCUT_REGISTER: 'register', // 注册快捷键
  SHORTCUT_ALL_UNREGISTER: 'unregister-all', // 注销所有快捷键
  SHORTCUT_REGISTER_SEARCHBAR: 'shortcut-register-searchbar', // 注册搜索框快捷键
  SHORTCUT_REGISTER_ACTION: 'shortcut-register-action', // 注册操作快捷键
  SHORTCUT_TRIGGER: 'shortcut-trigger', // 快捷键触发事件

  SHORTCUT_MANAGER_ADD_CATEGORY: 'shortcut-manager-add-category', // 新建分类
  SHORTCUT_MANAGER_RENAME_CATEGORY: 'shortcut-manager-rename-category', // 重命名分类
  SHORTCUT_MANAGER_REMOVE_CATEGORY: 'shortcut-manager-remove-category', // 删除分类
  SHORTCUT_MANAGER_ADD_CODE: 'shortcut-manager-add-code', // 新建代码片段
  SHORTCUT_MANAGER_REMOVE_CODE: 'shortcut-manager-remove-code', // 删除代码片段
  SHORTCUT_MANAGER_TOGGLE_FAVORITE: 'shortcut-manager-toggle-favorite', // 收藏/取消收藏代码片段

  /**
   * 背景图片
   */
  BACKGROUND_SELECT_IMAGE: 'background-select-image', // 选择背景图片
  BACKGROUND_DELETE_IMAGE: 'background-delete-image', // 删除背景图片
  BACKGROUND_GET_IMAGE: 'background-get-image', // 获取背景图片

  /**
   * Store
   */
  STORE_GET: 'store-get', // 获取配置
  STORE_SET: 'store-set', // 设置配置
  STORE_ON_CHANGE: 'store-on-change', // 监听配置变化
  STORE_GET_DEFAULT: 'store-get-default', // 获取默认配置

  /**
   * 其他
   */
  IGNORE_MOUSE_EVENTS: 'ignore-mouse-events', // 忽略鼠标事件
  FONT_GET_SYSTEM_FONTS: 'font-get-system-fonts' // 获取系统字体
}
