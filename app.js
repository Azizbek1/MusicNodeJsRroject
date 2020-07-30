const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParse = require("body-parser");

// Validatorlar 
const flash = require('connect-flash');
const expressValidator = require('express-validator')
const session = require('express-session')



const app = express();


// For navigation messages
// Express-messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Express_Sessions 
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))


// Express_Validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
      let namespace = param.split('.')
          , root = namespace.shift()
          , formParam = root

      while(namespace.length){
          formParam += '[' + namespace.shift() + ']';
      }
      return {
          param: formParam,
          msg: msg,
          value: value
      }
  }
}));



// BodyParser init
app.use(bodyParse.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParse.json());


// PUG STATIC FOLDERSI
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


// Static Folders 
app.use(express.static(path.join(__dirname, 'public' )))


mongoose.connect("mongodb://localhost:27017/NewDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log(`Mongo DB Local Ulandik`);
});


const musics = require('./routes/music');
const users = require('./routes/users');

app.use('/', musics)
app.use('/', users)



app.listen(3000, () => {
  console.log(`3000 portida server oyoqa turdi`);
});
