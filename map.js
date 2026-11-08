var map = L.map("map", {zoomControl: true}).setView([51,10], 3);
var maxTotalExpImp = 0;
var countries = {};
var worldGeoJson = null;
const trade_2025_file = "data/trade-2025.json";
const trade_2026_file = "data/trade-2026.json";


function getMaxTotalExpImp(countries) {
  return Math.max.apply(null, Object.values(countries).map(c => c.export + c.import));
}


function logScale(value, maxValue) {
  return Math.log(value + 1) / Math.log(maxValue + 1);
}


function getColor(value, maxValue) {
  if (!value || value <= 0) {
    return "#cccccc"; // no data: grey
  }
  var t = logScale(value, maxValue);    // 0..1 on log scale
  var hue = t * 200 - 90;              // 120 = green, 0 = red
  return "hsl(" + hue + ", 75%, 45%)";
}


function styleFeature(feature) {
  var code = feature.properties.ADM0_A3;

  if (code == "DEU") {
    return {
      fillColor: "#00aacc",
      fillOpacity: 1,
      color: "#666",
      weight: 0.5
    };
  }

  var c = countries[code];
  var total = c ? c.export + c.import : 0;
  return {
    fillColor: getColor(total, maxTotalExpImp),
    fillOpacity: 1,
    color: "#666",
    weight: 0.5
  };
}


async function displayTradeData(country_code) {
  const resp_countries_2025 = await fetch(trade_2025_file);
  const resp_countries_2026 = await fetch(trade_2026_file);
  const countries_2025 = await resp_countries_2025.json();
  const countries_2026 = await resp_countries_2026.json();

  const country_name = countries_2026[country_code] ? countries_2026[country_code].german_name : country_code; // "Keine Daten Verfügbar";
  const export_2025 = countries_2025[country_code] ? countries_2025[country_code].export  / 1000 : "-";
  const import_2025 = countries_2025[country_code] ? countries_2025[country_code].import  / 1000 : "-";
  const export_2026 = countries_2026[country_code] ? countries_2026[country_code].export  / 1000 : "-";
  const import_2026 = countries_2026[country_code] ? countries_2026[country_code].import  / 1000 : "-";

  var cardTitle = document.getElementById("country_name");
  var cardDataEx_2025 = document.getElementById("export_2025");
  var cardDataIm_2025 = document.getElementById("import_2025");
  var cardDataEx_2026 = document.getElementById("export_2026");
  var cardDataIm_2026 = document.getElementById("import_2026");

  cardTitle.innerHTML = country_name;
  cardDataEx_2025.innerHTML = export_2025.toLocaleString("de-DE");
  cardDataIm_2025.innerHTML = import_2025.toLocaleString("de-DE");
  cardDataEx_2026.innerHTML = export_2026.toLocaleString("de-DE");
  cardDataIm_2026.innerHTML = import_2026.toLocaleString("de-DE");
}


async function drawMap(tradedata, geojson) {
  const resp_countries = await fetch(tradedata);
  countries = await resp_countries.json();
  const resp_geojson = await fetch(geojson);
  worldGeoJson = await resp_geojson.json();

  maxTotalExpImp = getMaxTotalExpImp(countries);

  L.geoJSON(worldGeoJson, {
    style: styleFeature,
    onEachFeature: (feature, layer) => {
      layer.on("click", () => {
        country_code = feature.properties.ADM0_A3;
        if (country_code !== 'DEU')
          displayTradeData(feature.properties.ADM0_A3);
      });
    }
  }).addTo(map);
}

drawMap(trade_2026_file, "data/ne_110m_admin_0_countries.json");
displayTradeData('CHN');