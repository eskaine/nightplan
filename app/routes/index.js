'use strict';

var path = process.cwd();
var GoingHandler = require(path + '/app/controllers/goingHandler.server.js');
var GoogleHandler = require(path + '/app/controllers/googleHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/auth/twitter');
		}
	}

	var goingHandler = new GoingHandler();
	var googleHandler = new GoogleHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/googlef5a5c3e54c20e807.html')
		.get(function (req, res) {
			res.sendFile(path + '/public/googlef5a5c3e54c20e807.html');
		});
		
	app.route('/google/search')
		.post(googleHandler.search);

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.twitter);
		});

	app.route('/auth')
		.get(function(req, res){
			res.json(req.isAuthenticated());	
		});

	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(goingHandler.getGoing)
		.post(isLoggedIn, goingHandler.updateClicks);
		
};
