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

// @desc    get all articles
// @route   GET /api/article?category=&keyword=&size=&page=
// @access  Public
const getAllArticlesContent = asyncHandler(async(req,res) =>{
    
    const category = req.query.category ? { category: req.query.category } : {};
    const keyword = req.query.keyword ? req.query.keyword : null;
    const limit = req.query.size ? Number(req.query.size) : null;

    //console.log({...category, ...keyword});

    let articles = await Article.find({ ...category })
                            .sort({'updatedAt': -1})
                            .limit(limit);

    if (keyword) {
        const filteredArticles = []
        for (let x = 0; x < articles.length; x++) {
            const article = articles[x];
            console.log(article.title)
            const titre = article.title.values && article.title.values[0].value
            if (titre && titre.match(keyword)) {
                filteredArticles.push(article);
            }
        }
        articles = filteredArticles;
    }

    if(articles) {
        res.status(200).json({message: 'get all articles', value: articles});
    } else {
        res.status(404).json({
            message: `Error geting all articles. Category: ${category}`,
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
        article.url = updatedArticle.url;
        article.content = updatedArticle.content;
        article.author = updatedArticle.author;
        article.category = updatedArticle.category;
        await article.save();

        res.status(200).json({message: 'article updated', value: article});
    } else {
        res.status(404).json({
            message: `Article content not found. Article id requested : ${articleId}`,
            value: null
        });
    }
});

// @desc    delete an article
// @route   DELETE /api/article/:id
// @access  Private
const deleteArticleContent = asyncHandler(async(req,res) =>{
    
    const articleId = req.params.id

    const article = await Article.deleteOne({_id: articleId});

    if(article) {
        res.status(200).json({message: 'article deleted', value: null});
    } else {
        res.status(404).json({
            message: `Error deleting article : ${articleId}`,
            value: null
        });
    }
});

module.exports = { getArticleContent, updateArticleContent, createArticle, getAllArticlesContent, deleteArticleContent };