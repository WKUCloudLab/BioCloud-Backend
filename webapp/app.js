var express = require('express');
const app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io')(http);
var parseurl = require('parseurl');
var stringify = require('json-stringify-safe');
var session = require('express-session');
var Store = require('express-session').Store;

var login = require('./routes/login');
var register = require('./routes/register');
var homepage = require('./routes/homepage');
var selectscript = require('./routes/selectscript');
var createjob = require('./routes/createjob');
var job = require('./routes/job');
var viewpage = require('./routes/viewpage');

var flash = require('connect-flash');
var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connection = require('./lib/dbconn');
var BetterMemoryStore = require('session-memory-store')(session);

var salt = 'svkedd380ecxhxydgqgcd3dnh72pfjv3wipztcs8';
//process.umask(0);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
  name: 'JSESSION',
	secret: 'keyboard cat',
  store:  store,
	resave: true,
	saveUninitialized: true,
	cookie: { secure: false }
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// list of pages
app.use('/', login);
app.use('/register', register);
app.use('/homepage', homepage);
app.use('/selectscript', selectscript);
app.use('/createjob', createjob);
app.use('/job', job);
app.use('/viewpage', viewpage);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

// Checks inputed username and password to see if valid
passport.use('localLogin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //passback entire req to call back
} , function (req, username, password, done){
      // Check if either field was left empty
      if(!username || !password ) { 
        return done(null, false, req.flash('message','All fields are required.')); 
      }
      // Query to find all matches to given username
      connection.query("select * from users where id = ?", [username], function(err, rows){
        // return if an error occured
        if (err) return done(req.flash('message',err));
        // checks to see if any usernames match the given username
        if(!rows.length){ 
          return done(null, false, req.flash('message','Invalid username or password.')); 
        }
        var saltedPassword = salt+''+password;
        var encPassword = crypto.createHash('sha1').update(saltedPassword).digest('hex');
        var dbPassword  = rows[0].password;
        // Check if given password matches stored password
        if(!(dbPassword == encPassword)){
          return done(null, false, req.flash('message','Invalid username or password.'));
        }
        // Set the Id in the session
        req.session.userId = rows[0].id;

        // Return user information
        return done(null, rows[0]);
      });
    }
));

// Checks inputed username and password to see if valid
passport.use('localRegister', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passwordConfirmField: 'passwordConfirm',
  passReqToCallback: true //passback entire req to call back
} , function (req, username, password, done){
    console.log(JSON.stringify(req.body));
    var passwordConfirm = req.body['passwordConfirm'];

    if(password == passwordConfirm) {
      connection.query("select * from users where id = ?", [username], function(err, rows){
        // return if an error occured
        if (err) return done(req.flash('message',err));

        // checks to see if any usernames match the given username
        if(rows.length){ 
          return done(null, false, req.flash('message','Username already in use.')); 
        }

        // Salt and prep the user's password
        var saltedPassword = salt+''+password;
        var encPassword = crypto.createHash('sha1').update(saltedPassword).digest('hex');
        
        var sql = "INSERT INTO users (id, password)" +
				" VALUES ('"+username+"', '"+encPassword+"')";
        connection.query(sql, function (err, result) {
          if (err) return done(req.flash('message',err));
          console.log("Successful!");
        });

        var userPath = "/data/users/"+username;
        console.log(userPath);
        ensureExists(userPath, function(err) {
          if (err) { // handle folder creation error
            console.log(err);
          } else { // we're all good
            console.log("We did it!");
          }
        });
        return done(null);
      });
    } else {
      return done(null, false, req.flash('message','Passwords do not match.'));
    }
  }
));

function ensureExists(path, mask, cb) {
  if (typeof mask == 'function') { // allow the mask parameter to be optional
     cb = mask;
     mask = 0777;
  }
  fs.mkdir(path, mask, function(err) {
      if (err) {
          if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
          else cb(err); // something else went wrong
      } else cb(null); // successfully created folder
  });
}

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  //console.log("User Id:");
  //console.log(id);
  var sql = "SELECT * FROM users WHERE id = '" + id + "'";
  //console.log(sql);
  connection.query(sql, function (err, rows){
      if (err) console.log(err);
      //console.log("Rows:");
      //console.log(rows);
      done(err, rows[0]);
  });
});

module.exports = app;

app.listen(8080, () => console.log('Example app listening on port 8080!'))
