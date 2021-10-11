const jwt = require('jsonwebtoken');
const config = require('../../config/config.json');

const asyncHandler = require('express-async-handler');
const User = require('../models/userModels');
//const mongoose = require('mongoose');

const verifyJWTLocal = (token) => {

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        return decoded;
    } catch (error) {
        return false;
    }

}

const protect = asyncHandler (async (req, res, next) => {

    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded_local = verifyJWTLocal(token);

            if (decoded_local) {

                req.user = await User.findById(decoded_local.id)
                .select('-password');

                next();

            } else {
                res.status(401).json({message: 'Not authorized, token failed'});
                //throw new Error('Not authorized, token failed')
            }

        } catch (error) {
            console.error({message: 'Not authorized, token failed'});
            res.status(401).json({message: 'Not authorized, token failed'});
            //throw new Error('Not authorized, token failed')
        }
    }

    if(!token){
        res.status(401).json({message: 'Not authorized, no token'});
        //throw new Error('Not authorized, no token');
    }
});

module.exports = { 
    protect, 
};