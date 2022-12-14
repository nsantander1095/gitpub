var inputCity = "";
var sportKey = "50130162";
// this line below was to offset the days so that we could display the data
// var today = moment().add(10, "day").format("YYYY-MM-DD");
var today = moment().format("YYYY-MM-DD");
var searchBtnEL = document.querySelector("#search");
var savedBreweriesEl = document.querySelector("#savedBreweries");
var toJSON = function (response) {
  return response.json();
};
// generates all of the elements on the fly for the search results
var displayBreweryResults = function (data) {
  var resultsEl = document.getElementById("resultsBin");
  resultsEl.innerHTML = null;
  for (var i = 0; i < data.length; i++) {
    var resultsItemEl = document.createElement("div");
    var resultsItemBodyEl = document.createElement("div");
    var resultsBtnEl = document.createElement("button");
    var resultsItemTextEl = document.createElement("div");
    var breweryNameEl = document.createElement("h3");
    var breweryAddressEl = document.createElement("p");
    var breweryPhoneEl = document.createElement("p");
    var breweryURLEl = document.createElement("p");
    var iconEl = document.createElement("i");
    iconEl.style.pointerEvents = "none";

    breweryNameEl.textContent = data[i].name;
    breweryAddressEl.textContent =
      "Address: " + data[i].street + " " + data[i].city + ", " + data[i].state;
    breweryPhoneEl.textContent = "Phone Number: " + data[i].phone;
    breweryURLEl.textContent = "Web Site: " + data[i].website_url;
    iconEl.className = "fas fa-bookmark";
    resultsItemEl.className = "card mb-3";
    resultsItemBodyEl.className = "card-body";
    breweryNameEl.className = "card-title";
    resultsBtnEl.className = "btn btn-warning btn-lg";
    resultsItemTextEl.className = "card-text";

    resultsBtnEl.setAttribute("data-brew-id", data[i].id);
    resultsBtnEl.setAttribute("data-brew-name", data[i].name);

    resultsEl.appendChild(resultsItemEl);
    resultsItemEl.appendChild(resultsItemBodyEl);

    resultsItemBodyEl.appendChild(breweryNameEl);
    resultsItemBodyEl.appendChild(resultsItemTextEl);
    resultsItemTextEl.appendChild(breweryAddressEl);
    resultsItemTextEl.appendChild(breweryPhoneEl);
    resultsItemTextEl.appendChild(breweryURLEl);
    resultsItemTextEl.appendChild(resultsBtnEl);

    resultsBtnEl.appendChild(iconEl);
  }
};
// generates the sporting events on the right side of the page
var displaySports = function (data) {
  var sportsEl = document.getElementById("sportsBin");
  sportsEl.innerHTML = null;
  var sportsData = data.tvevents || [];
  for (var i = 0; i < sportsData.length; i++) {
    var sportsItemEl = document.createElement("div");
    var sportsTitleEl = document.createElement("h4");
    var sportsTypeEl = document.createElement("p");
    sportsTitleEl.textContent = sportsData[i].strEvent;
    sportsTypeEl.textContent = sportsData[i].strSport;
    sportsItemEl.appendChild(sportsTitleEl);
    sportsItemEl.appendChild(sportsTypeEl);
    sportsEl.appendChild(sportsItemEl);
  }
};
// renders the saved breweries as buttons on the left
var displayFavBreweries = function () {
  var breweries = JSON.parse(localStorage.getItem("breweries")) || {};
  savedBreweriesEl.innerHTML = null;
  for (var id in breweries) {
    var breweryButtonEl = document.createElement("button");
    breweryButtonEl.textContent = breweries[id];
    breweryButtonEl.id = id;
    breweryButtonEl.className = "btn btn-danger mb-3 btn-block col-12 mx-auto";
    savedBreweriesEl.appendChild(breweryButtonEl);
  }
};
// generates the information for an individul brewery when clicking a fave button
var displayPrevBrewery = function (data) {
  var resultsEl = document.getElementById("resultsBin");
  resultsEl.innerHTML = null;
  var breweryItemEl = document.createElement("div");
  var breweryItemBodyEl = document.createElement("div");
  var breweryItemTextEl = document.createElement("div");
  var breweryNameEl = document.createElement("h3");
  var breweryAddressEl = document.createElement("p");
  var breweryPhoneEl = document.createElement("p");
  var breweryURLEl = document.createElement("p");
  breweryNameEl.textContent = data.name;
  breweryAddressEl.textContent =
    "Address: " + data.street + " " + data.city + " " + data.state;
  breweryPhoneEl.textContent = "Phone Number: " + data.phone;
  breweryURLEl.textContent = "Web Site: " + data.website_url;
  breweryItemEl.className = "card mb-3";
  breweryItemBodyEl.className = "card-body";
  breweryNameEl.className = "card-title";
  breweryItemTextEl.className = "card-text";
  resultsEl.appendChild(breweryItemEl);
  breweryItemEl.appendChild(breweryItemBodyEl);

  breweryItemBodyEl.appendChild(breweryNameEl);
  breweryItemBodyEl.appendChild(breweryItemTextEl);
  breweryItemTextEl.appendChild(breweryAddressEl);
  breweryItemTextEl.appendChild(breweryPhoneEl);
  breweryItemTextEl.appendChild(breweryURLEl);
};
// fetch for sportsdb api
var getSportList = function () {
  var sportsURL = `https://www.thesportsdb.com/api/v1/json/50130162/eventstv.php?d=${today}&s=${encodeURIComponent(
    "American Football"
  )}`;
  fetch(sportsURL)
    .then(toJSON)
    .then(function (tvEvents) {
      console.log(tvEvents);
      displaySports(tvEvents);
    });
};
// fetch for openbrewery api
var gitBrewery = function (city) {
  var brewURL = `https://api.openbrewerydb.org/breweries?by_city=${city}`;

  fetch(brewURL)
    .then(toJSON)
    .then((breweryList) => {
      console.log(breweryList);
      getSportList();
      displayBreweryResults(breweryList);
    });
};
// handler for the search button on index page
var indexSearchHandler = function (event) {
  event.preventDefault();
  // if (event.target.matches("#search")) {
  inputCity = document.querySelector("#cityInput").value;
  console.log(inputCity);
  window.location.replace("results.html?city=" + inputCity);
  // }
};
// handler for the search button on results page
var searchHandler = function (event) {
  event.preventDefault();
  if (event.target.matches("#search")) {
    inputCity = document.querySelector("#cityInput").value;
    var url = new URL(document.location.href);
    url.searchParams.set("city", inputCity);
    history.pushState({}, null, url.toString());
    gitBrewery(inputCity);
  }
};
// handler for the save feature on bookmark click
var saveHandler = function (event) {
  if (event.target.matches("button")) {
    var id = event.target.getAttribute("data-brew-id");
    var name = event.target.getAttribute("data-brew-name");
    console.log(id, name);
    var breweries = JSON.parse(localStorage.getItem("breweries")) || {};
    breweries = { ...breweries, [id]: name };
    var data = JSON.stringify(breweries);
    localStorage.setItem("breweries", data);
    displayFavBreweries();
  }
};
// handler for click on button element of saved breweries
var previousHandler = function (event) {
  event.preventDefault();
  if (event.target.matches("button")) {
    var brewerySing = event.target;
    var brewId = event.target.id;
    var singBrewURL = `https://api.openbrewerydb.org/breweries/${brewId}`;

    fetch(singBrewURL)
      .then(toJSON)
      .then((brewerySing) => {
        console.log(brewerySing);
        getSportList();
        displayPrevBrewery(brewerySing);
      });
  }
};
// everything under here is to manage url pathing and event listeners
var url = new URL(document.location.href);

console.log(url);

if (url.pathname.includes("results")) {
  var cityInput = url.searchParams.get("city");
  console.log(cityInput);
  searchBtnEL.addEventListener("click", searchHandler);
  resultsBin.addEventListener("click", saveHandler);
  savedBreweriesEl.addEventListener("click", previousHandler);
  displayFavBreweries();

  if (url.searchParams.get("city")) {
    gitBrewery(cityInput);
  }
} else {
  console.log("on index page");
  searchBtnEL.addEventListener("click", indexSearchHandler);
}

//these are still here to make sure that we can toggle functionality when not using the url paths
// searchBtnEL.addEventListener("click", searchHandler);
// resultsBin.addEventListener("click", saveHandler);
// savedBreweriesEl.addEventListener("click", previousHandler);

// displayFavBreweries();
