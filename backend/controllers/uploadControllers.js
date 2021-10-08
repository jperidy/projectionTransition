const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const multer = require('multer');


// MULTER FOR VIDEO
const storageVideo = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/videos/');
    },
    filename(req, file, cb){
        cb(null, `VIDEO-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});
const checkFileTypeVideo = (file, cb) => {
    const filetypes = /mp4|webm|ogg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if(extname){
        return cb(null, true);
    } else {
        cb('Vidéo file only ! mp4|avi|wmv|webm|flv|mov|m4p|m4v|mpeg|m2v|3gp|3g2')
    }
};

const checkAndCreateVideoFolder = asyncHandler(async (req, res, next) => {

    const __dir = path.resolve();
    const pathImages = __dir + '/uploads/videos/';

    if (fs.existsSync(pathImages)) {
        next();
    } else {
        try {
            fs.mkdirSync(pathImages, { recursive: true })
            next();
        } catch (error) {
            res.status(500).json({ message: 'Error creating folder to upload video : ' + pathImages });
        }
    }

});

// @desc    Upload an image
// @route   POST /api/upload/images/1000x250
// @access  Private
const uploadVideo = multer({
    storage: storageVideo,
    fileFilter: function(req, file, cb) {
        checkFileTypeVideo(file, cb);
    },
    limits: { fileSize: 100000000 },
});


// MULTER FOR IMAGE
const storageImages1000x250 = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/images/1000x250/');
    },
    filename(req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// cb for callback
function checkFileTypeImage(file, cb){
    const filetypes = /png|jpg|jpeg|svg|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //const mimetype = filetypes.test(file.mimetype);

    if(extname){
        return cb(null, true);
    } else {
        cb('Image file only !')
    }
}

// @desc    Upload an image
// @route   POST /api/upload/images/1000x250
// @access  Private
const uploadImage1000x250 = multer({
    storage: storageImages1000x250,
    fileFilter: function(req, file, cb) {
        checkFileTypeImage(file, cb);
    },
    limits: { fileSize: 1000000 },
});

// @desc    Create image folder if not existing
// @route   POST /api/upload/images/1000x250
// @access  Private
const checkAndCreateImage1000x250Folder = asyncHandler(async (req, res, next) => {

    const __dir = path.resolve();
    const pathImages = __dir + '/uploads/images/1000x250/';

    if (fs.existsSync(pathImages)) {
        next();
    } else {
        try {
            fs.mkdirSync(pathImages, { recursive: true })
            next();
        } catch (error) {
            res.status(500).json({ message: 'Error creating folder to upload images: ' + pathImages });
        }
    }

});

// @desc    Delte image 
// @route   DELETE /api/upload/images?url=url
// @access  Private
const deleteImage = asyncHandler(async (req, res, next) => {

    console.log('start delteImage');
    try {

        const name = req.query.url.split('uploads')[1];
        const directory = path.resolve() + '/uploads';

        fs.unlinkSync(directory + name);

        res.status(200).json({ message: 'Image deleted', value: directory + name });

    } catch (error) {

        res.status(200).json({message: `Error deleting image or no image to delte: ${req.params.name}`});
        //throw new Error(`Error deleting file: ${req.params.name}`);
    
    }

});

module.exports = { uploadVideo, checkAndCreateVideoFolder, uploadImage1000x250, checkAndCreateImage1000x250Folder, deleteImage };