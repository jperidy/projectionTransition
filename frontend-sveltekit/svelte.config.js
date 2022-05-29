import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		// vite: () => ({
		// 	server: {
		// 		proxy: {
		// 			'/api': {
		// 				target: 'http://localhost:5000',
		// 				changeOrigin: true,
		// 			},
		// 		}
		// 	},
		// }),
	}
};

export default config;


// import adapter from '@sveltejs/adapter-node';

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	kit: {
// 		adapter: adapter({
// 			envPrefix: {
// 				host: 'HOST',
// 				port: 'PORT'
// 			}
// 		}),
// 	}
// };

// export default config;
