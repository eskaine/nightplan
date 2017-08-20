'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
   twitter: {
       id: String,
       displayName: String,
       userName: String
   },
   going: Schema.Types.Mixed
});

module.exports = mongoose.model('User', User);
