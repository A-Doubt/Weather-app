// since this API is free no harm done leaking it

import { populateForecast, populateWeatherToday } from './DOM_functions';
import { capitaliseEachWord, getRandomCity } from './helper_functions';
import './style.scss';

let weather;
let weatherToday;
let isError = false;

let form = document.querySelector('.city-input-form');

form.addEventListener('submit', renderOnSubmit);

export function handleError(err) {
	console.log('is error? :', isError);
	const todaysWeather = document.querySelector('.todays-weather');
	const forecast = document.querySelector('.forecast');
	const errorMessages = document.querySelector('.error');
	
	if (isError) {
		console.log('from handle error function');
		console.log(err);
		
		errorMessages.classList.remove('invisible');
		todaysWeather.classList.add('invisible');
		forecast.classList.add('invisible');
	} else {
		errorMessages.classList.add('invisible');
		todaysWeather.classList.remove('invisible');
		forecast.classList.remove('invisible');
	}
}

// get detailed weather for today via getWeatherData(city), put it in an object and return it
export async function getCurrentWeather(city) {
	
	const currentWeather = {};
	const weatherData = await getWeatherData(city);
	
	currentWeather.cityName = capitaliseEachWord(city);
	currentWeather.date = new Date(weatherData.dt * 1000).toISOString().split('T')[0];
	currentWeather.tempC = Number((weatherData.main.temp - 273.15).toFixed(1));
	currentWeather.tempF = Number((1.8 * (weatherData.main.temp - 273.15) + 32).toFixed(1));
	currentWeather.feelsLikeC = Number((weatherData.main.feels_like - 273.15).toFixed(1));
	currentWeather.feelsLikeF = Number((1.8 * (weatherData.main.temp - 273.15) + 32).toFixed(1));
	currentWeather.windDeg = weatherData.wind.deg;
	currentWeather.windSpeed = weatherData.wind.speed;
	currentWeather.clouds = weatherData.clouds.all;
	currentWeather.humidity = weatherData.main.humidity;
	currentWeather.pressure = weatherData.main.pressure;
	currentWeather.weatherId = weatherData.weather[0].id;
	
	let weatherDesc = weatherData.weather[0].description;
	currentWeather.weatherDescription = weatherDesc[0].toUpperCase() + weatherDesc.slice(1);
	
	weatherToday = currentWeather;
	return weatherToday;
}

// get detailed weather for today and return it
async function getWeatherData(city) {
	try {
		const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=49f5c57e6c9d12a7b3940cf63bfe2742`,{ mode: 'cors', });
		const weatherData = await response.json();
		return weatherData;
	} catch(err) {
		isError = true;
		console.log(err);
		handleError(err);
	}
}

//get coords using a city name string - this is needed to make a 7-day weather API call
async function getCoords(city) {
	try {
		const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=49f5c57e6c9d12a7b3940cf63bfe2742`);
		const data = await response.json();
		
		let lat = data.coord.lat;
		let lon = data.coord.lon;
		
		return {lat, lon};
	} catch (err) {
		console.log(err);
		isError = true;
		handleError(err);
	}
	
}

// get weather data for 7 days using coords
async function getData7days({lat, lon}) {
	try {
		const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=49f5c57e6c9d12a7b3940cf63bfe2742`);
		const data = await response.json();
		
		return data;
	} catch(err) {
		console.log(err);
		isError = true;
		handleError(err);
	}
}

// combination of 2 functions above - gets weather data for 7 days using a city name string
async function getWeather7Days(city) {
	const coords = await getCoords(city);
	const data = await getData7days(coords);
	
	return data;
}

// extract data from getWeather7Days(city) function and puts it in an array of objects
async function populateWeatherArray(city) {
	// empty the weather array
	weather = [];
	
	// gather data from API for next 7 days
	try {
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
			};
			weather.push(dayWeather);
		}
	} catch(err) {
		console.log(err);
		isError = true;
		handleError(err);
	}
}


// 'Call center' functions below

// render weather on initial load - with a random city out of 10 possible
async function render() {
	isError = false;
	const city = getRandomCity();
	await getWeather7Days(city);
	await populateWeatherArray(city);
	await populateWeatherToday(city);
	await populateForecast(weather);
	await handleError();
}

// render weather when user submits using the input
export async function renderOnSubmit(e) {
	isError = false;
	e.preventDefault();
	const input = form.querySelector('input');
	const inputValue = input.value.trim();
	
	// await populateWeatherToday(inputValue);
	await getWeather7Days(inputValue);
	await populateWeatherArray(inputValue);
	await populateWeatherToday(inputValue);
	await populateForecast(weather);
	input.value = '';
	
	handleError();
}

// calling render to make the initial load
render();
