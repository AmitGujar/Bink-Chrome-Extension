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

  document.getElementById("configIcon").addEventListener("click", () => {
    onConfigClick();
  });

  // Set the time interval to 12h if not configured
  let timeLimit = localStorage.getItem("timeLimit");
  if (!timeLimit) {
    timeLimit = 12;
    localStorage.setItem("timeLimit", timeLimit);
  }

  document.getElementById("timeBetween").value = timeLimit;

  document.getElementById("timeBetween").addEventListener("change", () => {
    localStorage.setItem("timeLimit", document.getElementById("timeBetween").value);
  });
});

function onConfigClick() {
  let configContainer = document.getElementById("configContainer");
  if (!configContainer.classList.contains("config-hide")) {
      document.getElementById("configContainer").classList.add("config-hide");
  } else {
      document.getElementById("configContainer").classList.remove("config-hide");
  }
}

// Verify if need to change the wallpaper every time the window is focused
window.addEventListener("focus", () => {
  if (shouldGetNewPhoto()) unsplashGetPhotos();
});

function init() {
  handleBackgroundInit();
  getTime();
  getQuotes();
  getTopSites();
}

function getTopSites() {
  const top_sites = (urls) => {
    const main = document.getElementById("main-nav");
    let index = urls.length >= 6 ? 6 : urls.length;
    for (var i = 0; i <= index; i++) {
      if (
        urls[i] &&
        urls[i].hasOwnProperty("title") &&
        urls[i].hasOwnProperty("url")
      ) {
        let cssclass = i == 0 ? "active" : "";
        let name =
          urls[i].title.length > 10
            ? urls[i].title.substring(0, 10) + "..."
            : urls[i].title; // split the name if title is too long
        let html = `<a class="${cssclass}" href="${urls[i].url}">${name}</a>`;
        main.innerHTML += html;
      }
    }
  };
  chrome.topSites.get(top_sites);
}

function handleBackgroundInit() {
  fetchImage();
  if (shouldGetNewPhoto()) unsplashGetPhotos();
}

function shouldGetNewPhoto() {
  // Calculate the millis passed then convert to hours
  let hoursPassed = (Date.now() - new Date(parseInt(localStorage.getItem("timestampFetched"))))/1000/60/60;
  let limit = parseFloat(localStorage.getItem("timeLimit"));
  return limit < hoursPassed;
}

//api access key
const clientID =
  "?client_id=8249d860403116cd4d1f60d039c9decb42300d417588a4d5960e8630f47a14cf";

function getQuotes() {
  fetch("https://freefacts.herokuapp.com/facts/random")
    .then((res) => res.json())
    .then((data) => {
      document.querySelector(".quote").innerHTML = `"${data[0].name}"`;
      document.querySelector(".credit");
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

  if (localStorage.getItem("url") === null) {
    img.src = "styles/default.jpg";
  } else {
    img.src = localStorage.getItem("url");
    credit.innerHTML = `<a target="_blank">${localStorage.getItem("name")}</a>`;
    navigate.innerHTML = `<a style="color : white; font-size:130%;" href="${localStorage.getItem(
      "link"
    )}">Download</a>`;
  }
}

function unsplashGetPhotos() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  fetch(`https://api.unsplash.com/photos/random${clientID}&w=${width}&h=${height}`)
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("url", data.urls.full);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("link", `${data.links.download}?force=true`);
      localStorage.setItem("timestampFetched", Date.now());
    })
    .then(() => {
      fetchImage();
    })
    .catch((err) => {
      console.error(err);
    });
}

// ! test code for auto change wallpaper starts from here
// Set time period based on time limit to at least 5 min
chrome.alarms.create("ChangeWallpaper", {
  periodInMinutes: (parseFloat(localStorage.getItem("timeLimit")) * 60) < 5 ? 5 : (parseFloat(localStorage.getItem("timeLimit")) * 60),
});

// Only change the wallpaper if needed
chrome.alarms.onAlarm.addListener(() => {
  if (shouldGetNewPhoto()) unsplashGetPhotos();
});
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
