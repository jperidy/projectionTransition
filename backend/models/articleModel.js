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
    src: {
        values: [],
        styles: []
    },
    content: {
        values: [],
        styles: []
    },

}, {timestamps: true});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;