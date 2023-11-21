// Create a weather dashboard with form inputs.
// When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
// When a user views the current weather conditions for that city they are presented with:

// When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:
// The date
// An icon representation of weather conditions
// The temperature
// The humidity
// When a user click on a city in the search history they are again presented with current and future conditions for that city




var APIKey = "1b00349d95f30cc4da6793e8861ce8ed";
var latitude;
var longitude;
var today = dayjs().format('DD/MM/YYYY');
var header = $(".weather-header");
var recent;
var recentTab = $("#history");

//Get search location coordinates 
function getWeather(inputValue) {
  var geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?q="  + inputValue + "&limit=1&appid=" + APIKey;
  console.log(geocodeURL)
  fetch(geocodeURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    latitude = data[0].lat.toFixed(2);
    longitude = data[0].lon.toFixed(2);
    showWeather()
  })
}


//search button event
searchButton = $('.search-button');
searchButton.on('click', function(event) {
    event.preventDefault();
    getWeather($(".weather-search").val());
    recentlyViewed();
})



var fiveDayList;

//Get weather information for specific location and display it to the page
function showWeather() {
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey;
    fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        var todaySection = $("#today");
        todaySection.html("");
        // The city name
            // The date
        var cityName = $("<h3>").text(data.city.name + " (" + today + ")");
        var icon =$("<img>").attr("src", "https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png")
        cityName.append(icon);
        // An icon representation of weather conditions
        var temperature = $("<h5>").text("Temperature: " + (data.list[0].main.temp - 273.15).toFixed(1) + "°C");
        var humidity = $("<h5>").text("Humidity: " + data.list[0].main.humidity + "%");
        // The temperature
        var windSpeed = $("<h5>").text("Wind speed: " + data.list[0].wind.speed + "m/s");
        // The wind speed
        todaySection.append(cityName, temperature, humidity, windSpeed);
        fiveDayList = [];
        for (i=0; i<data.list.length; i+=8) {
            fiveDayList.push(data.list[i]);
        }
        console.log(fiveDayList);
        forecast.html("");
        for(j=0; j<fiveDayList.length;j++) {
            cardContent(j);
        }
    })
}

// Make cards for the five day forecast 
var forecast = $("#forecast");

function cardContent(el) {
    var card = $('<div class="card mx-auto"></div>');
    var cardBody = $("<div>").addClass('card-body');
    var date = $('<h4>').text(dayjs().add(el, "day").format("DD/MM/YYYY"));
    var temperature = $("<p>").text("Temperature: " + (fiveDayList[el].main.temp - 273.15).toFixed(1) + "°C");
    var icon =$("<img>").attr("src", "https://openweathermap.org/img/wn/" + fiveDayList[el].weather[0].icon + "@2x.png")
    var humidity = $("<p>").text("Humidity: " + fiveDayList[el].main.humidity + "%");
    var windSpeed = $("<p>").text("Wind speed: " + fiveDayList[el].wind.speed + "m/s");
    cardBody.append(date, icon, temperature, humidity, windSpeed);
    card.append(cardBody);
    forecast.append(card);
}

function recentlyViewed() {
    recentTab.html("");
    recent = JSON.parse(localStorage.getItem("recentSearch")) || [];
    if(recent.length <= 4 && recent.includes($(".weather-search").val()) === false && $(".weather-search").val() != null) {
        recent.unshift($(".weather-search").val());
    } else if (recent.length > 4 && recent.includes($(".weather-search").val()) === false && $(".weather-search").val() != null)  {
        recent.pop();
        recent.unshift($(".weather-search").val());
    }
    localStorage.setItem("recentSearch", JSON.stringify(recent));
    console.log("Recent: " + recent);
    for (i=0;i<recent.length;i++){
        if(recent[i] != "") {
        var recentButton = $("<button>").addClass("btn btn-outline-dark recent-button").text(recent[i]);
        recentTab.append(recentButton);
    }
    }
}


//Show Weather when clicking a recent search
recentTab.on("click", ".recent-button", function(event) {
    getWeather($(event.target).text())
}); 


//Load recent buttons on page load
$(document).ready(function() {
    JSON.parse(localStorage.getItem("recentSearch"));
    if(recent != []) {
    recentlyViewed();
}
})



//Change header background based on time of day

function navChange() {
    var timeNow = dayjs().format("HH");
    if(5 <= Number(timeNow) && Number(timeNow) < 12) {
        header.attr("id", "morning");
    } else if (12<= Number(timeNow) && Number(timeNow) < 17) {
        header.attr("id", "day");
    } else if (17<= Number(timeNow) && Number(timeNow) < 22) {
        header.attr("id", "evening");
    } else if (Number(timeNow) >= 22 || Number(timeNow) < 5) {
        header.attr("id", "night");
    }
    console.log(header)
    console.log(timeNow)
}

navChange();