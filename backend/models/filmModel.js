const mongoose = require('mongoose');
const filmSchema = mongoose.Schema({
    infosGenerales: { values: [], styles: []},
    actions: [],
    url: { values: [], styles: []},
    title: { values: [], styles: []},
    real: { values: [], styles: []},
    summury: { values: [], styles: []},
    location: { type: String, required: true},
    book: { type: String },
    bookingAvailable: { type: Boolean },
    justification: { type: String },
}, {timestamps: true});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;