let tempResult = null

//если получены ГЕО-данные
const success = function (data) {
    lat = data.coords.latitude
    lon = data.coords.longitude
    tempResult = temp(lat, lon);
    tempResult.then(data => dataAtSite(data))
}
//если не получены ГЕО-данные
const error = function () {
    console.error("ERROR")
    // получить ip
    fetch('https://api.ipify.org/?format=json')
    .then(response => response.json())
    .then(data => getIP(data))
    .catch(console.log('IP not found...'))
    openHide(errorDiv, chooseCityDiv)
    weatherDiv.add('d-none')
}

navigator.geolocation.getCurrentPosition(success, error);

let lat = null
let lon = null
let api = "d7e5bd29ffa60ee00f7bf639ecd4cb87";
const inputCity = document.getElementById('inputCity')
const tryAgain = document.getElementById('tryAgain')
let cityName = null
let weatherDiv = document.querySelector('.weatherDiv').classList
let chooseCityDiv = document.querySelector('.chooseCityDiv').classList
let errorDiv = document.querySelector('.errorDiv').classList

//ввести название города
inputCity.addEventListener('change', ()=>{
    cityName = inputCity.value.trim()
    inputCity.value = ''
    tempResult = city(cityName)
})
//получить данные по названию города
async function city(cityName){
    const geo = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=en&appid=${api}`)
    const data = await geo.json()
    console.log(data)
    //если введен несуществующий город
    if(data.cod === '404'){
        openHide(errorDiv, chooseCityDiv)
    }
    //выводим погоду в городе
    dataAtSite(data)
    openHide(weatherDiv, chooseCityDiv)
    errorDiv.add('d-none')
    return data
}
//нажать на кнопку Еще раз
tryAgain.addEventListener('click', ()=>{
    openHide(chooseCityDiv, errorDiv)
    tempResult = temp(lat, lon);
    tempResult.then(data => dataAtSite(data))
})
//получить данные о погоде
async function temp(lat, lon){
    const weather = await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${api}`)
    const data = await weather.json()
    return data
}
//вывод данных о погоде
function dataAtSite(obj) {
    const container = document.body.querySelector(".weatherDiv")
    container.innerHTML=''
    
    //создаем карточку
    const p = document.createElement('p')
    const h1 = document.createElement('h1')
    let imgSrc = `https://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png`
    const img = document.createElement('img')
    img.setAttribute("src", imgSrc)
    let cel = Math.round(obj.main.temp) //округляем температуру до целых
    let city = obj.name
    let weather = obj.weather[0].description
    weather = weather.split('')
    weather[0] = weather[0].toUpperCase()
    weather = weather.join('')
    const button = document.createElement('button')
    button.innerHTML='Change city'
    button.setAttribute("class", 'changeCity')
    button.addEventListener('click', ()=>{
        openHide(chooseCityDiv, container.classList)
    })

    h1.innerHTML=`${cel}℃` //выводим температуру до целых
    p.innerHTML=`${weather} at ${city}` //выводим 'погоду' в 'городе'

    container.append(img, h1, p, button) //отрисовываем все в div-е
}

//получить IP
function getIP(json) {
    console.log("My public IP address is: ", json.ip);
    fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_LG2zBcVmwPMj4MaMnoeppnb6siIAT&ipAddress=${json.ip}`)
      .then((response) => response.json())
      .then((data) => city(data.location.region));
}
//открыть и скрыть экран
function openHide(div1, div2){
    div1.remove('d-none')
    div2.add('d-none')
}