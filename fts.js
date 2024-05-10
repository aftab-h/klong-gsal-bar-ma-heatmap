const textNodeInnerHTML = (textNode, innerHTML) => {
  var div = document.createElement("div");
  textNode.parentNode.insertBefore(div, textNode);
  div.insertAdjacentHTML("afterend", innerHTML);
  div.remove();
  textNode.remove();
};

const search = (node, term) => {
  const childNodes = node.childNodes;
  for (let i = childNodes.length - 1; i >= 0; i--) {
    if (childNodes[i].nodeType == 1 && childNodes[i].tagName == "H2") continue;
    if (childNodes[i].nodeType == 1) {
      search(childNodes[i], term);
    } else if (childNodes[i].nodeType == 3) {
      if (childNodes[i].textContent.indexOf(term) >= 0) {
        textNodeInnerHTML(
          childNodes[i],
          childNodes[i].textContent.replaceAll(term, `<mark>${term}</mark>`)
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

tSearchDrawer.querySelector(".search-next").addEventListener("click", () => {
  scrollToNext(
    tTextContent,
    "mark",
    tSearchDrawer.shadowRoot.querySelector(".drawer__panel").offsetHeight + 20
  );
});

tSearchDrawer.querySelector(".search-prev").addEventListener("click", () => {
  scrollToPrev(
    tTextContent,
    "mark",
    tSearchDrawer.shadowRoot.querySelector(".drawer__panel").offsetHeight + 20
  );
});

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

lsSearchDrawer.querySelector(".search-next").addEventListener("click", () => {
  scrollToNext(
    lsCorpusContent,
    "mark",
    lsSearchDrawer.shadowRoot.querySelector(".drawer__panel").offsetHeight + 20
  );
});

lsSearchDrawer.querySelector(".search-prev").addEventListener("click", () => {
  scrollToPrev(
    lsCorpusContent,
    "mark",
    lsSearchDrawer.shadowRoot.querySelector(".drawer__panel").offsetHeight + 20
  );
});