const scrollToPrev = (el, selector, vOffset = 20) => {
  const currentScroll = el.scrollTop;
  for (const subEl of [...el.querySelectorAll(selector)].toReversed()) {
    if (subEl.offsetTop - vOffset < currentScroll) {
      el.scrollTo({ top: subEl.offsetTop - vOffset, behavior: "smooth" });
      flashEl(subEl);
      break;
    }
  }
};

const scrollToNext = (el, selector, vOffset = 20) => {
  const currentScroll = el.scrollTop;
  for (const subEl of el.querySelectorAll(selector)) {
    if (subEl.offsetTop - vOffset > currentScroll) {
      el.scrollTo({ top: subEl.offsetTop - vOffset, behavior: "smooth" });
      flashEl(subEl);
      break;
    }
  }
};

document
  .getElementById("t-prev")
  .addEventListener("click", () =>
    scrollToPrev(document.getElementById("t-text"), ".highlight")
  );

document
  .getElementById("t-next")
  .addEventListener("click", () =>
    scrollToNext(document.getElementById("t-text"), ".highlight")
  );

document
  .getElementById("ls-prev")
  .addEventListener("click", () =>
    scrollToPrev(document.getElementById("ls-text"), ".highlight")
  );

document
  .getElementById("ls-next")
  .addEventListener("click", () =>
    scrollToNext(document.getElementById("ls-text"), ".highlight")
  );
