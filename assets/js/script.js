var inputCity = "";
var sportKey = "50130162";
var today = moment().add(11, "day").format("YYYY-MM-DD");
var searchBtnEL = document.querySelector("#search");
var savedBreweriesEl = document.querySelector("#savedBreweries");
var toJSON = function (response) {
  return response.json();
};

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

    breweryNameEl.textContent = data[i].name;
    breweryAddressEl.textContent =
      "Address: " + data[i].street + " " + data[i].city + " " + data[i].state;
    breweryPhoneEl.textContent = "Phone Number: " + data[i].phone;
    breweryURLEl.textContent = "Web Site: " + data[i].website_url;
    iconEl.className = "fas fa-bookmark";
    resultsItemEl.className = "card mb-3";
    resultsItemBodyEl.className = "card-body";
    breweryNameEl.className = "card-title";
    resultsBtnEl.className = "btn btn-warning";
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

var displaySports = function (data) {
  var sportsEl = document.getElementById("sportsBin");
  sportsEl.innerHTML = null;
  var sportsData = data.tvevents;
  for (var i = 0; i < sportsData.length; i++) {
    var sportsItemEl = document.createElement("div");
    var sportsTitleEl = document.createElement("h4");
    //var sportsLeagueEl = document.createElement("p");
    var sportsTypeEl = document.createElement("p");
    sportsTitleEl.textContent = sportsData[i].strEvent;
    //sportsLeagueEl.textContent = sportsData[i].strLeague;
    sportsTypeEl.textContent = sportsData[i].strSport;
    sportsItemEl.appendChild(sportsTitleEl);
    //sportsItemEl.appendChild(sportsLeagueEl);
    sportsItemEl.appendChild(sportsTypeEl);
    sportsEl.appendChild(sportsItemEl);
  }
};

var displayFavBreweries = function (brewName) {
  var breweries = JSON.parse(localStorage.getItem("breweries")) || [];
  savedBreweriesEl.innerHTML = null;
  for (var brewery of breweries) {
    var breweryButtonEl = document.createElement("button");
    breweryButtonEl.textContent = brewName;
    breweryButtonEl.className = "btn btn-danger mb-3";
    savedBreweriesEl.appendChild(breweryButtonEl);
  }
};

var savedToLocalStorage = function (breweryList) {
  console.log(breweryList);
  var breweries = JSON.parse(localStorage.getItem("breweries")) || [];
//   breweries.push(breweryList.id);
  var brewSet = Array.from(new Set(breweries));
  var data = JSON.stringify(brewSet);
  localStorage.setItem("breweries", data);
  displayFavBreweries();
};

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

var gitBrewery = function (city) {
  var brewURL = `https://api.openbrewerydb.org/breweries?by_city=${city.value}`;

  fetch(brewURL)
    .then(toJSON)
    .then((breweryList) => {
      console.log(breweryList);
      savedToLocalStorage(breweryList);
      getSportList();
      displayBreweryResults(breweryList);
    });
};

var searchHandler = function (event) {
  event.preventDefault();
  if (event.target.matches("#search")) {
    inputCity = document.querySelector("#cityInput");
    gitBrewery(inputCity);
  }
};

var saveHandler = function (event) {
  if (event.target.matches("button")) {
    var brewId = event.target.getAttribute("data-brew-id");
    var brewName = event.target.getAttribute("data-brew-name");
    console.log(brewId, brewName);
    var breweries = JSON.parse(localStorage.getItem("breweries")) || [];
    breweries.push(brewId);
    var brewSet = Array.from(new Set(breweries));
    var data = JSON.stringify(brewSet);
    localStorage.setItem("breweries", data);
    console.log(brewSet);
    displayFavBreweries(brewName);
  }
};

var previousHandler = function (event) {
  event.preventDefault();
  if (event.target.matches("button")) {
    var brewId = event.target.textContent;
    var singBrewURL = `https://api.openbrewerydb.org/breweries/${brewId}`;

    fetch(singBrewURL)
      .then(toJSON)
      .then((breweryList) => {
        console.log(breweryList);
        savedToLocalStorage(breweryList);
        getSportList();
        displayBreweryResults(breweryList);
      });
  }
};

// var init = function (data) {
//   gitBrewery(inputCity);
// };

searchBtnEL.addEventListener("click", searchHandler);
resultsBin.addEventListener("click", saveHandler);
savedBreweriesEl.addEventListener("click", previousHandler);
//searchBtnEL.addEventListener("click", searchHandler);

//init();
displayFavBreweries();
