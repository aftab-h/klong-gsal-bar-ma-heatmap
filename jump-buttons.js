const scrollToPrev = (el, selector, vOffset = 20) => {
  const currentScroll = el.scrollTop;
  const els = [...el.querySelectorAll(selector)].toReversed();
  for (const subEl of els) {
    if (subEl.offsetTop - vOffset < currentScroll) {
      el.scrollTo({ top: subEl.offsetTop - vOffset, behavior: "smooth" });
      flashEl(subEl);
      return true;
    }
  }
  if (els.length) flashEl(els.at(-1));
  return false;
};

const scrollToNext = (el, selector, vOffset = 20) => {
  const currentScroll = el.scrollTop;
  const els = [...el.querySelectorAll(selector)];
  for (const subEl of els) {
    if (subEl.offsetTop - vOffset > currentScroll) {
      el.scrollTo({ top: subEl.offsetTop - vOffset, behavior: "smooth" });
      flashEl(subEl);
      return true;
    }
  }
  if (els.length) flashEl(els.at(-1));
  return false;
};

const notAllowed = (el) => {
  el.shadowRoot.querySelector("button").style.cursor = "not-allowed";
  setTimeout(
    () => (el.shadowRoot.querySelector("button").style.cursor = ""),
    500
  );
};

document
  .getElementById("t-prev")
  .addEventListener(
    "click",
    (event) =>
      scrollToPrev(document.getElementById("t-text"), ".highlight") ||
      notAllowed(event.target)
  );

document
  .getElementById("t-next")
  .addEventListener(
    "click",
    (event) =>
      scrollToNext(document.getElementById("t-text"), ".highlight") ||
      notAllowed(event.target)
  );

document
  .getElementById("ls-prev")
  .addEventListener(
    "click",
    (event) =>
      scrollToPrev(document.getElementById("ls-text"), ".highlight") ||
      notAllowed(event.target)
  );

document
  .getElementById("ls-next")
  .addEventListener(
    "click",
    (event) =>
      scrollToNext(document.getElementById("ls-text"), ".highlight") ||
      notAllowed(event.target)
  );
