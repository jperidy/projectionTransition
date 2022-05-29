import User from '../../../database/models/userModels';
import { generateToken } from '../../../services/token/utils';

/** @type {import('./__types/items').RequestHandler} */
export async function post({ request }) {

    const { name, email, password } = request.body;

    const user = await User.findOne({ email });
    if (user) {
        return {
            status: 400,
            body: { message: 'User already exists'}
        }
    }

    const userCreated = await User.create({
        name,
        email,
        password,
        status: 'Waiting approval',
        profil:'unknown'
    });

    return {
        status: 201,
        body: {
            _id: userCreated._id,
            name: userCreated.name,
            email: userCreated.email,
            profil: userCreated.profil,
            status: 'Waiting approval',
            token: generateToken(userCreated._id)
        }
    }
};