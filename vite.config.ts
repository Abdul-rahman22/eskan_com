import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
      },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'radix-ui': ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-popover', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'hooks-form': ['react-hook-form', '@hookform/resolvers'],
          'recharts': ['recharts'],
          'framer': ['framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
}));
