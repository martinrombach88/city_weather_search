//~~~~~~~~~~~~~~~~~~ EVENT LISTENERS ~~~~~~~~~~~~~~~~~~ //

const search = document.querySelector("#search");
const searchSubmit = document.querySelector("#searchSubmit")
const results = document.querySelector("#results");
const autoComplete = document.querySelector("#autoComplete");
const autoResults = document.querySelector("#autoResults");
let autoArray = [];
autoResults.setAttribute("class", "displayNone");
resultsClicked = false;


search.addEventListener("focus", function(e) {
    search.value = "";
})

search.addEventListener("keyup", function(e) {
    let query = e.target.value;
    getAutoArray("assets/citylist/citylist.json", query); 
})

searchSubmit.addEventListener("submit", function(e) {
    e.preventDefault();
    getWeather(search.value);
    emptyAutoResults();
    search.value = "";
})


//~~~~~~~~~~~~~~~~~~ AUTOCOMPLETE ~~~~~~~~~~~~~~~~~~ //

function getAutoArray(json, query) {
    const citiesArray = [];
    fetch(json)
    .then((response) => {
        return response.json();
    })
    .then((data) => {    
        for (let i = 0; i < data.cities.length; i++) {
            for (key in data.cities[i]) {
                for (let j=0; j < data.cities[i][key].length; j++) {
                    citiesArray.push(data.cities[i][key][j]);
                };
            }        
        }
    autoArray = setAutoArray(citiesArray, query);
    if(query) {
        createAutoResults(autoArray, query);
        resultsClick();
    } else {
        emptyAutoResults();
    }
    })
}

function setAutoArray(array, query) {
    let autoArray = [];  
    for (let i=0; i < array.length; i++) {
        if (array[i].substr(0, query.length).toUpperCase() == query.toUpperCase()) {
            autoArray.push(array[i]);
        }
    }
    return autoArray;
}

function createAutoResults(autoArray){
    autoResults.innerHTML = "";
    autoResults.setAttribute("class", "display");
        
    for(let i = 0; i < autoArray.length; i++) {  
        let resultDiv = document.createElement('div');
        resultDiv.textContent = autoArray[i];
        resultDiv.setAttribute("class", "result")
        autoResults.appendChild(resultDiv);
    }
}

const emptyAutoResults = function() {
    autoResults.classList.add('displayNone');
    autoResults.classList.remove('display');
    autoResults.innerHTML = "";
}

const resultsClick = function() {
    let divs = document.getElementsByClassName("result");
    for (let i = 0; i < divs.length; i++){
        divs[i].addEventListener('click', function(e) {
            search.value = divs[i].textContent;
            emptyAutoResults();
        })
    }
}

//~~~~~~~~~~~~~~~~~~ DATA RETRIEVAL ~~~~~~~~~~~~~~~~~~ //

function getWeather(city)  {
    
    const APP_ID = "1cbfb739f9b6cfae7ea0cc16fe258306";
    let xhr = new XMLHttpRequest();
    let citySelect = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid="+ APP_ID;
    xhr.open('GET', citySelect);
    xhr.addEventListener('load', function() {
        if (xhr.status == 200) {
            results.innerHTML = "";
            let weatherResponse = JSON.parse(xhr.response);
            let filteredWData = filterWeatherData(weatherResponse.city.name, weatherResponse.list);
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


//~~~~~~~~~~~~~~~~~~ HTML STRUCTURE ~~~~~~~~~~~~~~~~~~ //

//Create Default Values Shared by All Days
function createDayDefault(parent, data, index) {
    let day = createItem('h3', data[index].day),
    desc = createItem('p', data[index].description),
    temp = createItem('p', `temperature: ${(data[index].temperature - 273.15).toFixed(1)}°`);
    parent.appendChild(day);
    parent.appendChild(desc);
    parent.appendChild(temp);
    console.log(desc.textContent);

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

    //Set Background
    desc = todayContainer.firstChild.nextSibling.nextSibling.nextSibling;

    if (desc.textContent === "overcast clouds" || desc.textContent === "broken clouds" || desc.textContent === "scattered clouds") {
        document.body.setAttribute("id", "cloudyBody");
    } else if (desc.textContent === "clear sky" || desc.textContent === "few clouds") {
        document.body.setAttribute("id", "clearBody");
    } else if (desc.textContent === "light rain" || desc.textContent === "shower rain") {
        document.body.setAttribute("id", "rainyBody");
    } else if (desc.textContent === "snow") {
        document.body.setAttribute("id", "snowyBody");
    } else if (desc.textContent === "thunderstorm") {
        document.body.setAttribute("id", "stormyBody");
    } else if (desc.textContent === "mist") {
        document.body.setAttribute("id", "mistyBody");
    }
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
    let icon = document.createElement('img');
    icon.setAttribute("src", "http://openweathermap.org/img/w/" + data + ".png");
    return icon; 
}


