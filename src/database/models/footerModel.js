import mongoose from 'mongoose';

const footerSchema = mongoose.Schema({
    name: {type: String, required: true},
    "TYPE": {},
    "BRAND": {},
    "TITLE": [],
    "SOCIAL_NETWORKS": [],
    "COPYRIGHT": {},
    "STYLE": {}
}, {timestamps: true} );

const Footer = mongoose.model('Footer', footerSchema);

export default Footer;