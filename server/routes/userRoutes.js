const express = require('express')
const multer = require('multer');
const requireAuth = require("../middleware/requireAuth");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// controller functions
const { loginUser, signupUser, updateProfilePicture } = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

router.post('/profile/image', upload.single('image'), requireAuth, updateProfilePicture)

module.exports = router;