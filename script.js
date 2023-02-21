const Singapore = [1.3521, 103.8198]; //leaflet expect lat lng in array, which will be used in the createMap function
const map = createMap(Singapore);
let searchResultLayer = L.layerGroup();
searchResultLayer.addTo(map);

function main() {
  //geojson
  async function loadHawkerGeoJson() {
    let hawkerGeoJson = await axios.get("hawker-centres-geojson.geojson");
    console.log(hawkerGeoJson.data);

    //add geojson layer
    //L.geoJson has two parameters, first is GeoJson data, second is options: https://leafletjs.com/examples/geojson/
    //The onEachFeature option is a function that gets called on each feature before adding it to a GeoJSON layer.
    //A common reason to use this option is to attach a popup to features when they are clicked.
    //the for loop is inside the GeoJson
    function onEachFeature(feature, layer) {
      let el = document.createElement("el");
      //queryselecterAll returns array
      el.innerHTML = feature.properties.Description;
      let allTd = el.querySelectorAll("td");

      //please dont forget the innerHTML!!!!!
      let origin = allTd[2].innerHTML;
      let name = allTd[19].innerHTML;

      layer.bindPopup(`<h2>${name}</h2>
                        <h4>${origin}</h4>
                        <button type="button" class="btn btn-primary stall-open-button">Click to see stalls</button>`);
    }

    //initialize markers for marker clustering
    let markers = L.markerClusterGroup();

    // using the pointToLayer option to create a CircleMarker as per "Using GeoJSON with Leaflet" Doc, and reference solution "https://gist.github.com/geog4046instructor/80ee78db60862ede74eacba220809b64"
    function createCustomIcon(feature, latlng) {
      let myIcon = L.icon({
        iconUrl: "img/food-stall.png",
        iconSize: [65, 65], // width and height of the image in pixels
        shadowSize: [35, 20], // width, height of optional shadow image
        iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
        shadowAnchor: [12, 6], // anchor point of the shadow. should be offset
        popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
      });
      return markers.addLayer(L.marker(latlng, { icon: myIcon }));
    }

    //loading geoJson
    L.geoJSON(hawkerGeoJson.data, {
      onEachFeature: onEachFeature,
      pointToLayer: createCustomIcon,
    }).addTo(map);
  }
  loadHawkerGeoJson();

  //user search from home page
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
          document.location.hash = "#map";
          map.flyTo(coordinate, 16);
        });
      }
    });
}

//adding DOMContentLoaded event before calling main()
window.addEventListener("DOMContentLoaded", function () {
  main();
});
