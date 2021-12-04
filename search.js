search = document.querySelector("#search");

search.addEventListener("focus", function(e) {
    search.value = "";
})

search.addEventListener("keyup", function(e) {
    if(e.key == 'Enter') {
        console.log(e.target.value);
        getWeather(e.target.value);
    }
})


function getWeather(city) {
    const APP_ID = "1cbfb739f9b6cfae7ea0cc16fe258306";
    let xhr = new XMLHttpRequest();
    let citySelect = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid="+ APP_ID;
    xhr.open('GET', citySelect);
    xhr.addEventListener('load', function() {
        if (xhr.status == 200) {
            let weatherResponse = JSON.parse(xhr.response);
            console.log(weatherResponse);
        }
    })
    xhr.send(null);
}

function getDayName(dateStr, locale)
{
    let date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}

