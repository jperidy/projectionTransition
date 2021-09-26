import { respond } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths, assets } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "./hooks.js";

const template = ({ head, body }) => "<!DOCTYPE html>\n<html lang=\"fr_FR\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<link rel=\"icon\" href=\"/favicon.png\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t\t\n\t\t" + head + "\n\t</head>\n\t<body>\n\t\t<div id=\"svelte\">" + body + "</div>\n\t</body>\n</html>\n";

let options = null;

const default_settings = { paths: {"base":"","assets":""} };

// allow paths to be overridden in svelte-kit preview
// and in prerendering
export function init(settings = default_settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);

	const hooks = get_hooks(user_hooks);

	options = {
		amp: false,
		dev: false,
		entry: {
			file: assets + "/_app/start-355b6046.js",
			css: [assets + "/_app/assets/start-61d1577b.css",assets + "/_app/assets/vendor-cf063f61.css"],
			js: [assets + "/_app/start-355b6046.js",assets + "/_app/chunks/vendor-5d9b017f.js",assets + "/_app/chunks/preload-helper-ec9aa979.js",assets + "/_app/chunks/singletons-12a22614.js"]
		},
		fetched: undefined,
		floc: false,
		get_component_path: id => assets + "/_app/" + entry_lookup[id],
		get_stack: error => String(error), // for security
		handle_error: (error, request) => {
			hooks.handleError({ error, request });
			error.stack = options.get_stack(error);
		},
		hooks,
		hydrate: true,
		initiator: undefined,
		load_component,
		manifest,
		paths: settings.paths,
		prerender: true,
		read: settings.read,
		root,
		service_worker: null,
		router: true,
		ssr: true,
		target: "#svelte",
		template,
		trailing_slash: "never"
	};
}

// input has already been decoded by decodeURI
// now handle the rest that decodeURIComponent would do
const d = s => s
	.replace(/%23/g, '#')
	.replace(/%3[Bb]/g, ';')
	.replace(/%2[Cc]/g, ',')
	.replace(/%2[Ff]/g, '/')
	.replace(/%3[Ff]/g, '?')
	.replace(/%3[Aa]/g, ':')
	.replace(/%40/g, '@')
	.replace(/%26/g, '&')
	.replace(/%3[Dd]/g, '=')
	.replace(/%2[Bb]/g, '+')
	.replace(/%24/g, '$');

const empty = () => ({});

