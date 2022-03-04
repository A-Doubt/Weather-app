import { getCurrentWeather } from './script';
import { toggleUnits, chooseIcon} from './helper_functions';

let weatherToday;

// populates weather forecast for 7 following days
export function populateForecast(weatherArray) {
	const forecast = document.querySelector('.forecast');
	forecast.innerHTML = '';

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
		);
	});
}

// populates detailed weather for today
export async function populateWeatherToday(city) {
	weatherToday = await getCurrentWeather(city);

	const weatherTodayDOM = document.querySelector('.todays-weather');
	weatherTodayDOM.innerHTML = '';

	let icon = chooseIcon(String(weatherToday.weatherId));
	let windSpeedImperial = (weatherToday.windSpeed / 1.609).toFixed(2);


	weatherTodayDOM.insertAdjacentHTML('beforeend', 
	`<div class="today-left">
		<h2 class="weather-now">${weatherToday.weatherDescription}</h2>
		<h3 class="city-now">${weatherToday.cityName}</h3>
		<p class="date-now">${weatherToday.date}</p>
		<p class="temp-now metric">${weatherToday.tempC} °C</p>
		<p class="temp-now imperial">${weatherToday.tempF} °F</p>
		<div class="units-swap metric">Display imperial units</div>
		<div class="units-swap imperial">Display metric units</div>
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
	</div>`
	);

	// add event listeners to switch units
	const unitsSwapDivs = document.querySelectorAll('.units-swap');
	
	unitsSwapDivs.forEach((div) => {
		div.addEventListener('click', toggleUnits);
	});
}
