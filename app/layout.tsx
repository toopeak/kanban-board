import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '看板 - 小知之的任务管理',
  description: 'OpenClaw Agent 任务管理看板',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  )
}