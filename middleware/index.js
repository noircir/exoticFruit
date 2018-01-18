
var Fruit = require("../models/fruit");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkFruitOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {  //isAuthenticated() is a method of passport
        Fruit.findById(req.params.id, function(err, foundFruit) {
            if (err || !foundFruit) {
                req.flash("error", "Fruit not found.");
                return res.redirect("/index");
            } else {
                // Is the logged person the same as the author of the campground?
                // since one id is Object, and the other is String, 
                // mongoose can compare them with .equals() method
                if (foundFruit.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    return res.redirect("/index");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {  //isAuthenticated() is a method of passport
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Comment not found.");
                res.redirect("/index/" + req.params.id);
            } else {
                // Is the logged person the same as the author of the campground?
                // since one id is Object, and the other is String, mongoose can compare with "equals"
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    return res.redirect("/index");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");  // even though it is before "redirect", the message appear on the next page.
    res.redirect("/login");
}

module.exports = middlewareObj;

