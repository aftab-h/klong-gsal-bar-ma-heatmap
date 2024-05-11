const textNodeInnerHTML = (textNode, innerHTML) => {
  var div = document.createElement("div");
  textNode.parentNode.insertBefore(div, textNode);
  div.insertAdjacentHTML("afterend", innerHTML);
  div.remove();
  textNode.remove();
};

const search = (node, term, options = {}) => {
  const childNodes = node.childNodes;
  for (let i = childNodes.length - 1; i >= 0; i--) {
    if (childNodes[i].nodeType == 1 && childNodes[i].tagName == "H2") continue;
    if (childNodes[i].nodeType == 1) {
      search(childNodes[i], term, options);
    } else if (childNodes[i].nodeType == 3) {
      switch (options?.where) {
        case "references":
          if (childNodes[i].parentNode.dataset.matchType !== "2") continue;
          break;
        case "untraced":
          if (childNodes[i].parentNode.dataset.matchType !== "0") continue;
          break;
        case "deep-correspondences":
          if (parseInt(childNodes[i].parentNode.dataset.depth, 10) < 2)
            continue;
        case "correspondences":
          if (!childNodes[i].parentNode.classList.contains("highlight"))
            continue;
      }
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
  [...node.getElementsByTagName("mark")].forEach((mark) =>
    mark.replaceWith(...mark.childNodes)
  );
};

/* T Search */
const tSearch = document.getElementById("t-search");
const tSearchButton = document.querySelector("#t-search-button");
const tSearchDrawer = tTextContainer.querySelector(".search-drawer");
const tSearchWhere = tSearchDrawer.querySelector("[name=where]");

const doTsearch = () => {
  clearMarks(tTextContent);
  if (tSearch.value) {
    const options = {
      where: tSearchWhere.value
    };
    search(tTextContent, tSearch.value, options);
  }
  createMinimap(tTextContainer, tTextContent);
  updateMatchCount(
    tSearchDrawer,
    tSearch.value,
    tTextContent.querySelectorAll("mark").length
  );
};

tSearch.addEventListener("sl-change", doTsearch);
tSearchWhere.addEventListener("sl-change", doTsearch);

tSearch.addEventListener("sl-clear", () => {
  tSearch.value = "";
});

tSearchButton.addEventListener(
  "click",
  () => (tSearchDrawer.open = !tSearchDrawer.open)
);

tSearchDrawer
  .querySelector(".search-next")
  .addEventListener("click", (event) => {
    scrollToNext(
      tTextContent,
      "mark",
      tSearchDrawer.shadowRoot.querySelector(".drawer__panel").offsetHeight + 20
    ) || notAllowed(event.target);
  });

tSearchDrawer
  .querySelector(".search-prev")
  .addEventListener("click", (event) => {
    scrollToPrev(
      tTextContent,
      "mark",
      tSearchDrawer.shadowRoot.querySelector(".drawer__panel").offsetHeight + 20
    ) || notAllowed(event.target);
  });

/* LS Search */
const lsSearch = document.getElementById("ls-search");
const lsSearchButton = document.querySelector("#ls-search-button");
const lsSearchDrawer = lsCorpusContainer.querySelector(".search-drawer");
const lsSearchWhere = lsSearchDrawer.querySelector("[name=where]");

const doLSsearch = () => {
  clearMarks(lsCorpusContent);
  if (lsSearch.value) {
    const options = {
      where: lsSearchWhere.value
    };
    search(lsCorpusContent, lsSearch.value, options);
  }
  createMinimap(lsCorpusContainer, lsCorpusContent);
  updateMatchCount(
    lsSearchDrawer,
    lsSearch.value,
    lsCorpusContent.querySelectorAll("mark").length
  );
};

lsSearch.addEventListener("sl-change", doLSsearch);
lsSearchWhere.addEventListener("sl-change", doLSsearch);

lsSearch.addEventListener("sl-clear", () => {
  lsSearch.value = "";
});

lsSearchButton.addEventListener(
  "click",
  () => (lsSearchDrawer.open = !lsSearchDrawer.open)
);

lsSearchDrawer
  .querySelector(".search-next")
  .addEventListener("click", (event) => {
    scrollToNext(
      lsCorpusContent,
      "mark",
      lsSearchDrawer.shadowRoot.querySelector(".drawer__panel").offsetHeight +
        20
    ) || notAllowed(event.target);
  });

lsSearchDrawer
  .querySelector(".search-prev")
  .addEventListener("click", (event) => {
    scrollToPrev(
      lsCorpusContent,
      "mark",
      lsSearchDrawer.shadowRoot.querySelector(".drawer__panel").offsetHeight +
        20
    ) || notAllowed(event.target);
  });
