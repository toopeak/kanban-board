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
 * 初始任务数据 - 小知之的任务列表
 */
const initialTasks: Task[] = [
  {
    id: '1',
    title: '安装 YouTube 视频监控技能',
    description: '从 ClawHub 安装 youtube-full 技能，配置每日抓取任务',
    priority: 'high',
    status: 'todo',
    createdAt: new Date('2026-03-02T09:00:00'),
  },
  {
    id: '2',
    title: '配置每日定时抓取任务',
    description: '每天早上8点抓取 @mreflow 和 @Fireship 频道的新视频',
    priority: 'high',
    status: 'todo',
    createdAt: new Date('2026-03-02T09:05:00'),
  },
  {
    id: '3',
    title: '测试 Stock Copilot Pro 股票分析',
    description: '使用 QVeris API 测试美股/港股/A股分析功能',
    priority: 'medium',
    status: 'in-progress',
    createdAt: new Date('2026-03-02T07:30:00'),
  },
  {
    id: '4',
    title: '寻找 QVeris 股票数据替代方案',
    description: '寻找 Yahoo Finance 或其他免费股票数据 API',
    priority: 'medium',
    status: 'in-progress',
    createdAt: new Date('2026-03-02T08:00:00'),
  },
  {
    id: '5',
    title: '安装 agent-reach 技能',
    description: '安装并配置 X/Twitter/多平台内容获取技能',
    priority: 'low',
    status: 'done',
    createdAt: new Date('2026-03-02T00:00:00'),
    completedAt: new Date('2026-03-02T07:15:00'),
  },
  {
    id: '6',
    title: '浏览 OpenClaw 中文教程',
    description: '阅读 35 万字完整教程，了解进阶用法',
    priority: 'low',
    status: 'done',
    createdAt: new Date('2026-03-01T22:00:00'),
    completedAt: new Date('2026-03-02T08:30:00'),
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