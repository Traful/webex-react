import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: "webex-react-privateKey.key",
      cert: "webex-react.crt"
    }
  },
  plugins: [react()],
})
