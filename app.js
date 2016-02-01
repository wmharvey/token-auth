var app = require('express')();
var path = require('path');
var publicPath = path.join(__dirname, 'public');
var Authenticat = require('authenticat');
var secret = require('./routes/secret');

module.exports = function (connection) {
  var authenticat = new Authenticat(connection);
  app.set('views', path.join(__dirname,'public', 'views'));
  app.set('view engine', 'jade');

  app.use('/api', authenticat.router);
  app.use('/secret', authenticat.tokenAuth, secret);

  app.use(function(req, res) {
    res.send('No path found');
  });

  return app;
};
