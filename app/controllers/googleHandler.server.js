var request = require('request');
var Location = require('../models/locations');
var googleMapUrl = 'https://maps.googleapis.com/maps/api/';
var geocode = 'geocode/json';
var nearbysearch = 'place/nearbysearch/json';

function googleMaps() {

    //add location to database
    function addLocation(location, dataset) {
        Location.findOne({ '_id': location }, { '_id': 1 })
            .exec(function(err, result) {
                if (err) throw err;

                if (!result) {

                    var newLocation = new Location();
                    newLocation._id = location;

                    let bars = {};

                    dataset.forEach(function(data) {
                        bars[data.id] = 0;
                    });

                    newLocation.count = bars;
                    newLocation.save(function(err) {
                        if (err) throw err;
                    });
                }
            });

    }


    // get location coordinates
    function getCoordinates(location) {

        return new Promise(function(resolve, reject) {

            //prepare url
            let requestUrl = googleMapUrl + geocode +
                '?address=' + location +
                '&key=' + process.env.GOOGLE_KEY;

            request(requestUrl, function(err, response, body) {
                if (err) {
                    reject(err);
                }
                body = JSON.parse(body);
                resolve(body.results[0]);
            });
        });

    }


    this.search = function(req, res) {
        let coordinates = getCoordinates(req.query.location);
        coordinates.then((result) => {

                //save location id
                req.session.location_id = result.place_id;

                //prepare url
                let requestUrl = googleMapUrl + nearbysearch +
                    '?location=' + result.geometry.location.lat + ',' + result.geometry.location.lng +
                    '&radius=' + 500 +
                    '&types=' + 'bar' +
                    '&key=' + process.env.GOOGLE_KEY;

                request(requestUrl, function(err, response, body) {
                    if (err) throw err;

                    body = JSON.parse(body);
                    addLocation(result.place_id, body.results);
                    res.send(body.results);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

}


module.exports = googleMaps;
