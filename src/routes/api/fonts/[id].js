import Font from '../../../database/models/fontModel';

/** @type {import('./__types/[id]').RequestHandler} */
export async function del({ params }) {
    const id = params.id;

    const font = await Font.deleteOne({ _id: id });

    return {
        status: 200,
        body: { message: 'font deleted', value: font }
    }
}