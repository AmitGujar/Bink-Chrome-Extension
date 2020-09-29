window.onload = function () {
  init();
  document
    .querySelector("#change-btn")
    .addEventListener("click", unsplashGetPhotos);
};

window.addEventListener("load", function () {
  // console.log("All assets are loaded");
  var searchButton = document.getElementById("search-btn");
  searchButton.addEventListener("click", function () {
    var searchQuery = document.getElementById("input-query").value;
    var searchURL;
    if (searchQuery === "") {
      alert("Oooh..!! Enter Something");
    } else {
      searchURL = "https://www.bing.com/search?q=" + searchQuery;
      window.open(searchURL);
      window.close();
    }
  });

  var input = document.getElementById("input-query");
  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("search-btn").click();
    }
  });
});

function init() {
  handleBackgroundInit();
  getTime();
  getQuotes();
}

function handleBackgroundInit() {
  fetchImage();
  if (shouldGetNewPhoto()) unsplashGetPhotos();
}
const HOUR_LIMIT = 12;

function shouldGetNewPhoto() {
  const timestampFetched = parseInt(localStorage.getItem("timestampFetched"));
  const timestampDiff = Date.now() - timestampFetched;
  const hourDiff = new Date(timestampDiff).getUTCHours();
  return HOUR_LIMIT < new Date(hourDiff).getHours();
}

//api access key
const clientID =
  "?client_id=8249d860403116cd4d1f60d039c9decb42300d417588a4d5960e8630f47a14cf";

function getQuotes() {
  fetch("https://quote-garden.herokuapp.com/quotes/random")
    .then((res) => res.json())
    .then((data) => {
      document.querySelector(".quote").innerHTML = `" ${data.quoteText} "`;
      // ! planned to remove quote author, cuz i know no one cares about that lol.
      // document.querySelector(
      //   ".credit"
      // ).innerHTML = `<i> by - ${data.quoteAuthor}</i>`;
      document.querySelector("#quotes").style.opacity = 1;
    });
}

function fetchImage() {
  const img = new Image();
  img.onload = function () {
    document.getElementById(
      "background-container"
    ).style.backgroundImage = `url(${this.src})`;
  };

  if (localStorage.getItem("image") === null) {
    img.src = "styles/default.jpg";
  } else {
    img.src = localStorage.getItem("image");
    credit.innerHTML = `<a target="_blank">${localStorage.getItem("name")}</a>`;
    navigate.innerHTML = `<a target="_blank"  style="color : white; font-size:130%;" href="${localStorage.getItem(
      "link"
    )}">Download Photo</a>`;
  }
}

async function handleImageUrl(url) {
  const reader = new FileReader();
  const blob = await fetch(url).then((res) => res.blob());
  await reader.readAsDataURL(blob);
  reader.onload = function (e) {
    localStorage.setItem("image", reader.result);
    fetchImage();
  };
}

function unsplashGetPhotos() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  fetch(
    `https://api.unsplash.com/photos/random${clientID}&w=${width}&h=${height}`
  )
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("timestampFetched", Date.now());
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("link", data.links.html);
      handleImageUrl(data.urls.custom);
    })
    .catch((err) => {
      console.error(err);
    });
}

// ! test code for auto change wallpaper starts from here

chrome.alarms.create("ChangeWallpaper", {
  // delayInMinutes: 1.0,
  periodInMinutes: 12 * 60,
});

chrome.alarms.onAlarm.addListener(unsplashGetPhotos);

//! test code ends here

function getTime() {
  var systemDate = new Date();
  var hours = systemDate.getHours();
  var minutes = systemDate.getMinutes();
  var ampm = hours >= 24 ? "pm" : "am";
  var twelve = hours % 24;
  hours = twelve == 0 ? 24 : twelve;
  _hours = checkTimeAddZero(hours);
  _minutes = checkTimeAddZero(minutes);
  //Only update if time is changed, this will prevent unnecessary re-render
  var timeInDOM = document.getElementById("current-time").innerHTML;
  var timeString = _hours + ":" + _minutes;
  if (timeInDOM !== timeString) {
    document.getElementById("current-time").innerHTML = timeString;
  }
}
// getTime() will be called in every 1 second of interval
setInterval(getTime, 1000);

//Function add zero
function checkTimeAddZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

window.addEventListener("load", () => {
  let long;
  let lat;
  let temperatureDescription = document.querySelector(
    ".temperature-description"
  );
  let temperatureDegree = document.querySelector(".temperature-degree");
  let temperatureSection = document.querySelector(".temperature");
  const temperatureSpan = document.querySelector(".unit");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const proxy = "http://cors-anywhere.herokuapp.com/";
      const api = `${proxy}https://api.darksky.net/forecast/551f03febb4552249ba0f312ebdbd498/${lat},${long}`;
      fetch(api)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const { temperature, summary, icon } = data.currently;
          temperatureDegree.textContent = Math.floor(temperature);
          temperatureDescription.textContent = summary;
          let celcius = (temperature - 32) * (5 / 9);
          setIcons(icon, document.querySelector(".icon"));
          temperatureSection.addEventListener("click", () => {
            if (temperatureSpan.textContent === "°F") {
              temperatureSpan.textContent = "°C";
              temperatureDegree.textContent = Math.floor(celcius);
            } else {
              temperatureSpan.textContent = "°F";
              temperatureDegree.textContent = Math.floor(temperature);
            }
          });
        });
    });
  }

  function setIcons(icon, iconID) {
    const skycons = new Skycons({
      color: "white",
    });
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }
});
