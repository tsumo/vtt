import { loadEnv, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE')
  return {
    plugins: [react()],
    base: process.env.BASE_URL,
    server: {
      host: env.VITE_SERVER_HOST_ENABLE ? true : false,
    },
  }
})
