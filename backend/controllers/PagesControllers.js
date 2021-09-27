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
        .catch((error) => res.status(500).json({message: `Error fetching page: ${req.params.nam}`, value: {name: req.params.name, content:[]}}));
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
                //content.content = newContent.content;
                content.content = newContent.content;
                content.titleSeo = newContent.titleSeo;
                content.descriptionSeo = newContent.descriptionSeo;
                content.titleOG = newContent.titleOG;
                content.descriptionOG = newContent.descriptionOG;
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

module.exports = { getPageContent, updatePageContent };