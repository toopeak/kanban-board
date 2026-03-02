'use client'

import { useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Plus, Layout } from 'lucide-react'
import { Column } from './Column'
import { AddTaskModal } from './AddTaskModal'
import { useKanbanStore } from '@/store/taskStore'
import type { Task, TaskStatus } from '@/types/task'

/**
 * 看板列配置
 */
const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: '⏳ 待办', color: 'bg-blue-100' },
  { id: 'in-progress', title: '🔄 进行中', color: 'bg-orange-100' },
  { id: 'done', title: '✅ 已完成', color: 'bg-green-100' },
]

/**
 * 看板主组件
 * 管理整个看板的布局和拖拽逻辑
 */
export function KanbanBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // 从 store 获取任务和操作
  const tasks = useKanbanStore((state) => state.tasks)
  const moveTask = useKanbanStore((state) => state.moveTask)
  const reorderTasks = useKanbanStore((state) => state.reorderTasks)

  /**
   * 处理拖拽结束事件
   */
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    // 如果没有放置到有效区域，不做任何操作
    if (!destination) return

    // 如果放置位置没有变化，不做任何操作
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    // 跨列移动
    if (source.droppableId !== destination.droppableId) {
      moveTask(draggableId, destination.droppableId as TaskStatus)
    } else {
      // 同列内重新排序
      const columnTasks = tasks.filter((t) => t.status === source.droppableId)
      const taskIds = columnTasks.map((t) => t.id)
      
      // 移除拖拽的任务ID
      taskIds.splice(source.index, 1)
      // 在新位置插入
      taskIds.splice(destination.index, 0, draggableId)
      
      reorderTasks(source.droppableId as TaskStatus, taskIds)
    }
  }

  /**
   * 打开编辑弹窗
   */
  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  /**
   * 关闭弹窗
   */
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  // 按状态分组任务
  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status)

  // 统计信息
  const stats = {
    total: tasks.length,
    todo: getTasksByStatus('todo').length,
    inProgress: getTasksByStatus('in-progress').length,
    done: getTasksByStatus('done').length,
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 头部 */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Layout className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">看板 - 小知之的任务管理</h1>
              <p className="text-sm text-gray-500">
                共 {stats.total} 个任务 · {stats.todo} 待办 · {stats.inProgress} 进行中 · {stats.done} 已完成
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            添加任务
          </button>
        </div>
      </header>

      {/* 看板主体 */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="h-full p-6 min-w-[1024px]">
            <div className="grid grid-cols-3 gap-6 h-full max-w-7xl mx-auto">
              {columns.map((column) => (
                <Column
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  color={column.color}
                  tasks={getTasksByStatus(column.id)}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </div>
        </DragDropContext>
      </main>

      {/* 添加/编辑任务弹窗 */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editTask={editingTask}
      />
    </div>
  )
}