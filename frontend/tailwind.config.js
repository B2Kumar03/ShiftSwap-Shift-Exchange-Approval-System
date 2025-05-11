import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A", // Dark blue-gray
        accent: "#3B82F6", // Blue
        success: "#10B981", // Green for approval
        warning: "#F59E0B", // Orange for pending
        danger: "#EF4444", // Red for rejection
        background: "#F8FAFC", // Light gray
      },
    },
  },
})