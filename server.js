var mongoose = require('mongoose');
var connection = mongoose.createConnection( 'mongodb://whitney:abc@ds059672.mongolab.com:59672/codefellows' );
var server = require('./app')( connection );
server.listen(8080);
