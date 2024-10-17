const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, updateProfile, uploadFile, readFile, deleteFile } = require('../controllers/studentController');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/upload', auth, uploadFile);
router.get('/file/:filename', auth, readFile);
router.delete('/file/:filename', auth, deleteFile);

module.exports = router;
