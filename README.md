# city_weather_search
A search app for the weather of the city.

The purpose of this application is allow users to enter any city of their choice into a search bar and return the weather for that city. 
The weather information is retrieved from Open Weather via an API. Unlike the Star Wars Quote generator, weather app
has a dedicated API retrieved using an API key from a well established website, so it doesn't have the issues of
the previous project. The view displays weather information for five days in stylised cards.


Today's card includes:
- The day
- A description of the weather
- An icon for the weather
- The temperature
- The wind speed
- The humidity
- The air pressure
- The cloudiness

Other days include:
- The day
- An icon for the weather
- A description of the weather

The app was built using Javascript. I built the code originally for my bootcamp, twice, the second attempt using an objects based design.
For GitHub, I plan to add two new features. The first is a background changer, where I will use DOM manipulation to add unique backgrounds
depending on the weather shown in the 'Today' container. I will also add an autocomplete, which triggers when the user writes, before they commit
to a choice with Enter. Finally, I've been studying how to build websites in a modular way. I hope to break this website down into a division of get data
and set data, using separate js files to make the site more modular.

Work Order:
1. Build HTML structure (complete)
2. Integrate base weather app code and stylise (complete)

Future Updates:
1. Implement the background changer
2. Implement the auto complete feature 
3. Attempt to reorganise in a modular way.
