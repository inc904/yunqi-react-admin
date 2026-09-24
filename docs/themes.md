# 主题系统入门

这份文档对应当前项目的实际代码。项目有「东来」「青岩」「松林」「夜幕」四套主题，每套都能选浅色、深色或跟随系统。默认是东来浅色；选择会保存在当前浏览器中。

## 先理解三个层次

1. **主题值**：每套主题的浅色和深色版本都给同一批 CSS 变量赋值。例如东来的 `--color-primary` 是橙色，青岩的是蓝色。
2. **组件样式**：按钮、侧栏等只读取变量，例如 `background: var(--color-primary)`。组件不关心正在使用哪套主题。
3. **切换逻辑**：给 `<html>` 设置 `data-theme` 和 `data-mode` 两个属性，让浏览器选择对应的主题与明暗版本。

这个关系可以记成：`主题 × 明暗模式 → CSS 变量 → 组件样式`。例如 `<html data-theme="forest" data-mode="dark">` 是松林深色。夜幕也是一个主题，并非深色模式的别名。

## 文件放在哪里

| 文件                                                   | 职责                                                     |
| ------------------------------------------------------ | -------------------------------------------------------- |
| `src/index.css`                                        | Tailwind 入口和与主题无关的全局规则                      |
| `src/styles/themes/donglai.css`                        | 东来主题的变量，兼作默认值                               |
| `src/styles/themes/slate.css`                          | 青岩主题的浅色与深色配色                                 |
| `src/styles/themes/forest.css`                         | 松林主题的浅色与深色配色                                 |
| `src/styles/themes/nightfall.css`                      | 夜幕主题的浅色与深色配色                                 |
| `src/theme/index.ts`                                   | 主题与模式名称、默认值、读取和保存选择的函数             |
| `src/theme/ThemeProvider.tsx`、`src/theme/useTheme.ts` | 向顶栏与配置页共享主题、模式与实际明暗状态               |
| `src/theme/tokens.ts`                                  | CSS 变量的名称、中文用途和分组，用于配置页说明           |
| `src/main.tsx`                                         | 引入所有主题文件，并在 React 渲染前应用保存的主题        |
| `index.html`                                           | 尽早设置上次保存的主题和模式，避免刷新时短暂显示默认配色 |
| `src/components/layouts/LayoutPage.tsx`                | 顶栏主题选择框，以及太阳、月亮、屏幕模式按钮             |
| `src/pages/settings/SettingsPage.tsx`                  | 系统配置概览、外观预览和可展开的变量说明                 |
| 各组件的 `.scss`                                       | 消费变量，负责布局和组件状态                             |

原「东来配色」页现已改为 `/settings` 系统配置页。访问旧地址 `/dl` 会自动跳转。配置页展示当前生效的主题，展开「查看全部 CSS 变量及用途」可以查阅每个变量的含义。

## 一次切换是怎么发生的

1. 用户在顶栏选「青岩」，再点击月亮图标选择深色。太阳图标切换浅色，屏幕图标选择跟随系统。
2. `LayoutPage.tsx` 通过 `useTheme()` 调用共享的 `setTheme('slate')` 和 `setModePreference('dark')`。
3. 函数把 `<html data-theme="slate" data-mode="dark">` 写到页面上，并分别存入 `localStorage` 的 `dl-ui-theme`、`dl-ui-mode`。
4. 浏览器命中 `slate.css` 中对应两个属性的选择器，重新计算所有 `var(...)`；共享的 React 状态同时更新 `/settings` 页的主题和模式说明。
5. 刷新时，`index.html` 先应用保存值，避免短暂闪过默认配色；`main.tsx` 随后校验保存值并在渲染 React 前再次应用。

选择「跟随系统」时，保存的是偏好 `system`，页面上的 `data-mode` 仍是实际生效的 `light` 或 `dark`。`ThemeProvider` 监听操作系统明暗变化并同步更新页面。东来文件使用 `:root` 提供无属性时的浅色默认值；旧版保存的夜幕主题在首次升级时会继续显示深色。

## 怎样新增一套主题

下面以新增 `sand` 为例。主题标识统一用短英文名；显示名称可以用中文。

**第一步：复制主题文件。** 新建 `src/styles/themes/sand.css`，复制 `donglai.css` 中的两组变量，分别修改浅色和深色选择器。`data-theme`、`data-mode` 控制全站，`data-preview-theme`、`data-preview-mode` 让配置页的主题列表显示对应模式的代表色。两组都不能省略变量。

```css
:root[data-theme='sand'][data-mode='light'],
[data-preview-theme='sand'][data-preview-mode='light'] {
  color-scheme: light;
  --color-primary: #97642e;
  /* 继续填写完整变量清单 */
}

:root[data-theme='sand'][data-mode='dark'],
[data-preview-theme='sand'][data-preview-mode='dark'] {
  color-scheme: dark;
  --color-primary: #dcb47e;
  /* 继续填写相同的完整变量清单 */
}
```

**第二步：在 `src/main.tsx` 引入。** 把 `import './styles/themes/sand.css'` 放在其他主题样式导入旁边。所有主题都是全局加载的；实际生效的主题由 `data-theme` 决定。

**第三步：在 `src/theme/index.ts` 注册。** 给 `themes` 增加 `sand: '暖沙'`。顶栏下拉框和配置页会自动出现该选项，TypeScript 的 `ThemeName` 也会自动包含 `sand`。

**第四步：检查页面。** 运行 `pnpm dev`，分别在浅色、深色和跟随系统模式下查看侧栏、顶栏、按钮、404 页和 `/settings` 的预览；刷新确认选择被保留，再运行 `pnpm build` 和 `pnpm lint`。

## 变量怎么命名和使用

组件应按**用途**选择变量，而不是按某个主题里的颜色取名：

```scss
.product-card {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.product-card__action {
  background: var(--color-primary);
  color: var(--color-primary-contrast);

  &:hover {
    background: var(--color-primary-hover);
  }
}
```

现有变量大致分为：品牌与交互（`primary`）、页面与卡片（`page`、`surface`）、文字与边框（`text`、`border`）、侧栏（`sidebar`）以及状态色（`danger`）。每项用途都写在 `donglai.css` 的同行注释和 `/settings` 的展开区中。如果新组件确实需要新的用途，例如成功提示，先定义 `--color-success`，再给**每套主题的两种模式**补上值，并在 `src/theme/tokens.ts` 增加说明。

原东来色卡中的 `$primary-color` 等 SCSS 变量在编译时会变成固定颜色，不能在浏览器里即时切换主题。运行时主题应使用 `var(--color-primary)` 这样的 CSS 变量。插画等确实要表达某一套设计原色的内容，可以保留固定色值。

## 修改默认主题

当前 `src/theme/index.ts` 的 `defaultTheme` 是 `donglai`，`defaultMode` 是 `light`。改成其他已注册值后，新访问者会使用新默认值；已保存过选择的浏览器仍会优先使用其保存值。测试默认值时，可先在浏览器开发者工具中删除本地存储的 `dl-ui-theme` 和 `dl-ui-mode`。

每套主题的浅色和深色块都应覆盖完整变量清单。这样新增组件时能准确知道要补哪些变量，也能避免某个组合意外继承东来的颜色。
