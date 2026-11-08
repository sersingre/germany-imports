async function drawTradeTable(year, clickedButton) {
  var buttons = document.querySelectorAll(".btn-group .btn");
  for(var button of buttons) {
    button.classList.remove("active")
  }
  clickedButton.classList.add("active");

  const response = await fetch("data/trade-" + year + ".json");
  const data = await response.json();

  var isoCodes = Object.keys(data);
  var countries = []

  for (iso of isoCodes) {
    var country = data[iso];
    countries.push({
      iso: iso,
      name: country.german_name,
      import: country.import / 1000,
      export: country.export / 1000
    });
  }

  let maxExport = Math.max.apply(null, countries.map(c => c.export));
  let maxImport = Math.max.apply(null, countries.map(c => c.import));

  populateTBody("#export_table", countries, "export", Math.max(maxExport, maxImport));
  populateTBody("#import_table", countries, "import", Math.max(maxExport, maxImport));
}

function populateTBody(tbodyElement, data, attribute, maxValue) {

  data.sort((a, b) => b[attribute] - a[attribute]);

  var tbody = document.querySelector(tbodyElement + " tbody");
  tbody.innerHTML = "";

  for(let [index, dataset] of data.entries()) {
    var row = document.createElement("tr");
    row.innerHTML =
      "<td>" + (index+1) + "</td>" +
      "<td>" +
        "<small>" + dataset.name + "</small>" +
        "<div class='progress' role='progressbar' " +
        "aria-valuenow='" + logScale(dataset[attribute], maxValue) + "' " +
        "aria-valuemin='0' aria-valuemax='1' " +
        "style='--bs-progress-height: 5px;'>" +
        "<div class='progress-bar' style='width: " + logScale(dataset[attribute], maxValue) * 100 + "%'>" +
        "</div></div>" +
      "</td>" +
      "<td>" + dataset[attribute].toLocaleString("de-DE") + "</td>";
      tbody.appendChild(row);
  }
}

function logScale(value, maxValue) {
  return Math.log(value + 1) / Math.log(maxValue + 1);
}


drawTradeTable("2026", document.getElementById("btn-2026"))