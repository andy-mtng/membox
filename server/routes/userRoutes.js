const express = require('express')
const multer = require('multer');

const upload = multer({ dest: "upload/" });

// controller functions
const { loginUser, signupUser, updateProfilePicture } = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

router.post('/profile/image', upload.single('image'), updateProfilePicture)

module.exports = router;