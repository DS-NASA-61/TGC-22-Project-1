//latlng is arry as required by leaflet
function createMap(latLng) {
  const map = L.map("map").setView(latLng, 13); //no need # even though it is an address

  L.tileLayer("https://maps-{s}.onemap.sg/v3/Original/{z}/{x}/{y}.png", {
    minZoom: 11,
    maxZoom: 18,
    bounds: [
      [1.56073, 104.11475],
      [1.16, 103.502],
    ],
    attribution:
      '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> New OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>',
  }).addTo(map);
  return map;
}

// tileLayer Option2:
// "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
//   {
//     attribution:
//       'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: "mapbox/streets-v11",

//     accessToken:
//       "pk.eyJ1IjoiZXh0cmFrdW4iLCJhIjoiY2swdnZtMWVvMTAxaDNtcDVmOHp2c2lxbSJ9.4WxdONppGpMXeHO6rq5xvg",
//   }
