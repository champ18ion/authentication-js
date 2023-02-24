const User = require('../models/user');
const bcrypt = require('bcrypt');


// render the Login page
module.exports.signIn = function(req,res){
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
      }
    return res.render('log-in',{title:'Log-IN | Authentication Cell'})
}

// render the Sign-up page
module.exports.signUp = function(req,res){
    if (req.isAuthenticated()) {
      return res.redirect("/home");
    }
     return res.render('sign-up',{title:'Sign-UP | Authentication Cell'})
}
// render home [page]
module.exports.renderHome = function (req, res) {
  return res.render('home', { title: 'Home Page', user: req.user });
}

// render the profile page
module.exports.profile = function (req, res) {
    return res.render("profile", {
      title: "User Profile",
      profile_user: req.user,
    });
  };

// creating a new user
module.exports.create = async function(req,res){
    try {
        const{name,email,password,confirm_password}=req.body;
        console.log(req.body)
         // if password doesn't match
        if (password != confirm_password) {
          req.flash('error','passwords do not match')
        return res.redirect("back");
        }
  
        // check if user exist already
        User.findOne({email}, async (err,user)=>{
            if(err){
                console.log("error in signin up",err);
                return;
            }
            const plaintextPassword = password;
            const saltRounds = 10;

            const hash = await bcrypt.hash(plaintextPassword, saltRounds);
            if(!user){
                await User.create({
                    name,
                    email,
                    password:hash
                },(err,user)=>{
                    if(err){
                        console.log('error in creating user')
                    }
                    return res.redirect('/log-in')
                })
            }else{
                console.log("error", "Email already registed!");
                 return res.redirect("back");
            }
        })
       
    } catch (error) {
        console.log(error);
    }

};

// update user Details
module.exports.updateUser = async function (req, res) {
  try{
        
    const user = await User.findOne({email:req.body.email});
    //match current password
    const passwordMatches = await bcrypt.compare(req.body.password, user.password);
    if(!passwordMatches){
      req.flash('error','current password entered is invalid, try again:')
        console.log('current password entered is invalid, try again:');
        return res.redirect('back');
    }

    const plaintextPassword = req.body.new_password;
    const saltRounds = 10;
    const hash = await bcrypt.hash(plaintextPassword, saltRounds);
    user.password = hash;
    await user.save();
    console.log('Password updated');
    req.flash('success','password updated successfully')
    return res.redirect('/sign-out');

}
catch(e){
    console.log('Error in reseting password: ',e);
}

}

// sign in and create a session for the user
module.exports.createSession = (req, res) => {
    req.flash('success',"signed in");
    return res.redirect("/");
  };

// clears the cookie
module.exports.destroySession = (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success','logged out')
      return res.redirect("/");
    });
  };