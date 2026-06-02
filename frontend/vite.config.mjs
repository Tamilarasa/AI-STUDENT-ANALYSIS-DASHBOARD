import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // 👈 Fixed: changed from react-plugin to plugin-react

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/AI-STUDENT-ANALYSIS-DASHBOARD/', 
})