const Singapore = [1.3521, 103.8198]; //leaflet expect lat lng in array, which will be used in the createMap function
const map = createMap(Singapore);
let searchResultLayer = L.layerGroup().addTo(map);

//customize GeoJson point markers
const myIcon = L.icon({
  iconUrl: "img/food-stall.png",
  iconSize: [65, 65], // width and height of the image in pixels
  shadowSize: [35, 20], // width, height of optional shadow image
  iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 6], // anchor point of the shadow. should be offset
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
});

//enable zooming to user's current location
let usercurrentLocation = L.control
  .locate({
    initialZoomLevel: 16,
    drawCircle: false,
    flyTo: true,
    strings: {
      title: "Hey,how me where I am!",
      popup: "You are here",
    },
  })
  .addTo(map);
usercurrentLocation.start();

//main function starts
function main() {
  //geojson
  async function loadHawkerGeoJson() {
    let hawkerGeoJson = await axios.get("hawker-centres-geojson.geojson");
    console.log(hawkerGeoJson.data);

    let markers = L.markerClusterGroup();
    L.geoJson(hawkerGeoJson.data, {
      onEachFeature: function (feature, layer) {
        let el = document.createElement("div");
        el.innerHTML = feature.properties.Description;
        console.log(feature);
        let allTd = el.querySelectorAll("td"); //queryselecterAll returns array

        let origin = allTd[2].innerHTML;
        let name = allTd[19].innerHTML;
        let xxx = allTd[3].innerHTML;

        //create bindpopup html elements
        const container = document.createElement("div");
        const nameEl = document.createElement("h2");
        nameEl.innerHTML = `${name}`;
        const originEl = document.createElement("h4");
        originEl.innerHTML = `${origin}`;
        const xxxEl = document.createElement("h4");
        xxxEl.innerHTML = `${xxx}`;
        const stallsButton = document.createElement("button");
        stallsButton.classList.add("btn", "btn-primary"); //Use the classList.add() method to add one or more classes to the element.
        stallsButton.setAttribute("id", "see-stalls-button"); // Set id attribute on the element
        stallsButton.innerText = "Show Stalls";
        const choiceButton = document.createElement("button");
        choiceButton.classList.add("btn", "btn-primary");
        choiceButton.setAttribute("id", "random-choice"); // Set id attribute on the element
        choiceButton.innerText = "Don't know what to eat?";

        //create interaction when click "see stalls" button will show stalls
        //call fsq API
        //id created by createElement cannot be accessed by addeventlistener, must use the variable name
        // stallsButton.addEventListener("click", async function () {
        //   let lat = feature.geometry.coordinates[1];
        //   let lng = feature.geometry.coordinates[0];
        //   let searchResults = await loadData(lat, lng);
        //   console.log(searchResults);
        //   // initialize stallMarkers for marker clustering
        //   let stallMarkers = L.markerClusterGroup();
        //   let marker = L.marker(coordinate).addTo(searchResultLayer);
        // });

        container.append(xxxEl, nameEl, originEl, stallsButton, choiceButton);
        console.log(container);

        layer.bindPopup(container);
      },

      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: myIcon });
      },
    }).addTo(markers);

    // map.addLayer(markers);
    markers.addTo(map);
  }
  loadHawkerGeoJson();

  //user search from home page, using oneMap API
  document
    .querySelector("#search-button")
    .addEventListener("click", async function () {
      let searchValue = document.querySelector("#user-search").value;

      let searchResults = await getAddress(searchValue);

      // //clear layer before search
      // searchResultLayer.clearLayers();

      for (let result of searchResults.results) {
        //create marker and add to searchResultLayer
        let coordinate = [result.LATITUDE, result.LONGITUDE];
        let marker = L.marker(coordinate).addTo(searchResultLayer);
        marker.bindPopup(`<h4>${result.SEARCHVAL}</h4>
                          <p>${result.ADDRESS}</p>`);

        //create search result list
        let resultElement = document.createElement(`div`);
        resultElement.classList.add("search-item");
        resultElement.innerText = result.ADDRESS;
        document
          .querySelector("#search-result-list")
          .appendChild(resultElement);

        //make the itme clickable
        resultElement.addEventListener("click", function () {
          document.querySelector("#map-container").style.zIndex = "6000";
          document.location.hash = "#map";
          map.flyTo(coordinate, 18);
        });
      }
    });
}

let searchInput = document.querySelector("#search-input");
let searchBtn = document.querySelector("#search-btn");

searchInput.addEventListener("input", async function () {
  //clear existing markers from search result layer
  // searchResultLayer.clearLayer();

  let response = await getAddress(searchInput.value);
  console.log(responsee ? responsee : "no repsonseee");

  try {
    for (let result of response.results) {
      let coordinate = [result.LATITUDE, result.LONGITUDE];
      let resultElement = document.createElement("div");
      resultElement.classList = "search-result";
      resultElement.innerHTML = result.SEARCHVAL;
      console.log(resultElement);
    }
  } catch (e) {
    console.log(e);
    console.log("ex ->", responsee);
  }

  searchBtn.addEventListener("click", function () {
    document.querySelector("#card-results").innerHTML = "";
  });
});

//adding DOMContentLoaded event before calling main()
window.addEventListener("DOMContentLoaded", function () {
  main();
});
