const Singapore = [1.3521, 103.8198]; //leaflet expect lat lng in array, which will be used in the createMap function
const map = createMap(Singapore);
let searchResultLayer = L.layerGroup();
searchResultLayer.addTo(map);

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

function main() {
  //geojson
  async function loadHawkerGeoJson() {
    let hawkerGeoJson = await axios.get("hawker-centres-geojson.geojson");
    console.log(hawkerGeoJson.data);

    //add geojson layer
    //L.geoJson has two parameters, first is GeoJson data, second is options: https://leafletjs.com/examples/geojson/
    //The onEachFeature option is a function that gets called on each feature before adding it to a GeoJSON layer.

    let markers = L.markerClusterGroup();

    L.geoJson(hawkerGeoJson.data, {
      onEachFeature: function (feature, layer) {
        let el = document.createElement("div");
        el.innerHTML = feature.properties.Description;
        let allTd = el.querySelectorAll("td"); //queryselecterAll returns array

        let origin = allTd[2].innerHTML; //dont forget the innerHTML!!!!!
        let name = allTd[19].innerHTML;

        //create bindpopup html elements
        const container = document.createElement("div");

        const nameEl = document.createElement("h2");
        nameEl.innerHTML = `${name}`;

        const originEl = document.createElement("h4");
        originEl.innerHTML = `${origin}`;

        const stallsButton = document.createElement("button");
        stallsButton.classList.add("btn", "btn-primary"); //Use the classList.add() method to add one or more classes to the element.
        stallsButton.setAttribute("id", "see-stalls-button"); // Set id attribute on the element
        stallsButton.innerText = "Show Stalls";

        const choiceButton = document.createElement("button");
        choiceButton.classList.add("btn", "btn-primary");
        choiceButton.setAttribute("id", "random-choice"); // Set id attribute on the element
        choiceButton.innerText = "Don't know what to eat?";

        // //create interaction when click "see stalls" button will show stalls
        // //call fsq API
        // //id created by createElement cannot be accessed by addeventlistener, must use the variable name
        stallsButton.addEventListener("click", async function () {
          let lat = feature.geometry.coordinates[1];
          let lng = feature.geometry.coordinates[0];
          let searchResults = await loadData(lat, lng);
          console.log(searchResults);
          // initialize stallMarkers for marker clustering
          let stallMarkers = L.markerClusterGroup();
          let marker = L.marker(coordinate).addTo(searchResultLayer);
        });

        container.append(nameEl, originEl, stallsButton, choiceButton);
        console.log(container);

        layer.bindPopup(container);
      },

      // using the pointToLayer option to create a customer marker as per "Using GeoJSON with Leaflet" Doc, and reference solution "https://gist.github.com/geog4046instructor/80ee78db60862ede74eacba220809b64"
      pointToLayer: function (feature, latlng) {
        let myIcon = L.icon({
          iconUrl: "img/food-stall.png",
          iconSize: [65, 65], // width and height of the image in pixels
          shadowSize: [35, 20], // width, height of optional shadow image
          iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
          shadowAnchor: [12, 6], // anchor point of the shadow. should be offset
          popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
        });
        return markers.addLayer(L.marker(latlng, { icon: myIcon }));
      },
    }).addTo(map);
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

//adding DOMContentLoaded event before calling main()
window.addEventListener("DOMContentLoaded", function () {
  main();
});
