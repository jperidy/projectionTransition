import User from '../../../database/models/userModels';
import { generateToken } from '../../../services/token/utils';
import bcrypt from 'bcryptjs';


const matchPassword = async (enteredPassword, reccordedPassword) => {
    return await bcrypt.compare(enteredPassword, reccordedPassword);
};

/** @type {import('./__types/[id]').RequestHandler} */
export async function post({ request }) {

    const maxTry = 3;
    const { email, password } = await request.json();

    const user = await User.findOne({ email });

    if (!user) {
        return {
            status: 401,
            body: { message: 'Email not found' }
        }
    }

    
    const passwordIsValid = await matchPassword(password, user.password);
    if (!passwordIsValid) {
        if (user.status === 'Validated') {
            // for the first connection
            if (!user.tryConnect || !user.tryConnect.try) {
                user.tryConnect.try = 0;
                user.tryConnect.lastTry = new Date(Date.now());
            }
            if ((Date.now() - (new Date(user.tryConnect.lastTry)).getTime()) / (1000 * 3600 * 24) <= 1) {
                user.tryConnect.try = user.tryConnect.try += 1;
                user.tryConnect.lastTry = new Date(Date.now());

                if(user.tryConnect.try >= maxTry) {
                    user.tryConnect.try = 0;
                    user.tryConnect.lastTry = new Date(Date.now());
                    user.status = 'Blocked';
                    await user.save();
                    return {
                        status: 401,
                        body: { message: `Your account has been blocked. Please contact your administrator.` }
                    }
                } else {
                    await user.save();
                    return {
                        status: 401,
                        body: { message: `Invalid password. You can try x${maxTry - user.tryConnect.try}` }
                    }
                }
            } else {
                user.tryConnect.try = 1;
                user.tryConnect.lastTry = new Date(Date.now());
                await user.save();
                return {
                    status: 401,
                    body: { message: `Invalid password. You can try x${maxTry - user.tryConnect.try}x.` }
                }
            }
        } else {
            return {
                status: 401,
                body: { message: `Your account is not validated: ${user.status}.Please contact your administrator.` }
            }
        }
    }

    if (user.status === 'Validated') {
        user.tryConnect.try = 0;
        user.tryConnect.lastTry = new Date(Date.now());
        user.lastConnexion = new Date(Date.now());
        await user.save();
        return {
            status: 200,
            body: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profil: user.profil,
                status: user.status,
                token: generateToken(user._id),
                lastConnexion: user.lastConnexion
            }
        }
    } else {
        user.tryConnect.try = 0;
        user.tryConnect.lastTry = new Date(Date.now());
        await user.save();
        return {
            status: 401,
            body: { message: `Your account is not validated: ${user.status}.Please contact your administrator.` }
        }
    }
};