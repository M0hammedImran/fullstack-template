import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), dts({ include: ["src"] })],

	build: {
		copyPublicDir: false,
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			formats: ["es", "cjs"],
			fileName: (format) => `index.${format}.js`,
		},
		rollupOptions: {
			external: ["react", "react/jsx-runtime", "react-dom"],
		},
	},
});

