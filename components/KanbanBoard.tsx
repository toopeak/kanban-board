'use client'

import { useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Plus, Layout, Users, CheckCircle2, Clock, ListTodo } from 'lucide-react'
import { Column } from './Column'
import { AddTaskModal } from './AddTaskModal'
import { useKanbanStore } from '@/store/taskStore'
import type { Task, TaskStatus } from '@/types/task'

/**
 * 看板列配置
 */
const columns: { id: TaskStatus; title: string; color: string; icon: React.ReactNode }[] = [
  { 
    id: 'todo', 
    title: '待办', 
    color: 'bg-blue-50 border-blue-200',
    icon: <ListTodo className="w-5 h-5 text-blue-600" />
  },
  { 
    id: 'in-progress', 
    title: '进行中', 
    color: 'bg-orange-50 border-orange-200',
    icon: <Clock className="w-5 h-5 text-orange-600" />
  },
  { 
    id: 'done', 
    title: '已完成', 
    color: 'bg-green-50 border-green-200',
    icon: <CheckCircle2 className="w-5 h-5 text-green-600" />
  },
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 头部 */}
      <header className="bg-white border-b shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-lg shadow-blue-600/20">
                <Layout className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">任务看板</h1>
                <p className="text-sm text-gray-500">小知之的任务管理系统</p>
              </div>
            </div>

            {/* 添加任务按钮 - 更显眼 */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transform hover:-translate-y-0.5 font-medium"
            >
              <Plus size={20} />
              <span>添加新任务</span>
            </button>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <ListTodo size={18} />
                <span className="text-sm font-medium">待办</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{stats.todo}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <Clock size={18} />
                <span className="text-sm font-medium">进行中</span>
              </div>
              <p className="text-2xl font-bold text-orange-700">{stats.inProgress}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">已完成</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.done}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <Users size={18} />
                <span className="text-sm font-medium">总任务</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">{stats.total}</p>
            </div>
          </div>
        </div>
      </header>

      {/* 看板主体 */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="h-full min-w-[1024px] max-w-7xl mx-auto">
            <div className="grid grid-cols-3 gap-6 h-full">
              {columns.map((column) => (
                <Column
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  color={column.color}
                  icon={column.icon}
                  tasks={getTasksByStatus(column.id)}
                  onEdit={handleEdit}
                  onAddTask={() => setIsModalOpen(true)}
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