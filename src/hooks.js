import connectDB from './database/db';
import { verifyAuthentication } from './services/api/authentication';
import config from './config.json';

const admins = [
    { methods: ['POST'], uri: /^\/api\/seo$/ },
    { methods: ['POST'], uri: /^\/api\/users\/verify$/ },
    { methods: ['POST'], uri: /^\/api\/pages$/ },
    { methods: ['PUT', 'DELETE'], uri: /^\/api\/pages\/[a-zA-Z-_]*$/},
    { methods: ['POST'], uri: /^\/api\/pages\/duplicate$/ },
    { methods: ['POST'], uri: /^\/api\/emails$/ },
    { methods: ['PUT'], uri: /^\/api\/fonts$/ },
    { methods: ['DELETE'], uri: /^\/api\/fonts\/[a-zA-Z-_]*$/ },
    { methods: ['PUT'], uri: /^\/api\/footers$/ },
    { methods: ['POST'], uri: /^\/api\/navs$/ },
    { methods: ['POST'], uri: /^\/api\/upload-files$/ },
    { methods: ['POST'], uri: /^\/api\/users$/ },
    { methods: ['POST'], uri: /^\/api\/users\/verify$/ },
];

const authentication = async (event) => {
    const matchUri = admins.find((admin) => admin.uri.test(event.url.pathname));
    if (
        matchUri
        && matchUri.methods.includes(event.request.method)
    ) {
        return verifyAuthentication(event.request);
    }
    return true;
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    if (!config.SVELTE_ENV === 'production') {
        console.log('DEBUG:', event.request.method, event.url.pathname);
    }

    try {
        await connectDB();
    
        const isAuhtenticated = await authentication(event);
        if (!isAuhtenticated) {
            return new Response('Token not valid');
        }
        
        return resolve(event);
    } catch (error) {
        console.log("Error in hooks", error);
        return new Response('Error', error);
    }
}