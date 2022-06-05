import Nav from '../../../database/models/navModels';

/** @type {import('./__types/[id]').RequestHandler} */
export async function get() {
    const navBar = await Nav.findOne({ name: 'nav' });
    if (!navBar) {
        return {
            status: 404,
            body: { message: `NavBar not found`, value: {} }
        }
    }
    return {
        status: 200,
        body: { message: 'get navbar', value: navBar }
    }
}

/** @type {import('./__types/[id]').RequestHandler} */
export async function put({ request: req }) {
    const updatedNavBar = await req.json();

    const navBar = await Nav.findOne({ name: 'nav' });
    if (!navBar) {
        const navBarCreated = await Nav.create(updatedNavBar);
        return {
            status: 200,
            body: { message: 'navBarCreated', value: navBarCreated }
        }
    }

    for (let key in updatedNavBar) {
        navBar[key] = updatedNavBar[key]
    }

    const navBarUpdated = await navBar.save();
    return {
        status: 200,
        body: { message: 'navBarUpdated', value: navBarUpdated }
    }
}