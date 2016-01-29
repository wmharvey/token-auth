var express = require('express');
var passport = require('passport');
var router = express.Router();
var User;

function registerUser (req, res, next) {
  User.register(new User({username: req.body.username}), req.body.password, function (err) {
    if (err) { return res.render('register', {title: 'Register', error: 'Username already taken'}); }
    next();
  });
}

module.exports = function (collection) {
  User = require('../models/user')(collection);

  router.get('/', function(req, res, next) {
    res.render('home', {title: 'Home', user: req.user});
  });

  router.get('/login', function(req, res) {
    res.render('login', {title: 'Login', user: req.user, error: req.query.error});
  });

  router.get('/register', function(req, res) {
    res.render('register', {title: 'Register', user: req.user});
  });

  router.post('/register', registerUser, passport.authenticate('local', {
    successRedirect: '/secret'
  }));

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login?error=badlogin'
  }));

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
};
