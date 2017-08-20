'use strict';

var Users = require('../models/users.js');
var Locations = require('../models/locations.js');

function ClickHandler() {

	function goingCount(type, req) {
		
		let param = {};
		let field = 'count.' + req.query.bar;

		if (type === 'increase')
			param[field] = 1;
		else if (type === 'decrease')
			param[field] = -1;

		param = { $inc: param };

		Locations.updateOne({ '_id': req.session.location_id }, param)
			.exec(function(err, result) {
				if (err) throw err;
			});
	}


	this.getGoing = function(req, res) {
		
		let param = {};
		let field = 'count.' + req.query.bar;
		param[field] = 1;
		
		Locations
			.findOne({ '_id': req.session.location_id }, param)
			.exec(function(err, result) {
				if (err) { throw err; }
				res.json(result.count[req.query.bar]);
			});
	};


	//update going
	this.updateClicks = function(req, res, next) {

		let param = {};
		let field = 'going.' + req.query.bar;
		param[field] = 1;

		Users.findOne({ 'twitter.id': req.user.twitter.id }, param)
			.exec(function(err, result) {
				if (err) throw err;

				if (!result.going || !result.going[req.query.bar]) {
					goingCount('increase', req);
					param[field] = true;
				}
				else if (result.going[req.query.bar]) {
					goingCount('decrease', req);
					param[field] = false;
				}

				Users.updateOne({ 'twitter.id': req.user.twitter.id }, param)
					.exec(function(err, result) {
						if (err) throw err;

						res.end();
					});
			});
	};

}


module.exports = ClickHandler;
