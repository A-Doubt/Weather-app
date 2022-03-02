// since this API is free no harm done leaking it
// 49f5c57e6c9d12a7b3940cf63bfe2742
import './style.scss';
import sunIcon from './assets/wi-day-sunny.svg';

let weather;

const form = document.querySelector('.city-input-form');
form.onsubmit = (async (e) => {
	e.preventDefault();
	const input = form.querySelector('input');
	const inputValue = input.value.trim();

	await getWeather7Days(inputValue);
	await populateWeatherArray(inputValue)
	await populateForecast(weather);
	input.value = '';
})


async function getCurrentWeather(city) {
	const currentWeather = {};
	const weatherData = await getWeatherData(city);
	console.log('weatherData: ', weatherData);

	currentWeather.date = new Date(weatherData.dt * 1000).toISOString().split('T')[0];
	currentWeather.tempC = Number((weatherData.main.temp - 273.15).toFixed(1));
	currentWeather.tempF = Number((1.8 * (weatherData.main.temp - 273.15) + 32).toFixed(1));
	currentWeather.feelsLikeC = Number((weatherData.main['feels_like'] - 273.15).toFixed(1));
	currentWeather.feelsLikeF = Number((1.8 * (weatherData.main.temp - 273.15) + 32).toFixed(1));
	currentWeather.windDeg = weatherData.wind.deg;
	currentWeather.windSpeed = weatherData.wind.speed;
	currentWeather.clouds = weatherData.clouds.all;
	currentWeather.humidity = weatherData.main.humidity;
	currentWeather.pressure = weatherData.main.pressure;
	currentWeather.weatherId = weatherData.weather[0].id;
	currentWeather.weatherDescription = weatherData.weather[0].description;


	console.table(currentWeather);
	weather.push(currentWeather);
}

async function getWeatherData(city) {
	const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=49f5c57e6c9d12a7b3940cf63bfe2742`,{ mode: 'cors', });
	const weatherData = await response.json();
	return weatherData;
}

async function getCoords(city) {
	const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=49f5c57e6c9d12a7b3940cf63bfe2742`)
	const data = await response.json();

	let lat = data.coord.lat;
	let lon = data.coord.lon;

	console.log(`${city} coords: ${lat} ${lon}`);

	return {lat, lon};
}

async function getData7days({lat, lon}) {
	const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=49f5c57e6c9d12a7b3940cf63bfe2742`);
	const data = await response.json();

	return data;
}


async function getWeather7Days(city) {
	const coords = await getCoords(city)
	const data = await getData7days(coords);

	return data;
}

async function populateWeatherArray(city) {
	// empty the weather array
	weather = [];

	// gather data from API for next 7 days
	const data = await getWeather7Days(city);
	const dailyData = data.daily;

	// make an object for each day and push it to weather array
	for (let i = 1; i <= 7; i++) {
		let dayWeather = {
			day: new Date(dailyData[i].dt * 1000).toLocaleString('en-gb', {weekday:'long'}),
			date: new Date(dailyData[i].dt * 1000).toISOString().split('T')[0],
			hiTempC: (dailyData[i].temp.max - 273.15).toFixed(1),
			lowTempC: (dailyData[i].temp.min - 273.15).toFixed(1),
			hiTempF: (1.8 * (dailyData[i].temp.max - 273.15) + 32).toFixed(1),
			lowTempF: (1.8 * (dailyData[i].temp.min - 273.15) + 32).toFixed(1),
			id: dailyData[i].weather[0].id,
		}
		weather.push(dayWeather);
	}

	console.log(data);
	console.log('Weather array: ', weather);
}

async function populateForecast(weatherArray) {
	const forecast = document.querySelector('.forecast');
	forecast.innerHTML = '';

		// NOT FINISHED HERE

	// weatherArray.forEach((day) => {
	// 	forecast.insertAdjacentHTML('beforeend',
	// 		`<div class="day-card">
	// 		<h4>${day.day}</h4>
	// 		<p class="max">${day.hiTempC}</p>
	// 		<p class="min">${day.lowTempC}</p>
	// 		<img src=${sunIcon}>
	// 		</div>`
	// 	)
	// });
}


// populateWeatherArray('london');
// getWeather7Days('london');




