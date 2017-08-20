'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Location = new Schema({
    _id: String,
    count: Schema.Types.Mixed
});

module.exports = mongoose.model('Location', Location);