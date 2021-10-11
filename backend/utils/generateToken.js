const jwt = require('jsonwebtoken');
const config = require('../../config/config.json');

const generateToken = (id) => {
    return jwt.sign({ id }, config.JWT_SECRET, {
        expiresIn: '1d'
    });
};

module.exports = generateToken;