const createMinimap = (containerId, contentId) => {
  const containerEl = document.getElementById(containerId);
  const contentEl = document.getElementById(contentId);

  // Set up the canvas and add to the minimap container
  const minimapEl = containerEl.querySelector(".minimap");
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.width = "40px";
  canvas.style.height = minimapEl.offsetHeight + "px";
  canvas.width = 40;
  canvas.height = minimapEl.offsetHeight;
  minimapEl.append(canvas);

  // Draw the content to the canvas
  const context = canvas.getContext("2d");
  const minimapHeight = minimapEl.offsetHeight;
  const contentHeight = contentEl.scrollHeight;

  contentEl.querySelectorAll(".highlight").forEach((highlight) => {
    const y = (highlight.offsetTop / contentHeight) * minimapHeight;
    context.fillStyle =
      getComputedStyle(highlight).getPropertyValue("background-color");
    context.fillRect(0, y, 40, 1);
  });

  // Set up the indicator element
  const indicator = document.createElement("div");
  indicator.style.position = "fixed";
  indicator.style.width = "40px";
  indicator.style.outline = "1px solid green";
  indicator.style.outlineOffset = "1px";
  indicator.style.boxSizing = "border-box";

  const ratio = contentEl.offsetHeight / contentEl.scrollHeight;
  indicator.style.height = minimapEl.offsetHeight * ratio + "px";

  minimapEl.append(indicator);

  // Add the scroll event listener
  contentEl.addEventListener(
    "scroll",
    () => (indicator.style.marginTop = contentEl.scrollTop * ratio + "px")
  );

  // Add the drag-to-scroll functionality
  let dragging = false;
  minimapEl.addEventListener("mousedown", (event) => {
    event.stopPropagation();
    dragging = true;
    const rect = minimapEl.getBoundingClientRect();
    contentEl.scrollTo({
      top: ((event.clientY - rect.top) / rect.height) * contentHeight,
      behavior: "instant"
    });
  });
  minimapEl.addEventListener("mouseup", () => (dragging = false));
  minimapEl.addEventListener("mouseleave", () => (dragging = false));
  minimapEl.addEventListener("mousemove", (event) => {
    if (dragging) {
      const rect = minimapEl.getBoundingClientRect();
      contentEl.scrollTo({
        top: ((event.clientY - rect.top) / rect.height) * contentHeight,
        behavior: "instant"
      });
    }
  });
};
