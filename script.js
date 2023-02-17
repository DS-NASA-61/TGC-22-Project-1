const Singapore = [1.3521, 103.8198]; //leaflet expect lat lng in array, which will be used in the createMap function
const map = createMap(Singapore);

function main() {
  let foodSearchResultLayer = L.layerGroup();
  foodSearchResultLayer.addTo(map);

  //geojson
  async function loadHawkerGeoJson() {
    let hawkerGeoJson = await axios.get("hawker-centres-geojson.geojson");
    console.log(hawkerGeoJson.data);

    //add geojson layer
    //L.geoJson has two parameters, first is GeoJson data, second is options: https://leafletjs.com/examples/geojson/
    //The onEachFeature option is a function that gets called on each feature before adding it to a GeoJSON layer.
    //A common reason to use this option is to attach a popup to features when they are clicked.
    //the for loop is inside the GeoJson

    let hawkerLayer = L.geoJson(hawkerGeoJson.data).addTo(map);

    function onEachFeature(feature, layer) {
      // let el = document.createElement(feature.properties.Description);
      // above wrong, should be:
      let el = document.createElement("el");
      //queryselecterAll returns array
      el.innerHTML = feature.properties.Description;
      let allTd = el.querySelectorAll("td");

      //please dont forget the innerHTML!!!!!
      let origin = allTd[2].innerHTML;
      let name = allTd[19].innerHTML;

      layer.bindPopup(`<h2>${name}</h2><h4>${origin}</h4>`);
    }

    L.geoJSON(hawkerGeoJson.data, {
      onEachFeature: onEachFeature,
    }).addTo(map);
  }
  loadHawkerGeoJson();

  document
    .querySelector("#hawkersearchBtn")
    .addEventListener("click", function () {
      let foodSearchValue = document.querySelector("#hawkerName").value;
      //   let foodCoordinates =
    });
}
main();

// //geojson
// async function loadHawkerGeoJson() {
//   let hawkerGeoJson = await axios.get("hawker-centres-geojson.geojson");
//   console.log(hawkerGeoJson.data);

//   //add geojson layer
//   //L.geoJson has two parameters, first is GeoJson data, second is options: https://leafletjs.com/examples/geojson/
//   //The onEachFeature option is a function that gets called on each feature before adding it to a GeoJSON layer.
//   //A common reason to use this option is to attach a popup to features when they are clicked.
//   //the for loop is inside the GeoJson

//   let hawkerLayer = L.geoJson(hawkerGeoJson.data).addTo(map);

//   function onEachFeature(feature, layer) {
//     // let el = document.createElement(feature.properties.Description);
//     // above wrong, should be:
//     let el = document.createElement("el");
//     //queryselecterAll returns array
//     el.innerHTML = feature.properties.Description;
//     let allTd = el.querySelectorAll("td");

//     //please dont forget the innerHTML!!!!!
//     let origin = allTd[2].innerHTML;
//     let name = allTd[19].innerHTML;

//     layer.bindPopup(`<h2>${name}</h2><h4>${origin}</h4>`);
//   }
// }
// loadHawkerGeoJson();
