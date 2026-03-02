'use client'

import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { GripVertical, Calendar, Trash2, Edit } from 'lucide-react'
import type { Task } from '@/types/task'
import { useKanbanStore } from '@/store/taskStore'

/**
 * 任务卡片组件
 * 显示单个任务的详细信息
 */
interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const deleteTask = useKanbanStore((state) => state.deleteTask)

  /**
   * 优先级显示配置
   */
  const priorityConfig = {
    high: { label: '高', className: 'priority-high' },
    medium: { label: '中', className: 'priority-medium' },
    low: { label: '低', className: 'priority-low' },
  }

  const priority = priorityConfig[task.priority]

  return (
    <div className="task-card bg-white rounded-lg p-4 shadow-sm border border-gray-200 animate-slide-in">
      {/* 拖拽手柄和标题 */}
      <div className="flex items-start gap-2 mb-2">
        <div className="text-gray-400 cursor-grab active:cursor-grabbing mt-1">
          <GripVertical size={16} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 leading-tight">{task.title}</h4>
        </div>
      </div>

      {/* 描述 */}
      <p className="text-sm text-gray-600 mb-3 ml-6 line-clamp-2">
        {task.description}
      </p>

      {/* 底部信息 */}
      <div className="flex items-center justify-between ml-6">
        <div className="flex items-center gap-2">
          {/* 优先级标签 */}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priority.className}`}>
            {priority.label}
          </span>

          {/* 创建时间 */}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar size={12} />
            <span>{format(task.createdAt, 'MM/dd', { locale: zhCN })}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="编辑"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => {
              if (confirm('确定要删除这个任务吗？')) {
                deleteTask(task.id)
              }
            }}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="删除"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}