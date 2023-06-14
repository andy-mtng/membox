const { randomBytes } = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const Token = require("../models/tokenModel");


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

module.exports = sendVerificationEmail;