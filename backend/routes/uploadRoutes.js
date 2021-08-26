const path = require('path');
const express = require('express');
const multer = require('multer');
const { checkAndCreateImage1000x250Folder, deleteImage } = require('../controllers/uploadControllers');
const { protect } = require('../middleware/authMiddleware');
//const { protect } = require('../middleware/authMiddleware');
//const { checkAndCreatePxxFolder, checkAndCreateConsultantsFolder } = require('../controllers/uploadControllers');


const router = express.Router();

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
    const filetypes = /png|jpg|jpeg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //const mimetype = filetypes.test(file.mimetype);

    if(extname){
        return cb(null, true);
    } else {
        cb('Image file only !')
    }
}

const uploadImage1000x250 = multer({
    storage: storageImages1000x250,
    fileFilter: function(req, file, cb) {
        checkFileTypeImage(file, cb);
    }
});

router.post('/images/1000x250', protect, checkAndCreateImage1000x250Folder, uploadImage1000x250.single('file'), (req, res) => {
    res.status(200).json({path:`/${req.file.path}`});
});
router.delete('/images', protect, deleteImage);

module.exports = router;