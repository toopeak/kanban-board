import { KanbanBoard } from './components/KanbanBoard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">任务看板</h1>
          <p className="text-gray-600 mt-1">拖拽卡片来改变任务状态</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto h-[calc(100vh-80px)]">
        <KanbanBoard />
      </div>
    </main>
  );
}
