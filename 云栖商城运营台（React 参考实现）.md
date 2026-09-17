# 云栖商城运营台（React 参考实现）

这是基于同级 [`mock-api`](../mock-api) 接口与产品设计文档实现的 React + TypeScript 运营后台参考项目。它刻意保留了后台项目中最常见的请求、权限、列表、业务动作和抽屉交互，便于作为 Vue / React 对照练习的基线。

## 启动

需要 Node.js 18+。先在两个终端分别启动 Mock API 与本项目：

```bash
# 终端 1
cd ../mock-api
npm install
npm run dev

# 终端 2
cd ../react-admin-reference
npm install
npm run dev
```

打开 Vite 输出的地址（默认 `http://localhost:5173`）。

默认会访问 `http://localhost:9000/api`；要修改地址，复制 `.env.example` 为 `.env.development` 并编辑 `VITE_API_BASE_URL`。

演示账号：`admin / 123456`（全部权限）或 `operator / 123456`（运营权限）。

## 已实现功能

| 模块         | 实现内容                                                                  | 使用接口                                                   |
| ------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 认证与应用壳 | 登录、令牌持久化、401/业务错误透传、权限驱动菜单、退出登录                | `POST /auth/login`                                         |
| 仪表盘       | 四项经营指标、待办跳转、7/14/30 天趋势、热销商品榜                        | `GET /dashboard/overview`、`GET /dashboard/sales-trend`    |
| 商品中心     | 商品搜索/状态筛选/分页、详情编辑抽屉、新建商品、上架与下架确认            | `/products`、`POST /products/:id/publish`、`off-shelf`     |
| 分类管理     | 分类列表与左侧分类导航示例                                                | `/categories`                                              |
| 订单中心     | 状态 Tabs、订单筛选/分页、详情抽屉、状态时间轴、物流发货表单              | `/orders`、`GET /orders/:id` 结构、`POST /orders/:id/ship` |
| 会员与营销   | 会员检索、等级标签；优惠券领取进度；Banner 视觉预览                       | `/customers`、`/coupons`、`/banners`                       |
| 系统设置     | 管理员、角色权限字符串数组、操作日志                                      | `/adminUsers`、`/roles`、`/operationLogs`                  |
| 通用体验     | 页面/列表 Loading、空状态、错误状态、操作 Toast、确认对话框、响应式内容区 | Mock 延迟/异常头可扩展验证                                 |

## 工具与技术选择

- **React 18 + TypeScript + Vite**：类型明确、热更新快，工程结构适合中后台项目。
- **React Router**：页面路由与受权限约束的导航组织。
- **Axios**：统一 API 基地址、JWT `Authorization` 注入、将后端的 `{ data, meta }` 响应规范化为页面可用数据。
- **Recharts**：仪表盘的自适应面积趋势图。
- **Lucide React**：使用一致的线性图标，避免手写 SVG。
- **原生 CSS**：把产品设计中的尺寸、色板、密度、状态色沉淀成可读样式；参考项目不引入组件库，以便看清布局与状态管理本身。

## 目录说明

```text
react-admin-reference/
├─ src/
│  ├─ App.tsx                    # 仅保留登录态恢复与路由声明
│  ├─ api.ts                     # Axios 实例、令牌注入与错误转换
│  ├─ hooks/useRequest.ts         # 单对象 / 分页请求的不同数据边界
│  ├─ lib/presentation.ts         # 金额、时间、状态等展示转换
│  ├─ constants/navigation.ts     # 路由、菜单、权限码的集中配置
│  ├─ components/
│  │  ├─ layout/ConsoleLayout.tsx # 侧栏、顶栏与权限菜单
│  │  └─ ui/                      # 按组件目录收拢：Modal/、Card/、Pagination/ 等
│  ├─ features/                   # 按业务领域拆分页面和领域交互
│  │  ├─ auth/                    # 登录
│  │  ├─ dashboard/               # 指标与趋势
│  │  ├─ products/                # 商品列表、抽屉、上下架
│  │  ├─ orders/                  # 订单、详情、发货
│  │  ├─ catalog/ customers/      # 分类、会员
│  │  ├─ marketing/               # 优惠券、Banner
│  │  └─ system/                  # 管理员、角色、日志
│  ├─ types.ts                    # 从 mock-api/types/index.ts 提炼的页面契约
│  ├─ styles.css                  # 样式加载入口，仅定义模块顺序
│  └─ styles/                     # 仅保留 Token、应用布局与响应式规则
├─ .env.example
├─ docs/问题修复记录.md # 可持续追加的问题定位与修复记录
└─ package.json
```

