//set up global variables
//leaflet expect lat lng in array

function createMap(latLng) {
  const map = L.map("map").setView(latLng, 12.5); //no need # even though it is an address

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoiZXh0cmFrdW4iLCJhIjoiY2swdnZtMWVvMTAxaDNtcDVmOHp2c2lxbSJ9.4WxdONppGpMXeHO6rq5xvg",
    }
  ).addTo(map);
  return map;
}