import Page from '../../../database/models/pageModels';

/** @type {import('./__types/[id]').RequestHandler} */
export async function get() {

    const pages = await Page.find().select("_id name display").sort({name: 1});

    if (!pages) {
        return {
            status: 404,
            body: { message: `There is no pages already created`, value: [] }
        }
    }

    return {
        status: 200,
        body: {message: '', value: pages}
    }
}

/** @type {import('./__types/[id]').RequestHandler} */
export async function post({request: req}) {

    const newContent = await req.json();
    
    const content = await Page.findById(newContent._id);

    if (!content) {
        const contentCreated = await Page.create(newContent);
        if (!contentCreated){
            return {
                status: 500,
                body: { message: `Error: ${newContent.name} not created`, value:[] }
            }
        }
        return {
            status: 200,
            body: { message: 'contentCreated', value: contentCreated}
        }
    }

    for (let key in newContent) {
        content[key] = newContent[key]
    }

    // url can't have spaces
    content.name = content.name.replaceAll(/[<>'"$#%{}[]()]/g, '_');

    const contentUpdated = await content.save();
    if (!contentUpdated) {
        return {
            status: 500,
            body: { message: `Error: ${newContent.name} not updated`, value:[] }
        }
    }
    return {
        status: 200,
        body: { message: 'contentUpdated', value: contentUpdated }
    }
}