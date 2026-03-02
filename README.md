# 看板应用 - 小知之的任务管理

基于 Next.js + TypeScript + Tailwind CSS + Zustand 构建的任务管理看板。

## ✨ 功能特性

- 📋 **三列看板**: 待办 (To Do)、进行中 (In Progress)、已完成 (Done)
- 🎯 **任务管理**: 添加、编辑、删除任务
- 🔄 **拖拽排序**: 支持跨列移动和同列内重新排序
- 💾 **本地存储**: 使用 Zustand + persist 自动保存到 localStorage
- 📱 **响应式设计**: 支持桌面端和移动端
- 🏷️ **优先级标签**: 高/中/低优先级可视化展示

## 🚀 快速开始

### 1. 安装依赖

```bash
cd ~/.openclaw/workspace/kanban-board
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

打开 http://localhost:3000 查看应用。

### 3. 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
kanban-board/
├── app/
│   ├── globals.css      # 全局样式
│   ├── layout.tsx       # 根布局
│   └── page.tsx         # 主页面
├── components/
│   ├── KanbanBoard.tsx  # 看板主组件
│   ├── Column.tsx       # 看板列组件
│   ├── TaskCard.tsx     # 任务卡片组件
│   └── AddTaskModal.tsx # 添加/编辑任务弹窗
├── store/
│   └── taskStore.ts     # Zustand 状态管理
├── types/
│   └── task.ts          # TypeScript 类型定义
├── package.json         # 项目依赖
├── tailwind.config.ts   # Tailwind 配置
└── tsconfig.json        # TypeScript 配置
```

## 🛠️ 技术栈

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 原子化 CSS
- **Zustand** - 状态管理
- **@hello-pangea/dnd** - 拖拽功能
- **date-fns** - 日期格式化
- **lucide-react** - 图标库

## 📝 初始数据

看板预置了 6 个任务：

1. **待办 (高优先级)**
   - 安装 YouTube 视频监控技能
   - 配置每日定时抓取任务

2. **进行中 (中优先级)**
   - 测试 Stock Copilot Pro 股票分析
   - 寻找 QVeris 股票数据替代方案

3. **已完成 (低优先级)**
   - 安装 agent-reach 技能
   - 浏览 OpenClaw 中文教程

## 🎨 使用说明

### 添加任务
- 点击右上角「添加任务」按钮
- 填写标题、描述、选择优先级和状态
- 点击「添加任务」保存

### 编辑任务
- 点击任务卡片上的编辑图标
- 修改信息后保存

### 删除任务
- 点击任务卡片上的删除图标
- 确认删除

### 移动任务
- 拖拽任务卡片到不同列
- 或在编辑弹窗中修改状态

### 排序任务
- 在同一列内拖拽任务调整顺序

## 🔧 开发计划

- [ ] 添加任务筛选功能
- [ ] 支持任务搜索
- [ ] 添加任务标签
- [ ] 支持任务截止日期
- [ ] 添加任务评论
- [ ] 导出/导入任务数据

## 📄 许可证

MIT License