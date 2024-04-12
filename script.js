document.addEventListener("DOMContentLoaded", function () {
  const lsCorpusContainer = document.getElementById("ls-text");
  const tTextContainer = document.getElementById("t-text");
  //const smallTextContainer = document.getElementById('small-t-text');

  console.log("test");

  // Load HTML's
  fetchAndLoadData("key_and_data/highlighted_ls_text.html", lsCorpusContainer);
  fetchAndLoadData("key_and_data/highlighted_t_text.html", tTextContainer);
  //fetchAndLoadData("key_and_data/highlighted_t_text.html", smallTextContainer);

  let list;

  // // Tooltip functionality
  // let tip;
  // const spans = document.querySelectorAll(".highlight");
  // spans.forEach((span) => {
  //   span.addEventListener("mouseover", (event) => {
  //     const el = event.target;
  //     const uids = el.dataset.uid.split(",");
  //     tip = document.createElement("div");
  //     tip.classList.add("tooltip");
  //     tip.textContent = el.dataset.uid
  //       .split(",")
  //       .map((uid) => `UID: ${uid}`)
  //       .join("\n");
  //     el.appendChild(tip);
  //     el.onpointermove = (e) => {
  //       if (e.target !== e.currentTarget) return;
  //       tip.style.left = `${e.clientX}px`;
  //       tip.style.top = `${e.clientY}px`;
  //     };
  //     document.querySelector("main").classList.add("fade");
  //     uids.forEach((uid) =>
  //       document
  //         .querySelectorAll(`.highlight[data-uid*="${uid}"]`)
  //         .forEach((span) => span.classList.add("mark"))
  //     );
  //   });
  //   span.addEventListener("mouseout", (event) => {
  //     tip.remove();
  //     tip = null;
  //     document.querySelector("main").classList.remove("fade");
  //     document
  //       .querySelectorAll(`.highlight.mark`)
  //       .forEach((span) => span.classList.remove("mark"));
  //   });
  // });

  const scrollToUidInT = (uid) => {
    // Find the corresponding T Text citation using data-uid attribute
    const tTextCitation = tTextContainer.querySelector(`[data-uid*="${uid}"]`);
    // Scroll to the T Text citation if found
    if (tTextCitation) {
      tTextCitation.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.log("No corresponding T Text citation found for UID: " + uid);
    }
  };

  const createQuotationList = (event) => {
    event.stopPropagation(); // prevents the event from "bubbling" up to the document.click handler defined below
    const el = event.target;
    const uids = el.dataset.uid.split(",");
    list = document.createElement("ul");
    list.classList.add("quotation-list");
    list.style.left = `${event.clientX}px`;
    list.style.top = `${event.clientY}px`;
    uids.forEach((uid) => {
      const listItem = document.createElement("li");
      listItem.textContent = `-> ${uid}`;
      listItem.addEventListener("click", () => scrollToUidInT(uid));
      list.appendChild(listItem);
    });
    el.appendChild(list);
  };

  const clearQuotationList = () => {
    if (list) {
      list.remove();
      list = null;
    }
  };

  // LS Corpus Click-Scroll functionality
  lsCorpusContainer.addEventListener("click", function (event) {
    clearQuotationList();
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
            createQuotationList(event);
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

  document.addEventListener("click", clearQuotationList);
  document
    .getElementById("ls-corpus")
    .addEventListener("scroll", clearQuotationList);
  document
    .getElementById("t-text")
    .addEventListener("scroll", clearQuotationList);

  // T Text Click-Scroll functionality
  tTextContainer.addEventListener("click", function (event) {
    clearQuotationList();
    const clickedElement = event.target;
    if (clickedElement.classList.contains("highlight")) {
      const uids = clickedElement.dataset.uid.split(",");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.innerHTML = uids
        .map((uid) => `UID: <span class="uid-link">${uid}</span><br>`)
        .join("");
      clickedElement.appendChild(tooltip);

      // Position the tooltip relative to the clicked element
      tooltip.style.left = `${event.clientX}px`;
      tooltip.style.top = `${event.clientY}px`;

      // Handle click on UID link within the tooltip
      tooltip.addEventListener("click", (e) => {
        if (e.target.classList.contains("uid-link")) {
          const clickedUID = e.target.textContent;
          scrollToUIDInLS(clickedUID);
        }
      });

      // Remove the tooltip after a certain duration or when clicking outside of it
      setTimeout(() => {
        tooltip.remove();
      }, 6000); // Remove after 6 seconds (adjust as needed)
    }
  });

  ``;

  function scrollToUIDInLS(uid) {
    const lsCorpusLines = lsCorpusContainer.querySelectorAll(
      `[data-uid*="${uid}"]`
    );
    lsCorpusLines.forEach((line) => {
      const lineUids = line.dataset.uid.split(",");
      if (lineUids.includes(uid)) {
        line.scrollIntoView({ behavior: "smooth", block: "start" });
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
      // Set the inner HTML of the container with the txt data
      container.innerHTML = textData.replace(/\n/g, "<br>"); // Converts newline characters to <br> for HTML display
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
