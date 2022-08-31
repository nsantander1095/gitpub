var city = "Charlotte";
var sportKey = "50130162";
var today = moment().add(11,"day").format("YYYY-MM-DD");
var searchBtnEL = document.querySelector("#search");
var toJSON = function(response){
    return response.json();
};
var getBrewList = function(data){
    displayResults(data)
    console.log(today);
    getSportList();
}
var getSportList = function(){
    var sportsURL = `https://www.thesportsdb.com/api/v1/json/50130162/eventstv.php?d=${today}&s=${encodeURIComponent("American Football")}`;
    fetch(sportsURL)
    .then(toJSON)
    .then(function(data){
        console.log(data)
        // displaySports(data)
    });
}
var displayResults = function(data){
    console.log(data)
    var resultsEl = document.getElementById("resultsBin");
    resultsEl.innerHTML = null;
    for (var i=0; i<data.length; i++) {
        var resultsItemEl = document.createElement("div");
        var resultsItemBodyEl = document.createElement("div");
        var resultsItemTextEl = document.createElement("div");
        var breweryNameEl = document.createElement("h3");
        var breweryAddressEl = document.createElement("p");    
        var breweryPhoneEl = document.createElement("p");    
        var breweryURLEl = document.createElement("p");    
        breweryNameEl.textContent = data[i].name;
        breweryAddressEl.textContent = "Address: " + data[i].street +" " + data[i].city +" " + data[i].state;
        breweryPhoneEl.textContent = "Phone Number: " + data[i].phone;
        breweryURLEl.textContent = "Web Site: " + data[i].website_url;
        resultsItemEl.className = "card mb-3";
        resultsItemBodyEl.className = "card-body";
        breweryNameEl.className = "card-title";
        resultsItemTextEl.className = "card-text";
        resultsEl.appendChild(resultsItemEl);
        resultsItemEl.appendChild(resultsItemBodyEl);
        resultsItemBodyEl.appendChild(breweryNameEl);
        resultsItemBodyEl.appendChild(resultsItemTextEl);
        resultsItemTextEl.appendChild(breweryAddressEl);
        resultsItemTextEl.appendChild(breweryPhoneEl);
        resultsItemTextEl.appendChild(breweryURLEl);
    }  
}
var displaySports = function(sportsData){
 console.log(sportsData);
 var sportsEl = document.getElementById("sportsBin");
 sportsEl.innerHTML = null;
 for (var i=0; i<sportsData.length; i++) {
    var sportsItemEl = document.createElement("div"); 
    var sportsTitleEl = document.createElement("h3"); 
    var sportsLeagueEl = document.createElement("p"); 
    var sportsTypeEl = document.createElement("p"); 
    var sportsDateEl = document.createElement("p"); 
    sportsTitleEl.textContent = sportsData[i].strEventAlternate;
    sportsLeagueEl.textContent = sportsData[i].strLeague;
    sportsTypeEl.textContent = sportsData[i].strSport;
    sportsDateEl.textContent = sportsData[i].dateEvent;
    sportsEl.appendChild(sportsItemEl);
    sportsItemEl.appendChild(sportsLeagueEl);
    sportsItemEl.appendChild(sportsTypeEl);
    sportsItemEl.appendChild(sportsDateEl);
    
 }
}

var brewURL = `https://api.openbrewerydb.org/breweries?by_city=${city}`;


fetch(brewURL)
    .then(toJSON)
    .then(getBrewList);
displaySports();