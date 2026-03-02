import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/types/task'

/**
 * 看板状态管理接口
 */
interface KanbanState {
  // 任务列表
  tasks: Task[]
  
  // 操作函数
  addTask: (input: CreateTaskInput) => void
  updateTask: (id: string, input: UpdateTaskInput) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, newStatus: TaskStatus) => void
  reorderTasks: (status: TaskStatus, taskIds: string[]) => void
  
  // 查询函数
  getTasksByStatus: (status: TaskStatus) => Task[]
  getTaskById: (id: string) => Task | undefined
}

/**
 * 生成唯一ID
 */
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 初始任务数据 - 小知之的任务列表（2026-03-02 更新）
 */
const initialTasks: Task[] = [
  // ===== 待办 (TODO) =====
  {
    id: '1',
    title: '安装 YouTube 视频监控技能',
    description: '从 ClawHub 安装 youtube-full 技能，配置每日抓取任务',
    priority: 'high',
    status: 'todo',
    assignee: { id: '1', name: '小知之', avatar: '🤖' },
    createdAt: new Date('2026-03-02T09:00:00'),
  },
  {
    id: '2',
    title: '配置每日定时抓取任务',
    description: '每天早上8点抓取 @mreflow 和 @Fireship 频道的新视频',
    priority: 'high',
    status: 'todo',
    assignee: { id: '1', name: '小知之', avatar: '🤖' },
    createdAt: new Date('2026-03-02T09:05:00'),
  },

  // ===== 进行中 (IN PROGRESS) =====
  {
    id: '3',
    title: '获取 Transcript API Key',
    description: '注册 transcriptapi.com 获取 API Key，完成 YouTube 技能配置',
    priority: 'high',
    status: 'in-progress',
    assignee: { id: '2', name: '峰哥', avatar: '👨‍💻' },
    createdAt: new Date('2026-03-02T10:00:00'),
  },

  // ===== 已完成 (DONE) =====
  // --- 知识管理/AI学习 ---
  {
    id: '10',
    title: '浏览 OpenClaw 中文教程',
    description: '阅读 35 万字完整教程，了解进阶用法和最佳实践',
    priority: 'medium',
    status: 'done',
    assignee: { id: '1', name: '小知之', avatar: '🤖' },
    createdAt: new Date('2026-03-01T22:00:00'),
    completedAt: new Date('2026-03-02T08:30:00'),
  },
  {
    id: '11',
    title: '学习 Jina Reader 获取 X 推文',
    description: '掌握 curl -s "https://r.jina.ai/https://x.com/..." 方法获取推文内容',
    priority: 'medium',
    status: 'done',
    assignee: { id: '1', name: '小知之', avatar: '🤖' },
    createdAt: new Date('2026-03-02T07:56:00'),
    completedAt: new Date('2026-03-02T07:58:00'),
  },
  // --- 股票分析任务（已完成） ---
  {
    id: '20',
    title: '探索 ClawHub 股票分析技能市场',
    description: '扫描 25+ 个股票相关技能，对比美股/港股/A股分析工具',
    priority: 'high',
    status: 'done',
    assignee: { id: '1', name: '小知之', avatar: '🤖' },
    createdAt: new Date('2026-03-02T07:15:00'),
    completedAt: new Date('2026-03-02T07:30:00'),
  },
  {
    id: '21',
    title: '安装 Stock Copilot Pro 技能',
    description: '安装美/港/A股全能分析工具，覆盖 Stock Copilot Pro v0.3.0',
    priority: 'high',
    status: 'done',
    assignee: { id: '1', name: '小知之', avatar: '🤖' },
    createdAt: new Date('2026-03-02T07:23:00'),
    completedAt: new Date('2026-03-02T07:35:00'),
  },
  {
    id: '22',
    title: '安装 Stock Info Explorer 技能',
    description: '安装 Yahoo Finance 免费股票分析工具作为备选方案',
    priority: 'medium',
    status: 'done',
    assignee: { id: '1', name: '小知之', avatar: '🤖' },
    createdAt: new Date('2026-03-02T08:00:00'),
    completedAt: new Date('2026-03-02T08:15:00'),
  },
  {
    id: '23',
    title: '配置 QVeris API Key',
    description: '获取 API Key 并配置 Stock Copilot Pro（待订阅工具）',
    priority: 'medium',
    status: 'done',
    assignee: { id: '2', name: '峰哥', avatar: '👨‍💻' },
    createdAt: new Date('2026-03-02T07:29:00'),
    completedAt: new Date('2026-03-02T09:40:00'),
  },
  {
    id: '24',
    title: '测试股票分析技能功能',
    description: '测试 Stock Copilot Pro 和 Stock Info Explorer 基本功能',
    priority: 'medium',
    status: 'done',
    assignee: { id: '1', name: '小知之', avatar: '🤖' },
    createdAt: new Date('2026-03-02T07:30:00'),
    completedAt: new Date('2026-03-02T08:20:00'),
  },
  // --- 看板开发任务 ---
  {
    id: '30',
    title: '构建 Next.js 看板应用',
    description: '使用 Next.js + TypeScript + Tailwind + Zustand 构建 Kanban Board',
    priority: 'high',
    status: 'done',
    assignee: { id: '1', name: '小知之', avatar: '🤖' },
    createdAt: new Date('2026-03-02T09:50:00'),
    completedAt: new Date('2026-03-02T12:00:00'),
  },
  {
    id: '31',
    title: '部署看板到 Vercel',
    description: '完成 Vercel 部署，获得 https://kanban-board-ten-sigma.vercel.app',
    priority: 'high',
    status: 'done',
    assignee: { id: '1', name: '小知之', avatar: '🤖' },
    createdAt: new Date('2026-03-02T12:00:00'),
    completedAt: new Date('2026-03-02T13:07:00'),
  },
  // --- 技能安装 ---
  {
    id: '40',
    title: '安装 agent-reach 技能',
    description: '安装并配置 X/Twitter/多平台内容获取技能',
    priority: 'low',
    status: 'done',
    assignee: { id: '1', name: '小知之', avatar: '🤖' },
    createdAt: new Date('2026-03-02T00:00:00'),
    completedAt: new Date('2026-03-02T07:15:00'),
  },
]

