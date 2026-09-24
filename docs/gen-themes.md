# 生成配色TOKEN

```text

请在当前 React 项目中新增一套可切换的主题。

设计要求：

- 主题中文名：[例如：暖沙]
- 主题英文标识：[例如：sand，使用小写英文字母]
- 品牌主色或参考色：[填写颜色或参考图描述]
- 整体气质：[例如：温暖、克制、适合后台长时间使用]
- 其他要求：[可选]

请先阅读：

- src/theme/tokens.ts
- src/theme/index.ts
- src/styles/themes/donglai.css
- src/main.tsx
- docs/themes.md

实现要求：

1. 新建 src/styles/themes/[英文标识].css，同时提供 light 和 dark 两组配色。
2. 每组必须定义下面全部 20 个变量，名称一致，不遗漏、不新增同义变量：
   品牌与交互：
   --color-primary 品牌主色，主要按钮和选中导航
   --color-primary-hover 主色悬停状态
   --color-primary-contrast 主色背景上的文字和图标
   --color-primary-soft 柔和的品牌色背景
   --color-primary-faint 弱化的装饰文字
   --shadow-primary 品牌强调区域的阴影

   页面与内容：
   --color-page 页面底色
   --color-surface 顶栏和卡片背景
   --color-surface-muted 搜索框和轻微悬停背景
   --color-text 标题和正文
   --color-text-muted 次要说明文字
   --color-text-subtle 面包屑和辅助标签
   --color-border 边框与分隔线

   侧栏：
   --color-sidebar 侧栏背景
   --color-sidebar-text 普通导航文字
   --color-sidebar-muted 菜单分组等辅助文字
   --color-sidebar-hover 导航悬停背景
   --color-sidebar-divider 侧栏分隔线
   --color-sidebar-active 侧栏强调文字

   状态：
   --color-danger 警示状态，例如通知红点

3. 两组选择器都要支持全站和系统配置页的主题预览，格式如下：

   :root[data-theme='[英文标识]'][data-mode='light'],
   [data-preview-theme='[英文标识]'][data-preview-mode='light'] {
   color-scheme: light;
   /* 完整的 20 个变量 */
   }

   :root[data-theme='[英文标识]'][data-mode='dark'],
   [data-preview-theme='[英文标识]'][data-preview-mode='dark'] {
   color-scheme: dark;
   /* 同样完整的 20 个变量 */
   }

4. 浅色和深色应保持同一种品牌气质，但要分别设计背景、表面、文字、边框及侧栏层次。不要仅把浅色数值机械反转。检查主要文字、次要文字、主色按钮文字和侧栏文字的可读性；普通文字对背景尽量达到 4.5:1 对比度。
5. 在 src/main.tsx 引入新 CSS，并在 src/theme/index.ts 的 themes 对象注册中文名。现有 20 个变量的语义不变，因此无需修改 src/theme/tokens.ts。
6. 更新 docs/themes.md 中的主题列表。保留已有主题和未提交的用户修改。
7. 运行 pnpm build、pnpm lint，并核对新主题的 light/dark 两组都恰好覆盖现有 20 个变量。最后说明修改了哪些文件及验证结果。
```
