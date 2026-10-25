import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import cloudflareAdapter from '@sveltejs/adapter-cloudflare';
import staticAdapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import { getAllOPPaths, getAllBlogPaths } from './src/lib/server_utils.js';

const useStatic = process.env.ADAPTER === 'static';

export default defineConfig({
	plugins: [sveltekit({
		extensions: ['.svelte', ...mdsvexConfig.extensions],
		preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],
		adapter: useStatic
			? staticAdapter({ pages: 'build', assets: 'build', fallback: '404.html' })
			: cloudflareAdapter({
				routes: { include: ['/*'], exclude: ['<all>'] },
				platformProxy: {
					configPath: 'wrangler.toml',
					environment: undefined,
					experimentalJsonConfig: false,
					persist: false
				}
			}),
		alias: { '@/*': './src/lib/*', '$lib': './src/lib' },
		paths: { base: '' },
		prerender: {
			entries: ['*', '/sitemap.xml', '/parties', '/groups', '/graph', '/constitutions', '/api/pages/page/*', '/api/posts/page/*', ...getAllOPPaths(), ...getAllBlogPaths()],
			handleHttpError: 'warn'
		},
		csp: { mode: 'auto' }
	})],
	server: {
		fs: {
			allow: ['.']
		}
	}
});
