const express = require('express')
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/userController')


router.get('/',userController.signUp)

router.get('/log-in',userController.signIn)

//  router for checking up the profile
router.get("/profile", passport.checkAuthentication, userController.profile);

//updating user profile
router.post("/update", passport.checkAuthentication, userController.updateUser);

router.post('/create',userController.create)

// use passport as middleware to authenticate
router.post(
    "/create-session",
    passport.authenticate("local", { failureRedirect: "/log-in" }),
    userController.createSession
  );

  router.get('/home',userController.renderHome);

// route for logout button
router.get("/sign-out", userController.destroySession);

// Define routes for Google authentication
router.get('/auth/google', passport.authenticate('google',{scope:['profile','email']}));

//callback from google
router.get('/auth/google/callback', passport.authenticate('google',{failureRedirect:'/'}), userController.createSession);

module.exports = router;