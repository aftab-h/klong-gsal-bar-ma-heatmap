const tText = document.getElementById("tantra-of-the-sun");
const tTextContainer = tText.querySelector(".text-container");
const tTextContent = document.getElementById("t-text");

const lsCorpus = document.getElementById("ls-corpus");
const lsCorpusContainer = lsCorpus.querySelector(".text-container");
const lsCorpusContent = document.getElementById("ls-text");

const flashEl = (el) => {
  el.classList.add("highlighted-swell-animation");
  setTimeout(() => {
    el.classList.remove("highlighted-swell-animation");
  }, 4000);
};

document.addEventListener("DOMContentLoaded", async function () {
  // Load HTML's
  fetchAndLoadData(
    "key_and_data/highlighted_ls_text.html",
    lsCorpusContent
  ).then(() => {
    createMinimap(lsCorpusContainer, lsCorpusContent);
    createChapterMenuLS(lsCorpus);
  });
  fetchAndLoadData("key_and_data/highlighted_t_text.html", tTextContent).then(
    () => {
      createMinimap(tTextContainer, tTextContent);
      createChapterMenu(tText);
    }
  );

  const keyData = await fetch("key_and_data/key_with_indexes.json")
    .then((response) => response.json())
    .then((keyData) => {
      // convert array of objects to object keyed by UID
      const uidKeyedData = keyData.reduce((obj, item) => {
        obj[item["UID"]] = item;
        return obj;
      }, {});
      return uidKeyedData;
    });

  let popupEl;

  const flashEl = (el) => {
    el.classList.add("highlighted-swell-animation");
    setTimeout(() => {
      el.classList.remove("highlighted-swell-animation");
    }, 4000);
  };

  const scrollToUidInT = (uid) => {
    // Find the corresponding T Text citation using data-uid attribute
    const tTextCitation = tTextContent.querySelector(`[data-uid*="${uid}"]`);
    // Scroll to the T Text citation if found
    if (tTextCitation) {
      tTextCitation.scrollIntoView({ behavior: "smooth", block: "start" });

      // Add animation to the corresponding line
      flashEl(tTextCitation);
    } else {
      console.log("No corresponding T Text citation found for UID: " + uid);
    }
  };

  // Creating tooltip in LS corpus for lines that have >1 match in T text
  const createMatchPopup = (event) => {
    console.log("running createMatchPopup...");
    event.stopPropagation(); // prevents the event from "bubbling" up to the document.click handler defined below
    const el = event.target;
    const uids = el.dataset.uid.split(",");
    popupEl = document.createElement("ul");
    popupEl.classList.add("tooltip");
    popupEl.style.left = `${event.clientX}px`;
    popupEl.style.top = `${event.clientY}px`;

    const data = uids.map((uid) => keyData[uid]);
    data.sort((a, b) => a["Start Index T"] - b["Start Index T"]);
    data.forEach((datum) => {
      const listItem = document.createElement("li");
      listItem.classList.add("uid-link");
      listItem.textContent = `➡️ Ch. ${datum["Ch. in T Text"]} ${datum["UID"]}`;
      listItem.addEventListener("click", () => scrollToUidInT(datum["UID"]));
      popupEl.appendChild(listItem);
    });
    el.appendChild(popupEl);
  };

  const clearMatchPopup = () => {
    if (popupEl) {
      popupEl.remove();
      popupEl = null;
    }
  };

  // For creating tooltip in LS corpus when clicking on grey or blue line
  const createPopupForBlueGrey = (event, matchType) => {
    const el = event.target;
    const popupEl = document.createElement("div");
    popupEl.classList.add("tooltip");

    if (matchType === 0) {
      popupEl.textContent =
        "No corresponding citation found in the Tantra of the Sun";
    } else if (matchType === 1) {
      popupEl.textContent =
        "References the Tantra of the Sun, not a direct citation";
    }

    // Position the tooltip relative to the clicked element
    popupEl.style.left = `${event.clientX}px`;
    popupEl.style.top = `${event.clientY}px`;

    // Append the tooltip to the clicked element's parent node (the html document)
    el.appendChild(popupEl);

    // Remove the tooltip
    setTimeout(() => {
      popupEl.remove();
    }, 2000);
  };

  // LS Corpus Click-Scroll functionality
  lsCorpusContent.addEventListener("click", function (event) {
    clearMatchPopup();
    const clickedElement = event.target;
    if (clickedElement.classList.contains("highlight")) {
      const uid = clickedElement.getAttribute("data-uid");
      if (uid) {
        console.log("Clicked something that's highlighted in ls pane...");
        console.log("uid = " + uid); // Check if UID is correctly extracted

        // Check if there's a matching T Text citation based on data-match-type
        const matchType = clickedElement.getAttribute("data-match-type");
        if (matchType === "1") {
          console.log("data-match-type = 1");
          if (uid.includes(",")) {
            // Multiple UIDs -- show a menu
            createMatchPopup(event);
          } else {
            // Single UID -- scroll directly to corresponding element in T
            scrollToUidInT(uid);
          }
        } else if (matchType === "0") {
          console.log("data-match-type = 0");
          console.log("No corresponding T Text citation found for UID: " + uid);
          createPopupForBlueGrey(event, 0);
        } else if (matchType === "2") {
          console.log("data-match-type = 2");
          createPopupForBlueGrey(event, 1);
        } else {
          console.log("Invalid data-match-type value for UID: " + uid);
        }
      }
    }
  });

  // Click anywhere? Remove tooltips
  document.addEventListener("click", clearMatchPopup);
  // Scroll ls corpus? Remove tooltips
  document
    .getElementById("ls-corpus")
    .addEventListener("scroll", clearMatchPopup);

  // Scroll t text? Remove tooltips
  document
    .getElementById("tantra-of-the-sun")
    .addEventListener("scroll", clearMatchPopup);

  // T Text Click-Scroll functionality
  tTextContent.addEventListener("click", function (event) {
    clearMatchPopup();
    const clickedElement = event.target;
    if (clickedElement.classList.contains("highlight")) {
      event.stopPropagation(); // prevents the event from "bubbling" up to the document.click handler defined below

      const uids = clickedElement.dataset.uid.split(",");
      popupEl = document.createElement("div");
      popupEl.classList.add("tooltip");

      const data = uids.map((uid) => keyData[uid]);
      data.sort((a, b) => a["Start Index LS"] - b["Start Index LS"]);
      const seen = {};
      popupEl.innerHTML = data
        .map((datum) => {
          const key = `${datum["Volume"]}.${datum["Text No."]}`;
          const affix = Object.keys(seen).includes(key)
            ? ` (${seen[key] + 1})`
            : "";
          seen[key] = seen[key] ? seen[key]++ : 1;
          return `
          <span class="uid-link" data-uid="${datum["UID"]}">
            ➡️ Vol. ${datum["Volume"]}, No. ${datum["Text No."]}: ${datum["Text Title"]} ${affix}
          </span><br>
          `;
        })
        .join("");
      clickedElement.appendChild(popupEl);

      // Position the popupEl relative to the clicked element
      popupEl.style.left = `${event.clientX}px`;
      popupEl.style.top = `${event.clientY}px`;

      // Handle click on UID link within the popupEl
      popupEl.addEventListener("click", (e) => {
        if (e.target.classList.contains("uid-link")) {
          const clickedUID = e.target.dataset.uid;
          scrollToUIDInLS(clickedUID);
        }
      });
    }
  });

  function scrollToUIDInLS(uid) {
    const lsCorpusLines = lsCorpusContent.querySelectorAll(
      `[data-uid*="${uid}"]`
    );
    lsCorpusLines.forEach((line) => {
      const lineUids = line.dataset.uid.split(",");
      if (lineUids.includes(uid)) {
        line.scrollIntoView({ behavior: "smooth", block: "start" });

        // Add animation to the corresponding line
        flashEl(line);

        return;
      } else {
        console.log("No corresponding LS citation found for UID: " + uid);
      }
    });
  }
});

