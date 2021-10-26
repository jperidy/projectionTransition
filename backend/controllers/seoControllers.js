const asyncHandler = require('express-async-handler');
const Seo = require('../models/seoModel');
//const config = require('../../config/config.json');

// @desc    get seo elements
// @route   GET /api/seo
// @access  Public
const getSeo = asyncHandler(async(req,res) => {
    Seo.findOne({name: "seo"})
        .then((seo) => {
            if (seo) {
                res.status(200).json({message: 'get seo', value: seo});
            } else {
                res.status(404).json({
                    message: `seo not found`,
                    value: {}
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error fetching seo: ${error}`, value: {}}));
});

// @desc    update seo 
// @route   PUT /api/seo
// @access  Private
const updateSeo = asyncHandler(async(req,res) => {

    const updatedSeo = req.body;
    Seo.findOne({name: "seo"})
        .then((seo) => {
            if (!seo) {
                // create the seo
                Seo.create(updatedSeo).then((seoCreated) => {
                    if (seoCreated) {
                        res.status(200).json({ message: 'seoCreated', value: seoCreated});
                    } else {
                        res.status(500).json({ message: `Error: seo not created`, value:[] })
                    }
                })
                .catch((error) => res.status(500).json({message: `Error creating seo in database: ${error}`, value:[]}))
            } else {
                // update the seo
                for (let key in updatedSeo) {
                    seo[key] = updatedSeo[key]
                }
                seo.save()
                    .then((seoUpdated) => {
                        if (seoUpdated) {
                            res.status(200).json({ message: 'seoUpdated', value: seoUpdated });
                        } else {
                            res.status(500).json({ message: `Error: seo not updated`, value:[] })
                        }
                    })
                    .catch((error) => res.status(500).json({message: `Error saving content in database: ${error}`, value:[]}))
            }
        })

});

module.exports = { getSeo, updateSeo }