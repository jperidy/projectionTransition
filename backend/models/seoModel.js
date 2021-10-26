const mongoose = require('mongoose');
const seoSchema = mongoose.Schema({
    name: {type: String},
    "DEFAULT_TITLE": {type: String},
    "DEFAULT_DESCRIPTION": {type: String},
    "DEFAULT_OG_TITLE": {type: String},
    "DEFAULT_OG_DESCRIPTION": {type: String},
    "DEFAULT_OG_IMAGE": {type: String},
    "FAVICON_48_48": {type: String},
    "FAVICON_64_64": {type: String},
    "FAVICON_96_96": {type: String},
    "FAVICON_128_128": {type: String},
    "FAVICON_196_196": {type: String}

}, {timestamps: true} );

const Seo = mongoose.model('Seo', seoSchema);

module.exports = Seo;