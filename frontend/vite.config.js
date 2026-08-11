import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
proxy:{
  "/api":{
    target:[
      "http://localhost:3000",
      "https://snitch-7b46.onrender.com"
    ],
    changeOrigin:true,
    secure :false
  }
}
  }
})
