var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  isAdmin: Boolean
});
User.plugin(passportLocalMongoose);

module.exports = function (collection) {
  collection = collection || 'User';
  return mongoose.model(collection, User);
};
