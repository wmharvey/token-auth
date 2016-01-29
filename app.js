var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();
var publicPath = path.join(__dirname, 'public');

module.exports = function (collection) {
  var mainRoutes = require('./routes/mainRoutes')(collection);
  var secret = require('./routes/secret');
  app.set('views', path.join(__dirname,'public', 'views'));
  app.set('view engine', 'jade');

  app.use(express.static(publicPath));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({
    secret: 'Some secret string',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  var User = require('./models/user')(collection);
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  function ensureAuthenticated(req, res, next) {
    if ( req.isAuthenticated() ) { return next(); }
    res.redirect('/');
  }

  app.use('/', mainRoutes);
  app.use('/secret', ensureAuthenticated, secret);

  app.use(function(req, res) {
    res.send('No path found');
  });

  return app;
};
