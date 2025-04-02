# BBS自动发帖系统

这是一个用于BBS论坛自动发帖的前端系统，主要功能包括车辆信息展示、发帖编辑和发帖历史查看。系统采用现代化的UI设计，提供了流畅的用户体验。

## 功能特点

### 发帖编辑器
- 展示车辆基本信息（VIN、品牌型号、里程数、价格等）
- 帖子主题和内容编辑（支持多行文本）
- 标签添加功能
- 车辆图片选择（支持多选、排序，最多30张）
- 发送选项（立即发送/智能排期）
- 用户切换功能

### 发帖历史
- 展示历史发帖记录，按时间倒序排列
- 包含车辆详细信息、发帖用户、排队时间、执行时间和状态
- 帖子标题支持点击跳转到原帖
- 状态分类：待发送、成功、失败（颜色区分）

## 技术栈
- HTML5
- Tailwind CSS 
- JavaScript (ES6+)
- Vite（构建工具）

## 安装与运行

### 环境要求
- Node.js 14.0+
- npm 6.0+

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
├── src/                     # 源代码目录
│   ├── assets/              # 资源文件
│   │   └── images/          # 图片资源
│   │       └── vehicle/     # 车辆图片
│   ├── css/                 # 样式文件
│   │   └── style.css        # 主样式（Tailwind扩展）
│   └── js/                  # JavaScript文件
│       └── main.js          # 主脚本
├── vite.config.js           # Vite配置
└── postcss.config.js        # PostCSS配置
```

## 设计说明

### UI设计
- 采用蓝色为主色调，搭配灰色背景，提供清晰的视觉层次
- 使用卡片式设计展示车辆信息
- 表单元素设计符合现代Web标准，提供良好的交互反馈
- 响应式设计，适配桌面和移动设备

### 交互优化
- 表单验证并提供即时反馈（Toast通知）
- 车辆信息变更时保留表单内容
- 图片选择支持点击交互和序号显示
- 防止Enter键误提交表单
- Tab切换保留各自状态

## 未来优化方向
1. 添加用户登录系统
2. 支持草稿保存功能
3. 增强图片上传和编辑功能
4. 添加发帖统计分析功能
5. 集成更多社区平台API
6. 添加黑暗模式支持

## 贡献指南
欢迎贡献代码或提出建议。请先fork项目，创建功能分支，然后提交pull request。

## 许可证
MIT 