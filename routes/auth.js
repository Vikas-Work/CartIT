const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
[
    body('email')
      .isEmail()
      .withMessage('Please enter a valid E-mail address'),
      
    body('password', 'Please enter a valid password')
      .isLength({min: 6})
      .isAlphanumeric()
      .trim()
],
authController.postLogin);

router.post(
  "/signup",
   [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid E-mail address.')
    .custom((value, { req }) => {
      
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject(
            'E-Mail already exists, please try again with different E-mail address.'
          );
        }
      });
    })
    .normalizeEmail(),

   body('password', 
   'Please enter a password with only numbers and text that should be atleast 6 characters long'
   )
   .isLength({min: 6})
   .isAlphanumeric()
   .trim(),
   body('confirmPassword')
   .trim()
   .custom((value, {req})=>{
       if(value !== req.body.password){
            throw new Error('Confirm password should match with password');
       }
       return true;
   })
 ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);


module.exports = router;