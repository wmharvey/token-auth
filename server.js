var mongoose = require('mongoose');
var server = require('./app')();

mongoose.connect('mongodb://localhost/passport_demo');
server.listen(8080);
