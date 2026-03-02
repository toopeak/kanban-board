/**
 * 任务优先级枚举
 */
export type Priority = 'high' | 'medium' | 'low'

/**
 * 任务状态（看板列）
 */
export type TaskStatus = 'todo' | 'in-progress' | 'done'

/**
 * 任务类型定义
 */
export interface Task {
  id: string                    // 唯一标识
  title: string                 // 任务标题
  description: string           // 任务描述
  priority: Priority            // 优先级
  status: TaskStatus            // 当前状态
  createdAt: Date               // 创建时间
  completedAt?: Date            // 完成时间（可选）
}

/**
 * 看板列类型
 */
export interface Column {
  id: TaskStatus
  title: string
  color: string
}

/**
 * 创建任务的输入类型
 */
export interface CreateTaskInput {
  title: string
  description: string
  priority: Priority
  status?: TaskStatus
}

/**
 * 更新任务的输入类型
 */
export interface UpdateTaskInput {
  title?: string
  description?: string
  priority?: Priority
  status?: TaskStatus
}