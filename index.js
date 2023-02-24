const express = require('express') 
const bodyParser = require('body-parser')


const app = express();
const port = process.env.PORT || 8000;
const db = require('./config/mongoose')

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// used for sessions
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local");
const GoogleStrategy = require('./config/passport-google');
const MongoStore = require("connect-mongo");
const flash = require('connect-flash')
const flashWare = require('./config/middleware')

// set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");


// mongo-store is used to store session cookies in database
app.use(
  session({
    name: "Authentication-cell",
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://champ18ion:1V1q1XMHGIyNLfNL@cluster0.jxaps7z.mongodb.net/authenticate",
      autoRemove: "disabled",
    }),
      function(err) {
      console.log(err || "connect-mongodb setup ok");
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());

// sets the authenticated user in the response
app.use(passport.setAuthenticatedUser);

app.use(flash())
app.use(flashWare.setFlash)

// using express routers
app.use(require("./routes"));

//  listening to the port 5000;
app.listen(port, (err) => {
    if (err) {
      console.log("error in starting the server", err);
      return;
    }
    console.log("server listening on port 5000");
  });