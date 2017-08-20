'use strict';

var searchButton = document.querySelector('.search-btn');
var input = document.querySelector('.input');
var resultsContainer = document.querySelector('.results');
var apiUrl = appUrl + '/api/:id/clicks';

(function() {

    function generateResults(results) {

        return new Promise(function(resolve, reject) {

            let mainDiv = document.createElement('div');
            mainDiv.setAttribute('class', 'results');

            for (var i = 0, r = results.length; i < r; i++) {
                
                let div = document.createElement('div');
                div.setAttribute('class', 'result-box');

                let imgBox = document.createElement('div');
                imgBox.setAttribute('class', 'img-box');

                let img = document.createElement('img');
                img.setAttribute('src', results[i].icon);

                let name = document.createElement('h4');
                let nameText = document.createTextNode(results[i].name);

                let num = 0;
                let goButton = document.createElement('button');
                goButton.setAttribute('value', results[i].id);
                goButton.setAttribute('class', 'go-btn');
                goButton.setAttribute('type', 'submit');
                goingRequest(goButton);

                let address = results[i].vicinity.split(',');
                let p = document.createElement('p');
                address.forEach(function(line) {
                    p.innerHTML += line + '<br />';
                });

                name.appendChild(nameText);
                imgBox.appendChild(img);
                div.appendChild(imgBox);
                div.appendChild(name);
                div.appendChild(p);
                div.appendChild(goButton);
                mainDiv.appendChild(div);

                if (i === results.length - 1) {
                    resolve(mainDiv);
                }
            }
        });

    }


    function searchRequest() {
        ajaxFunctions.ajaxRequest('POST', '/google/search' + '?location=' + input.value, function(result) {

            result = JSON.parse(result);
            if (result.length === 0) {
                notAvailable();
            }
            else {
                let resultPromise = generateResults(result);
                resultPromise.then(function fulfilled(resultDiv) {
                    resultsContainer.innerHTML = '';
                    resultsContainer.appendChild(resultDiv);
                }, function rejected(err) {
                    if (err) throw err;
                });
            }
        });
    }


    function notAvailable() {
        let header = document.createElement('h3');
        header.setAttribute('class', 'na-text');
        header.innerHTML = 'Not available!';

        resultsContainer.innerHTML = '';
        resultsContainer.appendChild(header);
    }


    function loading() {
        let loadHeader = document.createElement('h3');
        loadHeader.setAttribute('class', 'loading-text');
        let loadText = document.createTextNode('Loading');
        let span = document.createElement('span');

        loadHeader.appendChild(loadText);
        loadHeader.appendChild(span);
        resultsContainer.innerHTML = '';
        resultsContainer.appendChild(loadHeader);

        let str = '.';
        let loading = '.';

        setInterval(function() {
            span.innerHTML = loading;
            loading += str;
            if (loading === '....') {
                loading = '.';
            }
        }, 500);
    }


    //enter button
    input.addEventListener('keypress', function(e) {
        if (e.keyCode === 13) {
            if (!input.value) {
                notAvailable();
            }
            else {
                loading();
                searchRequest();
            }
        }
    }, false);


    searchButton.addEventListener('click', function() {
        if (!input.value) {
            notAvailable();
        }
        else {
            loading();
            searchRequest();
        }
    }, false);


})();
