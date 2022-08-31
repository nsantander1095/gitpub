var city = "Charlotte";
var sportKey = "50130162";
var searchBtnEL = document.querySelector("#search");
var toJSON = function(response){
    return response.json();
};
var displayResults = function(data){
    console.log(data)
    var resultsEl = document.getElementById("resultsBin");
    resultsEl.innerHTML = null;
    for (var i=0; i<data.length; i++) {
        var resultsItemEl = document.createElement("card");
        var breweryNameEl = document.createElement("h3");
        var breweryAddressEl = document.createElement("p");    
        var breweryPhoneEl = document.createElement("p");    
        var breweryURLEl = document.createElement("p");    
        breweryNameEl.textContent = data[i].name;
        breweryAddressEl.textContent = "Address: " + data[i].street +" " +  data[i].state;
        breweryPhoneEl.textContent = "Phone Number: " + data[i].phone;
        breweryURLEl.textContent = "Web Site: " + data[i].website_url;
        resultsEl.appendChild(resultsItemEl);
        resultsItemEl.appendChild(breweryNameEl);
        resultsItemEl.appendChild(breweryAddressEl);
        resultsItemEl.appendChild(breweryPhoneEl);
        resultsItemEl.appendChild(breweryURLEl);
    }  
}
var brewURL = `https://api.openbrewerydb.org/breweries?by_city=${city}`;
fetch(brewURL)
    .then(toJSON)
    .then(function(data){
        displayResults(data)
    });