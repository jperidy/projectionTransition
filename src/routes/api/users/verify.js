/** @type {import('./__types/[id]').RequestHandler} */
export async function post() {

    // if protect is pass then the token is valid
    return {
        status: 200,
        body: {message: 'token is valid'}
    }    
};