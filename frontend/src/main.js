import App from './App.svelte';
import '../css/mains.min.css';
//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const app = new App({
	target: document.body,
	//hydrate: true,
	props: {
		name: 'projection transition'
	}
});

export default app;