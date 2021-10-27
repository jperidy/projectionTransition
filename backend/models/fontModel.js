const mongoose = require('mongoose');
const fontSchema = mongoose.Schema({
    name: {type: String, required: true},
    defaultHeader: {type: Boolean},
    defaultBody: {type: Boolean},
    href: {type: String}
}, {timestamps: true} );

const Font = mongoose.model('Font', fontSchema);

module.exports = Font;