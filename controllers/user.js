const Review = require("../models/review.js");
const Listing = require("../models/listings.js"); 
const User = require("../models/user");

module.exports.rendersignupform=(req, res) => {
    res.render("users/signup");
}

module.exports.signup =async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
   const registeredUser= await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
      if(err){
        return next (err);
      }
      req.flash("success", "Welcome to WanderLust!");
    res.redirect("/listings");
    })

  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
}

module.exports.renderloginform=(req, res) => {
  res.render("users/login");
}

module.exports.login= (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

  module.exports.logout=(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next (err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  })
}
