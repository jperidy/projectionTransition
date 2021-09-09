const asyncHandler = require('express-async-handler');
const User = require('../models/userModels');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {

    // rewrite with async function
    const maxTry = 3;
    const { email, password } = req.body;

    User.findOne({ email })
        .then((user) => {
            if (user) {
                user.matchPassword(password)
                    .then((matchResult) => {
                        if (matchResult) {
                            if (user.status === 'Validated') {
                                user.tryConnect.try = 0;
                                user.tryConnect.lastTry = new Date(Date.now());
                                user.lastConnexion = new Date(Date.now());
                                user.save()
                                    .then(() => res.json({
                                        _id: user._id,
                                        name: user.name,
                                        email: user.email,
                                        profil: user.profil,
                                        status: user.status,
                                        token: generateToken(user._id),
                                        lastConnexion: user.lastConnexion
                                    }))
                                    .catch((error) => res.status(500).json({message: `Error saving user: ${error}`}));
                            } else {
                                user.tryConnect.try = 0;
                                user.tryConnect.lastTry = new Date(Date.now());
                                user.save()
                                    .then(() => res.status(401).json({ message: `Your account is not validated: ${user.status}.Please contact your administrator.` }))
                                    .catch((error) => res.status(500).json({message: `Error updating user with not validated account`}));                                
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
                    
                                    if(user.tryConnect.try >= maxTry) {
                                        user.tryConnect.try = 0;
                                        user.tryConnect.lastTry = new Date(Date.now());
                                        user.status = 'Blocked';
                                        user.save()
                                            .then(() => res.status(401).json({ message: `Sorry your account has been blocked. Please contact your administrator` }))
                                            .catch((error) => res.status(500).json({message:`Error saving blocked account: ${error}`}));
                                    } else {
                                        user.save()
                                            .then( () => res.status(401).json({ message: `Invalid password. You can try x${maxTry - user.tryConnect.try}` }))
                                            .catch((error) => res.status(500).json({ message:`Error saving user account updating number of try: ${error}`}));
                                    }
                                } else {
                                    user.tryConnect.try = 1;
                                    user.tryConnect.lastTry = new Date(Date.now());
                                    user.save()
                                        .then(() => res.status(401).json({ message: `Invalid password. You can try x${maxTry - user.tryConnect.try}x.` }))
                                        .catch((error) => res.status(500).json({message: `Error saving user whit first try error: ${error}`}));
                                }
                            } else {
                                res.status(401).json({ message: `Your account is not validated: ${user.status}.Please contact your administrator.` });
                            }
                        }
                    })
                    .catch((error) => res.status(500).json({message: `Error with matching password function: ${error}`}));        
            } else {
                res.status(401).json({message: 'Email not found'});
            }
        })
        .catch((error) => res.status(500).json({message: `Error finding user in database: ${error}`}));
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async(req,res) => {

    const { name, email, password } = req.body;

    User.findOne({ email })
        .then((userExists) => {
            if(userExists) {
                res.status(400).json({message: 'User already exists'});
            } else {
                User.create({
                    name,
                    email,
                    password,
                    status: 'Waiting approval',
                    profil:'unknown'
                })
                .then((user) => {
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
                })
                .catch((error) => res.status(500).json({message: `Error creating user in database: ${error}`}));
            }
        })


    

    // const { name, email, password } = req.body;

    // const userExists = await User.findOne({ email });

    // if(userExists) {
    //     res.status(400).json({message: 'User already exists'});
    // }

    // const user = await User.create({
    //     name,
    //     email,
    //     password,
    //     status: 'Waiting approval',
    //     profil:'unknown'
    // });

    // if (user) {
    //     res.status(201).json({
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         profil: user.profil,
    //         status: 'Waiting approval',
    //         token: generateToken(user._id)
    //     });
    // } else {
    //     res.status(400).json({message: 'Invalid user data'});
    // }
});

module.exports = { authUser, registerUser };