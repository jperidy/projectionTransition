const mongoose = require('mongoose');

const connectDB = async () => {
    
    let uri = '';
    
    if (['dev'].includes(process.env.NODE_ENV)) {
        uri = process.env.MONGO_URI_DEV
    }

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
        .then((conn) => console.log(`MongoDB connected: ${conn.connection.host}`))
        .catch((error) => {
            console.log(`Error: ${error.message} \nNODE_ENV:${process.env.NODE_ENV}\nuri: ${uri}`);
            process.exit(1);
        })
}

require('../models/pageModels');

module.exports = connectDB;