const asyncHandler = require('express-async-handler');
const PageNew = require('../models/PageNewModels');

// @desc    get content for a specific page name
// @route   GET /api/page/:name
// @access  Public
const getPageContent = asyncHandler(async(req,res) =>{
    
    //console.log('route is ok', req.params.name)
    const content = await PageNew.findOne({name: req.params.name});

    if(content) {
        res.status(200).json({message: 'get content', value: content});
    } else {
        res.status(404).json({
            message: `Page content not found. Page name requested: ${req.params.name}`,
            value: {name: req.params.name, content:[]}
        });
        throw new Error(`Page content not found. Page name requested: ${req.params.name}`);
    }
});

// @desc    update (or create) content for a specific page name
// @route   POST /api/page/:name
// @access  Public
const updatePageContent = asyncHandler(async(req,res) =>{
    
    const newContent = req.body;
    
    let content = {};

    // verify if page already exist
    // content = await Page.findOne({name: req.params.name});
    content = await PageNew.findOne({name: req.params.name});

    //console.log('content', content);

    if (!content) {
        //console.log('create content');
        //console.log(newContent);
        const contentCreated = await PageNew.create(newContent);

        if (contentCreated) {
            res.status(200).json({ message: 'contentCreated', value: contentCreated});
        } else {
            res.status(500).json({ message: `Error: ${newContent.name} not created` })
            throw new Error(`Error: ${newContent.name} not created`);
        }
    } else {
        //console.log('update content');
        content.content = newContent.content;
        const contentUpdated = await content.save(); 

        if (contentUpdated) {
            res.status(200).json({ message: 'contentUpdated', value: contentUpdated });
        } else {
            res.status(500).json({ message: `Error: ${newContent.name} not updated` })
            throw new Error(`Error: ${newContent.name} not updated`);
        }
    }
});

module.exports = { getPageContent, updatePageContent };