'use client'

import { Droppable, Draggable } from '@hello-pangea/dnd'
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
  onEdit: (task: Task) => void
}

export function Column({ id, title, tasks, color, onEdit }: ColumnProps) {
  return (
    <div className="flex flex-col h-full">
      {/* 列标题 */}
      <div className={`${color} rounded-t-lg px-4 py-3`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <span className="bg-white/60 text-gray-700 text-sm px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* 任务列表（可拖拽放置区域） */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 bg-gray-100/50 rounded-b-lg p-3 min-h-[300px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-gray-200' : ''
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
                      className={`group ${snapshot.isDragging ? 'opacity-50' : ''}`}
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
              <div className="text-center py-8 text-gray-400 text-sm">
                拖拽任务到此处
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}