/**
 * 看板状态管理 Store
 * 使用 Zustand + persist 实现本地存储
 */
export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,

      /**
       * 添加新任务
       */
      addTask: (input) => {
        const newTask: Task = {
          id: generateId(),
          title: input.title,
          description: input.description,
          priority: input.priority,
          status: input.status || 'todo',
          assignee: input.assignee,
          createdAt: new Date(),
        }
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))
      },

      /**
       * 更新任务
       */
      updateTask: (id, input) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...input,
                  completedAt: input.status === 'done' ? new Date() : task.completedAt,
                }
              : task
          ),
        }))
      },

      /**
       * 删除任务
       */
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },

      /**
       * 移动任务到不同状态列
       */
      moveTask: (taskId, newStatus) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: newStatus,
                  completedAt: newStatus === 'done' ? new Date() : undefined,
                }
              : task
          ),
        }))
      },

      /**
       * 重新排序任务（同一列内）
       */
      reorderTasks: (status, taskIds) => {
        set((state) => {
          const otherTasks = state.tasks.filter((t) => t.status !== status)
          const reorderedTasks = taskIds
            .map((id) => state.tasks.find((t) => t.id === id))
            .filter(Boolean) as Task[]
          return {
            tasks: [...otherTasks, ...reorderedTasks],
          }
        })
      },

      /**
       * 根据状态获取任务列表
       */
      getTasksByStatus: (status) => {
        return get().tasks.filter((task) => task.status === status)
      },

      /**
       * 根据ID获取任务
       */
      getTaskById: (id) => {
        return get().tasks.find((task) => task.id === id)
      },
    }),
    {
      name: 'kanban-storage', // localStorage 键名
    }
  )
)