const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const memoryModel = require("./memoryModel");

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    data: String,
    contentType: String
  },
  handle: {
    type: String,
    required: true
  },
  emailIsVerified: {
    type: Boolean,
    required: true
  }
})

// static signup method
userSchema.statics.signup = async function(email, password) {

  // validation
  if (!email || !password) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  let uniqueHandle = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] })
  let handleExists = await this.findOne({ handle: uniqueHandle });

  while (handleExists) {
    uniqueHandle = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] })
    handleExists = await this.findOne({ handle: uniqueHandle });
  }

  const user = await this.create({ 
    email, 
    password: hash, 
    profileImage: { data: "", contentType: ""},
    handle: uniqueHandle,
    emailIsVerified: false
  })

  return user
}

// static login method
userSchema.statics.login = async function(email, password) {

  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  if (!user.emailIsVerified) {
    throw Error('You must verify your email before logging in');
  }

  return user
}

userSchema.pre("remove", async function(next) {
  memoryModel.deleteMany({ user_id: this._id })
    .then(() => {
      console.log("Memories associated with user deleted.");
      next();
    })
    .catch((error) => {
      console.log("Error deleting memories associted with user");
      next(error);
    })
})

module.exports = mongoose.model('User', userSchema);