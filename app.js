if(process.env.NODE_ENV!=="production"){
  require("dotenv").config()
}

const { renderFile } = require("ejs");
const { urlencoded } = require("express");
const session=require('express-session');
const methodOverride = require("method-override");
const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./util/ExpressError");
const morgan = require("morgan");
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const mongoSanitize=require('express-mongo-sanitize');
const MongoStore = require("connect-mongo");
const campground = require("./models/campground");
const bodyParser = require('body-parser');


const campgrounds=require('./routes/campgrounds');
const reviews=require('./routes/reviews');
const users=require('./routes/users');

const User=require('./models/user');
const helmet = require("helmet");
// "mongodb://localhost:27017/yelp-camp"

mongoose.connect(process.env.DB_URL, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify:false,
});

const app = express();
const db = mongoose.connection;
mongoose.set("useFindAndModify", false);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(morgan("tiny"));
app.use(flash());
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, 'public')));

// const store = new MongoDBStore({
//   url:process.env.DB_URL,
//   secret:'popopop',
//   touchAfter:24*3600
// })

// store.on("error",function(e){
//   console.log("store error",e)
// })

app.use(session({
  name:'session',
  secret: process.env.SECRET||'thisisdummysecret',
  resave:false,
  saveUninitialized: false,
  cookie:{
    httpOnly:true,
    // secure:true,
    expires: Date.now()+1000*60*60*24,
    maxAge: 1000*60*60*24,
  },
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
}),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
const{policySites}=require('./util/allowedSites')
app.use(
  helmet.contentSecurityPolicy({
      directives: policySites
  })
);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.currentUser=req.user;
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
}); 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use('/',users);
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);

app.get("/", (req, res) => {
  res.render('home');
});

app.get("/search",async(req,res)=>{
  try{
    let result=await campground.aggregate([
      {"$search":{
        "autocomplete":{
          "query":`${req.query.term}`,
          "path":"title",
          "fuzzy":{
            "maxEdits": 2,
            "prefixLength": 3
          }        
        }}
      }
    ])
    res.send(result);
  }
  catch(e){
    res.status(500).send({message:e.message});
  }
})

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no! Something went wrong";
  res.status(statusCode).render("campgrounds/error", { err });
});

app.listen(process.env.PORT||3000, () => {
  console.log("Serving on port");
});