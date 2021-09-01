const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

// @desc    Create image folder if not existing
// @route   POST /api/upload/images/1000x250
// @access  Private
const checkAndCreateImage1000x250Folder = asyncHandler(async (req, res, next) => {

    const __dir = path.resolve();
    const pathImages = __dir + '/uploads/images/1000x250/';
    //console.log(pathImages);

    if (fs.existsSync(pathImages)) {
        next();
    } else {
        try {
            fs.mkdirSync(pathImages, { recursive: true })
            //console.log('Directory created successfully /uploads/images/1000x250: ' + pathImages);
            next();
        } catch (error) {
            //console.error('Error creating folder to upload Pxx: ' + pathImages);
            res.status(500).json({ message: 'Error creating folder to upload Pxx: ' + pathImages });
        }
    }

});

// @desc    Delte image 
// @route   DELETE /api/upload/images?url=url
// @access  Private
const deleteImage = asyncHandler(async (req, res, next) => {

    //console.log('start delteImage');
    try {
        const name = req.query.url.split('/uploads')[1];
        const directory = path.resolve() + '/uploads';

        //console.log('file to delete', name, 'in directory', directory);

        fs.unlinkSync(directory + name);

        res.status(200).json({ message: 'Image deleted', value: directory + name });

    } catch (error) {

        res.status(200).json({message: `Error deleting image or no image to delte: ${req.params.name}`});
        throw new Error(`Error deleting file: ${req.params.name}`);
    
    }

});

module.exports = { checkAndCreateImage1000x250Folder, deleteImage };