// FUNCTION DEFINITIONS

function findAllCorrespondingLSCitations(tTextCitationText, keyData) {
  // Filter the keyData for all entries with the matching T Text citation
  const matchingEntries = keyData.filter(
    (row) => row["Quote in T Text"] === tTextCitationText
  );

  // Log the citation details to console
  console.log(`LS Citations for T Text citation "${tTextCitationText}":`);
  matchingEntries.forEach((entry) => {
    console.log(
      `Volume: ${entry["Volume"]}, Text No.: ${entry["Text No."]}, Quote in LS: ${entry["Quote in LS"]}`
    );
  });

  // Create an array to hold citation details (for printing to context menu)
  const citationDetails = matchingEntries.map((entry) => {
    return {
      volume: entry["Volume"],
      textNo: entry["Text No."],
      quoteInLS: entry["Quote in LS"]
    };
  });

  return citationDetails;
}

// Function to fetch and load text data into a container
function fetchAndLoadData(filePath, container) {
  return fetch(filePath)
    .then((response) => response.text())
    .then((textData) => {
      // container.innerHTML = "";
      const cont = document.createElement("div");
      textData = textData.replace(/\n/g, "<br>"); // Converts newline characters to <br> for HTML display
      cont.innerHTML = textData;
      let section = document.createElement("section");
      const childNodes = cont.childNodes;
      for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType === 1 && childNodes[i].nodeName === "H2") {
          container.append(section);
          section = document.createElement("section");
        }
        section.append(childNodes[i].cloneNode(true));
      }
      container.append(section);
    });
}

// Function to append LS Corpus info to each T Text citation
function appendLSCorpusInfo(tTextContent, citationUidMap, keyData) {
  const tTextCitations = tTextContent.querySelectorAll(".highlight-t");
  tTextCitations.forEach((tTextCitation) => {
    const citationText = tTextCitation.textContent;
    const uid = tTextCitation.getAttribute("data-uid");
    const matchingRow = keyData.find((row) => row["UID"] === uid);
    if (matchingRow) {
      const volume = matchingRow["Volume"];
      const textNo = matchingRow["Text No."];
      tTextCitation.textContent += ` (LS ${volume}.${textNo})`;
    }
  });
}
