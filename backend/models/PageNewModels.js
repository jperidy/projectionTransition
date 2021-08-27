const mongoose = require('mongoose');
const pageNewSchema = mongoose.Schema({
    name: {type: String},
    content: [{
        type: {type: String, required: true},
        values: [],
        styles: [],
        components: []
    }]

}, {timestamps: true});

const PageNew = mongoose.model('PageNew', pageNewSchema);

module.exports = PageNew;