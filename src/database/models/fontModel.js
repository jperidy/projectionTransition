import mongoose from 'mongoose';

const fontSchema = mongoose.Schema({
    name: {type: String, required: true},
    defaultHeader: {type: Boolean},
    defaultBody: {type: Boolean},
    href: {type: String}
}, {timestamps: true} );

const Font = mongoose.model('Font', fontSchema);

export default Font;