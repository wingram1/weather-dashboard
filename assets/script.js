//misc global variables
var searchForm = document.querySelector("#search-container");
var historyContainer = document.querySelector("#history-container");
var cityContainer = document.querySelector("#city-container");
var forecastContainer = document.querySelector("#forecast-container");
var citySearchHistory = [];
var searchInput = null;

// take input, save to localStorage
var formSubmitHandler = function(event) {
    event.preventDefault();

    // if button, tell it to get textContent
    if (event.target.tagName === "BUTTON") {
        searchInput = event.target.textContent;
    }
    // if form, tell it to get the input value
    else if (event.target.tagName === "FORM") {
        searchInput = document.querySelector("#city-input").value;
    }

    console.log("Form submitted. Your input: " + searchInput);

    // get coordinates of searchInput
    getCoords(searchInput);

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
            workingButton.className = "btn btn-secondary mt-2 mb-2 history-button";
            workingButton.textContent = citySearchHistory[i];
            historyContainer.appendChild(workingButton);
        }
        console.log("Finished loading history.")

        // add event listeners for buttons
        $(".history-button").on("click", formSubmitHandler)
    }
    else {
        console.log("No cities found.");
        citySearchHistory = [];
    }
}

// get coordinates of city using OpenWeather Geocoding
var getCoords = function(targetCity) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + targetCity + ",US&appid=9f22897565b785c5e1809cff5dde2ef9";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    var lat = (data[0].lat);
                    var lon = (data[0].lon);

                    console.log("Coordinates for " + targetCity + ": " + lat + ", " + lon);
                    getForecast(lat, lon);
                });
            } else {
                console.log("Error connecting to openweather.com Geocoding API");
            }
        })
}

// fetch weather from API
var getForecast = function(lat, lon) {
    console.log("Getting forecast for coordinates " + lat + ", " + lon + "...");

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=9f22897565b785c5e1809cff5dde2ef9";

    console.log(apiUrl);

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                ////// GET DATA //////
                var c = data.current;
                var d = data.daily;

                var forecastData = [
                    {
                        // City Name
                        city: searchInput,
                        // Date (MM/DD/YYYY)
                        date: unixToDate(c.dt),
                        // Temp
                        temp: c.temp,
                        // Wind
                        wind: c.wind_speed,
                        // Humidity
                        humidity: c.humidity,
                        // UV Index
                        uvi: c.uvi,
                        // Icon
                        icon: c.weather[0].icon
                    }
                ]

                // Create daily forecast data starting from tomorrow
                for (i = 1; i < 6; i++) {
                    var newObject = {
                        // DATE
                        date: unixToDate(d[i].dt),
                        // TEMP
                        temp: d[i].temp.day,
                        // WIND
                        wind: d[i].wind_speed,
                        // HUMIDITY
                        humidity: d[i].humidity,
                        // ICON
                        icon: d[i].weather[0].icon
                    };

                    // push new object to forecastData
                    forecastData.push(newObject);
                }

                console.log(forecastData);

                // generate HTML
                generateForecast(forecastData);
                
                });
            }
            else {
                console.log("Error connecting to openweather.com One Call API")
            }
        });

}

// Convert unix to MM/DD/YYYY
var unixToDate = function(unix) {
    var ms = (unix * 1000);
    var date = new Date(ms);
    var format = {month: 'numeric', day: 'numeric', year: 'numeric'};
    var formattedDate = date.toLocaleDateString('en-US', format);
    return formattedDate;
};

// Generate HTML using forecastData
var generateForecast = function(data) {
    // clear content
    $("#city-container").empty();
    $("#forecast-container").empty();

    // Current Weather
    var titleContainer = document.createElement("div");
    titleContainer.className = "d-flex flex-row justify-content-start";
    titleContainer.style = "height: 20%;"
    titleContainer.textContent = data[0].name
    cityContainer.appendChild(titleContainer);

    var cityName = document.createElement("h2");
    cityName.className = "pr-2"
    cityName.textContent = data[0].city;
    titleContainer.appendChild(cityName);

    var currentDate = document.createElement("h2");
    currentDate.textContent = "(" + data[0].date + ")";
    titleContainer.appendChild(currentDate);

    var currentIcon = document.createElement("img")
    currentIcon.src = "http://openweathermap.org/img/wn/" + data[0].icon + "@2x.png";
    currentIcon.style = "height: 42px";
    titleContainer.appendChild(currentIcon);

    var currentTemp = document.createElement("p");
    currentTemp.textContent = "Temp: " + data[0].temp + "°F"
    cityContainer.appendChild(currentTemp)

    var currentWind = document.createElement("p");
    currentWind.textContent = "Wind: " + data[0].wind + " MPH"
    cityContainer.appendChild(currentWind);

    var currentHumidity = document.createElement("p");
    currentHumidity.textContent = "Humidity: " + data[0].humidity + " %"
    cityContainer.appendChild(currentHumidity);

    var uviContainer = document.createElement("div");
    uviContainer.className = "d-flex flex-row justify-content-start";
    cityContainer.appendChild(uviContainer)

    var uviLabel = document.createElement("p");
    uviLabel.textContent = "UV Index: ";
    uviContainer.appendChild(uviLabel)

    var currentUVI= document.createElement("p");
    currentUVI.textContent = data[0].uvi;
    currentUVI.className = "ml-2 pl-3 pr-3 mb-auto rounded";
    currentUVI.style = "background-color: " + getUviColor(data[0].uvi) + "; color: white;"
    uviContainer.appendChild(currentUVI)

    // 5-Day Forecast
    for (i = 1; i < data.length; i++) {
        var card = document.createElement("div");
        card.className = "forecast-card rounded m-2 p-3";
        forecastContainer.appendChild(card);

        var cardDate = document.createElement("h4");
        cardDate.textContent = data[i].date;
        card.appendChild(cardDate);

        var cardIcon = document.createElement("img");
        cardIcon.src = "http://openweathermap.org/img/wn/" + data[i].icon + "@2x.png";
        cardIcon.style = "height: 30px";
        card.appendChild(cardIcon);

        var cardTemp = document.createElement("p");
        cardTemp.textContent = "Temp: " + data[i].temp + "°F"
        card.appendChild(cardTemp)
    
        var cardWind = document.createElement("p");
        cardWind.textContent = "Wind: " + data[i].wind + " MPH"
        card.appendChild(cardWind);
    
        var cardHumidity = document.createElement("p");
        cardHumidity.textContent = "Humidity: " + data[i].humidity + " %"
        card.appendChild(cardHumidity);
    }
}

var getUviColor = function(uvi) {
    if (uvi < 3) {
        return "green";
    } 
    else if (uvi >= 3 && uvi < 6) {
        return "yellow";
    }
    else if (uvi >= 6 && uvi < 8) {
        return "orange";
    }
    else if (uvi >= 8 && uvi < 11) {
        return "red";
    }
    else if (uvi >= 11) {
        return "purple";
    }
}

//////////// CALL FUNCTIONS ////////////
loadCities();

searchForm.addEventListener('submit', formSubmitHandler);