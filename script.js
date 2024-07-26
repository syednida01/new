import { apiKey } from "./config.js";

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const dayApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

function initialize() {
	const searchBtn = document.querySelector(".search-icon");
	const searchBox = document.querySelector(".search-bar");

	// Check if searchBtn is defined before adding event listener
	if (searchBtn) {
		searchBtn.addEventListener("click", () => {
			console.log("button clicked");
			checkWeather(searchBox.value);
			dayForecast(searchBox.value);
		});
	} else {
		console.error("Search button not found in the DOM.");
	}
}

async function checkWeather(city){
	const response = await fetch(apiUrl+city+`&appid=${apiKey}`);
	if(response.cod == 404){
		alert("City Not Found");
	}
	else {
		var data = await response.json();
	}

	const weatherIcon = document.querySelector(".weather-icon")
	console.log(data);

	const rise = timeStamp(data.sys.sunrise);
	const set= timeStamp(data.sys.sunset);

	document.querySelector(".city").innerHTML = data.name;
	document.querySelector(".tempDegree").innerHTML = Math.round(data.main.temp)+"°c";
	document.querySelector(".sunrise-time").innerHTML = rise.sunTime;
	document.querySelector(".sunset-time").innerHTML = set.sunTime;
	document.querySelector(".detail-value-humidity").innerHTML = data.main.humidity+"%";
	document.querySelector(".detail-value-pressure").innerHTML = data.main.pressure+"Pa";
	document.querySelector(".detail-value-wind").innerHTML = data.wind.speed+"km/h";
	document.querySelector(".detail-value-grndLvl").innerHTML = data.main.grnd_level;

	if(data.weather[0].main == "Clouds"){
		weatherIcon.src = "/assets/cloudy.png";
		document.querySelector(".weather-icon-value").innerText = "Clouds";
	}
	else if(data.weather[0].main == "Haze"){
		weatherIcon.src = "/assets/haze.png";
		document.querySelector(".weather-icon-value").innerText = "Haze";
	}
	else if(data.weather[0].main == "Rain"){
		weatherIcon.src = "/assets/rainy-day.png";
		document.querySelector(".weather-icon-value").innerText = "Rain";
	}
	else if(data.weather[0].main == "Clear"){
		weatherIcon.src = "/assets/sun.png";
		document.querySelector(".weather-icon-value").innerText = "Clear";
	}
}

document.addEventListener("DOMContentLoaded", initialize);

//update time
function getCurrentDateTime() {
	const now = new Date();
	
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	const dayName = days[now.getDay()];
	const monthName = months[now.getMonth()];

	const day = String(now.getDate()).padStart(2, '0');
	const year = now.getFullYear();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
    
	const forecast = [];
	for (let i = 1; i <= 5; i++) {
		const nextDay = new Date(now);
		nextDay.setDate(now.getDate() + i);
		const FivedayName = days[nextDay.getDay()];
		const Fivedate = `${nextDay.getDate()} ${months[nextDay.getMonth()]} ${nextDay.getFullYear()}`;
		forecast.push({ FivedayName, Fivedate });
	}


	return {
		time: `${hours}:${minutes}`,
		dayName: dayName,
		date: `${day} ${monthName} ${year}`,
		forecast
	};
}

function updateDateTime() {
	const dateTime = getCurrentDateTime();
	document.querySelector('.time').innerText = dateTime.time;
	document.querySelector('.dayName').innerText = dateTime.dayName;
	document.querySelector('.day').innerText = dateTime.date;

	for(let i = 0 ; i < 5 ; i++){
		document.getElementById("date"+(i+1)).innerHTML = `${dateTime.forecast[i].FivedayName}<br>${dateTime.forecast[i].Fivedate}`;
	}

}

// Update date and time every second
setInterval(updateDateTime, 1000);

// Initial call to display the date and time immediately
updateDateTime();

function timeStamp(time){
    const miliSec = time*1000;
	const date = new Date(miliSec);
	
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');

	return {
		sunTime : `${hours}:${minutes}`
	};
}

async function dayForecast(cityName){
    const response = await fetch(dayApiUrl+cityName+`&appid=${apiKey}`);
	var data = await response.json();
	console.log(data);

	const weatherConditions = {
		"Clouds": {
		  icon: "/assets/cloudy.png",
		  text: "Clouds"
		},
		"Haze": {
		  icon: "/assets/haze.png",
		  text: "Haze"
		},
		"Rain": {
		  icon: "/assets/rainy-day.png",
		  text: "Rain"
		},
		"Clear": {
		  icon: "/assets/sun.png",
		  text: "Clear"
		}
	  };
	  

	for(let i = 0 ; i < 5 ; i++){
		document.getElementById("temp"+(i+1)).innerHTML = data.list[i].main.temp+"°";
	}
	
	for (let i = 0; i < 5; i++) {
		const weather = data.list[i].weather[0].main;
		const weatherIcon = document.getElementById("dayIcon" + (i + 1));
	  
		if (weatherConditions[weather]) {
		  weatherIcon.src = weatherConditions[weather].icon;
		} else {
		  // Handle any other weather conditions not covered in the weatherConditions object
		  weatherIcon.src = "/assets/sun.png"; // default icon
		}
	  }
}