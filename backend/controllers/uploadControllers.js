const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

// @desc    Create image folder if not existing
// @route   POST /api/upload/images/1000x250
// @access  Private
const checkAndCreateImage1000x250Folder = asyncHandler(async (req, res, next) => {

    const __dir = path.resolve();
    const pathImages = __dir + '/uploads/images/1000x250/';
    console.log(pathImages);

    if (fs.existsSync(pathImages)) {
        next();
    } else {
        try {
            fs.mkdirSync(pathImages, { recursive: true })
            console.log('Directory created successfully /uploads/images/1000x250: ' + pathImages);
            next();
        } catch (error) {
            console.error('Error creating folder to upload Pxx: ' + pathImages);
            res.status(500).json({ message: 'Error creating folder to upload Pxx: ' + pathImages });
        }
    }

});


// @desc    Delte image 
// @route   DELETE /api/upload/images/1000x250/:name
// @access  Private
const deleteImage1000x250 = asyncHandler(async (req, res, next) => {

    console.log('start delteImage1000x250');
    try {
        const name = req.params.name;
        const directory = path.resolve() + '/uploads/images/1000x250';

        console.log('file to delete', name);

        fs.readdir(directory, (err, files) => {
            if (err) {
                res.status(500).json({message: 'Unable to scan directory: ' + err});
                return;
            }

            files.map(file => {

                const fileName = path.basename(file);
                console.log(fileName);

                console.log(fileName, name);
                if (fileName === name) {
                    fs.unlink(directory + '/' + file, (err) => {
                        if (err) {
                            console.error('Error removing file ' + file + 'from ' + directory);
                        } else {
                            console.log(file + ' has been removed from: ' + directory);
                        }
                    });
                }
            });
        });

        res.status(200).json({ message: 'process to delte done', value: name });

    } catch (error) {
        res.status(500).json({message: `Error deleting file: ${req.params.name}`});
        throw new Error(`Error deleting file: ${req.params.name}`);
    }

});

module.exports = { checkAndCreateImage1000x250Folder, deleteImage1000x250 };