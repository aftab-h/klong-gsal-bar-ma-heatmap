const flashEl = (el) => {
  el.classList.add("highlighted-swell-animation");
  setTimeout(() => {
    el.classList.remove("highlighted-swell-animation");
  }, 4000);
};

document.addEventListener("DOMContentLoaded", async function () {
  const lsCorpusContainer = document.getElementById("ls-text");
  const tTextContainer = document.getElementById("t-text");
  //const smallTextContainer = document.getElementById('small-t-text');

  console.log("test");

  // Load HTML's
  fetchAndLoadData(
    "key_and_data/highlighted_ls_text.html",
    lsCorpusContainer
  ).then(() => createMinimap("ls-corpus", "ls-text"));
  fetchAndLoadData("key_and_data/highlighted_t_text.html", tTextContainer).then(
    () => createMinimap("tantra-of-the-sun", "t-text")
  );
  //fetchAndLoadData("key_and_data/highlighted_t_text.html", smallTextContainer);

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
    const tTextCitation = tTextContainer.querySelector(`[data-uid*="${uid}"]`);
    // Scroll to the T Text citation if found
    if (tTextCitation) {
      tTextCitation.scrollIntoView({ behavior: "smooth", block: "start" });

      // Add animation to the corresponding line
      flashEl(tTextCitation);
    } else {
      console.log("No corresponding T Text citation found for UID: " + uid);
    }
  };

  const createMatchPopup = (event) => {
    event.stopPropagation(); // prevents the event from "bubbling" up to the document.click handler defined below
    const el = event.target;
    const uids = el.dataset.uid.split(",");
    popupEl = document.createElement("ul");
    popupEl.classList.add("tooltip");
    popupEl.style.left = `${event.clientX}px`;
    popupEl.style.top = `${event.clientY}px`;
    uids.forEach((uid) => {
      const listItem = document.createElement("li");
      listItem.classList.add("uid-link");
      listItem.textContent = `➡️ ${uid}`;
      listItem.addEventListener("click", () => scrollToUidInT(uid));
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

  // LS Corpus Click-Scroll functionality
  lsCorpusContainer.addEventListener("click", function (event) {
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
        } else if (matchType === "2") {
          console.log("data-match-type = 2");
          // Do something
        } else {
          console.log("Invalid data-match-type value for UID: " + uid);
        }
      }
    }
  });

  document.addEventListener("click", clearMatchPopup);
  document
    .getElementById("ls-corpus")
    .addEventListener("scroll", clearMatchPopup);
  document
    .getElementById("tantra-of-the-sun")
    .addEventListener("scroll", clearMatchPopup);

  // T Text Click-Scroll functionality
  tTextContainer.addEventListener("click", function (event) {
    clearMatchPopup();
    const clickedElement = event.target;
    if (clickedElement.classList.contains("highlight")) {
      event.stopPropagation(); // prevents the event from "bubbling" up to the document.click handler defined below

      const uids = clickedElement.dataset.uid.split(",");
      popupEl = document.createElement("div");
      popupEl.classList.add("tooltip");
      popupEl.innerHTML = uids
        .map((uid) => {
          const data = keyData[uid];
          return `
          <span class="uid-link" data-uid="${uid}">
            ➡️ Vol. ${data["Volume"]}, No. ${data["Text No."]}: ${data["Text Title"]}
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
    const lsCorpusLines = lsCorpusContainer.querySelectorAll(
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
      textData = textData.replace(/\n\s*\[/g, "<hr>[");
      textData = textData.replace(/\n/g, "<br>"); // Converts newline characters to <br> for HTML display
      // Set the inner HTML of the container with the txt data
      container.innerHTML = textData;

      const hrs = [...container.querySelectorAll("hr")];
      hrs.forEach((hr) => {
        hr.addEventListener("click", (event) => {
          const i = hrs.indexOf(hr);
          if (i < hrs.length - 1) {
            container.scrollTo({
              top: hrs[i + 1].offsetTop - 40,
              behavior: "smooth"
            });
          }
        });
      });
    });
}

// Function to append LS Corpus info to each T Text citation
function appendLSCorpusInfo(tTextContainer, citationUidMap, keyData) {
  const tTextCitations = tTextContainer.querySelectorAll(".highlight-t");
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
