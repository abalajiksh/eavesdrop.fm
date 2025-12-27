import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Use both vitePreprocess and sveltePreprocess for SCSS support
	preprocess: [
		vitePreprocess(),
		sveltePreprocess({
			scss: {
				prependData: '@use "src/variables.scss" as *;'
			}
		})
	],

	kit: {
		adapter: adapter()
	}
};

export default config;
