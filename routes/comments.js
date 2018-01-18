var express = require("express"),
    router 	= express.Router({mergeParams: true}),
    Fruit 	= require("../models/fruit"),
    Comment = require("../models/comment"),
    middleware	= require("../middleware");

//=======================
// NEW COMMENT 1 (GET)
//=======================

router.get("/new", middleware.isLoggedIn, function(req, res) {
	Fruit.findById(req.params.id, function (err, fruit) {
		if (err || !fruit) {
			req.flash("error", "Fruit could not be found.");
			res.redirect("/index");
		} else {
			res.render("comments/new", {fruit: fruit});
		}
	});	
});

//=======================
// NEW COMMENT 2  (POST)
//=======================

router.post("/", middleware.isLoggedIn, function (req, res) {
	//look up fruit by ID
	// create new comment
	//connect new comment to fruit
	//redirect somewhere
	Fruit.findById(req.params.id, function(err, fruit) {
		if (err || !fruit) {
			req.flash("error", "Fruit could not be found.");
			res.redirect("/index");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash("error", "Could not create comment.");
				} else {
					// add username and id to the comment
					// The id and username are not 
					// coming from the form, but are extracted from req.user.
					// This is why we added comment.save(), to fill all fields of the comment
					// before pushing it into the fruit object.
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					fruit.comments.push(comment);
					fruit.save();
					// console.log(comment);
					req.flash("success", "Successfully created comment.");
					res.redirect("/index/" + fruit._id);
				}
			});
		}
	});
});

//=======================
// EDIT COMMENT 1 (GET)
//=======================

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {

	Fruit.findById(req.params.id, function(err, foundFruit) {
		if (err || !foundFruit) {
			req.flash("error", "Fruit could not be found.");
			res.redirect("/index");
		} else {
			Comment.findById(req.params.comment_id, function(err, comment) {
				if (err || !comment) {
					req.flash("error", "Comment could not be found.");
					res.redirect("/index");
				} else {
					// the req.params.id in this case is fruit's id 
					// because req.params has two strings: id and comment_id
					// (consists of all parameters passed in the address bar line)
					// console.log(req.params);
					res.render("comments/edit", {id: req.params.id, comment: comment});
				}
			});
		}
	});
});


//=======================
// EDIT COMMENT 2  (POST)
//=======================

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	// first arg = id of object to update, 2nd arg = value to update the object with
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/index/"+ req.params.id);
        }
    });
});


//=======================
// DELETE COMMENT
//=======================


router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
        	req.flash("success", "Comment deleted.");
            res.redirect("/index/" + req.params.id);
        }
    });
});


module.exports = router;