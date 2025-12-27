const searchInput = document.getElementById('weather-search-input');
const searchBtn = document.getElementById('weather-search-btn');
const loadingDiv = document.getElementById('weather-loading');
const errorDiv = document.getElementById('weather-error');
const resultsDiv = document.getElementById('weather-results');
const modeToggle = document.getElementById('weather-mode-toggle');

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});


modeToggle.addEventListener('click', toggleDarkMode);


function initTheme() {
    const savedTheme = localStorage.getItem('weather-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        modeToggle.textContent = 'Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        modeToggle.textContent = 'Dark Mode';
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('weather-theme', 'dark');
        modeToggle.textContent = 'Light Mode';
    } else {
        localStorage.setItem('weather-theme', 'light');
        modeToggle.textContent = 'Dark Mode';
    }
}


initTheme();

function handleSearch() {
    const cityName = searchInput.value.trim();
    
    if (!validateInput(cityName)) {
        return;
    }
    
    fetchWeatherData(cityName);
}
//dito yung pag vavalidate ng input ng user
function validateInput(cityName) {
    if (cityName === '') {
        showError('please enter a city name');
        return false;
    }
    
    if (/[<>{}[\]\\]/.test(cityName)) {
        showError('special characters are not allowed');
        return false;
    }
    
    return true;
}

function showError(message) {
    errorDiv.innerHTML = message;
    errorDiv.style.display = 'flex';
    resultsDiv.style.display = 'none';
}

function hideError() {
    errorDiv.style.display = 'none';
}

function showLoading() {
    loadingDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    resultsDiv.style.display = 'none';
    searchBtn.disabled = true;
    searchBtn.innerHTML = 'Processing...';
}

function hideLoading() {
    loadingDiv.style.display = 'none';
    searchBtn.disabled = false;
    searchBtn.innerHTML = 'Search';
}

//dito yung pag kuha ng weather galing sa   api
async function fetchWeatherData(cityName) {
    showLoading();
    
    try {
        const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(cityName) + '&appid=' + API_KEY + '&units=metric';
        
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('city not found');
            } else if (response.status === 401) {
                throw new Error('invalid api key');
            } else {
                throw new Error('error fetching weather data');
            }
        }
        
      
        const data = await response.json();
        displayWeatherData(data);
        
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            showError('no internet connection or server error');
        } else {
            showError(error.message);
        }
    } finally {
        hideLoading();
    }
}

// display weather 
function displayWeatherData(data) {
    hideError();
    
    document.getElementById('weather-city-name').textContent = data.name + ', ' + data.sys.country;
    document.getElementById('weather-date').textContent = formatDate(new Date());
    document.getElementById('weather-temp').textContent = Math.round(data.main.temp);
    document.getElementById('weather-description').textContent = data.weather[0].description;
    document.getElementById('weather-feels-like').textContent = Math.round(data.main.feels_like) + '°C';
    document.getElementById('weather-humidity').textContent = data.main.humidity + '%';
    document.getElementById('weather-wind').textContent = data.wind.speed + ' m/s';
    document.getElementById('weather-visibility').textContent = (data.visibility / 1000).toFixed(1) + ' km';
    document.getElementById('weather-pressure').textContent = data.main.pressure + ' hPa';
    document.getElementById('weather-sunrise').textContent = formatTime(data.sys.sunrise * 1000);
    document.getElementById('weather-sunset').textContent = formatTime(data.sys.sunset * 1000);
    
    resultsDiv.style.display = 'block';
}

function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return dayName + ', ' + month + ' ' + day + ', ' + year;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return hours + ':' + minutes + ' ' + ampm;
}
