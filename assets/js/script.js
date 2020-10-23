
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

// Display UV data
var displayUV = function(data) {
    var apiKey = "fa400288e1b24a95393c31ac7761f9ee";
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid="+apiKey;
    console.log(lat,lon,uvURL);
    fetch(uvURL)
        .then(response => response.json())
        .then(data => {
            console.log("UV is: ",data.value);
            $(".uv").text("UV Index: ");
            $("#uv-value").text("put value here: "+data.value);
        });

};


//getWeather("Arcata");
loadCities();