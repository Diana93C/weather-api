# Open Weather 

## Project Description

This is a weather application that displays current weather information for any city worldwide. The application uses the OpenWeather API to fetch real-time weather data including temperature, humidity, wind speed, visibility, pressure, sunrise, and sunset times. The interface is fully responsive and works seamlessly on desktop, tablet, and mobile devices. Users can search for weather information by entering a city name in the search bar.

## API Details Used

### Base URL
https://api.openweathermap.org/data/2.5

### Endpoints

1. Current Weather Data
   Endpoint: /weather
   Method: GET
   Description: Retrieves current weather data for a specified city

2. Weather by City Name
   Endpoint: /weather?q={city name}
   Method: GET
   Description: Fetches weather information using city name as parameter

3. Weather with Units
   Endpoint: /weather?q={city name}&units=metric
   Method: GET
   Description: Returns weather data with temperature in Celsius

### Required Parameters

Query Parameters:
- q: City name (required) - Example: "Manila" or "New York"
- appid: API key (required) - Your OpenWeather API key
- units: Temperature units (optional) - "metric" for Celsius, "imperial" for Fahrenheit, default is Kelvin

### Authentication

API Key
The OpenWeather API requires an API key for authentication. You need to:
1. Sign up for a free account at https://openweathermap.org/api
2. Generate an API key from your account dashboard
3. Store the API key in the config.js file
4. Replace "YOUR_API_KEY_HERE" with your actual API key

### Sample JSON Response

{
  "coord": {
    "lon": 120.9822,
    "lat": 14.6042
  },
  "weather": [
    {
      "id": 801,
      "main": "Clouds",
      "description": "few clouds",
      "icon": "02d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 28.5,
    "feels_like": 32.1,
    "temp_min": 27.8,
    "temp_max": 29.2,
    "pressure": 1013,
    "humidity": 75
  },
  "visibility": 10000,
  "wind": {
    "speed": 3.5,
    "deg": 180
  },
  "sys": {
    "type": 1,
    "id": 8160,
    "country": "PH",
    "sunrise": 1696809600,
    "sunset": 1696852800
  },
  "timezone": 28800,
  "id": 1701668,
  "name": "Manila",
  "cod": 200
}

### Fetch the Data (JavaScript)

The application uses the fetch() API with async/await to retrieve weather data:

async function fetchWeatherData(cityName) {
    showLoading();
    
    try {
        const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(cityName) + '&appid=' + API_KEY + '&units=metric';
        
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Hindi namin mahanap ang lungsod na yan');
            } else if (response.status === 401) {
                throw new Error('Invalid API key');
            } else {
                throw new Error('May problema sa pagkuha ng data');
            }
        }
        
        const data = await response.json();
        displayWeatherData(data);
        
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            showError('Walang internet connection o may problema sa server');
        } else {
            showError(error.message);
        }
    } finally {
        hideLoading();
    }
}

## Instructions to Run the Project

Step 1: Get an API Key
Visit https://openweathermap.org/api and create a free account. Navigate to your API keys section and generate a new key.

Step 2: Configure the API Key
Open the config.js file in the weather folder. Replace "YOUR_API_KEY_HERE" with your actual OpenWeather API key.

Step 3: Open the Project
Open the index.html file in a web browser. You can either:
- Double-click the index.html file to open it directly
- Use a local server like XAMPP, WAMP, or Live Server extension in VS Code
- Use Python's built-in server: python -m http.server 8000

Step 4: Use the Application
Enter a city name in the search bar and click the Search button or press Enter. The application will fetch and display the current weather information for that city.

Step 5: Troubleshooting
If you encounter errors:
- Verify your API key is correct in config.js
- Check your internet connection
- Ensure the city name is spelled correctly
- Make sure you are using a local server if opening directly in browser causes CORS issues