遇到线上或联调问题时，请从 [问题修复记录](docs/问题修复记录.md) 的模板继续追加；首条记录已说明列表页“接口有数据但未渲染”的根因与修复方式。

目录拆分的选型依据、依赖方向和后续演进条件，见 [架构设计说明](docs/架构设计说明.md)。

首页跳转、前端 404、接口错误与未来 `app/routes.tsx` 迁移方式，见 [路由与异常处理](docs/路由与异常处理.md)。

### 分层原则

- `features` 只存放某个业务域独有的页面、状态和业务动作，例如商品上架、订单发货。
- `components` 只存放跨业务复用的界面能力；它们不应知道 `Product`、`Order` 等领域字段。
- `hooks` 处理数据获取生命周期；`api.ts` 只处理 HTTP 与认证，不写页面逻辑。
- `lib` 放纯函数转换；`constants` 放可配置数据，避免把菜单、权限等散落在 JSX 中。

## 实现中的重点与思路

### 1. 接口返回结构与前端边界

Mock 服务对单值和列表分别返回 `{ data }` 与 `{ data, meta }`，而不是把 HTTP 响应对象直接暴露给页面。`src/api.ts` 的响应拦截器只剥离 Axios 的 `response.data`，因此页面仍能清晰地区分业务数据 `result.data` 与分页数据 `result.meta`。这避免了“有些接口多一层 data、有些没有”的常见混乱。

### 2. 权限不仅是路由守卫

登录接口返回的 `permissions` 会存入本地状态。侧栏菜单由 `hasPermission` 过滤，商品上/下架、订单发货等高影响按钮也采用相同检查。这样可以使 UI 与服务端权限模型同源。服务端仍是最终安全边界，前端隐藏按钮只用于改善体验。

### 3. 列表查询的状态收敛

每个列表将页码、筛选条件和排序放在一个 params 对象中，再交给 `usePage`。当筛选或 Tab 改变时先回到第一页；分页元数据来自服务端而非前端猜测。这个模式适合后续替换为 TanStack Query：只需把 `useRequest` 的内部实现替换为 query hook，页面无需变化。

### 4. 业务动作不能退化为 PATCH

商品上架/下架和订单发货使用专门的业务接口，而不是在页面中直接 PATCH `status`。原因是业务接口封装了服务端校验、时间字段、物流字段和操作日志。页面也在调用前给出明确确认或表单，避免误操作。

### 5. 抽屉承载“上下文不丢失”的编辑流

商品编辑、订单详情采用右侧抽屉。运营人员不离开列表就能核对商品/订单上下文；详情内按时间轴、收货信息、商品、金额、物流依次排布。新建商品表单按“基础信息、销售信息、SKU”分段，和产品设计保持一致。

### 6. 可演练的异步状态

`State` 组件统一呈现首次加载、错误和空数据。Mock 服务支持 `x-mock-delay`、`x-mock-scenario`：实际项目可在 `api.ts` 的请求拦截器（仅开发环境）加入对应头，观察骨架屏、重试与表单防重复提交效果。

## 可继续完善的部分

- 用 React Hook Form + Zod 完善所有创建/编辑弹窗的失焦校验与错误文案。
- 将 `useRequest` 升级为 TanStack Query，获得缓存、失焦刷新和 mutation 后自动失效。
- 将权限码映射到路由守卫，处理直接输入无权 URL 的 403 页面。
- 增加分类真实编辑、优惠券分步创建、管理员禁用二次确认等写操作；Mock API 已具备 CRUD。
- 为表格增加 URL 同步筛选、日期范围、批量操作和导出。
- 将 `mock-api/types/index.ts` 发布为共享包或通过 monorepo 路径别名复用，消除类型重复。

## 验证清单

```bash
npm run build
```

手工验证建议：以 `admin` 登录后，进入商品页新建并上架一个商品，再刷新确认数据保持；在订单页选择“待发货”订单，填写物流公司与单号并提交；最后登录 `operator`，确认 Banner 与系统设置菜单不显示。