const manifest = {
	assets: [{"file":"favicon.png","size":4646,"type":"image/png"},{"file":"fonts/Roboto-Regular.eot","size":168436,"type":"application/vnd.ms-fontobject"},{"file":"fonts/Roboto-Regular.otf","size":233484,"type":"font/otf"},{"file":"fonts/Roboto-Regular.svg","size":1013951,"type":"image/svg+xml"},{"file":"fonts/Roboto-Regular.ttf","size":168260,"type":"font/ttf"},{"file":"fonts/Roboto-Regular.woff","size":119608,"type":"font/woff"},{"file":"fonts/omotenashi2-4be39-webfont.woff","size":16832,"type":"font/woff"},{"file":"fonts/omotenashi2-4be39-webfont.woff2","size":12532,"type":"font/woff2"},{"file":"global.css","size":816,"type":"text/css"},{"file":"images/fond.jpg","size":18516,"type":"image/jpeg"},{"file":"images/logo-projection-transition.png","size":32213,"type":"image/png"},{"file":"images/og_logo.jpg","size":34095,"type":"image/jpeg"},{"file":"mains.min.css","size":176941,"type":"text/css"}],
	layout: "src/routes/__layout.svelte",
	error: ".svelte-kit/build/components/error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/article(?:\/(.*))?\/?$/,
						params: (m) => ({ data: d(m[1] || '')}),
						a: ["src/routes/__layout.svelte", "src/routes/article/[...data].svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/login\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/login.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/film\/([^/]+?)\/?$/,
						params: (m) => ({ id: d(m[1])}),
						a: ["src/routes/__layout.svelte", "src/routes/film/[id].svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^(?:\/(.*))?\/?$/,
						params: (m) => ({ data: d(m[1] || '')}),
						a: ["src/routes/__layout.svelte", "src/routes/[...data].svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, resolve }) => resolve(request)),
	handleError: hooks.handleError || (({ error }) => console.error(error.stack)),
	externalFetch: hooks.externalFetch || fetch
});

const module_lookup = {
	"src/routes/__layout.svelte": () => import("../../src/routes/__layout.svelte"),".svelte-kit/build/components/error.svelte": () => import("./components/error.svelte"),"src/routes/article/[...data].svelte": () => import("../../src/routes/article/[...data].svelte"),"src/routes/login.svelte": () => import("../../src/routes/login.svelte"),"src/routes/film/[id].svelte": () => import("../../src/routes/film/[id].svelte"),"src/routes/[...data].svelte": () => import("../../src/routes/[...data].svelte")
};

const metadata_lookup = {"src/routes/__layout.svelte":{"entry":"pages/__layout.svelte-83c0ddd5.js","css":["assets/pages/__layout.svelte-4023d378.css","assets/vendor-cf063f61.css"],"js":["pages/__layout.svelte-83c0ddd5.js","chunks/vendor-5d9b017f.js","chunks/navigation-51f4a605.js","chunks/singletons-12a22614.js"],"styles":[]},".svelte-kit/build/components/error.svelte":{"entry":"error.svelte-8bf1216f.js","css":["assets/vendor-cf063f61.css"],"js":["error.svelte-8bf1216f.js","chunks/vendor-5d9b017f.js"],"styles":[]},"src/routes/article/[...data].svelte":{"entry":"pages/article/[...data].svelte-b7909f75.js","css":["assets/vendor-cf063f61.css","assets/Loading-cf5c7f6a.css"],"js":["pages/article/[...data].svelte-b7909f75.js","chunks/vendor-5d9b017f.js","chunks/articleActions-81437636.js","chunks/CustomContainer-a7142113.js","chunks/Loading-f946706e.js","chunks/navigation-51f4a605.js","chunks/singletons-12a22614.js"],"styles":[]},"src/routes/login.svelte":{"entry":"pages/login.svelte-4612ea98.js","css":["assets/vendor-cf063f61.css"],"js":["pages/login.svelte-4612ea98.js","chunks/vendor-5d9b017f.js","chunks/CustomContainer-a7142113.js","chunks/navigation-51f4a605.js","chunks/singletons-12a22614.js"],"styles":[]},"src/routes/film/[id].svelte":{"entry":"pages/film/[id].svelte-2d816160.js","css":["assets/pages/film/[id].svelte-3e993aa3.css","assets/vendor-cf063f61.css","assets/MovingContent-ec5075fb.css","assets/Loading-cf5c7f6a.css"],"js":["pages/film/[id].svelte-2d816160.js","chunks/vendor-5d9b017f.js","chunks/MovingContent-22332d0d.js","chunks/CustomContainer-a7142113.js","chunks/Loading-f946706e.js","chunks/navigation-51f4a605.js","chunks/singletons-12a22614.js"],"styles":[]},"src/routes/[...data].svelte":{"entry":"pages/[...data].svelte-35bb6ad8.js","css":["assets/pages/[...data].svelte-33008d0b.css","assets/vendor-cf063f61.css","assets/Loading-cf5c7f6a.css","assets/MovingContent-ec5075fb.css"],"js":["pages/[...data].svelte-35bb6ad8.js","chunks/vendor-5d9b017f.js","chunks/CustomContainer-a7142113.js","chunks/Loading-f946706e.js","chunks/navigation-51f4a605.js","chunks/singletons-12a22614.js","chunks/MovingContent-22332d0d.js","chunks/articleActions-81437636.js","chunks/preload-helper-ec9aa979.js"],"styles":[]}};

async function load_component(file) {
	const { entry, css, js, styles } = metadata_lookup[file];
	return {
		module: await module_lookup[file](),
		entry: assets + "/_app/" + entry,
		css: css.map(dep => assets + "/_app/" + dep),
		js: js.map(dep => assets + "/_app/" + dep),
		styles
	};
}

export function render(request, {
	prerender
} = {}) {
	const host = request.headers["host"];
	return respond({ ...request, host }, options, { prerender });
}