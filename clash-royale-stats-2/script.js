var userContainer = document.getElementById("current-user");
var clashData = {};

var initAPI = function() {
  var key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTc4NywiaWRlbiI6IjQwMjc1Nzc0Mjc0NzQ1MTM5MiIsIm1kIjp7fSwidHMiOjE1Mzg2NjQ3OTQ2Mjd9.0JLa2j04z96C3iwkDcPVO_PP6G3jnyFJ_RQ7OVzQmow";
  var url = "https://api.royaleapi.com/player/JYG8VPL";

  clashData = JSON.parse(httpGet(url, key));

  userContainer.innerHTML = "Navn: <strong>" + clashData.name + "</strong>";
}

var httpGet = function(url,key){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false );
  xmlHttp.setRequestHeader("auth",key);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}
