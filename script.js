document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.getElementById("submitbtn");
    const currentCityElement = document.getElementById("currentCity");
    const currentTempElement = document.getElementById("currentTemp");
    const weatherDescElement = document.getElementById("weatherDesc");
    const weatherIcon = document.getElementById("weatherIcon");
    const celsiusRadio = document.querySelector('input[value="celsius"]');
    const fahrenheitRadio = document.querySelector('input[value="fahrenheit"]');
    
    let selectedUnit = "celsius";
    
    celsiusRadio.addEventListener("change", function() {
        selectedUnit = "celsius";
    });
    
    fahrenheitRadio.addEventListener("change", function() {
        selectedUnit = "fahrenheit";
    });
    
    submitButton.addEventListener("click", async function() {
        const cityName = document.getElementById("cname").value;
        
        try {
            const weatherData = await getWeatherData(cityName);
            
            if (weatherData) {
                currentCityElement.textContent = `City: ${weatherData.location.name}, ${weatherData.location.country}`;
                weatherDescElement.textContent = `Weather Description: ${weatherData.current.condition.text}`;
                weatherIcon.innerHTML = `<i class="fas ${getWeatherIconClass(weatherData.current.condition.code)}"></i>`;
                if (selectedUnit === "celsius") {
                    currentTempElement.textContent = `Current Temperature: ${weatherData.current.temp_c}°C`;
                } else {
                    currentTempElement.textContent = `Current Temperature: ${weatherData.current.temp_f}°F`;
                }
                const forecastData = await getForecastData(cityName);
                if (forecastData) {
                    updateForecastSection(forecastData.forecast.forecastday);
                }
            } else {
                currentCityElement.textContent = "City not found.";
                currentTempElement.textContent = "";
                weatherDescElement.textContent = "";
                weatherIcon.innerHTML = "";
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    });
    
    async function getForecastData(city) {
        const apiKey = "1782756a4a964a9fb8055026232108";
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching forecast data:", error);
            return null;
        }
    }

    function updateForecastSection(forecastDays) {
        const forecastSection = document.querySelector(".forecast");
        forecastSection.style.display = "block";
    
        forecastDays.forEach((day, index) => {
            const dayElement = document.getElementById(`day${index + 1}`);
            const dateElement = dayElement.querySelector(".forecast-date");
            const iconElement = dayElement.querySelector(".forecast-icon");
            const tempElement = dayElement.querySelector(".forecast-temp");
    
            dateElement.textContent = day.date;
            iconElement.innerHTML = `<i class="fas ${getWeatherIconClass(day.day.condition.code)}"></i>`;
            tempElement.textContent = `Temp: ${selectedUnit === "celsius" ? day.day.avgtemp_c : day.day.avgtemp_f}°${selectedUnit.toUpperCase()}`;
        });
    }

    async function getWeatherData(city) {
        const apiKey = "1782756a4a964a9fb8055026232108";
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
        
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
            return null;
        }
    }
    function getWeatherIconClass(conditionCode) {
        switch (conditionCode) {
            case 1000: // Clear
                return "fa-sun";
            case 1003: // Partly Cloudy
                return "fa-cloud-sun";
            case 1006: // Cloudy
                return "fa-cloud";
            case 1009: // Overcast
                return "fa-cloud";
            case 1030: // Mist
                return "fa-smog";
            case 1135: // Fog
                return "fa-smog";
            case 1063: // Showers
                return "fa-cloud-showers-heavy";
            case 1072: // Freezing Rain
                return "fa-cloud-showers-heavy";
            case 1150: // Light Rain
                return "fa-cloud-rain";
            case 1153: // Drizzle
                return "fa-cloud-rain";
            case 1180: // Light Snow
                return "fa-snowflake";
            case 1183: // Heavy Snow
                return "fa-snowflake";
            case 1192: // Rain
                return "fa-cloud-showers-heavy";
            case 1195: // Heavy Rain
                return "fa-cloud-showers-heavy";
            case 1240: // Showers
                return "fa-cloud-showers-heavy";
            case 1243: // Freezing Rain
                return "fa-cloud-showers-heavy";
            case 1276: // Snow
                return "fa-snowflake";
            case 1279: // Snow
                return "fa-snowflake";
            case 1282: // Thunderstorm
                return "fa-thunderstorm";
            case 1087: // Tornado
                return "fa-wind";
            case 1080: // Tornado
                return "fa-wind";
            case 1237: // Hail
                return "fa-icicles";
            default:
                return "fa-question-circle"; // Unknown condition, use a question mark icon
        }
    }
});