'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, GripVertical } from 'lucide-react';
import { Task } from '../types';

interface KanbanCardProps {
  task: Task;
  isOverlay?: boolean;
}

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

const priorityLabels = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
};

export function KanbanCard({ task, isOverlay }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white rounded-lg p-4 shadow-sm border border-gray-200
        cursor-grab active:cursor-grabbing
        hover:shadow-md transition-shadow
        ${isDragging ? 'opacity-50' : ''}
        ${isOverlay ? 'shadow-xl rotate-2 cursor-grabbing' : ''}
      `}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>

          <div className="flex items-center justify-between">
            <span
              className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}
            >
              {priorityLabels[task.priority]}
            </span>

            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {task.createdAt}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
