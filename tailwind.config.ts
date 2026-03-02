import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 看板列背景色
        'column-todo': '#E3F2FD',
        'column-progress': '#FFF3E0',
        'column-done': '#E8F5E9',
        // 优先级颜色
        'priority-high': '#EF4444',
        'priority-medium': '#F59E0B',
        'priority-low': '#10B981',
      },
    },
  },
  plugins: [],
}
export default config