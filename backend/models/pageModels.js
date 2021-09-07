const mongoose = require('mongoose');
const pageSchema = mongoose.Schema({
    name: {type: String},
    content: [{
        type: {type: String, required: true},
        values: [],
        styles: [],
        components: []
    }]

}, {timestamps: true});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;