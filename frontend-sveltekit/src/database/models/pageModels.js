import mongoose from 'mongoose';

const pageSchema = mongoose.Schema({
    name: {type: String},
    titleSeo: {type: String},
    descriptionSeo: {type: String},
    titleOG: {type: String},
    descriptionOG: {type: String},
    content: [{
        type: {type: String, required: true},
        values: [],
        styles: [],
        components: []
    }],
    display: { type: Boolean },

}, {timestamps: true});

const Page = mongoose.model('Page', pageSchema);

export default Page;