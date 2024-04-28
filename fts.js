function textNodeInnerHTML(textNode, innerHTML) {
  var div = document.createElement("div");
  textNode.parentNode.insertBefore(div, textNode);
  div.insertAdjacentHTML("afterend", innerHTML);
  div.remove();
  textNode.remove();
}

const search = (node, term) => {
  const childNodes = node.childNodes;
  for (let i = childNodes.length - 1; i >= 0; i--) {
    if (childNodes[i].nodeType == 1 && childNodes[i].tagName == "H2") {
      continue;
    }

    if (childNodes[i].nodeType == 1) {
      search(childNodes[i], term);
    } else if (childNodes[i].nodeType == 3) {
      if (childNodes[i].textContent.indexOf(term) >= 0) {
        textNodeInnerHTML(
          childNodes[i],
          childNodes[i].textContent.replace(term, "<mark>" + term + "</mark>")
        );
      }
    }
  }
};

const clearMarks = (node) => {
  [...node.getElementsByTagName("mark")].forEach((mark) => mark.remove());
};

const tSearch = document.getElementById("t-search");
tSearch.addEventListener("sl-change", (event) => {
  clearMarks(document.getElementById("t-text"));
  if (!event.target.value) return;
  search(document.getElementById("t-text"), event.target.value);
  createMinimap(tTextContainer, tTextContent);
});

tSearch.addEventListener("sl-clear", () => {
  tSearch.value = "";
});

const lsSearch = document.getElementById("ls-search");
lsSearch.addEventListener("sl-change", (event) => {
  clearMarks(document.getElementById("ls-text"));
  if (!event.target.value) return;
  search(document.getElementById("ls-text"), event.target.value);
  createMinimap(lsCorpusContainer, lsCorpusContent);
});

lsSearch.addEventListener("sl-clear", () => {
  lsSearch.value = "";
});
