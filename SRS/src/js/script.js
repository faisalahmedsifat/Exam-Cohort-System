// Global Array for Populating Table of Contents
var tocItems = [];

// Snake Case Converter
function toSnakeCase(str) {
  return str && str.split(" ").map(function (x) { return x.toLowerCase() }).join('_');
}

// Add Numbering in Titles 
(function () {
  document.querySelectorAll('.section-title').forEach(function (data, index) {
    if (data.innerText.split(" ")[0] === "Appendix") data.innerText = data.innerText
    else data.innerText = index + 1 + ". " + data.innerText
    data.setAttribute("id", toSnakeCase(data.innerText))
    tocItems.push([data.innerText])
  })
})();

// Add Numbering in subtitles 
(function () {
  var allSection = document.querySelectorAll('.section')
  for (var index = 0; index < allSection.length; index++) {
    allSection[index].querySelectorAll(".content-title").forEach(function (data, subindex) {
      if (data.innerText.split(" ")[0] === "Appendix") data.innerText = data.innerText
      else {
        data.innerText = (index + 1) + "." + (subindex + 1) + ". " + data.innerText
        data.setAttribute("id", toSnakeCase(data.innerText))
        tocItems[index].push(data.innerText)
      }
    })
  }
})();

// Populate Table of Contents
(function () {
  var tocLinks1 = document.getElementById("toc-links-sidebar")
  for (let index = 0; index < tocItems.length; index++) {
    if (tocItems[index].length > 0) {
      let tmpDiv0 = document.createElement('a')
      tmpDiv0.classList.add("toc-title")
      tmpDiv0.textContent = tocItems[index][0]
      tmpDiv0.setAttribute("href", "#" + toSnakeCase(tmpDiv0.textContent))
      tocLinks1.appendChild(tmpDiv0)
      for (var index1 = 1; index1 < tocItems[index].length; index1++) {
        let tmpDiv = document.createElement('a')
        tmpDiv.classList.add("toc-sub-title")
        tmpDiv.textContent = tocItems[index][index1]
        tmpDiv.setAttribute("href", "#" + toSnakeCase(tmpDiv.textContent))
        tocLinks1.appendChild(tmpDiv)
      }
    }
  }
  var tocLinks2 = document.getElementById("toc-links-print")
  tocLinks2.innerHTML = tocLinks1.innerHTML
})();