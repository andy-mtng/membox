const express = require('express')
const multer = require('multer');
const requireAuth = require("../middleware/requireAuth");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// controller functions
const { 
    loginUser, 
    signupUser, 
    updateProfilePicture, 
    getProfilePicture, 
    removeProfileImage, 
    updateHandle,
    getHandle,
    deleteAccount
} = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

router.delete("/", deleteAccount);

router.post('/profile/image', upload.single('image'), requireAuth, updateProfilePicture);

router.get('/profile/image', requireAuth, getProfilePicture);

router.delete('/profile/image', requireAuth, removeProfileImage);

router.put('/profile/handle', requireAuth, updateHandle);

router.get('/profile/handle', requireAuth, getHandle);

module.exports = router;