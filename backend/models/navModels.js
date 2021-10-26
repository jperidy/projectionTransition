const mongoose = require('mongoose');
const navSchema = mongoose.Schema({
    name: {type: String, required: true},
    TITLE: [],
    BRAND: {},
    SOCIAL_NETWORKS: [],
    STYLE: {},
}, {timestamps: true} );

const Nav = mongoose.model('Nav', navSchema);

module.exports = Nav;