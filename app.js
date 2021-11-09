//OpenWeatherMap API key 
const apiKey = 'a1316dea8e181f4f36d68059a113ed24';

const currentWeather = document.getElementById("current-weather");

//Getting our position with the navigator and Fetching the openweathermap API with our latitude and longitude
function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);
        let {latitude, longitude} = success.coords;
        //https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${apiKey}
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&eclude=hourly,minutely&units=metric&appid=${apiKey}`).then(res => res.json().then(data=> {
            console.log(data);
            showData(data);
        }))
    })
}

//This function reinplaces HTML templates by same classes filled with the open data
function showData(data){
    let otherdayForecast = '';
    //For each day in the week, that has an index (idx)
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            //current day, we fill the current day div
            //We could use this instead of "Today" : ${window.moment(day.dt*1000).format('dddd')}
            //API returns an "icon" which is a String, it's made to use their icons
            //Renamming our custom icons with these returned Strings allows us to pick the correct one foreach situation without using if,else...
            currentWeather.innerHTML = 
            `
            <h1 class="current-day">Today</h1>
            <img class="weather-icons" src="icons/${day.weather[0].icon}.png">
            <div class="flex">
            <p class="current-temp">${day.temp.day} °C</p>
            <p>${day.temp.min} °C | ${day.temp.max} °C </p>

            `
            //If the icon returned by OPENWEATHERMAP contains a "n", that means we're at night
            //So, if we are at night, we change the background and the color of the text
            //We also change the background if it's sunny (main:"Clear" || id=800)
            if(day.weather[0].icon.includes('n')){
                const body = document.body;
                body.style.background = `url(background/night.png) no-repeat center`
                const r = document.querySelector(":root");
                r.style.setProperty('--text-color', '#fff')
            }else if(day.weather[0].main === "Clear"){ // Or day.weather[0].id === 800 
                let body = document.body;
                body.style.background = `url(background/sun.png) no-repeat center`
            }

        }else{
            otherdayForecast += `
            <div class="day">
                <h1>${window.moment(day.dt*1000).format('ddd')}</h1> 
                <img class="weather-icons" src="icons/${day.weather[0].icon}.png">
                <p class="temp">${day.temp.day} °C</p>
                <p>${day.temp.min} °C | ${day.temp.max} °C </p>
            </div>

            `
        }
    })
    let cont = document.getElementById("forecast-container");
    cont.innerHTML = otherdayForecast;
    
}

getWeatherData();

