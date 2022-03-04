import sunnyIcon from './assets/wi-day-sunny.svg';
import cloudyIcon from './assets/wi-cloudy.svg';
import sunnyOvercastIcon from './assets/wi-day-sunny-overcast.svg';
import rainIcon from './assets/wi-rain.svg';
import showersIcon from './assets/wi-showers.svg';
import snowIcon from './assets/wi-snow.svg';
import thunderstormIcon from './assets/wi-thunderstorm.svg';
import windyIcon from './assets/wi-windy.svg';


// basic edition of user input
export function capitaliseEachWord(string) {
	const words = string.split(" ");
	let result = words.map((word) => { 
		return word[0].toUpperCase() + word.substring(1); 
	}).join(" ");
	return result;
}

// switch from metric to imperial and vice versa
export function toggleUnits() {
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

// choose an icon to display (eg. sun, thunderstorm)
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

export function getRandomCity() {
	const cities = ['Berlin', 'Warsaw', 'Washington', 'Amsterdam', 'Beijing', 'Paris', 'London', 'Kyiv', 'Oslo', 'Sydney'];
	let randomNum = Math.floor(Math.random() * 10);

	return cities[randomNum];
}
