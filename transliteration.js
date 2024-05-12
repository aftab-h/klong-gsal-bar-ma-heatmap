document
  .querySelector("#toggle-unicode")
  .addEventListener("sl-change", (event) => {
    document.querySelector(".loader").style.display = "block";
    document.querySelector(".container").style.opacity = "0.3";
    setTimeout(() => {
      Promise.all([
        fetchAndLoadData(
          `key_and_data/highlighted_t_text${
            (event.target.checked && ".tibetan") || ""
          }.html`,
          tTextContent
        ),
        fetchAndLoadData(
          `key_and_data/highlighted_ls_text${
            (event.target.checked && ".tibetan") || ""
          }.html`,
          lsCorpusContent
        )
      ]).then(() => {
        document.querySelector(".loader").style.display = "none";
        document.querySelector(".container").style.opacity = "1";
        createMinimap(tTextContainer, tTextContent);
        createMinimap(lsCorpusContainer, lsCorpusContent);
        createChapterMenu(tText);
        createChapterMenuLS(lsCorpus);
      });
    }, 0);
  });
