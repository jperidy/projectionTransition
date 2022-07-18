import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			envPrefix: {
				host: 'HOST',
				port: 'PORT'
			}
		}),
	}
};

export default config;
