import Page from '../../../database/models/pageModels';

/** @type {import('./__types/[id]').RequestHandler} */
export async function get({params}) {

    const content = await Page.findOne({ name: '/pages/' + params.slug });
    
    if (!content) {
        return {
            status: 404,
            body: {
                message: `Page content not found. Page name requested: ${params.slug}`,
                value: {name: params.slug, content:[]}
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

    const content = await Page.findOne({ _id: params.slug });

    if (!content) {
        return {
            status: 404,
            body: {
                message: `Page content not found. Page name requested: ${params.slug}`,
                value: { name: content.name, content:[] }
            }
        }
    }

    await Page.deleteOne({ _id: params.slug });

    return {
        status: 200,
        body: {message: 'page removed', value: content}
    }
}


/** @type {import('./__types/[id]').RequestHandler} */
export async function put({ params, request: req }) {

    const updateData = await req.json();
    const result = await Page.findOneAndUpdate({ _id: params.slug }, updateData);

    if (!result) {
        return {
            status: 500,
            body: { message: `Error: ${params.slug} not updated` }
        }
    }

    return {
        status: 200,
        body: { message: 'pageUpdated', value: ''}
    }
}