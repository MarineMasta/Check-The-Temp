//Important clicks and loads
$("#searchBtn").on("click",displayWeather);
$(document).on("click",invokePast);
$(window).on("load",loadLast);
$("#clearBtn").on("click",clearPast);

//Important variables to link to the html
//user-input  city
var chosenCity = "";
//city  form
var searchCity = $("#searchCity");
//search  button
var searchBtn = $("#searchBtn");
//clear  history button
var clearBtn = $("#clearBtn");
//current city title
var cityCurrent = $("#cityCurrent");
//current temp for chosen city
var tempCurrent = $("#tempCurrent");
//current humidity for chosen city
var humidityCurrent = $("#humidityCurrent");
//current wind speed for chosen city
var windSpeed = $("#windSpeed");
//current UV Index for chosen city
var uvIndex = $("#uvIndex");
//array for city names
var storedCity = [];

//API key, taken from openweathermap.org by creating a free account and copy pasting default key
var APIKey = "a08836c73c257e96565ed5c72f87a878";
// Making the API AJAX call, API was copied from the openweathermap.org site
function showWeather(chosenCity){
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + chosenCity + "&APPID=" + APIKey;
    $.ajax ( {
        url:apiURL,
        method:"GET",
    } ).then(function(response){
        
        console.log(response);
        //basing the icon on the response for weather
        var weatherIcon = response.weather[0].icon;
        //finding the icon from the openweathermap.org site's icons
        var iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + "@4x.png";
        // Finding the date format comes from https://developer.mozilla.org
        var date = new Date(response.dt*1000).toLocaleDateString();
        //displaying the chosen city name, the date, and the icon showing the current weather
        $(cityCurrent).html("TODAY'S WEATHER IN " + chosenCity.toUpperCase() + "<img src="+iconUrl+">");
        // displaying weather info, &#8457 comes from w3schools, formula to change temp to F comes from a simple google search
        var tempFar = (response.main.temp - 273.15) * 1.80 + 32;
        $(tempCurrent).html((tempFar).toFixed(1)+ " &#8457");
        // displaying humidity info
        $(humidityCurrent).html(response.main.humidity+" %");
        // displaying the wind speed, mph conversion comes from a quick google search
        var windS = response.wind.speed;
        var windmph = (windS*2.237).toFixed(1);
        $(windSpeed).html(windmph+"MPH");
        // display UVIndex, but  because of the API requirements, we need to assign lon and lat to the city first
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod == 200){
            //Using JSON and local storage to get the city name and information
            storedCity = JSON.parse(localStorage.getItem("namedCity"));
            console.log(storedCity);
            if (storedCity == null){
                storedCity = [];
                storedCity.push(chosenCity.toUpperCase());
                localStorage.setItem("namedCity",JSON.stringify(storedCity));
                addToList(chosenCity);
            }
            else {
                if(find(chosenCity)>0){
                    storedCity.push(chosenCity.toUpperCase());
                    localStorage.setItem("namedCity",JSON.stringify(storedCity));
                    addToList(chosenCity);
                }
            }
        }

    });
}
            function UVIndex(ln,lt){
            var uvURL="https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lt + "&lon=" + ln;
            $.ajax({
                url:uvURL,
                method:"GET"
                }).then(function(response){
                    $(uvIndex).html(response.value);
                });
            }
    

// Current section
function displayWeather(event) {
    if(searchCity.val() !== ""){
        chosenCity = searchCity.val();
        showWeather(chosenCity);
    }
}

//Forecast Section
function forecast(cityid){
    var futureURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:futureURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            //Date format is same as above
            var date = new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            //pulling icons
            var iconF = response.list[((i+1)*8)-1].weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/wn/"+iconF+".png";
            //temp comes in K
            var tempK = response.list[((i+1)*8)-1].main.temp;
            //Formula to change the temp to F
            var tempFar = (((tempK-273.5)*1.80)+32).toFixed(1);
            var humidity = response.list[((i+1)*8)-1].main.humidity;
        
            $("#dateFuture"+i).html(date);
            $("#iconFuture"+i).html("<img src="+iconUrl+">");
            //numbers for the F here is same as above
            $("#temperaturreFuture"+i).html(tempFar+"&#8457");
            $("#humidityFuture"+i).html(humidity+"%");
        }
        
    });
}

//adding cities to the history list - why is only the first search after each reset adding??
function addToList(chosenCity){
    var listEl = $("<li>"+chosenCity.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",chosenCity.toUpperCase());
    $(".list-group").append(listEl);
}

//showing old search results
function invokePast(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        chosenCity=liEl.textContent;
        showWeather(chosenCity);
    }

}
function loadLast(){
    $("ul").empty();
    var storedCity = JSON.parse(localStorage.getItem("namedCity"));
    if(storedCity !== null){
        storedCity = JSON.parse(localStorage.getItem("namedCity"));
        for(i=0; i<storedCity.length;i++){
            addToList(storedCity[i]);
        }
        chosenCity=storedCity[i-1];
        showWeather(chosenCity);
    }

}

//clearing  the  history 
function clearPast(event){
    event.preventDefault();
    storedCity=[];
    localStorage.removeItem("namedCity");
    document.location.reload();
}






















