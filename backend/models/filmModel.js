const mongoose = require('mongoose');
const filmSchema = mongoose.Schema({
    location: { type: String, required: true},
    title: {
        values: [],
        styles: []
    },
    real: {
        values: [],
        styles: []
    },
    releaseDate: {type: Date},
    duration: {type: Number},
    url: {
        values: [],
        styles: []
    },
    summury: {
        values: [],
        styles: []
    },
    debateTitle: {
        values: [],
        styles: []
    },
    date: {type: Date}, 
    debatePitch: {
        values: [],
        styles: []
    },
    whyThisFilm: {
        values: [],
        styles: []
    },
    presentator: {
        values: [],
        styles: []
    },
    participants: {
        values: [],
        styles: []
    },

}, {timestamps: true});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;