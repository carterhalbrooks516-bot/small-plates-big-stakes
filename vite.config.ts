import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Using a relative base ('./') so the build works the same whether it is served
// from the domain root (Vercel) or a subpath (GitHub Pages project site, e.g.
// https://<user>.github.io/small-plates-big-stakes/). No extra config needed.
export default defineConfig({
  base: './',
  plugins: [react()],
});
