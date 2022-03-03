// since this API is free no harm done leaking it
// 49f5c57e6c9d12a7b3940cf63bfe2742
import { getWeatherToday } from './DOM_functions';
import { populateForecast } from './DOM_functions';
import { chooseIcon } from './DOM_functions';
import { populateWeatherToday } from './DOM_functions';
import './style.scss';

let weather;
let weatherToday;

let form = document.querySelector('.city-input-form');

form.addEventListener('submit', renderOnSubmit);

export async function renderOnSubmit(e) {
	e.preventDefault();
	const input = form.querySelector('input');
	const inputValue = input.value.trim();

	// await populateWeatherToday(inputValue);
	await getWeather7Days(inputValue);
	await populateWeatherArray(inputValue);
	await populateWeatherToday(inputValue);
	await populateForecast(weather);
	input.value = '';
}


export async function getCurrentWeather(city) {

	const currentWeather = {};
	const weatherData = await getWeatherData(city);

	currentWeather.cityName = capitaliseEachWord(city);
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

	let weatherDesc = weatherData.weather[0].description
	currentWeather.weatherDescription = weatherDesc[0].toUpperCase() + weatherDesc.slice(1);

	weatherToday = currentWeather;
	return weatherToday;
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
			id: String(dailyData[i].weather[0].id),
		}
		weather.push(dayWeather);
	}
}


// populateWeatherToday('helsinki');
// populateWeatherArray('london');
// getWeather7Days('london');

function capitaliseEachWord(string) {
	const words = string.split(" ");
	let result = words.map((word) => { 
		return word[0].toUpperCase() + word.substring(1); 
	}).join(" ");
	return result;
}

async function render(city) {
	await getWeather7Days(city);
	await populateWeatherArray(city);
	await populateWeatherToday(city);
	await populateForecast(weather);
}

const unitsButton = document.querySelector('main > button');

unitsButton.addEventListener('click', toggleUnits);

// switch from metric to imperial and vice versa
function toggleUnits() {

	const unitsMetric = document.querySelectorAll('.metric');
	const unitsImperial = document.querySelectorAll('.imperial');

	// check which units are visible

	unitsMetric.forEach((unit) => {
		if(window.getComputedStyle(unit).display === 'block') {
			unit.style.display = 'none';
		}
		else unit.style.display = 'block';
	});
	
	unitsImperial.forEach((unit) => {
		if(window.getComputedStyle(unit).display === 'block') {
			unit.style.display = 'none';
		}
		else unit.style.display = 'block';
	});
}

render('berlin');
