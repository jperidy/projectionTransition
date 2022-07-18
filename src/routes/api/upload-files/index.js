import path from 'path';
import fs from 'fs';

/** @type {import('./__types/[id]').RequestHandler} */
export async function post({ url, request: req }) {

    try {
        const fileName = url.searchParams.get('fileName');
        const __dir = path.resolve();
    
        const storage = `${__dir}/static/uploads/${fileName}`;
    
        const stream = req.body;
    
        stream.on('data', chunk => {
            fs.appendFileSync(storage, chunk);
        });
    
        return {
            body: {
                success: true,
                storage,
            },
        }
    } catch (error) {
        console.log(error);
        return {
            body: error.message
        }
    }
}

/** @type {import('./__types/[id]').RequestHandler} */
export async function del({ url }) {
    try {
        const name = url.searchParams.get('url');
        const directory = path.resolve() + '/static';

        fs.unlinkSync(directory + name);

        return {
            status: 200,
            body: { message: 'File deleted', value: directory + name }
        }
    } catch (error) {

        return {
            status: 200,
            body: {message: `Error deleting file or no file to delete: ${url.searchParams.get('url')}`}
        }    
    }
}