const mongoose = require('mongoose');
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
    }]

}, {timestamps: true});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;