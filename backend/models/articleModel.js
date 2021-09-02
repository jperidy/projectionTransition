const mongoose = require('mongoose');
const articleSchema = mongoose.Schema({
    title: {
        values: [],
        styles: []
    },
    subTitle: {
        values: [],
        styles: []
    },
    url: {
        values: [],
        styles: []
    },
    content: {
        values: [],
        styles: []
    },
    category: { type: String, required: true},
    author: {
        values: [],
        styles: []
    },

}, {timestamps: true});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;