# BBS Auto Post

这是一个用于BBS论坛自动发帖的现代化前端系统，专注于车辆信息展示、自动发帖和历史记录管理。系统采用Vue 3和TypeScript构建，提供直观友好的用户界面，提升发帖效率。

## 功能特点

### 发帖编辑器
- 展示车辆基本信息（VIN、品牌型号、里程数、价格等）
- 帖子主题和内容编辑（支持多行文本）
- 标签管理功能
- 车辆图片选择（支持多选、无限制数量）
- 发送选项（立即发送/智能排期）
- 用户切换功能

### 发帖历史
- 展示历史发帖记录，按时间倒序排列
- 包含车辆详细信息、发帖用户、排队时间、执行时间和状态
- 帖子快照查看功能，包括详细内容和图片
- 状态分类：待发送、成功、失败、已取消（颜色区分）
- 支持取消待发送的帖子

## 技术栈
- Vue 3 + TypeScript
- Pinia (状态管理)
- Tailwind CSS (样式)
- Vite (构建工具)

## 安装与运行

### 环境要求
- Node.js 16.0+
- npm 7.0+

### 安装步骤
1. 克隆仓库到本地
```bash
git clone https://github.com/yourusername/bbs_autopost.git
cd bbs_autopost
```

2. 安装依赖
```bash
npm install
```

3. 开发模式运行
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

5. 预览生产版本
```bash
npm run preview
```

## 项目结构

```
bbs_autopost/
├── index.html               # 页面入口文件
├── package.json             # 项目配置
├── README.md                # 项目说明
├── tsconfig.json            # TypeScript配置
├── vite.config.ts           # Vite配置
├── tailwind.config.js       # Tailwind CSS配置
├── src/
│   ├── App.vue              # 应用根组件
│   ├── main.ts              # 应用入口文件
│   ├── views/               # 页面视图组件
│   │   └── Home.vue         # 主页视图
│   ├── components/          # UI组件
│   │   ├── TabNavigation.vue    # 标签导航
│   │   ├── VehicleInfoCard.vue  # 车辆信息卡片
│   │   ├── PostEditorTab.vue    # 发帖编辑器
│   │   ├── HistoryTab.vue       # 历史记录
│   │   ├── ImageSelector.vue    # 图片选择器
│   │   └── ToastContainer.vue   # 提示消息
│   ├── stores/              # Pinia状态管理
│   │   ├── vehicle.ts       # 车辆信息
│   │   ├── user.ts          # 用户信息
│   │   ├── form.ts          # 表单数据
│   │   ├── history.ts       # 历史记录
│   │   └── toast.ts         # 提示消息
│   ├── types/               # TypeScript类型
│   │   └── index.ts         # 类型定义
│   ├── css/                 # 样式文件
│   │   └── style.css        # 主样式（Tailwind扩展）
│   └── public/              # 静态资源
│       └── moke_photo/      # 模拟图片
```

## 设计特点

### UI设计
- 蓝色主题，搭配简洁的灰白色背景，提供清晰的视觉层次
- 扁平化架构，减少不必要的嵌套，提升页面渲染效率
- 表单元素设计符合现代Web标准，提供良好的交互反馈
- 响应式设计，适配不同屏幕尺寸

### 交互优化
- 表单验证并提供即时反馈（Toast通知）
- 车辆信息变更时保留表单内容
- 图片选择支持多种视图模式和预览功能
- 快照查看功能，详细展示帖子内容和图片
- 危险操作(如取消发帖)提供二次确认

## 功能亮点
- 多用户切换支持，不同用户有独立的发帖配置
- 自动填充功能，根据用户信息生成联系方式
- 图片管理系统，按车辆ID分类展示不同图片集
- 历史记录查询和管理，支持查看详情和取消操作

## 未来优化方向
1. 添加用户登录和权限管理系统
2. 实现帖子草稿保存功能
3. 增强图片上传和编辑功能
4. 添加发帖统计分析和数据可视化
5. 集成多平台发帖API
6. 支持更多帖子内容格式(富文本、Markdown)
7. 添加黑暗模式支持

## 贡献指南
欢迎贡献代码或提出建议。请先fork项目，创建功能分支，然后提交pull request。

## 许可证
MIT 