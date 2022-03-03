import { getCurrentWeather } from './script';
import { getWeatherData } from './script';
import { renderOnSubmit } from './script';

import sunnyIcon from './assets/wi-day-sunny.svg';
import cloudyIcon from './assets/wi-cloudy.svg';
import sunnyOvercastIcon from './assets/wi-day-sunny-overcast.svg';
import rainIcon from './assets/wi-rain.svg';
import showersIcon from './assets/wi-showers.svg';
import snowIcon from './assets/wi-snow.svg';
import thunderstormIcon from './assets/wi-thunderstorm.svg';
import windyIcon from './assets/wi-windy.svg';

let weatherToday;

export function chooseIcon(id) {
	let icon;

	switch(id) {
		case '800':
			icon = sunnyIcon;
			break;
		case '801':
		case '802':
		case '803':
			icon = sunnyOvercastIcon;
			break;
		case '804':
			icon = cloudyIcon;
			break;

		// if neither of those most common cases
		default:
			if(id >= '200' && id <= '232') icon = thunderstormIcon;
			else if (id >= '300' && id <= '321') icon = showersIcon;
			else if (id >= '500' && id <= '531') icon = rainIcon;
			else if (id >= '600' && id <='622') icon = snowIcon;
			else icon = windyIcon;
	}
	
	return icon;
}

export async function populateForecast(weatherArray) {
	const forecast = document.querySelector('.forecast');
	forecast.innerHTML = '';

	let icon;

	weatherArray.forEach((day) => {

		let icon = chooseIcon(day.id);

		forecast.insertAdjacentHTML('beforeend',
			`<div class="day-card">
			<h4>${day.day}</h4>
			<p class="max metric">${day.hiTempC} °C</p>
			<p class="min metric">${day.lowTempC} °C</p>
			<p class="max imperial">${day.hiTempF} °F</p>
			<p class="min imperial">${day.lowTempF} °F</p>
			<img src=${icon}>
			</div>`
		)
	});
}

export async function populateWeatherToday(city) {
	weatherToday = await getCurrentWeather(city);

	const weatherTodayDOM = document.querySelector('.todays-weather');
	weatherTodayDOM.innerHTML = '';

	let icon = chooseIcon(String(weatherToday.weatherId));
	let windSpeedImperial = (weatherToday.windSpeed / 1.609).toFixed(2)


	weatherTodayDOM.insertAdjacentHTML('beforeend', 
		`<section class="todays-weather">
			<div class="today-left">
				<h2 class="weather-now">${weatherToday.weatherDescription}</h2>
				<h3 class="city-now">${weatherToday.cityName}</h3>
				<p class="date-now">${weatherToday.date}</p>
				<p class="temp-now metric">${weatherToday.tempC} °C</p>
				<p class="temp-now imperial">${weatherToday.tempF} °F</p>
				<img src="${icon}" alt="weather-icon" class="weather-icon-now"/>

			</div>
			<div class="today-right">
				<div class="wrapper">
					<div class="details-now">
						<img src="68caee2f71c475b5e078.svg"/>
						<div class="details-text">
							<p class="label">Feels like</p>
							<p class="value metric">${weatherToday.feelsLikeC} °C</p>
							<p class="value imperial">${weatherToday.feelsLikeF} °F</p>
						</div>
					</div>
					<div class="details-now">
						<img src="fd74a4dde8275263486e.svg"/>
						<div class="details-text">
							<p class="label">Wind speed</p>
							<p class="value metric">${weatherToday.windSpeed} km/h</p>
							<p class="value imperial">${windSpeedImperial} mph</p>
						</div>
					</div>
					<div class="details-now">
						<img src="1cfe3059f06bdc21a4fa.svg" style="transform: rotate(${weatherToday.windDeg}deg)"/>
						<div class="details-text">
							<p class="label">Wind direction</p>
							<p class="value">${weatherToday.windDeg}°</p>
						</div>
					</div>
				</div>
				<div class="wrapper">
					<div class="details-now">
						<img src="4810ceffb1d8565f36bc.svg"/>
						<div class="details-text">
							<p class="label">Humidity</p>
							<p class="value">${weatherToday.humidity}%</p>
						</div>
					</div>
					<div class="details-now">
						<img src="f7ed7c0e2663da6c517e.svg"/>
						<div class="details-text">
							<p class="label">Clouds</p>
							<p class="value">${weatherToday.clouds}%</p>
						</div>
					</div>
					<div class="details-now">
						<img src="e9c43f109d7e087243bb.svg"/>
						<div class="details-text">
							<p class="label">Pressure</p>
							<p class="value">${weatherToday.pressure} hPa</p>
						</div>
					</div>
				</div>	
			</div>
		</section>`
	)
}
