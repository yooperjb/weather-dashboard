
var cities = [];
var apiKey = "fa400288e1b24a95393c31ac7761f9ee";

// Algolia places API
var placesAutocomplete = places({
appId: 'plZ9J0X3JT85',
apiKey: 'd4f18aa1a84be763e7706d34efa5b44f',
container: document.querySelector('#city'),
templates: {
    value: function(suggestion){
        console.log(suggestion);
        return suggestion.name;
    }
}
}).configure({
    countries:['us'],
    type: 'city',
    aroundLatLngViaIP: false,
    useDeviceLocation: false
});

// City Search Button - pass to saveCities, loadCities and getWeather
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
        // if cities > 10 remove last and add to beginning
        else {
            cities.pop();
            cities.unshift(city);
        }
    }
    else {
        window.alert("Please Enter A City.");
    }

    $("#city").val("");
    saveCities();
    loadCities();
    getWeather(city);
});

// Load cities into arrary from localStorage
var loadCities = function() {
    cities = JSON.parse(localStorage.getItem("cities"));
    $(".list-group").empty();

    if (!cities) {
        cities = [];
    }

    // loop over cities - create city list-element
    $.each(cities, function(index) {
        createCityEl(cities[index]);
    })
};

// Save cities array to localStorage
var saveCities = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

// Create city list element
var createCityEl = function(city) {
    var cityListEl = $("<li>")
        .addClass("list-group-item list-group-item-action")
        .text(city);
    
    $(".list-group").append(cityListEl);
};

// Search for city that is clicked in city list
$(".list-group").on("click", "li", function(event) {
    event.preventDefault();
    cityText = $(this).text();
    getWeather(cityText);
});

// Get weather data from OpenWeatherAPI - return data
/*
var getWeather = function(city) {
    var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units=imperial";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            displayUV(data);
            displayForecast(city);
        });
};
*/

// Get weather data from OpenWeatherAPI - return data
var getWeather = function(city) {
    // Initial fetch get Lat Lon for city
    var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units=imperial";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var cityName = data.name;
            
            // pass lat lon to next fetch for weather data - pass display functions
            return fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly&appid="+apiKey+"&units=imperial");
        })
        .then(response => response.json())
        .then(data => {
            
            //console.log("Data:",data);
            displayWeather(data, city);
            displayForecast(data);
        })
};

// Display current weather data
var displayWeather = function(data, city){
    console.log("DAta:", data)
    $("#city-display").text(city);
    //$("#date-display").text(moment().format(" (MM/DD/YYYY)"));
    $("#date-display").text(" "+ convertUnixTimestamp( data.current.dt) );
    $("#icon-display").html("<img src='http://openweathermap.org/img/wn/"+data.current.weather[0].icon+"@2x.png' >");
    $("#icon-display img").attr("alt", data.current.weather[0].description+ " icon");
    $(".temp").text("Temperature: "+Math.round(data.current.temp*10)/10+" \u00B0F");
    $(".humidity").text("Humidity: "+data.current.humidity+"%");
    $(".wind").text("Wind Speed: "+Math.round(data.current.wind_speed*10)/10+" MPH");

    // add span with uv index data and assign class based on value
    var uvi = data.current.uvi;
    var uvSpanEl = $("<span>");

    if (uvi <= 2) {
        uvSpanEl.addClass("low").text(uvi);
    }
    else if (uvi <= 5) {
        uvSpanEl.addClass("moderate").text(uvi);
    }
    else if (uvi <= 7) {
        uvSpanEl.addClass("high").text(uvi);
    }
    else if (uvi <= 10) {
        uvSpanEl.addClass("veryhigh").text(uvi);
    }
    else {
        uvSpanEl.addClass("extreme").text(uvi);
    }

    // write values to HTML
    $(".uv").text("UV Index: ");
    $(".uv").append(uvSpanEl);
};

// Fetch and display UV data - don't need this anymore delete after testing
/*
var displayUV = function(data) {
    var apiKey = "fa400288e1b24a95393c31ac7761f9ee";
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid="+apiKey;
    
    fetch(uvURL)
        .then(response => response.json())
        .then(data => {
            
            // add span with uv index data and assign class
            var uvSpanEl = $("<span>");

            if (data.value <= 2) {
                uvSpanEl.addClass("low").text(data.value);
            }
            else if (data.value <= 5) {
                uvSpanEl.addClass("moderate").text(data.value);
            }
            else if (data.value <= 7) {
                uvSpanEl.addClass("high").text(data.value);
            }
            else if (data.value <= 10) {
                uvSpanEl.addClass("veryhigh").text(data.value);
            }
            else {
                uvSpanEl.addClass("extreme").text(data.value);
            }

            // write values to HTML
            $(".uv").text("UV Index: ");
            $(".uv").append(uvSpanEl);
        }); 
};
*/

// Display 5-day forcast data
var displayForecast = function(data) {
    
    $("#five-day-forecast").show();

    // loop through each day of weather object
    for (var i = 1; i < 6; i++) {
        // create variables for each metric
        var date = convertUnixTimestamp(data.daily[i].dt);
        var desc = data.daily[i].weather[0].description;
        var icon = data.daily[i].weather[0].icon;
        var maxTemp = data.daily[i].temp.max;
        var minTemp = data.daily[i].temp.min;
        var humidity = data.daily[i].humidity;
        
        // assign values to html elements
        tempCard = $('[forecast="'+i+'"]');
        tempCard.find(".card-header").text(date);
        tempCard.find(".card-desc").text(desc);
        tempCard.find(".card-icon").attr("src","http://openweathermap.org/img/wn/"+icon+"@2x.png");
        tempCard.find(".card-icon").attr("alt",data.daily[i].weather[0].description+" icon");

        tempCard.find(".card-maxtemp").text("Max Temp: "+Math.round(maxTemp*10)/10+ " \u00B0F");
        tempCard.find(".card-mintemp").text("Min Temp: "+Math.round(minTemp*10)/10+ " \u00B0F");
        tempCard.find(".card-humidity").text("Humidity "+humidity+"%");

    }
};

// convert unix timestamp into date
var convertUnixTimestamp = function(timestamp) {
    var unixTimestamp = timestamp;
    var milliseconds = unixTimestamp * 1000;
    var dateObject = new Date(milliseconds);
    var dateFormat = dateObject.toLocaleString();
    var date = dateFormat.split(",")[0];
    return date;
};

loadCities();