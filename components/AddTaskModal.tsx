'use client'

import { useState, useEffect } from 'react'
import { X, User, Plus } from 'lucide-react'
import type { Task, CreateTaskInput, Priority, TaskStatus, Assignee } from '@/types/task'
import { useKanbanStore } from '@/store/taskStore'

/**
 * 预设的执行者列表
 */
const PRESET_ASSIGNEES: Assignee[] = [
  { id: '1', name: '小知之', avatar: '🤖' },
  { id: '2', name: '峰哥', avatar: '👨‍💻' },
  { id: '3', name: '外包团队', avatar: '👥' },
  { id: '4', name: '待定', avatar: '❓' },
]

/**
 * 添加/编辑任务弹窗组件
 */
interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  editTask?: Task | null
  defaultStatus?: TaskStatus
}

export function AddTaskModal({ isOpen, onClose, editTask, defaultStatus = 'todo' }: AddTaskModalProps) {
  const addTask = useKanbanStore((state) => state.addTask)
  const updateTask = useKanbanStore((state) => state.updateTask)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [status, setStatus] = useState<TaskStatus>(defaultStatus)
  const [assignee, setAssignee] = useState<Assignee | undefined>(undefined)

  // 编辑模式时填充表单
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setDescription(editTask.description)
      setPriority(editTask.priority)
      setStatus(editTask.status)
      setAssignee(editTask.assignee)
    } else {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setStatus(defaultStatus)
      setAssignee(undefined)
    }
  }, [editTask, isOpen, defaultStatus])

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
        assignee,
      })
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        assignee,
      })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-slide-in overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Plus size={20} />
            {editTask ? '编辑任务' : '添加新任务'}
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              任务标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入任务标题..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              autoFocus
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              任务描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="详细描述任务内容..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
            />
          </div>

          {/* 执行者 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <User size={16} />
              执行者
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_ASSIGNEES.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => setAssignee(person)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                    assignee?.id === person.id
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{person.avatar}</span>
                  <span className="text-sm font-medium">{person.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 优先级和状态 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                优先级
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="high">🔴 高优先级</option>
                <option value="medium">🟡 中优先级</option>
                <option value="low">🟢 低优先级</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
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
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/30"
            >
              {editTask ? '保存修改' : '添加任务'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}