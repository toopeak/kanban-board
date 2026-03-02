'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import { Task } from '../types';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

export function KanbanColumn({ id, title, tasks, color }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${color} rounded-lg p-4 min-w-[300px] w-[350px] flex flex-col`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">{title}</h2>
        <span className="bg-white/80 px-2 py-1 rounded-full text-sm text-gray-600">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-3 min-h-[100px]">
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
