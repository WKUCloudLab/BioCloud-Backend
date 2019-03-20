var createError = require("http-errors");
var express = require("express");
// var session = require("express-session");
var path = require("path");
// var cookieParser = require('cookie-parser');
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var passport = require("passport");
// var LocalStrategy = require('passport-local').Strategy;
// var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
// var JwtStrategy = require('passport-jwt').Strategy,
// ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require("jsonwebtoken");
// const expressJwt = require('express-jwt');
const {
  loadSpec,
  pushToReady,
  pushToInProcess,
  checkCompletion
} = require("../controllers/jobsScheduler");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var jobsRouter = require("./routes/jobs");
var filesRouter = require("./routes/files");
var registerRouter = require("./routes/register");
var loginRouter = require("./routes/login");
var uploadRouter = require("./routes/upload");
var logoutRouter = require("./routes/logout");

//these are temp going to delete
var homepageRouter = require("./routes/homepage");
var anotherpageRouter = require("./routes/anotherpage");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
// app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "bio-cloud")));

// app.use(expressJwt({secret: 'BioCloud'}).unless({path: ['/login', '/register']}}));
// app.use(session({ secret: "poop", cookie:{} }));
// app.use(passport.initialize());
// app.use(passport.session());

// app.use(bodyParser.urlencoded({ extended: false }));

// passport.use(new LocalStrategy(
//   async (username, password, done)=>{
//     // User.findOne({ username: username }, function (err, user) {
//     //   if (err) { return done(err); }
//     //   if (!user) {
//     //     return done(null, false, { message: 'Incorrect username.' });
//     //   }
//     //   if (!user.validPassword(password)) {
//     //     return done(null, false, { message: 'Incorrect password.' });
//     //   }
//     //   return done(null, user);
//     // });
//       //might have to dehash the password here
//       console.log(username, password);
//        let user = await loginController.login(username, password);
//       //  console.log(user)
//        if(user.status == true){
//          done(null, user.message);
//        }
//        else{
//          return done(null, false, {message: user.message})
//        }

//   }
// ));

// var opts = {};

// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'secret';
// passport.use(new JwtStrategy(opts, function(jwt_payload, done){
//   let user = await loginController.authenticateToken(jwt_payload.sub);
//    console.log(user);
//     if(user.status == true){
//       done(null, user.message);
//     }
//     else{
//       return done(null, false, {message: user.message})
//     }
// }))

// passport.serializeUser(function(user, done) {
//   console.log("serialize user", user);
//   done(null, user.username);
// });

// passport.deserializeUser(async function(username, done) {
//   console.log("deserialize user ", username)
//   let user = await loginController.deserialize(username);
//   console.log('deserialize', user);
//   if(user.status){
//     done(null, user.message);
//   }
// });

app.use("/", indexRouter);
app.use("/jobs", jobsRouter);
app.use("/users", usersRouter);
app.use("/upload", uploadRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/files", filesRouter);

app.use("/homepage", homepageRouter);
app.use("/anotherpage", anotherpageRouter);

// Catch all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'bio-cloud/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

app.listen(3001, () => console.log("Example app listening on port 3001!"));

// Job scheduling
loadSpec();
setInterval(() => {
  pushToReady();
}, 15000);
setInterval(() => {
  pushToInProcess();
}, 15000);
setInterval(() => {
  checkCompletion();
}, 15000);
