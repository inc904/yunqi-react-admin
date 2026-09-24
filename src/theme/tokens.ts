/**
 * 这是变量的说明清单，不存放具体颜色：真正的值在各主题 CSS 的浅色、深色块中。
 * name 必须与 CSS 变量同名；featured 控制是否出现在“关键颜色”；
 * kind: 'shadow' 让预览方块使用 box-shadow，而不是把阴影当作背景色。
 */
export const themeTokens = [
  // 品牌与交互
  {
    name: '--color-primary',
    label: '品牌主色',
    description: '主要按钮、品牌标记和当前导航项',
    group: '品牌与交互',
    featured: true,
  },
  { name: '--color-primary-hover', label: '主色悬停', description: '主要按钮悬停时的颜色', group: '品牌与交互' },
  {
    name: '--color-primary-contrast',
    label: '主色上的文字',
    description: '主色背景上的文字和图标',
    group: '品牌与交互',
  },
  {
    name: '--color-primary-soft',
    label: '浅色强调背景',
    description: '提示图标等柔和的品牌色背景',
    group: '品牌与交互',
  },
  { name: '--color-primary-faint', label: '淡色强调文字', description: '弱化的大号装饰文字', group: '品牌与交互' },
  {
    name: '--shadow-primary',
    label: '品牌色阴影',
    description: '当前导航项等品牌强调区域的阴影',
    group: '品牌与交互',
    kind: 'shadow',
  },
  // 页面与内容
  { name: '--color-page', label: '页面背景', description: '后台内容区和页面底色', group: '页面与内容', featured: true },
  {
    name: '--color-surface',
    label: '内容表面',
    description: '顶栏、卡片和次要按钮背景',
    group: '页面与内容',
    featured: true,
  },
  { name: '--color-surface-muted', label: '柔和表面', description: '搜索框和轻微悬停背景', group: '页面与内容' },
  { name: '--color-text', label: '主要文字', description: '标题和正文', group: '页面与内容', featured: true },
  { name: '--color-text-muted', label: '次要文字', description: '说明文字和次要图标', group: '页面与内容' },
  { name: '--color-text-subtle', label: '弱化文字', description: '面包屑和辅助标签', group: '页面与内容' },
  {
    name: '--color-border',
    label: '分隔边框',
    description: '卡片、输入框和区域分隔线',
    group: '页面与内容',
    featured: true,
  },
  // 侧栏
  { name: '--color-sidebar', label: '侧栏背景', description: '左侧导航区域底色', group: '侧栏', featured: true },
  { name: '--color-sidebar-text', label: '侧栏文字', description: '普通导航项文字', group: '侧栏' },
  { name: '--color-sidebar-muted', label: '侧栏辅助文字', description: '菜单分组与品牌副标题', group: '侧栏' },
  { name: '--color-sidebar-hover', label: '侧栏悬停', description: '导航项悬停时的半透明背景', group: '侧栏' },
  { name: '--color-sidebar-divider', label: '侧栏分隔线', description: '品牌区内部的分隔线', group: '侧栏' },
  { name: '--color-sidebar-active', label: '侧栏高亮文字', description: '深色侧栏上强调显示的文字', group: '侧栏' },
  { name: '--color-danger', label: '危险状态', description: '通知红点等需要警示的状态', group: '状态' },
] as const
