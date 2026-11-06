function loadPartial(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    });
}
    
loadPartial("header", "header.html");
loadPartial("footer", "footer.html");