'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { Task } from '../types';

const initialTasks: Task[] = [
  {
    id: '1',
    title: '安装 YouTube Full 技能',
    description: '从 ClawHub 安装 youtube-full 技能',
    status: 'done',
    priority: 'high',
    createdAt: '2026-03-02',
  },
  {
    id: '2',
    title: '配置 YouTube 定时任务',
    description: '每天早上8点抓取 @mreflow 和 @Fireship 的最新视频',
    status: 'done',
    priority: 'high',
    createdAt: '2026-03-02',
  },
  {
    id: '3',
    title: '获取 Transcript API Key',
    description: '注册 transcriptapi.com 获取 API Key',
    status: 'todo',
    priority: 'high',
    createdAt: '2026-03-02',
  },
  {
    id: '4',
    title: '构建看板应用',
    description: '使用 Next.js + shadcn/ui 构建 Kanban Board',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2026-03-02',
  },
  {
    id: '5',
    title: '测试 YouTube 抓取',
    description: '手动运行脚本测试视频抓取功能',
    status: 'todo',
    priority: 'medium',
    createdAt: '2026-03-02',
  },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask || !overTask) return;

    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    const overIndex = tasks.findIndex((t) => t.id === overId);

    if (activeTask.status !== overTask.status) {
      setTasks((tasks) => {
        const newTasks = [...tasks];
        newTasks[activeIndex] = { ...activeTask, status: overTask.status };
        return arrayMove(newTasks, activeIndex, overIndex);
      });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask || !overTask) {
      // 拖到列上
      const columnId = overId as string;
      if (['todo', 'in-progress', 'done'].includes(columnId)) {
        setTasks((tasks) =>
          tasks.map((t) => (t.id === activeId ? { ...t, status: columnId as Task['status'] } : t))
        );
      }
      return;
    }

    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    const overIndex = tasks.findIndex((t) => t.id === overId);

    if (activeTask.status === overTask.status) {
      setTasks((tasks) => arrayMove(tasks, activeIndex, overIndex));
    } else {
      setTasks((tasks) =>
        tasks.map((t) =>
          t.id === activeId ? { ...t, status: overTask.status } : t
        )
      );
    }
  }

  const activeTask = tasks.find((t) => t.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto p-4">
        <KanbanColumn
          id="todo"
          title="待办 (To Do)"
          tasks={todoTasks}
          color="bg-slate-100"
        />
        <KanbanColumn
          id="in-progress"
          title="进行中 (In Progress)"
          tasks={inProgressTasks}
          color="bg-blue-50"
        />
        <KanbanColumn
          id="done"
          title="已完成 (Done)"
          tasks={doneTasks}
          color="bg-green-50"
        />
      </div>

      <DragOverlay>
        {activeTask ? (
          <KanbanCard task={activeTask} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
