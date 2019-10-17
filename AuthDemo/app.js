//require packages
var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    User                  = require("./models/user");

//connect mongoose with database
mongoose.connect("mongodb://localhost/auth_app_demo", {useNewUrlParser: true});

//use express
var app = express();
//set view engine
app.set("view engine", 'ejs');
//use body parser
app.use(bodyParser.urlencoded({extended: true}));


//express-session
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

//to initialize and use passport
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
//for serializing and deserializing
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===============
//    Routes
//===============

//home route
app.get("/", function(req, res){
    res.render("home");
});

//secret route
app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

//Auth route

//show sign up form
app.get("/register",function(req, res){
    res.render("register");
} );

//handling user sign up
app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

//LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
    res.render("login");
});

//login logic
//middleware - some code that runs before the handler
app.post("/login",passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
});

//Logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

//isLoggedIn function
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// Start Server
app.listen(3000, function(){
    console.log("AuthDemo server started");
});