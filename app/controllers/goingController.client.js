'use strict';

function goingRequest(element) {
    ajaxFunctions.ajaxRequest('GET', apiUrl + '?location=' + input.value + '&bar=' + element.value, function(count) {
        element.innerHTML = count + ' Going';
    });
}


(function() {

    function restoreSession() {
        if (sessionStorage.input) {
            input.value = sessionStorage.input;
            sessionStorage.removeItem('input');
        }

        if (sessionStorage.results) {
            resultsContainer.innerHTML = sessionStorage.results;
            sessionStorage.removeItem('results');
        }
    }


    document.addEventListener('click', function(e) {
        if (e.target.className === 'go-btn') {

            ajaxFunctions.ajaxRequest('GET', '/auth', function(authenticated) {
                authenticated = JSON.parse(authenticated);
                if (!authenticated) {
                    sessionStorage.setItem('input', input.value);
                    sessionStorage.setItem('results', resultsContainer.innerHTML);
                    window.location.href = '/auth/twitter';
                }
                else {
                    ajaxFunctions.ajaxRequest('POST', apiUrl + '?location=' + input.value + '&bar=' + e.target.value, function() {
                        goingRequest(e.target);
                    });
                }
            });
        }
    }, false);


    ajaxFunctions.ready(restoreSession);

})();
