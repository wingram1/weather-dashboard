//misc global variables
var searchForm = document.querySelector("#search-container");
var historyContainer = document.querySelector("#history-container");
var citySearchHistory = [];

// take input, save to localStorage
var formSubmitHandler = function(event) {
    event.preventDefault();
    var searchInput = document.querySelector("#city-input").value;

    console.log("Form submitted. Your input: " + searchInput);

    // check if no prior search history
    if (citySearchHistory.length > 0) {

        // if there is, check citySearchHistory for an object with name equal to submission
        for (i=0; i< (citySearchHistory.length + 1); i++) {

            // if search input matches a city, splice then re-save
            if (citySearchHistory[i] === searchInput) {
                console.log(citySearchHistory[i] + " === " + searchInput + ". Saving to localStorage.");
                citySearchHistory.splice(i, 1);
                saveCity(searchInput);
                break;
            }
            // if there isn't, log that cities were compared and keep looping
            else if (citySearchHistory[i] && citySearchHistory[i] != searchInput) {
                console.log(citySearchHistory[i] + " != " + searchInput);
            }
            // if nothing on the last iteration, save a new one
            else if (!citySearchHistory[i]) {
                console.log("New city saved: " + searchInput);
                saveCity(searchInput);
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

    // update search history
    loadCities();
};

// function to load search history
var loadCities = function() {
    var storedCities = localStorage.getItem("Cities");

    console.log(storedCities);

    // if not null, set to citySearchHistory and generate HTML
    if (storedCities != null) {
        console.log("You've got cities!");
        citySearchHistory = JSON.parse(storedCities);

        // kill all babies of historyContainer
        $("#history-container").empty();


        // make new babies
        for (i = (citySearchHistory.length - 1); i > -1; i--) {
            var workingButton = document.createElement("button");
            workingButton.className = "btn btn-secondary mt-2 mb-2";
            workingButton.textContent = citySearchHistory[i];
            historyContainer.appendChild(workingButton);
        }
        console.log("Finished loading history.")
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
