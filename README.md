# city_weather_search
A search app for the weather of the city.

The purpose of this application is allow users to enter any city of their choice into a search bar and return the weather for that city. 
The weather information is retrieved from Open Weather via an API. Unlike the Star Wars Quote generator, weather app
has a dedicated API retrieved using an API key from a well established website, so it doesn't have the issues of
the previous project. The view displays weather information for five days in stylised cards.

The app was built using Javascript. I built the code originally for my bootcamp, twice, the second attempt using an objects based design. 

For GitHub, I've added two new features. 

The first is a background changer that responds to the description in today's weather, displaying a different background depending on the weather type.

The second is an autocomplete feature on the search. While I did have the option to include a full list of all the cities in the world, the slow down potential for this feature was intimidating. Instead I decided to make my own JSON file with an object of arrays that would somewhat simulate the difficulty of importing an API data object, without the potential slowdown problems it could cause for both myself and anyone using my portfolio.

I was interested in making this site modular but with the event listeners I expect it is a long task, as they rely on the global object for variables. Due to time constraints with other projects, I will have to put it on a future updates list. 

Work Order:
1. Build HTML structure (complete)
2. Integrate base weather app code and stylise (complete)
3. Implement the background changer (complete)
4. Implement the auto complete feature (complete)

Future Updates:
1. Improve the background designs with a consultation from a designer
2. Break the search.js into a modular structure of multiple files.
3. Implement keyboard controls on the autocomplete feature.

