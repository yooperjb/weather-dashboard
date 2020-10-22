
var cities = [];

// City Search Button
$("#city-search").click(function() {
    var city = $("#city").val().trim();
    
    if (city) {
        // if city exists in array remove and add to beginning
        if (cities.includes(city)) {
            var index = cities.indexOf(city);
            cities.splice(index,1);
            cities.unshift(city);
        }
        // if city not in array but it's < 10 add to beginning
        else if (cities.length < 10) {
            cities.unshift(city);
        }
        // if weather > 10 remove last and add to beginning
        else {
            cities.pop();
            cities.unshift(city);
        }
    }
    else {
        window.alert("Please Enter A City.");
    }

    $("#city").val("");
    console.log(cities);
    saveCities();
    loadCities();
});

// Load cities into arrary from localStorage
var loadCities = function() {
    cities = JSON.parse(localStorage.getItem("cities"));
    $(".city-list").empty();

    if (!cities) {
        cities = [];
    }

    // loop over cities - create city list-element
    $.each(cities, function(index) {
        //console.log(cities[index]);
        createCityEl(cities[index]);
    })
};

// Save cities array to localStorage
var saveCities = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

// Create city list element
var createCityEl = function(city) {
    var cityListEl = $("<a>")
        .addClass("list-group-item list-group-item-action")
        .attr("href", "")
        .text(city);
    
    $(".city-list").append(cityListEl);
};

// Get weather data from OpenWeatherAPI
var getWeather = function(city) {
    var apiKey = "fa400288e1b24a95393c31ac7761f9ee";
    var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units=imperial";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            //console.log(data.main);
            return data;
        });
    
};

getWeather("Arcata");
loadCities();