var userContainer = document.getElementById('current-user');
var navButtons = document.getElementsByClassName('nav__item');
var clashData = {};
var dataContainer = document.getElementById('clash-data');

var initApp = function() {
    //hent dataene
    var key =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTc4NywiaWRlbiI6IjQwMjc1Nzc0Mjc0NzQ1MTM5MiIsIm1kIjp7fSwidHMiOjE1Mzg2NjQ3OTQ2Mjd9.0JLa2j04z96C3iwkDcPVO_PP6G3jnyFJ_RQ7OVzQmow';
    var url = 'https://api.royaleapi.com/player/JYG8VPL';

    clashData = JSON.parse(httpGet(url, key));

    //vis brukernavnet til den som er eier av disse dataene
    userContainer.innerHTML = clashData.name;

    //list ut dataene i konsollvinduet for referanse
    //console.log(clashData);

    //initialiser kategori-navigasjonen, og aktiver sist valgte kategori
    detectNavigation();
};

var httpGet = function(url, key) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, false);
    xmlHttp.setRequestHeader('auth', key);
    xmlHttp.send(null);
    return xmlHttp.responseText;
};

var isImage = function(propVal) {
    var imageTag = propVal;
    if (propVal.endsWith('.png')) {
        imageTag = '<img src="' + propVal + '" alt="">';
    }
    return imageTag;
};

var detectNavigation = function() {
    //hent sist valgte kategori om den finnes
    var currentCat = localStorage.getItem('currentCat');

    //loop gjennom knapperaden for å detektere knappetrykk
    for (var i = 0; i < navButtons.length; i++) {
        var elem = navButtons[i];
        var btnDataCat = elem.getAttribute('data-switch');

        if (btnDataCat === currentCat && currentCat !== null) {
            menuClick(elem);
        }

        elem.onclick = function() {
            menuClick(this);
        };
    }
};

var menuClick = function(button) {
    //reset nåværende valg
    removeActiveMenuItem();

    //slå opp knappens kategori
    var dataToShow = button.getAttribute('data-switch');

    //lagre denne kategorien
    localStorage.setItem('currentCat', dataToShow);

    //set aktiv-klasse for denne knappen
    button.classList.add('active');

    //vis dataene
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
    var level2Only = true;

    for (var prop in categoryData) {
        if (categoryData.hasOwnProperty(prop)) {
            if (typeof categoryData[prop] !== 'object') {
                level2Only = false;
            }
        }
    }

    if (level2Only === false) {
        for (var prop in categoryData) {
            var tr = document.createElement('tr');

            if (categoryData.hasOwnProperty(prop)) {
                if (typeof categoryData[prop] !== 'object') {
                    //liste egenskapsnavn og verdi på elementer som ikke har flere nivåer
                    tr.innerHTML = '<th>' + prop + '</th><td>' + categoryData[prop] + '</td>';
                    table.appendChild(tr);
                } else {
                    //lage en nøstet tabell for denne egenskapen som inneholder flere under-egenskaper
                    var innerTable = document.createElement('table');
                    var th = document.createElement('th');
                    var td = document.createElement('td');
                    th.innerHTML = prop;

                    for (var nestedProp in categoryData[prop]) {
                        var innerTR = document.createElement('tr');
                        if (categoryData[prop].hasOwnProperty(nestedProp)) {
                            //sjekke om verdien er en bilde-uri
                            var nestedPropVal = isImage(String(categoryData[prop][nestedProp]));

                            innerTR.innerHTML = '<th>' + nestedProp + '</th><td class="fill">' + nestedPropVal + '</td>';
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
        }

        dataContainer.appendChild(table);
        dataContainer.classList.remove('wide');
        dataContainer.classList.add('narrow');
    } else {
        for (var prop in categoryData) {
            var tbody = document.createElement('tbody');

            for (var nestedProp in categoryData[prop]) {
                var tr = document.createElement('tr');
                if (categoryData[prop].hasOwnProperty(nestedProp)) {
                    //sjekke om verdien er en bilde-uri
                    var nestedPropVal = isImage(String(categoryData[prop][nestedProp]));

                    tr.innerHTML = '<th>' + nestedProp + '</th>' + '<td>' + nestedPropVal + '</td>';
                    tbody.appendChild(tr);
                }
            }

            table.appendChild(tbody);
        }

        dataContainer.appendChild(table);
        dataContainer.classList.remove('narrow');
        dataContainer.classList.add('wide');
    }
};

initApp();
