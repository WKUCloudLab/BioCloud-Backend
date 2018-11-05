var createError = require('http-errors');
var express = require('express');
var session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jobsRouter = require('./routes/jobs');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var uploadRouter = require('./routes/upload');

var loginController = require('../controllers/loginController');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// res.set('Content-Type', 'application/json');
// res.set('Access-Control-Allow-Origin', '192.168.1.100');
// res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
app.use(cors());
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static("public"));
app.use(session({ secret: "poop" }));
app.use(passport.initialize());
app.use(passport.session());

// app.use(bodyParser.urlencoded({ extended: false }));

passport.use(new LocalStrategy(
  async (username, password, done)=>{
    // User.findOne({ username: username }, function (err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });
      //might have to dehash the password here
       let user = await loginController.login(username, password);
       console.log(user)
       if(user.status == "success"){
         done(null, user.message);
       }

  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(async function(id, done) {
  let user = await loginController.login(username, password);
  if(user.status == "success"){
    done(null, user.message);
  }
});

app.use('/', indexRouter);
app.use('/createJob', jobsRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


app.listen(3001, () => console.log('Example app listening on port 3001!'))
