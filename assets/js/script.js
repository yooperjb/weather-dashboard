
var cities = [];

// Algolia places API
var placesAutocomplete = places({
appId: 'plZ9J0X3JT85',
apiKey: 'd4f18aa1a84be763e7706d34efa5b44f',
container: document.querySelector('#city'),
templates: {
    value: function(suggestion){
        return suggestion.name;
    }
}
}).configure({
    countries:['us'],
    type: 'city',
    aroundLatLngViaIP: false,
    useDeviceLocation: false
});

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
    //console.log(cities);
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

// Search for city that is clicked on from list
$(".list-group").on("click", "li", function(event) {
    event.preventDefault();
    cityText = $(this).text();
    getWeather(cityText);
});

// Get weather data from OpenWeatherAPI - return data
var getWeather = function(city) {
    var apiKey = "fa400288e1b24a95393c31ac7761f9ee";
    var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units=imperial";
    //data = {}
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("data is: ",data);
            displayWeather(data);
            displayUV(data);
        });
    // I need to call the uv api at http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key} with the lat long from data - probably create another function displayUV to display it.
    //console.log("data is:", data);
};

// Display weather data
var displayWeather = function(data){
    $("#city-display").text(data.name);
    $("#date-display").text(moment().format(" (MM/DD/YYYY)"));
    $("#icon-display").html("<img src='http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png'/>");
    $(".temp").text("Temperature: "+Math.round(data.main.temp*10)/10+" F");
    $(".humidity").text("Humidity: "+data.main.humidity+"%");
    $(".wind").text("Wind: "+Math.round(data.wind.speed*10)/10+" MPH");
    
};

// Fetch and display UV data
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

loadCities();