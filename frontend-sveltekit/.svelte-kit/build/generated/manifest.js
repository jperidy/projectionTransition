const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/statistics.svelte"),
	() => import("../../../src/routes/article/[...data].svelte"),
	() => import("../../../src/routes/login.svelte"),
	() => import("../../../src/routes/film/[id].svelte"),
	() => import("../../../src/routes/[...data].svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/statistics.svelte
	[/^\/statistics\/?$/, [c[0], c[2]], [c[1]]],

	// src/routes/article/[...data].svelte
	[/^\/article(?:\/(.*))?\/?$/, [c[0], c[3]], [c[1]], (m) => ({ data: d(m[1] || '')})],

	// src/routes/login.svelte
	[/^\/login\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/film/[id].svelte
	[/^\/film\/([^/]+?)\/?$/, [c[0], c[5]], [c[1]], (m) => ({ id: d(m[1])})],

	// src/routes/[...data].svelte
	[/^(?:\/(.*))?\/?$/, [c[0], c[6]], [c[1]], (m) => ({ data: d(m[1] || '')})]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];