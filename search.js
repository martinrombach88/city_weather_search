//~~~~~~~~~~~~~~~~~~ EVENT LISTENERS ~~~~~~~~~~~~~~~~~~ //

const search = document.querySelector("#search");
const searchSubmit = document.querySelector("#searchSubmit")
const results = document.querySelector("#results");
const autoComplete = document.querySelector("#autoComplete");
const autoResults = document.querySelector("#autoResults");
let autoArray = [];
autoResults.setAttribute("class", "displayNone");
var currentFocus = -1;



search.addEventListener("focus", function(e) {
    search.value = "";
})

search.addEventListener("keydown", function(e) {
    // console.log(`search:el:keydown ${e.keyCode}`);
    if (e.keyCode == 13) {
        e.preventDefault();
        emptyAutoResults();
        // return false;
    }
});

search.addEventListener("keyup", function(e) {
    if(e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 13) {
        setArrowKeys(e);
        
    } else {
        let query = e.target.value;   
        getAutoArray("assets/citylist/citylist.json", query); 
    }
})




function setArrowKeys(e) { 
        var x = document.getElementById("autoResults");
        if (x) x = x.getElementsByTagName("div"); 
        //If x (autoResults exists) then reassign x to be an array of all child divs.
        //Current focus will contain the value of the index 
        // of that array that is currently selected.
        if (e.keyCode == 40) {
            
        currentFocus++;  //Index +1, so restyle the div with the current index
        //That div is now the active div because it has a class on it.
        //The index of the item within the array is the indicator 

        addActive(x);
        } else if (e.keyCode == 38) { //Index -1, restyle the previous div,
        
        currentFocus--;
        addActive(x);
        } else if (e.keyCode == 13) {
            search.value = x[currentFocus].textContent;
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        //search.value 

        

    }
}

searchSubmit.addEventListener("submit", function(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        // console.log(`I am in ${searchSubmit}, key code ${e.keyCode} has been pressed.`);
    } else {
        e.preventDefault();
        getWeather(search.value);
        emptyInnerHTML();
        emptyAutoResults();
        search.value = "";
    }

})


//~~~~~~~~~~~~~~~~~~ AUTOCOMPLETE ~~~~~~~~~~~~~~~~~~ //

function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0; //If you scroll below the end, it goes back to the top.
    if (currentFocus < 0) currentFocus = (x.length - 1); //If you scroll above the list, it goes to the bottom
    //Add result selected to the div which has the 'currentFocus', identified by the index set by the arrows
    x[currentFocus].classList.add("resultSelected");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("resultSelected");
    }
  }

function getAutoArray(json, query) {
    const citiesArray = [];
    fetch(json) //Ask the server for the value, first thing that comes back is a response.
    .then((response) => { //Then deal with the response (Promise 1)
        return response.json();
    })
    .then((data) => { //(Promise 2) This fires when promise 1 is complete
        if (data.cities) {
            for (let i = 0; i < data.cities.length; i++) {
                for (key in data.cities[i]) {
                    for (let j=0; j < data.cities[i][key].length; j++) {
                        citiesArray.push(data.cities[i][key][j]);
                    };
                }        
            }
        } else {
            alert(`Data not found.`);
        }

    autoArray = setAutoArray(citiesArray, query);
    if(query) {
        createAutoResults(autoArray, query);
        resultsClick();

    } else {
        emptyInnerHTML();
        emptyautoResults();
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

const emptyInnerHTML = function() {
    autoResults.innerHTML = "";
}

const emptyAutoResults = function() {
    autoResults.classList.add('displayNone');
    autoResults.classList.remove('display');
}

const resultsClick = function() {
    let divs = document.getElementsByClassName("result");
    for (let i = 0; i < divs.length; i++){
        divs[i].addEventListener('click', function(e) {
            search.value = divs[i].textContent;
            emptyInnerHTML();
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


