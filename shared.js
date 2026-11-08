async function loadPartial(id, file) {
  const response = await fetch(file);
  const html = await response.text();

  const element = document.getElementById(id);

  if (element != null) element.innerHTML = html;
}
    
loadPartial("header", "header.html");
loadPartial("footer", "footer.html");