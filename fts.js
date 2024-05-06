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

const updateMatchCount = (drawer, query, count) => {
  drawer.querySelector(".query").innerText = query;
  drawer.querySelector(".match-count").innerText = count.toLocaleString();
};

const clearMarks = (node) => {
  [...node.getElementsByTagName("mark")].forEach((mark) => mark.remove());
};

const tSearch = document.getElementById("t-search");
tSearch.addEventListener("sl-change", (event) => {
  clearMarks(tTextContent);
  if (event.target.value) search(tTextContent, event.target.value);
  createMinimap(tTextContainer, tTextContent);
  updateMatchCount(
    tSearchDrawer,
    event.target.value,
    tTextContent.querySelectorAll("mark").length
  );
});

tSearch.addEventListener("sl-clear", () => {
  tSearch.value = "";
});

const tSearchButton = document.querySelector("#t-search-button");
const tSearchDrawer = tTextContainer.querySelector(".search-drawer");
tSearchButton.addEventListener(
  "click",
  () => (tSearchDrawer.open = !tSearchDrawer.open)
);

const lsSearch = document.getElementById("ls-search");
lsSearch.addEventListener("sl-change", (event) => {
  clearMarks(lsCorpusContent);
  if (event.target.value) search(lsCorpusContent, event.target.value);
  createMinimap(lsCorpusContainer, lsCorpusContent);
  updateMatchCount(
    lsSearchDrawer,
    event.target.value,
    lsCorpusContent.querySelectorAll("mark").length
  );
});

lsSearch.addEventListener("sl-clear", () => {
  lsSearch.value = "";
});

const lsSearchButton = document.querySelector("#ls-search-button");
const lsSearchDrawer = lsCorpusContainer.querySelector(".search-drawer");
lsSearchButton.addEventListener(
  "click",
  () => (lsSearchDrawer.open = !lsSearchDrawer.open)
);
