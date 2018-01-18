
var express 	= require("express"),
    router 		= express.Router(),
    Fruit 		= require("../models/fruit"),
    Comment 	= require("../models/comment"),
    middleware	= require("../middleware"),  // if no file specified, index.js is taken as default
    geocoder = require('geocoder');

//=============================================
//  INDEX PAGE
//=============================================

router.get("/", function(req, res) {
	Fruit.find({}, function(err, fruits) {
		if (err) {
			console.log(err);
		} else {
			res.render("fruits/index", {fruits: fruits});
		}
	})
});

//=============================================
//  NEW ROUTE 1
//=============================================

router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("fruits/new");
});

//=============================================
//  NEW ROUTE 2
//=============================================

router.post("/", middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	// var location = req.body.location;
	var author = {
		id: req.user._id,
		username: req.user.username
	};

	geocoder.geocode(req.body.location, function (err, data) {
		// this is just for my local testing
		//----------------------------------
		console.log("req.body.location is " + req.body.location);
		console.log("data.results[0].geometry.location.lat is " + data.results[0].geometry.location.lat);
		console.log("data.results[0].geometry.location.lng is " + data.results[0].geometry.location.lng);

	    var lat = data.results[0].geometry.location.lat;
	    var lng = data.results[0].geometry.location.lng;
	    var location = data.results[0].formatted_address;

		Fruit.create({name: name, image: image, price: price, description: desc, author: author, location: location, lat: lat, lng: lng}, function(err, fruit) {
			if (err) {
				req.flash("error", "Could not create fruit. Something went wrong.")
				console.log(err);
			} else {
				req.flash("success", "Fruit successfully created.")
				res.redirect("/index");
			}
		});
	});
});

//=============================================
//  SHOW ROUTE
//=============================================

router.get("/:id", function(req, res) {
	Fruit.findById(req.params.id).populate("comments").exec(function(err, foundFruit) {
		if (err || !foundFruit) {
			req.flash("error", "Could not find fruit to show.");
			res.redirect("/index");
		} else {
			res.render("fruits/show", {fruit: foundFruit});
		}
	});
});

//=============================================
//  EDIT ROUTE 1
//=============================================

router.get("/:id/edit", middleware.checkFruitOwnership, function(req, res) {
	Fruit.findById(req.params.id, function(err, foundFruit) {
			res.render("fruits/edit", {fruit: foundFruit});
	});
});

//=============================================
//  EDIT ROUTE 2
//=============================================

router.put("/:id", middleware.checkFruitOwnership, function(req, res) {
	var name = req.body.fruit.name;
	var image = req.body.fruit.image;
	var price = req.body.fruit.price;
	var desc = req.body.fruit.description;
	// var location = req.body.fruit.location;
	console.log("req.body.location before geocoder.geocode call is " +req.body.location);

	geocoder.geocode(req.body.location, function (err, data) {
		// this is just for my local testing
		//----------------------------------
		console.log("req.body.location inside geocoder.geocode is " + req.body.location);
		console.log("data.results[0].geometry.location.lat is " + data.results[0].geometry.location.lat);
		console.log("data.results[0].geometry.location.lng is " + data.results[0].geometry.location.lng);

	    var lat = data.results[0].geometry.location.lat;
	    var lng = data.results[0].geometry.location.lng;
	    var location = data.results[0].formatted_address;
	    var newData = {name: name, image: image, description: desc, price: price, location: location, lat: lat, lng: lng};
		
		Fruit.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedFruit) {
			if (err) {
				req.flash("error", err.message);
				res.redirect("/index");
			} else {
				req.flash("success","Successfully updated!");
				res.redirect("/index/" + req.params.id);
			}
		});
	});
});

//=============================================
//  DELETE ROUTE 
//=============================================

router.delete("/:id", middleware.checkFruitOwnership, function(req,res) {

	Fruit.findById(req.params.id, function(err, foundFruit) {
		if (err || ! foundFruit) {
			req.flash("error", "Fruit not found.");
			res.redirect("/index");
		} else { 
			console.log(foundFruit.comments);
			// remove all associated comments first.
			Comment.remove({ _id: { $in: foundFruit.comments } }, function (err) {
				if (err) {
					req.flash("error", "Could not remove comments.");
					res.redirect("/index");
				} else {
					foundFruit.remove(function(err) {
				        if (err) {
				        	req.flash("error", "Could not remove fruit.")
				            res.redirect("/index");
				        } else {
				        	req.flash("success", "Removal successful.")
				            res.redirect("/index");
				        }
				    });
				}
			});
		}
	});	
});

module.exports = router;