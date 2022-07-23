//if(process.env.NODE_ENV !== "production") {
//    require('dotenv').config();
//}
require('dotenv').config();
const express = require('express');     // Load express framework
const app = express();                  // Run express Server
const path = require('path');           // Load path for Navigating through the filesystem of the project
const mongoose = require('mongoose');   // Load MongoDB
const methodOveride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');

const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');

const usersRoutes = require('./routes/users');
const campgroundsRoutes = require('./routes/campgrounds'); 
const reviewsRoutes = require('./routes/reviews');

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const session = require('express-session');
const MongoStore = require('connect-mongo');



const dbUrl = process.env.DB_URL;
                // MONGO DATABASE CONNECTION // 
//////////////////////////////////////////////////////////////////////
mongoose.connect( dbUrl, {           //Connect MongoDB ATLAS        // 
    useNewUrlParser: true,                                          //
    useUnifiedTopology: true                                        //
});    // Connect to Database yelp-camp                             //    
                                                                    //        
const db = mongoose.connection;                                     //        
db.on("error", console.log.bind(console, "connection error"));      //    
db.once("open", () => {                                             //
    console.log("Database Connected");                              //
})                                                                  //
//////////////////////////////////////////////////////////////////////


app.engine('ejs', ejsMate);
app.set( 'view engine', 'ejs');                    // giving access to file with extension .ejs
app.set( 'views', path.join(__dirname, 'views')); // Gaining access inside the folder views

app.use(express.urlencoded({ extended: true }));
app.use(methodOveride('_method'));
app.use(express.static( path.join(__dirname,'public')));

app.use(mongoSanitize());

app.use(session({
    secret: 'thisismysecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create( {
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600 
     })
}));   // Opens the Session
app.use(flash());
//app.use(helmet({ contentSecurityPolicy: false }));


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net", 
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/florian-cloud/", 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());  
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(( req, res, next ) => {     
    console.log(req.query);
    res.locals.currentUser = req.user;          // Respond that there is a User Logged in.       
    res.locals.success = req.flash('success');  // Success Flash message
    res.locals.error = req.flash('error');      // Error Flash message
    next();
})

app.use('/', usersRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

app.get( '/', (req,res) => {
    res.render('home')
})

app.all('*', (req,res,next) => {
    next(new ExpressError('Page not found', 404))
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port :${port}`)
})
