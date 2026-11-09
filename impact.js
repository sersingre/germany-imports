async function buildAccordion(file) {
  const response = await fetch(file);
  const items = await response.json();

  var container = document.getElementById("trade_impacts");
  container.innerHTML = "";

  items.forEach(function(item, index) {
    var itemDiv = document.createElement("div");
    itemDiv.className = "accordion-item";

    var headerH2 = document.createElement("h2");
    headerH2.className = "accordion-header";

    var button = document.createElement("button");
    button.className = "accordion-button collapsed";
    button.type = "button";
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", "#collapse" + index);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "collapse" + index);

    var titleWrapper = document.createElement("div");

    var titleSpan = document.createElement("span");
    titleSpan.className = "fw-semibold";
    titleSpan.textContent = item.title;

    var subtitleSmall = document.createElement("small");
    subtitleSmall.className = "d-block text-muted pt-1";
    subtitleSmall.textContent = item.subtitle;

    var collapseDiv = document.createElement("div");
    collapseDiv.id = "collapse" + index;
    collapseDiv.className = "accordion-collapse collapse";
    collapseDiv.setAttribute("data-bs-parent", "#trade_impacts");

    var bodyDiv = document.createElement("div");
    bodyDiv.className = "accordion-body";
    bodyDiv.style = "text-align: justify;";
    bodyDiv.textContent = item.text;

    titleWrapper.appendChild(titleSpan);
    titleWrapper.appendChild(subtitleSmall);
    button.appendChild(titleWrapper);
    headerH2.appendChild(button);
    collapseDiv.appendChild(bodyDiv);
    itemDiv.appendChild(headerH2);
    itemDiv.appendChild(collapseDiv);
    container.appendChild(itemDiv);
  });
}

buildAccordion("data/impact.json");