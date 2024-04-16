const scrollToPrev = (el) => {
  const currentScroll = el.scrollTop;
  for (const highlight of [...el.querySelectorAll(".highlight")].toReversed()) {
    if (highlight.offsetTop < currentScroll) {
      el.scrollTo({ top: highlight.offsetTop, behavior: "smooth" });
      flashEl(highlight);
      break;
    }
  }
};

const scrollToNext = (el) => {
  const currentScroll = el.scrollTop;
  for (const highlight of el.querySelectorAll(".highlight")) {
    if (highlight.offsetTop > currentScroll) {
      el.scrollTo({ top: highlight.offsetTop, behavior: "smooth" });
      flashEl(highlight);
      break;
    }
  }
};

document
  .getElementById("t-prev")
  .addEventListener("click", () =>
    scrollToPrev(document.getElementById("t-text"))
  );

document
  .getElementById("t-next")
  .addEventListener("click", () =>
    scrollToNext(document.getElementById("t-text"))
  );

document
  .getElementById("ls-prev")
  .addEventListener("click", () =>
    scrollToPrev(document.getElementById("ls-text"))
  );

document
  .getElementById("ls-next")
  .addEventListener("click", () =>
    scrollToNext(document.getElementById("ls-text"))
  );
