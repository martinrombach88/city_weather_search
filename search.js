search = document.querySelector("#search");

search.addEventListener("focus", function(e) {
    search.value = "";
})

search.addEventListener("keyup", function(e) {
    if(e.key == 'Enter') {
        getWeather(e.target.value);
    }
})

//Getting the Data

function getWeather(city)  {
    const results = document.querySelector("#results");
    const APP_ID = "1cbfb739f9b6cfae7ea0cc16fe258306";
    let xhr = new XMLHttpRequest();
    let citySelect = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid="+ APP_ID;
    xhr.open('GET', citySelect);
    xhr.addEventListener('load', function() {
        if (xhr.status == 200) {
            results.innerHTML = "";
            let weatherResponse = JSON.parse(xhr.response);
            let filteredWData = filterWeatherData(weatherResponse.city.name, weatherResponse.list);
            console.log(filteredWData);
            setToday(results, filteredWData);
            setOtherContainer(results, filteredWData);
        }
    })
    xhr.send(null);
}

function getDayName(dateStr, locale)
{
    let date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}


function filterWeatherData(city, dataList) {
    let weatherArray = [];
    let j = 0;

    for (let i = 1; i < dataList.length; i+=8) {
        weatherArray[j] = {
            city: city, 
            icon: dataList[i].weather[0].icon,
            day: getDayName(dataList[i].dt_txt),
            description: dataList[i].weather[0].description,
            temperature: dataList[i].main.temp,
            wind: dataList[i].wind.speed, 
            pressure: dataList[i].main.pressure,
            humidity: dataList[i].main.humidity,
            cloudiness: dataList[i].clouds.all
        }
        j++
    }
    
    return weatherArray;
}

//Create HTML and Set Data

//Create Default Values Shared by All Days
function createDayDefault(parent, data, index) {
    let day = createItem('h3', data[index].day),
    desc = createItem('p', data[index].description),
    temp = createItem('p', `temperature: ${(data[index].temperature - 273.15).toFixed(1)}°`);
    parent.appendChild(day);
    parent.appendChild(desc);
    parent.appendChild(temp);
}

//Create HTML Structure - Today and Container
function setToday(parent, dataList) {
    //Container
    let todayContainer = createItem('div');
    todayContainer.classList.add('today', 'container');
    parent.appendChild(todayContainer);

    //City, Icon, Default Values
    let city = createItem('h2', dataList[0].city);
    let icon = createIcon(dataList[0].icon);
    todayContainer.appendChild(city);
    todayContainer.appendChild(icon);
    createDayDefault(todayContainer, dataList, 0);

    //Inner Div
    let tInnerDiv = createItem('div');
    tInnerDiv.classList.add('innerDiv');
    tInnerDivSide1 = createItem('div'),
    tInnerDivSide2 = createItem('div'),
    wind = createItem('p', `wind speed: ${dataList[0].wind} m/s`),
    pres = createItem('p', `pressure: ${dataList[0].pressure}hPa`),
    humi = createItem('p', `humidity: ${dataList[0].humidity}%`),
    clou = createItem('p', `cloudiness: ${dataList[0].cloudiness}%`);

    //Append Child
    todayContainer.appendChild(tInnerDiv);
    tInnerDiv.appendChild(tInnerDivSide1);
    tInnerDiv.appendChild(tInnerDivSide2);
    tInnerDivSide1.appendChild(wind);
    tInnerDivSide1.appendChild(pres);
    tInnerDivSide2.appendChild(humi);
    tInnerDivSide2.appendChild(clou);
}

//Create HTML Structure - Other Days and Container
function setOtherContainer(parent, data) {
    let otherDaysContainer = createItem('div');
    otherDaysContainer.classList.add('allOther', 'container');
    parent.appendChild(otherDaysContainer);
    for (let i = 1; i <= 4; i++){
        setOtherDay(otherDaysContainer, data, i);
    }
}

function setOtherDay(parent, dataList, index) {
    let otherDayContainer = createItem('div');
    otherDayContainer.classList.add('otherDay');
    let icon = createIcon(dataList[index].icon);
    parent.appendChild(otherDayContainer);
    createDayDefault(otherDayContainer, dataList, index);
    otherDayContainer.insertBefore(icon, otherDayContainer.firstChild.nextSibling);   
}

//Create Individual Elements and Icons
function createItem(tag, data) {
    let item = document.createElement(tag);
    item.textContent = data;
    return item;   
}

function createIcon(data) {
    let icon = document.createElement('img'); // Should be skeleton Phase
    icon.setAttribute("src", "http://openweathermap.org/img/w/" + data + ".png"); //Should be Populate phase
    return icon; 
}

//Set Background 
function setBackground(data, array) {
    
    const backgroundArray = ['few clouds', 'scattered clouds', 'broken clouds', 'shower rain', 'rain', 'thunderstorm', 'snow', 'mist', 'clear sky'];

}

//LOGIC - 
//if data includes description X, change to background X.
//Background changes set on body.

//Use data[index].description to reference the description.

//Get backgrounds first

