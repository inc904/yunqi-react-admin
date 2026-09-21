import js from '@eslint/js'
import globals from 'globals'
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
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Hooks 只能在组件或自定义 Hook 顶层调用；依赖项遗漏时给出提示。
      ...reactHooks.configs.recommended.rules,

      // Vite 的 Fast Refresh 允许组件文件导出常量，避免不必要的开发期告警。
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
)
