import Page from '../../../database/models/pageModels';

/** @type {import('./__types/[id]').RequestHandler} */
export async function post({request: req}) {

    const pageToDuplicate = (await req.json()).pageName;

    const content = await Page.findOne({ name: pageToDuplicate });

    if(!content) {
        return {
            status: 401,
            body: {message: "Not authorized : you can't duplicate non existing page", value:[]}
        }
    }

    const objectToCreate = { ...content };
    objectToCreate.name = objectToCreate.name + "_copy";
    delete objectToCreate._id;

    const contentCreated = await Page.create(objectToCreate);

    if (!contentCreated) {
        return {
            status: 500,
            body: { message: `Error: ${pageToDuplicate.name} not duplicated`, value:[] }
        }
    }

    return {
        status: 200,
        body: { message: 'contentDuplicated', value: contentCreated}
    }
}