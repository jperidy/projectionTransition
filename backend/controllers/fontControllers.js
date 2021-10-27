const asyncHandler = require('express-async-handler');
const Font = require('../models/fontModel');

// @desc    get font elements
// @route   GET /api/font
// @access  Public
const getFonts = asyncHandler(async(req,res) => {
    Font.find()
        .then((fonts) => {
            if (fonts) {
                res.status(200).json({message: 'get fonts', value: fonts});
            } else {
                res.status(404).json({
                    message: `fonts not found`,
                    value: []
                });
            }
        })
        .catch((error) => res.status(500).json({message: `Error fetching fonts: ${error}`, value: []}));
});

// @desc    update a font 
// @route   PUT /api/font
// @access  Private
const updateFont = asyncHandler(async(req,res) => {
    const updatedFont = req.body;

    Font.findById(updatedFont._id)
        .then((font) => {
            if (!font) {
                // create the font
                Font.create(updatedFont).then((fontCreated) => {
                    if (fontCreated) {
                        res.status(200).json({ message: 'fontCreated', value: fontCreated});
                    } else {
                        res.status(500).json({ message: `Error: footer not created`, value:[] })
                    }
                })
                .catch((error) => res.status(500).json({message: `Error creating content in database: ${error}`, value:[]}))
            } else {
                // update the font
                for (let key in updatedFont) {
                    font[key] = updatedFont[key]
                }
                font.save()
                    .then((fontUpdated) => {
                        if (fontUpdated) {
                            res.status(200).json({ message: 'fontUpdated', value: fontUpdated });
                        } else {
                            res.status(500).json({ message: `Error: font not updated`, value:[] })
                        }
                    })
                    .catch((error) => res.status(500).json({message: `Error saving font in database: ${error}`, value:[]}))
            }
        })

});

// @desc    delete a font 
// @route   DELETE /api/font
// @access  Private
const deleteFont = asyncHandler(async(req,res) => {
    const id = req.params.id;

    Font.deleteOne({ _id: id})
        .then((font) => {
            if (font) {
                res.status(200).json({message: 'font deleted', value: font});
            } else {
                res.status(404).json({message: 'font not deleted', value: font});
            }
        }).catch((error) => res.status(500).json({message: 'error deleting font', value: error}));
});

module.exports = { getFonts, updateFont, deleteFont }