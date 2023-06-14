const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const memoryModel = require("../models/memoryModel");
const Token = require("../models/tokenModel");
const sgMail = require('@sendgrid/mail');
const { randomBytes } = require('crypto');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// Login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)

    // Create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// Signup a user
const signupUser = async (req, res) => {
  const {email, password} = req.body
  try {
    const user = await User.signup(email, password)
    sendVerificationEmail(user);
    res.status(200).json({message: "Email sent for verification."})

  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const sendVerificationEmail = (user) => {
    // Create a token
    const tokenData = randomBytes(32).toString('hex');
    const verificationLink = `http://localhost:5000/user/signup/confirmation?token=${tokenData}&email=${user.email}`;
    const signupToken = new Token({
      user_id: user._id,
      email: user.email,
      token: tokenData,
      token_type: "signup",
    })

    signupToken.save()
      .then(() => {
        console.log("Signup token creation sucessful.")
        const emailVerificationMessage = {
          to: user.email, 
          from: 'andynguyen9001@gmail.com', 
          subject: 'Verify Your Membox Account',
          text: `
            Welcome to Membox!
    
            Please click the link below to verify your account:
            ${verificationLink}
    
            If you did not request this verification, please ignore this email.
          `,
          html: `
            <h1>Welcome to Membox</h1>
            <p>Please click the link below to verify your account:</p>
            <a href=${verificationLink}>Verify Account</a>
            <p>If you did not request this verification, please ignore this email.</p>
          `,
        }
    
        sgMail
          .send(emailVerificationMessage)
          .then(() => {
            console.log('Email sent');
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log("Error creating signup token")
        console.log(error);
        throw new Error("Error creating signup token.")
      })
}

const verifyUserEmail = (req, res) => {
  const extractedToken = req.query.token;
  const email = req.query.email;
  Token.findOne({ email: email })
    .then((foundToken) => {
      if (foundToken.token === extractedToken && foundToken.token_type === "signup") {
        User.findByIdAndUpdate(foundToken.user_id, { emailIsVerified: true })
          .then(() => {
            console.log("Account verification successful.");
            Token.deleteOne({ _id: foundToken._id })
              .then(() => {
                console.log("Token deletion successful.");
              })
              .catch((error) => {
                console.log("Token deletion unsuccesful.");
              })
            res.redirect("http://localhost:3000/email-confirmation");
          })
          .catch((error) => {
            console.log(error);
            console.log("Verification failed");
            res.status(400).json({
              message: "",
              error: "Email verification failed.",
              validationErrors: "",
              type: "error"            
            })
          })
      }
      else {
        console.log("No match");
      }
    })
}

const getHandle = (req, res) => {
  const user = req.user;

  User.findOne({ _id: user._id })
    .then((foundUser) => {
      res.status(200).json({ 
        data: foundUser.handle,
        message: "Handle sucessfully fetched.",
        error: "",
        validationErrors: "",
        type: "success"    
      });
    })
    .catch((error) => {
      res.status(400).json({ 
        message: "",
        error: "An error occured updating your handle.",
        validationErrors: "",
        type: "error"
       })
    })
}

const updateHandle = async (req, res) => {
  const user = req.user;
  const newHandle = req.query.newHandle;

  const exists = await User.findOne({ handle: newHandle });

  if (exists) {
    res.status(409).json({
      message: "",
      error: "Handle already in use.",
      validationErrors: "",
      type: "error"
    });
    return;
  }

  User.findByIdAndUpdate(user._id, { handle: newHandle })
    .then(() => {
      console.log("New profile handle saved.");
      res.status(200).json({
        message: "Handle sucessfully updated.",
        error: "",
        validationErrors: "",
        type: "success"
      });
    })
    .catch((error) => {
      console.log("Error updating handle.", error);
      res.status(500).json({
          message: "",
          error: "An error occured updating your handle.",
          validationErrors: "",
          type: "error"
      });
    })

}

const updateProfilePicture = (req, res) => {
    const user = req.user;
    const image = {
      data: req.file.buffer.toString('base64'),
      contentType: req.file.mimetype
    };
  
    user.profileImage = image;

    user.save()
      .then((updatedUser) => {
        console.log("New profile picture saved.");
        res.status(200).json({
          message: "Profile picture sucessfully updated.",
          error: "",
          validationErrors: "",
          type: "success"
        });
      })
      .catch((error) => {
        console.log("Error saving profile picture to the DB.");
        res.status(500).json({
            message: "",
            error: "An error occured saving the profile picture.",
            validationErrors: "",
            type: "error"
        });
      })
}

const getProfilePicture = (req, res) => {
  const user = req.user;
  User.findOne({ _id: user._id })
    .then((foundUser) => {
      res.status(200).json({
        profileImage: foundUser.profileImage,
        message: "",
        error: "",
        validationErrors: "",
        type: "success"
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        profileImage: null,
        message: "",
        error: "Failed to fetch profile picture.",
        validationErrors: "",
        type: "error"
    });
    })
}

const removeProfileImage = (req, res) => {
  const user = req.user;
  user.profileImage = {
    data: "",
    contentType: ""
  };

  user.save()
    .then((updatedUser) => {
      console.log("Profile picture removed.");
      res.status(200).json({
        message: "Profile picture removed.",
        error: "",
        validationErrors: "",
        type: "success"
      });
    })
    .catch((error) => {
      console.log("Error saving removing profile picture from the DB.");
      res.status(500).json({
          message: "",
          error: "An error occured removing the profile picture.",
          validationErrors: "",
          type: "error"
      });
    })
}

const deleteAccount = (req, res) => {
  const user = req.user;
  User.findByIdAndDelete(user._id)
    .then(() => {
      memoryModel.deleteMany({user_id: user._id})
        .then(() => {
          console.log("Account and memories deleted.")
          res.status(200).json({
            message: "Account and memrories deleted.",
            error: "",
            validationErrors: "",
            type: "success"
          })
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            message: "",
            error: "An error occured deleting the memories associated with the account.",
            validationErrors: "",
            type: "error"
          });
        })
    })
    .catch((error) => {
      console.log(error);
      console.log("Error deleting user.");
      res.status(500).json({
        message: "",
        error: "An error occured deleting the account.",
        validationErrors: "",
        type: "error"
      });
    });
}

module.exports = { 
  signupUser, 
  loginUser,
  updateProfilePicture,
  getProfilePicture,
  removeProfileImage,
  updateHandle,
  getHandle,
  deleteAccount,
  verifyUserEmail
}