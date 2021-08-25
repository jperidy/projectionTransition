const asyncHandler = require('express-async-handler');
const User = require('../models/userModels');
const generateToken = require('../utils/generateToken');

const { protect } = require('../middleware/authMiddleware');



// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {

    const maxTry = 3;
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        if (await user.matchPassword(password)) {
            if (user.status === 'Validated') {
                user.tryConnect.try = 0;
                user.tryConnect.lastTry = new Date(Date.now());
                user.lastConnexion = new Date(Date.now());
                await user.save();
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    profil: user.profil,
                    status: user.status,
                    token: generateToken(user._id),
                    lastConnexion: user.lastConnexion
                    //lastConnexion: "2021-04-26T17:20:50.298Z"
                });
                return;
            } else {
                user.tryConnect.try = 0;
                user.tryConnect.lastTry = new Date(Date.now());
                await user.save();
                res.status(401).json({ message: `Your account is not validated: ${user.status}.
                Please contact your administrator.` });
                return;
            }
        } else {
            if (user.status === 'Validated') {
                // for the first connection
                if (!user.tryConnect || !user.tryConnect.try) {
                    user.tryConnect.try = 0;
                    user.tryConnect.lastTry = new Date(Date.now());
                }
        
                if ((Date.now() - (new Date(user.tryConnect.lastTry)).getTime()) / (1000 * 3600 * 24) <= 1) {
                    user.tryConnect.try = user.tryConnect.try += 1;
                    user.tryConnect.lastTry = new Date(Date.now());
    
                    //console.log(user.tryConnect.try)
                    if(user.tryConnect.try >= maxTry) {
                        user.tryConnect.try = 0;
                        user.tryConnect.lastTry = new Date(Date.now());
                        user.status = 'Blocked';
                        await user.save();
                        res.status(401).json({ message: `Sorry your account has been blocked. Please contact your administrator` });
                        return
                    }
    
                    await user.save();
                    res.status(401).json({ message: `Invalid password. You can try x${maxTry - user.tryConnect.try}` });
                    return;
                } else {
                    user.tryConnect.try = 1;
                    user.tryConnect.lastTry = new Date(Date.now());
                    await user.save();
                    res.status(401).json({ message: `Invalid password. You can try x${maxTry - user.tryConnect.try}x.` });
    
                }
            } else {
                res.status(401).json({ message: `Your account is not validated: ${user.status}.
                Please contact your administrator.` });
                return;
            }
        }

    } else {
        res.status(401).json({message: 'Email not found'});
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async(req,res) => {

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400).json({message: 'User already exists'});
    }

    const user = await User.create({
        name,
        email,
        password,
        status: 'Waiting approval'
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profil: user.profil,
            status: 'Waiting approval',
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({message: 'Invalid user data'});
    }
});

// // @desc    Verify a token
// // @route   POST /api/users/token
// // @access  Private
// const verifyUserToken = asyncHandler(async(req,res) => {

//     // if private middleware pass token is valid 
//     const user = req.user;
//     res.status(200).json(user);
// });


module.exports = { authUser, registerUser };