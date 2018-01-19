var express 		= require("express"),
	app 			= express(),
    mongoose		= require("mongoose"),
	bodyParser 		= require("body-parser"),
    passport    	= require("passport"),
    expressSession  = require("express-session"),
    localStrategy   = require("passport-local"),
	methodOverride 	= require("method-override"),
	flash 			= require("connect-flash"),
    geocoder        = require("geocoder"),
	seedDB 			= require("./seeds"),
	Fruit 			= require("./models/fruit"),
	Comment 		= require("./models/comment"),
	User 			= require("./models/user");

var IP = 'localhost',
	port = 8020;

var fruitRoutes 	= require("./routes/fruits"),
	commentRoutes 	= require("./routes/comments"),
	authRoutes 		= require("./routes/auth");


mongoose.connect('mongodb://localhost/fruit', { useMongoClient: true });
mongoose.Promise = global.Promise;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
// __dirname is where the app.js is
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(flash());

//seedDB();


//=============================================
//  PASSPORT CONFIGURATION
//=============================================

// to salt for the duration of the session
app.use(expressSession({
    secret: "Whitenose and Blacknose are sisters",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); 

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// to provide a user to all places that require a pass-through user
// (like the header partial)
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    // No colors are defined here. These are variabes to which any message can be attached.
    // We define two of them because we've chosen to have two colors. (Bootstrap 'alert' styling in header.ejs)
    // We could define another one for warning, etc.
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/index",fruitRoutes);
app.use("/index/:id/comments", commentRoutes);
app.use(authRoutes);


//The fall-through route (404 Not Found)
app.use(function(req, res){
    res.sendStatus(404); 
    // res.send(404).send({ error: "boo:((" });
});


app.listen(port, IP, function() {
	console.log("Magic happens on port " + port + " ...");
});

