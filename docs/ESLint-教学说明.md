# ESLint 配置教学说明

本项目使用 **ESLint 9**、React、TypeScript 与 Vite。代码检查的配置位于根目录的 [`eslint.config.js`](../eslint.config.js)。

## 为什么配置文件叫 `eslint.config.js`

ESLint 9 默认采用 Flat Config（扁平配置）：配置文件名为 `eslint.config.js`、`eslint.config.mjs` 或 `eslint.config.cjs`，并导出一个配置对象数组。旧项目常见的 `.eslintrc.js`、`.eslintrc.json` 属于旧配置格式，不能作为 ESLint 9 的默认配置使用。

本项目的 `package.json` 已定义如下命令：

```bash
npm run lint
```

它等价于 `eslint .`，会检查当前项目下所有未被忽略的适用文件。检查不通过时命令会以非零状态退出，适合在提交前或 CI 中执行。

## 配置结构

`eslint.config.js` 从上到下由四部分构成：

| 部分                           | 作用                                                                     |
| ------------------------------ | ------------------------------------------------------------------------ |
| `ignores`                      | 排除构建产物、覆盖率报告、依赖目录和配置本身。                           |
| `js.configs.recommended`       | 启用 ESLint 官方 JavaScript 推荐规则，例如未定义变量检查。               |
| `tseslint.configs.recommended` | 启用 TypeScript 推荐规则，并使用 TypeScript parser 解析 `.ts` / `.tsx`。 |
| `src/**/*.{ts,tsx}` 配置块     | 为应用源码添加浏览器全局变量、React Hooks 与 Vite Fast Refresh 规则。    |

Flat Config 的关键概念是：**配置按数组顺序合并，后面的同名设置会覆盖前面的设置**。因此，项目自己的规则通常放在最后一个配置块中。

## 已启用的 React 规则

`react-hooks/rules-of-hooks` 会报错阻止以下问题：在条件、循环或普通函数中调用 `useState`、`useEffect` 等 Hook。Hook 只能在 React 函数组件或自定义 Hook 的顶层调用。

`react-hooks/exhaustive-deps` 会警告 `useEffect`、`useCallback`、`useMemo` 的依赖数组可能遗漏了某个值。它不一定代表代码必须机械地修改，但应先确认闭包与数据更新逻辑是否正确。

`react-refresh/only-export-components` 用于保证 Vite 开发环境的 Fast Refresh 能可靠刷新组件。当前设为 `warn`，且允许同一组件文件导出常量；这不会阻塞构建，但建议在出现警告时将共享函数、对象或上下文拆到独立文件。

## 常见使用方式

检查整个项目：

```bash
npm run lint
```

只检查一个文件：

```bash
npx eslint src/App.tsx
```

尝试自动修复可安全修复的问题：

```bash
npx eslint . --fix
```

`--fix` 会改写源文件；执行前请确认工作区改动已保存或已提交。对于逻辑类问题（例如 Hook 依赖项），ESLint 通常不会自动修复，需要人工判断。

## 如何增加项目规则

在 `eslint.config.js` 最后一个 `rules` 对象中添加或覆盖规则即可。例如，将未使用变量从错误降为警告，并忽略以下划线开头的参数：

```js
'@typescript-eslint/no-unused-vars': [
  'warn',
  { argsIgnorePattern: '^_' },
]
```

规则级别可使用：`'off'`（关闭）、`'warn'`（告警但不阻止命令成功）和 `'error'`（错误，`npm run lint` 会失败）。规则名称与选项可在 [ESLint Rules 文档](https://eslint.org/docs/latest/rules/) 和 [typescript-eslint Rules 文档](https://typescript-eslint.io/rules/) 中查询。

## 与 Prettier 的边界

项目使用 [`.prettierrc.json`](../.prettierrc.json) 统一代码排版，并通过 [`.prettierignore`](../.prettierignore) 排除依赖、构建产物和二进制资源。ESLint 主要发现代码质量和潜在逻辑问题，Prettier 主要统一排版风格；两者可以并用，但职责不同。

格式化全部适用文件：

```bash
npm run format
```

只检查格式是否符合规范、不修改文件：

```bash
npm run format:check
```

项目的 `.vscode/settings.json` 已启用保存时格式化。请安装 VS Code 的 **Prettier - Code formatter** 扩展（扩展标识：`esbenp.prettier-vscode`），这样每次保存支持的文件时都会遵循这份配置。
