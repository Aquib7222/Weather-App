async function getWeather(event) {
    event.preventDefault();
    const inputElement = document.getElementById('search');
    const city = inputElement.value;
    const apiKey = '7767c2731bfbda217adbc3ea327fe127';  // Replace with your OpenWeatherMap API key

    // URLs for current weather and 5-day forecast
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        // Fetch current weather
        const weatherResponse = await fetch(currentWeatherUrl);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod === 200) {
            // Display current weather details
            displayCurrentWeather(weatherData);

            // Fetch 5-day forecast
            const lat = weatherData.coord.lat;
            const lon = weatherData.coord.lon;
            const forecastResponse = await fetch(forecastUrl.replace('{lat}', lat).replace('{lon}', lon));
            const forecastData = await forecastResponse.json();

            // Display 4-day forecast (every 24 hours)
            displayForecast(forecastData);
        } else {
            document.getElementById('temp').innerText = 'City not found';
        }
    } catch (error) {
        document.getElementById('weather').innerText = 'Error fetching weather data. Please try again.';
    }
}

// Function to display current weather
function displayCurrentWeather(data) {
    const cityName = data.name;
    const roundedTemp = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const feelsLike = Math.round(data.main.feels_like);
    const pressure = data.main.pressure;
    const windSpeed = data.wind.speed;
    const cloudiness = data.clouds.all;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    
    
    const currentTime = new Date().toLocaleTimeString();
    const country = data.sys.country;

    const weatherIcon = data.weather[0].icon;
    const weatherDescription = data.weather[0].description;

    const weatherImage = document.getElementById('image');
    weatherImage.src = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
    weatherImage.alt = weatherDescription;

    weatherImage.style.width = '150px';
    weatherImage.style.height = '150px';
    weatherImage.style.marginTop = '-50px';

    document.getElementById('temp').innerText = `${roundedTemp}°C`;
    document.getElementById('humidity').innerText = `${humidity}%`;
    document.getElementById('wind').innerText = `${windSpeed}m/s`;
    document.getElementById('cloud').innerText = `${cloudiness}%`;
    document.getElementById('uv').innerText = `${roundedTemp}°C`;
    document.getElementById('pressure').innerText = `${pressure}hPa`;
    document.getElementById('sunrise').innerText = `${sunrise}`;
    document.getElementById('date_time').innerText = `${date} at ${currentTime}`;
    document.getElementById('city_name').innerText = `${cityName}, ${country}`;
    document.getElementById('feels_like').innerText = `Feels Like ${feelsLike}°C`;
}

// Function to display 4-day forecast
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');

    // Clear previous forecast
    forecastContainer.innerHTML = '';

    // Filter data to get forecast every 24 hours
    const dailyForecasts = data.list.filter((forecast, index) => index % 8 === 0).slice(1, 8);

    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        const roundedTemp = Math.round(forecast.main.temp);
        const weatherIcon = forecast.weather[0].icon;
        const weatherDescription = forecast.weather[0].description;
        
        // Create forecast card
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');
        forecastCard.innerHTML = `
            <h5>${date}</h5>
            <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weatherDescription}">
            <p>${roundedTemp}°C</p>
            <p>${weatherDescription}</p>
        `;
        forecastContainer.appendChild(forecastCard);
    });
}



// window.addEventListener('resize', toggleDropdown);
if(window.innerWidth<600){
    const weatherOptions = document.getElementById('forecast_dropdown');
const todaysWeather = document.getElementById('todays_weather');
const fourDaysWeather = document.getElementById('forecast');

function handleScreenResize(){
    if(window.innerWidth < 600){
        weatherOptions.style.display='block';
        weatherOptions.addEventListener('change', function(){
            if(this.value === 'todays'){
                todaysWeather.style.display='block';
                fourDaysWeather.style.display='none';
                todaysWeather.style.display='flex';
            }else if(this.value==='four_days'){
                todaysWeather.style.display='none';
                fourDaysWeather.style.display='block';
                fourDaysWeather.style.display='flex';
                fourDaysWeather.style.marginTop='50px';
                
            }
        });
    }else{
        todaysWeather.style.display='block';
        fourDaysWeather.style.display='none';
        weatherOptions.style.display='none';
    }
    
}
window.addEventListener('resize',handleScreenResize);
    handleScreenResize();

}


