'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Task, CreateTaskInput, Priority, TaskStatus } from '@/types/task'
import { useKanbanStore } from '@/store/taskStore'

/**
 * 添加/编辑任务弹窗组件
 */
interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  editTask?: Task | null
}

export function AddTaskModal({ isOpen, onClose, editTask }: AddTaskModalProps) {
  const addTask = useKanbanStore((state) => state.addTask)
  const updateTask = useKanbanStore((state) => state.updateTask)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [status, setStatus] = useState<TaskStatus>('todo')

  // 编辑模式时填充表单
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setDescription(editTask.description)
      setPriority(editTask.priority)
      setStatus(editTask.status)
    } else {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setStatus('todo')
    }
  }, [editTask, isOpen])

  if (!isOpen) return null

  /**
   * 提交表单
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      alert('请输入任务标题')
      return
    }

    if (editTask) {
      updateTask(editTask.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
      })
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
      })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 animate-slide-in">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">
            {editTask ? '编辑任务' : '添加新任务'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              任务标题 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入任务标题..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              autoFocus
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              任务描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入任务描述..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* 优先级和状态 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                优先级
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="high">🔴 高</option>
                <option value="medium">🟡 中</option>
                <option value="low">🟢 低</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                状态
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="todo">⏳ 待办</option>
                <option value="in-progress">🔄 进行中</option>
                <option value="done">✅ 已完成</option>
              </select>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editTask ? '保存修改' : '添加任务'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}