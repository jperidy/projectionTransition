import mongoose from 'mongoose';
import config from '../config.josn';

const getDatabaseUri = () => {
    let uri = '';
    
    if (['dev'].includes(config.NODE_ENV)) {
        uri = config.MONGO_URI_DEV;
    } else if (['preprod'].includes(config.NODE_ENV)) {
        uri = config.MONGO_URI_PREPROD;
    } else if (['production'].includes(config.NODE_ENV)) {
        uri = config.MONGO_URI_PROD;
    } else {
        console.log('Unknow environment: ' + config.NODE_ENV);
    }
    return uri;
}

const connectDB = async () => {
    const uri = getDatabaseUri()
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
        .then((conn) => console.log(`MongoDB connected: ${conn.connection.host}`))
        .catch((error) => {
            console.log(`Error: ${error.message} \nNODE_ENV:${config.NODE_ENV}\nuri: ${uri}`);
            process.exit(1);
        })
}

export default connectDB;