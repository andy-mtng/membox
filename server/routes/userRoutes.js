const express = require('express')
const multer = require('multer');
const requireAuth = require("../middleware/requireAuth");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const { 
    loginUser, 
    signupUser, 
    updateProfilePicture, 
    getProfilePicture, 
    removeProfileImage, 
    updateHandle,
    getHandle,
    deleteAccount,
    verifyUserEmail
} = require('../controllers/userController')

const router = express.Router()

router.post('/login', loginUser)

router.post('/signup', signupUser);

router.get('/signup/confirmation', verifyUserEmail);

router.delete("/", requireAuth, deleteAccount);

router.post('/profile/image', upload.single('image'), requireAuth, updateProfilePicture);

router.get('/profile/image', requireAuth, getProfilePicture);

router.delete('/profile/image', requireAuth, removeProfileImage);

router.put('/profile/handle', requireAuth, updateHandle);

router.get('/profile/handle', requireAuth, getHandle);

module.exports = router;