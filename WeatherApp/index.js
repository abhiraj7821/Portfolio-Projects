const searchBtn=document.querySelector("[data-searchBtn]");
const searchInput=document.querySelector("[data-searchInput]");
const myWeatherBtn=document.querySelector("[data-myLocation ]");
const loadingContainer=document.querySelector(".loadingContainer");
const wrapperContainer=document.querySelector(".wrapper");

const api_key="d1845658f92b31c64bd94f06f7188c9c";

getFromSesionStorage();

myWeatherBtn.addEventListener("click",()=>{
    //start the loader
    loadingContainer.classList.remove("invisible");
    getFromSesionStorage();
})

function getFromSesionStorage(){

    if(sessionStorage.getItem("user_coordinates_Lat")&&sessionStorage.getItem("user_coordinates_Lon")){
        const lat=sessionStorage.getItem("user_coordinates_Lat");
        const lon=sessionStorage.getItem("user_coordinates_Lon");
        weatherCall(lat,lon);
    }
    else{
        getLocation();
    }
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No Geolocation Support");
    }
}

function showPosition(position){
    const lat=position.coords.latitude;
    const lon=position.coords.longitude;

    sessionStorage.setItem("user_coordinates_Lat",lat);
    sessionStorage.setItem("user_coordinates_Lon",lon);
    weatherCall(lat,lon);
}

async function weatherCall(lat,lon){
    let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
    const data=await response.json();
    randerWeather(data);
}

function slicestringForDate(event){
    return new Date(event*1000).toDateString();
}

function slicestringForTime(event){
    return new Date(event*1000).toTimeString().slice(0,8);
}

function randerWeather(data){

    const city=document.querySelector("[data-city]");
    const temp=document.querySelector("[data-temp]");
    const discription=document.querySelector("[data-discription]");
    const date=document.querySelector("[data-date]");
    const humidity=document.querySelector("[data-humidity]");
    const windspeed=document.querySelector("[data-windspeed]");
    const clouds=document.querySelector("[data-clouds]");
    const sunrise=document.querySelector("[data-sunrise]");
    const sunset=document.querySelector("[data-sunset]");

    city.innerText=data?.name;
    
    if(data?.main?.temp>100){
        console.log(data?.main?.temp);
        temp.innerText=((data?.main?.temp)-273).toFixed(2);
    }
    else{
        temp.innerText=(data?.main?.temp);
    }
    discription.innerText=data?.weather?.[0]?.description;
    humidity.innerText=data?.main?.humidity;
    windspeed.innerText=data?.wind?.speed;
    clouds.innerText=data?.clouds?.all;
    date.innerText=slicestringForDate(data?.dt);
    sunrise.innerText =slicestringForTime(data?.sys?.sunrise);
    sunset.innerText=slicestringForTime(data?.sys?.sunset);

    //stop the loader
    //visible the wrapper
    loadingContainer.classList.add("invisible");
    wrapperContainer.classList.remove('scale-0');
}

searchBtn.addEventListener("click",(e)=>{
    e.preventDefault()
    let cityName=searchInput.value;
    if(cityName==="") {
        return;
    }
    else{
        cityWeather(cityName);
    }
})

async function cityWeather(city){
    //start the loader
    loadingContainer.classList.remove("invisible");
    let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`);
    const data=await response.json();
    randerWeather(data);
}



