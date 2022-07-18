import mongoose from 'mongoose';
import config from '../config.json';

const connectDB = async () => {
    try {
        return mongoose.connect(config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log(`ERROR DB CONNECTION: ${error.message} \nSVELTE_ENV:${config.SVELTE_ENV}\nuri: ${config.MONGO_URI}`);
    }
}

export default connectDB;