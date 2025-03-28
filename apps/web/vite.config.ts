import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: '/index.html',
        shop: '/shop.html',
        product: '/product/index.html',
        cart: '/cart.html',
      }
    }
  },
  plugins: [
    tailwindcss(),
  ],
})