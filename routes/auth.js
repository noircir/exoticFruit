var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");


//=============================================
//  LANDING PAGE
//=============================================

router.get("/", function(req, res){
	res.render("landing");
});


//=============================================
//=============================================
//  	AUTH ROUTES
//=============================================
//=============================================

// show signup form
router.get("/signup", function(req, res) {
    res.render("signup");
});

// handling user sign-up
router.post("/signup", function(req, res) {
    // register a method of Passport.
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if (err) {
            // console.log(err);
            // another way of showing flash message.
            return res.render("signup", {error: err.message});
        } 
        // after registering new user, immediately 
        // authenticate with the same credentials (req.body)
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
            res.redirect("/index");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// handling login logic
// apparently takes username and password from the form (req.body.user)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login",
    failureFlash: true
}), function(req, res) {});


// handling logout logic
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/index");
});

module.exports = router;