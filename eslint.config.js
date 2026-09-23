import js from '@eslint/js'
import globals from 'globals'
import perfectionist from 'eslint-plugin-perfectionist'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

/**
 * ESLint 9 使用 Flat Config（扁平配置）。
 *
 * 配置是一个数组：每个对象只对匹配到的 files 生效；越靠后的规则优先级越高。
 * 这里不启用需要 TypeScript 类型信息的规则，因此 lint 速度快，也不需要额外指定
 * parserOptions.project。
 */
export default tseslint.config(
  // 这些文件不属于源码，既没有必要也不应被 ESLint 扫描。
  {
    ignores: ['dist', 'coverage', 'node_modules', '*.config.js'],
  },

  // JavaScript 的通用问题，例如未定义变量、不可达代码等。
  js.configs.recommended,

  // TypeScript 推荐规则会自动配置 TypeScript parser 和插件。
  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      // 浏览器端 React 应用可直接使用 window、document、setTimeout 等全局变量。
      globals: globals.browser,
    },
    plugins: {
      perfectionist,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // 统一 import 分组：类型 -> 第三方/Node -> @/ 内部模块 -> 相对路径 -> 样式等副作用。
      // 组内按模块路径自然排序，并让副作用导入也能移动到正确分组。
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          sortBy: 'path',
          newlinesBetween: 1,
          internalPattern: ['^@/'],
          sortSideEffects: true,
          groups: [
            'type-import',
            ['value-builtin', 'value-external'],
            'value-internal',
            ['value-parent', 'value-sibling', 'value-index'],
            'side-effect-style',
            'side-effect',
            'unknown',
          ],
        },
      ],

      // Hooks 只能在组件或自定义 Hook 顶层调用；依赖项遗漏时给出提示。
      ...reactHooks.configs.recommended.rules,

      // Vite 的 Fast Refresh 允许组件文件导出常量，避免不必要的开发期告警。
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
)
