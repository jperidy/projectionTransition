import connectDB from './database/db';
import { verifyAuthentication } from './services/api/apiHandler';

const admins = [
    { methods: ['post'], uri: '/api/seo'},
    { methods: ['post'], uri: '/api/users/verify'},
];

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    await connectDB();
    console.log('hook', event.url.pathname);
    
    if (admins.map((admin) => admin.uri).includes(event.url.pathname)) {
        const isAuhtenticated = await verifyAuthentication(event.request);
        if (!isAuhtenticated) {
            return new Response('Token not valid');
        }
    }
    
    const response = await resolve(event);
    return response;
}