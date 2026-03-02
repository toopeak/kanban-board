'use client'

import { Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { TaskCard } from './TaskCard'
import type { Task, TaskStatus } from '@/types/task'

/**
 * 看板列组件
 * 显示一个状态列及其任务列表
 */
interface ColumnProps {
  id: TaskStatus
  title: string
  tasks: Task[]
  color: string
  icon: React.ReactNode
  onEdit: (task: Task) => void
  onAddTask: () => void
}

export function Column({ id, title, tasks, color, icon, onEdit, onAddTask }: ColumnProps) {
  return (
    <div className={`flex flex-col h-full rounded-2xl border-2 ${color}`}>
      {/* 列标题 */}
      <div className="px-4 py-3 border-b border-inherit">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-semibold text-gray-800">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-white/80 text-gray-700 text-sm px-2.5 py-1 rounded-lg font-bold shadow-sm">
              {tasks.length}
            </span>
            <button
              onClick={onAddTask}
              className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
              title="添加任务"
            >
              <Plus size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* 任务列表（可拖拽放置区域） */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 overflow-y-auto transition-colors ${
              snapshot.isDraggingOver ? 'bg-white/50' : ''
            }`}
          >
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${snapshot.isDragging ? 'opacity-50 rotate-2' : ''}`}
                      style={provided.draggableProps.style}
                    >
                      <TaskCard task={task} onEdit={onEdit} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>

            {/* 空状态提示 */}
            {tasks.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">暂无任务</p>
                <button
                  onClick={onAddTask}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + 添加任务
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}