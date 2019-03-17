var userContainer = document.getElementById('current-user');
var navButtons = document.getElementsByClassName('nav__item');
var clashData = {};
var dataContainer = document.getElementById('clash-data');

var initApp = function() {
    var key =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTc4NywiaWRlbiI6IjQwMjc1Nzc0Mjc0NzQ1MTM5MiIsIm1kIjp7fSwidHMiOjE1Mzg2NjQ3OTQ2Mjd9.0JLa2j04z96C3iwkDcPVO_PP6G3jnyFJ_RQ7OVzQmow';
    var url = 'https://api.royaleapi.com/player/JYG8VPL';

    clashData = JSON.parse(httpGet(url, key));

    userContainer.innerHTML = clashData.name;

    console.log(clashData); //list data to get a glimpse of what's available

    detectNavigation();
};

var httpGet = function(url, key) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, false);
    xmlHttp.setRequestHeader('auth', key);
    xmlHttp.send(null);
    return xmlHttp.responseText;
};

var detectNavigation = function() {
    for (var i = 0; i < navButtons.length; i++) {
        var elem = navButtons[i];
        elem.onclick = function() {
            menuClick(this);
        };
    }
};

var menuClick = function(button) {
    removeActiveMenuItem();
    var dataToShow = button.getAttribute('data-switch');
    button.classList.add('active');
    showData(dataToShow);
};

var removeActiveMenuItem = function() {
    for (var i = 0; i < navButtons.length; i++) {
        var elem = navButtons[i];
        elem.classList.remove('active');
    }
};

var showData = function(dataName) {
    dataContainer.innerHTML = '';
    var categoryData = clashData[dataName];
    var table = document.createElement('table');

    for (var property in categoryData) {
        var tr = document.createElement('tr');

        if (categoryData.hasOwnProperty(property)) {
            if (typeof categoryData[property] !== 'object') {
                //liste egenskapsnavn og verdi på elementer som ikke har flere nivåer
                tr.innerHTML = '<th>' + property + '</th><td>' + categoryData[property] + '</td>';
                table.appendChild(tr);
            } else {
                //lage en nøstet tabell for denne egenskapen som inneholder flere under-egenskaper
                var innerTable = document.createElement('table');
                var th = document.createElement('th');
                var td = document.createElement('td');
                th.innerHTML = property;

                for (var nestedProperty in categoryData[property]) {
                    var innerTR = document.createElement('tr');
                    if (categoryData[property].hasOwnProperty(nestedProperty)) {
                        //sjekke om det er et bilde
                        var nestedPropertyVal = String(categoryData[property][nestedProperty]);
                        if (nestedPropertyVal.endsWith('.png')) {
                            nestedPropertyVal = '<img src="' + nestedPropertyVal + '" alt="">';
                        }
                        innerTR.innerHTML = '<th>' + nestedProperty + '</th><td class="fill">' + nestedPropertyVal + '</td>';
                        innerTable.appendChild(innerTR);
                    }
                }

                td.classList.add('have-children');
                td.appendChild(innerTable);
                tr.appendChild(th);
                tr.appendChild(td);
                table.appendChild(tr);
            }
        }

        dataContainer.appendChild(table);
    }
};

initApp();
