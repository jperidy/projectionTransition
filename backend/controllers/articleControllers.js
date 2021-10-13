const asyncHandler = require('express-async-handler');
const Article = require('../models/articleModel');

// @desc    create an article
// @route   POST /api/article
// @access  Private
const createArticle = asyncHandler(async(req,res) =>{
    
    const articleToCreate = req.body;

    Article.create(articleToCreate)
        .then((article) => {
            if(article) {
                res.status(200).json({message: 'article created', value: article});
            } else {
                res.status(404).json({
                    message: `Article not created`,
                    value: null
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error creating article in database: ${error}`}));
});

// @desc    get all articles
// @route   GET /api/article?category=&keyword=&size=&page=
// @access  Public
const getAllArticlesContent = asyncHandler(async(req,res) =>{
    
    const category = req.query.category ? { category: req.query.category } : {};
    const keyword = req.query.keyword ? req.query.keyword : null;
    const limit = req.query.size ? Number(req.query.size) : null;

    Article.find({ ...category }).sort({'createdAt': -1})
        .then((articles) => {
            if (keyword) {
                const filteredArticles = []
                // TOTO : optimize. But not worry array will stay small
                for (let x = 0; x < articles.length; x++) {
                    const article = articles[x];
                    console.log(article.title)
                    const titre = article.title.values && article.title.values[0].value;
                    if (titre && titre.toLowerCase().match(keyword.toLowerCase())) {
                        filteredArticles.push(article);
                    }
                }
                articles = filteredArticles;
            }
            if (limit) {
                articles = articles.slice(0, limit);
            }
        
            if(articles) {
                res.status(200).json({message: 'get all articles', value: articles});
            } else {
                res.status(404).json({
                    message: `Error geting all articles. Category: ${category}`,
                    value: null
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error finding articles in database: ${error}`}));
});

// @desc    get content for a specific article
// @route   GET /api/article/:id
// @access  Public
const getArticleContent = asyncHandler(async(req,res) =>{
    
    const articleId = req.params.id
    Article.findById(articleId)
        .then((article) => {
            if(article) {
                res.status(200).json({message: 'get article', value: article});
            } else {
                res.status(404).json({
                    message: `Article content not found. Article id requested : ${articleId}`,
                    value: null
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error finding article in database: ${error}`}));
});

// @desc    get content for a specific article
// @route   PUT /api/article/:id
// @access  Private
const updateArticleContent = asyncHandler(async(req,res) =>{
    
    const articleId = req.params.id
    const updatedArticle = req.body

    Article.findById(articleId)
        .then((article) => {
            if(article) {
                for (let key in updatedArticle) {
                    article[key] = updatedArticle[key]
                }
                // article.title = updatedArticle.title;
                // article.subTitle = updatedArticle.subTitle;
                // article.url = updatedArticle.url;
                // article.content = updatedArticle.content;
                // article.author = updatedArticle.author;
                // article.category = updatedArticle.category;
                // article.createdAt = updatedArticle.createdAt;
                article.save()
                    .then(() => res.status(200).json({message: 'article updated', value: article}))
                    .catch((error) => res.status(500).json({message: `Error saving the article in database: ${error}`}));
            } else {
                res.status(404).json({
                    message: `Article content not found. Article id requested : ${articleId}`,
                    value: null
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error finding article in database: ${error}`}));
});

// @desc    delete an article
// @route   DELETE /api/article/:id
// @access  Private
const deleteArticleContent = asyncHandler(async(req,res) =>{
    
    const articleId = req.params.id

    Article.deleteOne({_id: articleId})
        .then((article) => {
            if(article) {
                res.status(200).json({message: 'article deleted', value: null});
            } else {
                res.status(404).json({
                    message: `Error deleting article : ${articleId}`,
                    value: null
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error deleting article in database: ${error}`}))
});

module.exports = { getArticleContent, updateArticleContent, createArticle, getAllArticlesContent, deleteArticleContent };