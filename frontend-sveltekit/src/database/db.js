import mongoose from 'mongoose';
import config from '../config.json';

const connectDB = async () => {
    const uri = config.MONGO_URI;
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then((conn) => console.log(`MongoDB connected: ${conn.connection.host}`))
        .catch((error) => {
            console.log(`Error: ${error.message} \nNODE_ENV:${config.NODE_ENV}\nuri: ${uri}`);
            process.exit(1);
        })
}

export default connectDB;