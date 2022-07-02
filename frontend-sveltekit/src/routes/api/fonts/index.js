import Font from '../../../database/models/fontModel';

/** @type {import('./__types/[id]').RequestHandler} */
export async function get() {
    const fonts = await Font.find();
    if(!fonts) {
        return {
            status: 404,
            body: { message: `fonts not found`, value: [] }
        }
    }
    return {
        status: 200,
        body: { message: 'get fonts', value: fonts }
    }
}

/** @type {import('./__types/[id]').RequestHandler} */
export async function post({request: req}) {
    const fontToUpdateOrCreate = await req.json();

    const font = await Font.findById(fontToUpdateOrCreate._id);

    if (!font) {
        const fontCreated = await Font.create(fontToUpdateOrCreate);
        return {
            status: 200,
            body: { message: 'fontCreated', value: fontCreated}
        }
    }

    for (let key in fontToUpdateOrCreate) {
        font[key] = fontToUpdateOrCreate[key]
    }
    const fontUpdated = await font.save();
    return {
        status: 200,
        body: { message: 'fontUpdated', value: fontUpdated }
    }    
}