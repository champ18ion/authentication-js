const passport = require("passport");
const User = require("../models/user");
const bcrypt = require('bcrypt')
const LocalStratergy = require("passport-local").Strategy;


// authentication using passport
passport.use(
 new LocalStratergy({usernameField: 'email',passwordField: 'password'},async (email, password, done) => {
  try {
    // Find the user with the given username
    const user = await User.findOne({ email });

    // If the user does not exist, return an error
    if (!user) {
      console.log('User not found');
      return done(null, false, { message: 'Incorrect email' });
    }

    
    //decrypt and check password from stored one
    const passwordMatches = await bcrypt.compare(password, user.password);


    //verify password
    if (!passwordMatches) {
      console.log('Invalid password');
      return done(null, false);
    }
    

    // Otherwise, return the user object
    return done(null, user);
    
  } catch (err) {
      console.log('Error while authenticating user');
    return done(err);
  }
    })
  );
  
  // serializing the user to choose which key should be kept in cookies
  passport.serializeUser(function (user, done) {
    return done(null, user.id);
  });
  
  // deserializing the user form the key in the cookies
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      if (err) {
        console.log("Error in finding user ---> Passport");
        return done(err);
      }
  
      return done(null, user);
    });
  });
  
  // check if user authenticated
  passport.checkAuthentication = function (req, res, next) {
    // if the user is signed in, then pass on the request to the next function
    if (req.isAuthenticated()) {
      return next();
    }
  
    // redirecting the user
    return res.redirect("/");
  };
  
  passport.setAuthenticatedUser = function (req, res, next) {
    // if user is authenticated that store the user in req
    if (req.isAuthenticated()) {
      res.locals.user = req.user;
    }
    next();
  };
  
  module.exports = passport;