const mongoose = require('mongoose');
const pageSchema = mongoose.Schema({
    name: {type: String},
    content: [{
        section: {type: String, required: false},
        type: {type: String, required: true},
        styles: [{ name: { type: String }, value: { type: String} }],
        value: {type: String},
        values: [{
            url: {type: String},
            title: {type: String},
            subTitle: {type: String},
            text: {type: String},
            footer: {type: String},
            image: {type: Buffer}
        }]
    }]

}, {timestamps: true});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;