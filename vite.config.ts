import * as fs from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync('/Users/rtb/.keys/server.key'),
      cert: fs.readFileSync('/Users/rtb/.keys/server.crt')
    }
  },
  plugins: [react()]
})
