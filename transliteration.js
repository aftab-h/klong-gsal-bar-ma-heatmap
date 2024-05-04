const transliterateWorker = new Worker("./transliterate-worker.js", {
  type: "module"
});

const transliterate = (node, toUnicode = true, promises = []) => {
  const childNodes = node.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    if (childNodes[i].nodeType == 1) {
      transliterate(childNodes[i], toUnicode, promises);
    } else if (childNodes[i].nodeType == 3) {
      promises.push(
        new Promise((resolve) => {
          const channel = new MessageChannel();
          channel.port2.onmessage = ({ data }) => {
            childNodes[i].textContent = data;
            resolve();
          };
          transliterateWorker.postMessage(
            { content: childNodes[i].textContent, toUnicode },
            [channel.port1]
          );
        })
      );
    }
  }
  return Promise.all(promises);
};

document
  .querySelector("#toggle-unicode")
  .addEventListener("sl-change", (event) => {
    document.querySelector(".loader").style.display = "block";
    document.querySelector(".container").style.opacity = "0.3";
    setTimeout(() => {
      Promise.all(
        [...document.querySelectorAll(".text")].map((container) =>
          transliterate(container, event.target.checked)
        )
      ).then(() => {
        document.querySelector(".loader").style.display = "none";
        document.querySelector(".container").style.opacity = "1";
        createMinimap(tTextContainer, tTextContent);
        createMinimap(lsCorpusContainer, lsCorpusContent);
      });
    }, 0);
  });
