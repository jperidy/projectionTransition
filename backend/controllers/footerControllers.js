const asyncHandler = require('express-async-handler');
const Footer = require('../models/footerModel');

// @desc    get footer elements
// @route   GET /api/footer
// @access  Public
const getFooter = asyncHandler(async(req,res) => {
    Footer.findOne({name: "footer"})
        .then((footer) => {
            if (footer) {
                res.status(200).json({message: 'get footer', value: footer});
            } else {
                res.status(404).json({
                    message: `footer not found`,
                    value: {}
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error fetching footer: ${error}`, value: {}}));
});

// @desc    update footer 
// @route   PUT /api/footer
// @access  Private
const updateFooter = asyncHandler(async(req,res) => {
    const updatedFooter = req.body;
    Footer.findOne({name: "footer"})
        .then((footer) => {
            if (!footer) {
                // create the footer
                Footer.create(updatedFooter).then((footerCreated) => {
                    if (footerCreated) {
                        res.status(200).json({ message: 'footerCreated', value: footerCreated});
                    } else {
                        res.status(500).json({ message: `Error: footer not created`, value:[] })
                    }
                })
                .catch((error) => res.status(500).json({message: `Error creating content in database: ${error}`, value:[]}))
            } else {
                // update the footer
                for (let key in updatedFooter) {
                    footer[key] = updatedFooter[key]
                }
                footer.save()
                    .then((footerUpdated) => {
                        if (footerUpdated) {
                            res.status(200).json({ message: 'footerUpdated', value: footerUpdated });
                        } else {
                            res.status(500).json({ message: `Error: footer not updated`, value:[] })
                        }
                    })
                    .catch((error) => res.status(500).json({message: `Error saving content in database: ${error}`, value:[]}))
            }
        })

});

module.exports = { getFooter, updateFooter }