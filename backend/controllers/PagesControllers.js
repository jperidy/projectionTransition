const asyncHandler = require('express-async-handler');
const Page = require('../models/pageModels');

// @desc    get content for a specific page name
// @route   GET /api/page/:name
// @access  Public
const getPageContent = asyncHandler(async(req,res) =>{
    
    // rewrite with async functions
    Page.findOne({name: req.params.name})
        .then((content) => {
            if(content) {
                res.status(200).json({message: 'get content', value: content});
            } else {
                res.status(404).json({
                    message: `Page content not found. Page name requested: ${req.params.name}`,
                    value: {name: req.params.name, content:[]}
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error fetching page: ${req.params.name}`, value: {name: req.params.name, content:[]}}));
});

// @desc    delete a page
// @route   DELETE /api/page/:name
// @access  Public
const deleteOnePage = asyncHandler(async(req,res) =>{
    
    Page.findOne({name: req.params.name})
        .then((content) => {
            if(content) {
                content.remove()
                    .then((result) => res.status(200).json({message: 'page removed', value: content}))
                    .catch((error) => res.status(500).json({message: 'page not removed', values: error}));
            } else {
                res.status(404).json({
                    message: `Page content not found. Page name requested: ${req.params.name}`,
                    value: {name: req.params.name, content:[]}
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error removing page: ${req.params.name}`, value: error}));
});

// @desc    update (or create) content for a specific page name
// @route   POST /api/page/:name
// @access  Public
const updatePageContent = asyncHandler(async(req,res) =>{
    
    // rewrite with async function
    const newContent = req.body;
    Page.findOne({name: req.params.name})
        .then((content) => {
            if (!content) {
                Page.create(newContent)
                    .then((contentCreated) => {
                        if (contentCreated) {
                            res.status(200).json({ message: 'contentCreated', value: contentCreated});
                        } else {
                            res.status(500).json({ message: `Error: ${newContent.name} not created`, value:[] })
                        }
                    })
                    .catch((error) => res.status(500).json({message: `Error creating content in database: ${error}`, value:[]}))   
            } else {

                for (let key in newContent) {
                    content[key] = newContent[key]
                }

                content.save()
                    .then((contentUpdated) => {
                        if (contentUpdated) {
                            res.status(200).json({ message: 'contentUpdated', value: contentUpdated });
                        } else {
                            res.status(500).json({ message: `Error: ${newContent.name} not updated`, value:[] })
                        }
                    })
                    .catch((error) => res.status(500).json({message: `Error saving content in database: ${error}`, value:[]}))
            }
        })
        .catch((error) => res.status(500).json({message: `Error fetching the page in database: ${error}`, value: []}))

});

// @desc    create a page
// @route   POST /api/page
// @access  Public
const createPage = asyncHandler(async(req,res) =>{
    
    // rewrite with async function
    const pageToCreate = req.body;
    Page.findOne({name: pageToCreate.name})
        .then((content) => {
            if (!content) {
                Page.create(pageToCreate)
                    .then((contentCreated) => {
                        if (contentCreated) {
                            res.status(200).json({ message: 'contentCreated', value: contentCreated});
                        } else {
                            res.status(500).json({ message: `Error: ${pageToCreate.name} not created`, value:[] })
                        }
                    })
                    .catch((error) => res.status(500).json({message: `Error creating content in database: ${error}`, value:[]}))   
            } else {
                res.status(401).json({message: "Not authorized : this page already exist", value:[]});
            }
        })
        .catch((error) => res.status(500).json({message: `Error creating the page in database: ${error}`, value: []}))

});

// @desc    get all pages name
// @route   GET /api/page/list
// @access  Privalte
const getAllPages = asyncHandler(async(req,res) =>{
    
    Page.find().select("_id name").sort({name: 1})
        .then((pages) => {
            if(pages) {
                res.status(200).json({message: '', value: pages});
            } else {
                res.status(404).json({
                    message: `There is no pages already created`,
                    value: []
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error fetching pages: ${error}`, value: []}));
});


module.exports = { getAllPages, getPageContent, updatePageContent, createPage, deleteOnePage };