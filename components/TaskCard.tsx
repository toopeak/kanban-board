'use client'

import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { GripVertical, Calendar, Trash2, Edit, User } from 'lucide-react'
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
    high: { 
      label: '高', 
      className: 'bg-red-100 text-red-700 border-red-200',
      dot: 'bg-red-500'
    },
    medium: { 
      label: '中', 
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      dot: 'bg-yellow-500'
    },
    low: { 
      label: '低', 
      className: 'bg-green-100 text-green-700 border-green-200',
      dot: 'bg-green-500'
    },
  }

  const priority = priorityConfig[task.priority]

  return (
    <div className="group bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all animate-slide-in cursor-grab active:cursor-grabbing">
      {/* 拖拽手柄和标题 */}
      <div className="flex items-start gap-2 mb-3">
        <div className="text-gray-300 mt-0.5">
          <GripVertical size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 leading-tight truncate">{task.title}</h4>
        </div>
      </div>

      {/* 描述 */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 ml-6 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* 执行者 */}
      {task.assignee && (
        <div className="flex items-center gap-2 mb-3 ml-6">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-lg">
            <span className="text-base">{task.assignee.avatar || '👤'}</span>
            <span className="text-xs text-gray-600 font-medium">{task.assignee.name}</span>
          </div>
        </div>
      )}

      {/* 底部信息 */}
      <div className="flex items-center justify-between ml-6">
        <div className="flex items-center gap-2">
          {/* 优先级标签 */}
          <span className={`text-xs px-2 py-1 rounded-lg font-medium border flex items-center gap-1 ${priority.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`}></span>
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
            onClick={(e) => {
              e.stopPropagation()
              onEdit(task)
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="编辑"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (confirm('确定要删除这个任务吗？')) {
                deleteTask(task.id)
              }
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="删除"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}