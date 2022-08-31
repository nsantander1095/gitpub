var city = "Charlotte";
var sportKey = "50130162";
var searchBtnEL = document.querySelector("#search");
var toJSON = function(response){
    return response.json();
};
var displayResults = function(data){
    
}
var brewURL = `https://api.openbrewerydb.org/breweries?by_city=${city}`;
fetch(brewURL)
    .then(toJSON)
    .then(function(data){
        console.log(data)
        displayResults(data)
    });