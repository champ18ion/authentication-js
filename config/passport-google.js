const passport = require('passport')
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto')
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID:"498186167331-igqot7938ftj98ifofmn7ot1r7v12nla.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"/auth/google/callback"
   },
   function(accessToken,refreshToken,profile,done){
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){console.log(err); return}

            console.log(profile);

            if(user){
                return done(null,user);
            }else{
                User.create({
                    firstname:profile.displayName,
                    lastname:' ',
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){console.log(err); return}

                    return done(null,user);
                })
            }
        })
   }
))

module.exports = passport;