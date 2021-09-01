const asyncHandler = require('express-async-handler');
const Article = require('../models/articleModel');

// @desc    create an article
// @route   POST /api/article
// @access  Private
const createArticle = asyncHandler(async(req,res) =>{
    
    const articleToCreate = req.body;

    const article = await Article.create(articleToCreate);

    if(article) {
        res.status(200).json({message: 'article created', value: article});
    } else {
        res.status(404).json({
            message: `Article not created`,
            value: null
        });
    }
});

// @desc    get content for a specific article
// @route   GET /api/article/:id
// @access  Public
const getArticleContent = asyncHandler(async(req,res) =>{
    
    //console.log('route is ok', req.params.name)
    const articleId = req.params.id
    const article = await Article.findById(articleId);

    if(article) {
        res.status(200).json({message: 'get article', value: article});
    } else {
        res.status(404).json({
            message: `Article content not found. Article id requested : ${articleId}`,
            value: null
        });
    }
});

// @desc    get content for a specific article
// @route   PUT /api/article/:id
// @access  Private
const updateArticleContent = asyncHandler(async(req,res) =>{
    
    //console.log('route is ok', req.params.name)
    const articleId = req.params.id
    const updatedArticle = req.body

    const article = await Article.findById(articleId);

    if(article) {
        article.title = updatedArticle.title;
        article.subTitle = updatedArticle.subTitle;
        article.src = updatedArticle.src;
        article.content = updatedArticle.content;
        await article.save();

        res.status(200).json({message: 'article updated', value: article});
    } else {
        res.status(404).json({
            message: `Article content not found. Article id requested : ${articleId}`,
            value: null
        });
    }
});

module.exports = { getArticleContent, updateArticleContent, createArticle };