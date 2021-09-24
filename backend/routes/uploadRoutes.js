const express = require('express');
const { checkAndCreateImage1000x250Folder, deleteImage, uploadImage1000x250, checkAndCreateVideoFolder, uploadVideo } = require('../controllers/uploadControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/images/1000x250', protect, checkAndCreateImage1000x250Folder, uploadImage1000x250.single('file'), (req, res) => {
    res.status(200).json({path:`/${req.file.path}`});
});
router.delete('/images', protect, deleteImage);

router.post('/videos', protect, checkAndCreateVideoFolder, uploadVideo.single('video'), (req, res) => {
    res.status(200).json({path: `${req.file.path}`});
});
router.delete('/videos', protect, deleteImage);

module.exports = router;