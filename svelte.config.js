import adapter from '@sveltejs/adapter-cloudflare';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		scss: {
			prependData: '@use "src/variables.scss" as *;'
		},
		typescript: true
	}),

	kit: {
		adapter: adapter()
	}
};

export default config;
