import Page from '../../../database/models/pageModels';

/** @type {import('./__types/[id]').RequestHandler} */
export async function get({params}) {

    const content = await Page.findOne({ name: '/pages/' + params.name });
    
    if (!content) {
        return {
            status: 404,
            body: {
                message: `Page content not found. Page name requested: ${params.name}`,
                value: {name: params.name, content:[]}
            }
        }
    }

    return {
        status: 200,
        body: {message: 'get content', value: content}
    }
}

/** @type {import('./__types/[id]').RequestHandler} */
export async function del({params}) {

    const content = await Page.findOne({ name: '/pages/' + params.name });

    if (!content) {
        return {
            status: 404,
            body: {
                message: `Page content not found. Page name requested: ${params.name}`,
                value: {name: params.name, content:[]}
            }
        }
    }

    return {
        status: 200,
        body: {message: 'page removed', value: content}
    }
}


/** @type {import('./__types/[id]').RequestHandler} */
export async function put({ params, request: req }) {

    const updateData = await req.json();
    const result = await Page.findOneAndUpdate({ name: '/pages/' + params.name }, updateData);

    if (!result) {
        return {
            status: 500,
            body: { message: `Error: ${params.name} not updated` }
        }
    }

    return {
        status: 200,
        body: { message: 'pageUpdated', value: ''}
    }
}