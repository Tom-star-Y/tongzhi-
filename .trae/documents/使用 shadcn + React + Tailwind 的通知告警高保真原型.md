# 使用 shadcn + React + Tailwind 的通知告警高保真原型

## 目标与范围
- 仅实现前端样式与静态数据演示，不接入后端逻辑
- 统一采用 shadcn/ui + TailwindCSS 组件体系
- 输出“通知告警”主题的高保真界面：仪表盘、告警列表与详情、规则管理、通知渠道、全局设置

## 技术选型
- 构建：Vite + React + TypeScript（轻量快速，适合原型）
- 样式：TailwindCSS + CSS 变量（支持明暗主题）
- UI：shadcn/ui（Button、Card、Table、Tabs、Dialog、Sheet、DropdownMenu、Command、Input、Select、Calendar、Tooltip、Toast/Sonner 等）
- 图标：Lucide（shadcn 默认）

## 当前仓库研判与取舍
- 已发现 `App.tsx` 与若干压缩包（components.zip、styles.zip、imports.zip），缺少 `package.json`、Tailwind/shadcn 配置
- 执行策略：初始化标准 Vite 工程后，解压并迁移可用资源至规范结构（若 zip 中包含 shadcn 组件，按需复用）

## 初始化与基础配置
1. 初始化 Vite + React + TS 项目骨架
2. 安装 Tailwind + PostCSS，生成 `tailwind.config.ts` 与 `postcss.config.js`
3. 安装并配置 shadcn/ui：生成 `components.json`，设置别名与 `utils/cn`
4. 全局样式：`src/styles/globals.css` 注入 `@tailwind base/components/utilities`，补充 CSS 变量与字体
5. 图标与 Toast：安装 lucide-react 与 sonner，接入全局 `<Toaster />`

## 设计规范
- 色板：基于 shadcn 默认主题，扩展品牌主色（蓝/青系），状态色（信息/成功/警告/危险）
- 字体/字号：系统默认 + Tailwind 字体梯度，标题/正文/标签层级清晰
- 间距/圆角：8px 体系（2/4/8/12/16/24/32），圆角 `md/lg`，阴影 `sm/md`
- 布局：内容最大宽度 1440，网格 12 栏，常用 4/8/12 列组合
- 主题：支持明暗主题切换（样式就绪，功能可置静态）

## 全局架构
- 顶部导航栏：产品名、搜索框、主题切换、用户菜单
- 侧边导航：仪表盘、告警、规则、通知渠道、设置（带当前路由高亮）
- 主内容区：面包屑 + 页头操作区 + 模块内容
- 全局反馈：Toast、对话框、抽屉、悬浮提示

## 页面与模块
1. 仪表盘 Dashboard
   - 总览卡片（今日告警数、未处理、已解决、规则数量）
   - 告警趋势小组件（以 `Card + Skeleton/条形进度` 占位）
   - 最近告警表格（Top 5，状态徽章 + 严重级别）
2. 告警列表 Alerts
   - 工具栏：搜索（Command 触发）、筛选（Select/DropdownMenu）、时间选择（Popover + Calendar）、批量操作
   - 表格：列（标题、级别、来源、状态、最近发生、操作），支持行内操作按钮样式
   - 详情抽屉 Sheet：基础信息、标签、最近事件时间线（使用 `Separator` 分组）
3. 规则管理 Rules
   - 规则列表：名称、触发条件、启用状态、最近触发、操作
   - 新建/编辑对话框 Dialog：表单元素（Input、Select、Textarea、Checkbox、Switch、Tabs 分步）
4. 通知渠道 Channels
   - 渠道卡片：邮件、短信、Webhook、钉钉/企业微信（`Card + Toggle/Switch`）
   - 渠道配置 Drawer：密钥/URL/模板（仅样式，禁输入校验）
5. 设置 Settings
   - 基础设置：时区、时间格式、严重级别阈值、默认渠道
   - 外观：主题、密度、语言

## 组件清单（shadcn/ui）
- 结构：`Button` `Card` `Tabs` `Accordion` `Separator` `Breadcrumb`
- 表单：`Input` `Select` `Textarea` `Checkbox` `Switch` `RadioGroup` `Slider`
- 数据展示：`Table` `Badge` `Avatar` `Tooltip` `Skeleton` `Progress`
- 浮层：`Dialog` `Drawer/Sheet` `Popover` `DropdownMenu` `HoverCard`
- 导航与搜索：`Command` `Menubar` `NavigationMenu` `Pagination`
- 反馈：`Alert` `Toast/Sonner`

## 文件结构（拟）
```
src/
  app/
    layout.tsx
    routes.tsx
  components/
    ui/...(shadcn 自动生成)
    layout/
      header.tsx
      sidebar.tsx
      app-shell.tsx
    common/
      empty-state.tsx
      severity-badge.tsx
      stat-card.tsx
  pages/
    dashboard/index.tsx
    alerts/index.tsx
    alerts/detail-drawer.tsx
    rules/index.tsx
    channels/index.tsx
    settings/index.tsx
  lib/
    utils.ts (cn)
    constants.ts
    mock.ts (静态数据)
  styles/
    globals.css
```

## 交互与数据策略
- 全部静态数据与假数据，集中在 `lib/mock.ts`
- 控件可点击但不改变状态（或以 Toast 演示“已触发”）
- 空状态、加载占位一律使用 `EmptyState` 与 `Skeleton`

## 响应式与无障碍
- 响应式断点：sm/md/lg/xl，侧边栏在 `sm` 折叠为抽屉
- 继承 shadcn/Radix 的可访问性语义，保证键盘焦点样式

## 里程碑
1. M1 环境初始化与依赖安装（Vite、Tailwind、shadcn、lucide、sonner）
2. M2 设计令牌与主题配置（CSS 变量、明暗色）
3. M3 全局布局（Header/Sidebar/AppShell）
4. M4 页面骨架（Dashboard/Alerts/Rules/Channels/Settings）
5. M5 细节打磨（空状态、Skeleton、表格密度、对话框/抽屉）
6. M6 自查优化与样式一致性校准

## 验收标准
- 全部页面完成像素级还原与一致的 UI 规范
- 样式 100% 基于 shadcn/ui + Tailwind，无第三方 UI 库
- 明暗主题样式到位（可静态），移动端具备基本适配
- 所有交互有视觉反馈（Toast/禁用/悬停/焦点）

## 确认后将执行
- 初始化项目与依赖、接入 Tailwind 与 shadcn
- 解压并迁移现有 `components.zip/styles.zip/imports.zip` 中可复用资源
- 按上述结构创建页面与组件，填充静态样例数据
- 提供可预览链接与使用说明（启动脚本/访问路径）