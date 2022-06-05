import User from "../../database/models/userModels";
import { CustomApiError } from "./customError";
// import { CustomApiError, handleErrorsAndFinaliseHttpResponse } from "./customError";
import jwt from 'jsonwebtoken';
import config from '../../config.json';
// import connectDB from "../../database/db";


const verifyJWTLocal = (token) => {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        return decoded;
    } catch (error) {
        return false;
    }
}

export const verifyAuthentication = async (req) => {
    console.log('authorization', req.headers.get('authorization'));
    if(
        req.headers.get('authorization') 
        && req.headers.get('authorization').startsWith('Bearer')
    ){
        const token = req.headers.get('authorization').split(' ')[1];
        const decoded_local = verifyJWTLocal(token);
        if (!decoded_local) {
            throw new CustomApiError(401, 'Not authorized');
        }
        req.user = await User.findById(decoded_local.id).select('-password');
        return true;
    }
    return false;
};

// export const apiHandler = (handlers) => async (req) => {
//     console.log('__req', req)
//     try {
//         await connectDB();
//         const handler = handlers[req.method.toLowerCase()];
//         if (!handler) {
//             throw new CustomApiError(405, 'Method not allowed');
//         }
        
//         if (handler.authenticated) {
//             await verifyAuthentication(req);
//         }
        
//         if (handler.joiSchema) {
//             await handler.joiSchema.validateAsync(req.body);
//         }
        
//         return await handler.fn(req);
//     } catch (error) {
//         return handleErrorsAndFinaliseHttpResponse(error, req);
//     }
// };
