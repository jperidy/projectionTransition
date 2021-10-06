//const asyncHandler = require('express-async-handler');
const Logs = require('../models/logsModel');

// @desc    log a request
const logARequest = (type, target) => {
    
    const log = {type, target};
    Logs.create(log)
        //.then(result => console.log('result: ' + result))
        .catch((error) => console.log('error writting log: ' + error));
};

module.exports = { logARequest };