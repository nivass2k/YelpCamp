const User = require("../models/user");
module.exports.getUser = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      username: req.body.username,
    });
    const registeredUser = await User.register(user, req.body.password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
    });
    req.flash("success", "Welcome to Yelp Camp!");
    res.redirect("/campgrounds");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.getLogin = (req, res) => {
  res.render("users/login");
};

module.exports.authUser = (req, res) => {
  req.flash("success", "welcome back");
  const returnPath = req.session.returnTo;
  delete req.session.returnTo;
  res.redirect(returnPath || "/campgrounds");
};

module.exports.logOut=(req,res)=>{
    req.logOut();
    req.flash('success','You have been logged out!');
    res.redirect('/campgrounds')
}
