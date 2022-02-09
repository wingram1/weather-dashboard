//misc global variables
var searchForm = document.querySelector("#search-container");
var citySearchHistory = [];

// take input, save to localStorage
var formSubmitHandler = function(event) {
    event.preventDefault();
    var searchInput = document.querySelector("#city-input").value;

    console.log("Form submitted. Your input: " + searchInput);

    // check if no prior search history
    if (citySearchHistory.length > 0) {

        // if there is, check citySearchHistory for an object with name equal to submission
        for (i=0; i<citySearchHistory.length; i++) {

            // if search input matches a city, break the loop
            if (citySearchHistory[i].name === searchInput) {
                console.log(citySearchHistory[i].name + " === " + searchInput + ". Saving to localStorage.");
                break;
            }
            // if there isn't, log that cities were compared and keep looping
            else if (citySearchHistory[i].name != searchInput) {
                console.log(citySearchHistory[i].name + " != " + searchInput);
            }
            else {
                console.log("Error looping through history")
                break;
            }
        } 

    // if not, loaded tasks are null or empty, set to empty array and save
    } 
    else if (citySearchHistory === null || citySearchHistory.length === 0) {
        citySearchHistory = [];
        saveCity(searchInput);
    }
    else {
        console.log("Error checking for search history");
    }    
}

// function to save city
var saveCity = function(newCity) {
    console.log("City saved: " + newCity);
    
    citySearchHistory.push(newCity);
    console.log(citySearchHistory);

    localStorage.setItem("Cities", JSON.stringify(citySearchHistory));
};

// function to load search history
var loadCities = function() {
    var storedCities = localStorage.getItem("Cities");

    console.log(storedCities);

    // if not null, set to citySearchHistory and generate HTML
    if (storedCities != null) {
        console.log("You've got cities!");
        citySearchHistory = JSON.parse(storedCities);
        // generateHistory();
    }
    else {
        console.log("No cities found.");
        citySearchHistory = [];
    }
}


// fetch weather from API


// Generate HTML using data







//////////// EVENT LISTENERS ////////////
loadCities();

searchForm.addEventListener('submit', formSubmitHandler);
