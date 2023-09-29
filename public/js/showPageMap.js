mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "show-page-map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: datingplace.geometry.coordinates, // starting position [lng, lat]
  zoom: 15, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(datingplace.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${datingplace.title}</h3><p>${datingplace.location}</p>`
    )
  )
  .addTo(map);
