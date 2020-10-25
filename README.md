# Weather Dashboard Application
![Weather Dashboard](https://img.shields.io/github/languages/top/yooperjb/weather-dashboard)  ![GitHub language count](https://img.shields.io/github/languages/count/yooperjb/weather-dashboard)

## Description

This Weather Dashboard Application is a landing page to search for and display current and 5-day forecast weather data for any city.


![Dashboard](./assets/images/weather-dashboard.jpg)

## Features

The Weather Dashboard utilizes the OpenWeather API which provides both free and paid for weather data for any location on the globe. This application uses two free API products, the [Current Weather Data](https://openweathermap.org/current) and [One Call](https://openweathermap.org/api/one-call-api) APIs. 

The search feature uses the Algolia places address search autocompletion API. This API uses OpenStreetMap's open sourch database of worldwid places to help autofill the search form for weather data. Once a city is searched for it is added to the list of ten most recent searches. If the city already exists in the list, it is removed from the current location and added to the top of the list. If the list already contains ten cities in the search history it will remove the oldest and add the newest to the top. These cities are saved in the brower's local storage and reloaded upon page load.

Once a city is searched, current weather is displayed in the main weather frame which shows City, date, temperature, humidity, wind speed, and UV index. The UV index is colorized based on value - from low to extreme. Below the current weather is the 5-day Forecast panels showing the data, general weather description, max temperature, minimum temperature, and humidity. There is also a weather icon which changes based on the general weather desription and contains an alt value for accessibilty standards. 

## Using the Application

The application can be used by visiting the live version on GitHub pages, or can be downloaded or clones from the GitHub repo [here](https://github.com/yooperjb/weather-dashboard). 

## Viewing the Weather Dashboard

The Weather Dashboard can be viewed on GitHub pages [here](https://yooperjb.github.io/weather-dashboard/).

## Resources

Any third-party resource used in this application is listed here.

* [Bootstrap CSS](https://getbootstrap.com/)
* [OpenWeather API](https://openweathermap.org/api)
* [Algolia API](https://community.algolia.com/places/api-clients.html)
* [jQuery.js](https://jquery.com/)
* [Moment.js](https://momentjs.com/)
