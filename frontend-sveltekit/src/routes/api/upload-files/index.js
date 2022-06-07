import path from 'path';
import fs from 'fs';

/** @type {import('./__types/[id]').RequestHandler} */
export async function post({ url, request: req }) {

    try {
        const fileName = url.searchParams.get('fileName');
        const __dir = path.resolve();
    
        const storage = `${__dir}/static/uploads/${fileName}`;
    
        const stream = req.body;
        console.log(fileName, storage);
    
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

    // https://github.com/sveltejs/kit/issues/70
    // const data = await req.body;
    // console.log('request', req)
    // console.log('data', data);
    // const filename = '/uploads/' + crypto.randomUUID()+'.jpg';
    // try {
    //     fs.writeFileSync(
    //         `${__dir}/static${filename}`,
    //         data, 
    //         { encoding: 'base64' }
    //     );
    //     return {
    //         body: {
    //             success: true,
    //             filename,
    //         },
    //     }
    // } catch (err) {
    //     console.log(err);
    //     return {
    //         body: err.message
    //     }
    // }
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