const createChapterMenu = (containerId, dropdownId) => {
  const textContainer = document
    .getElementById(containerId)
    .querySelector(".text");
  const dropdown = document.getElementById(dropdownId);
  const menu = document.createElement("sl-menu");
  const headingSpans = textContainer.querySelectorAll("span.heading");

  headingSpans.forEach((span) => {
    const dropdownOption = document.createElement("sl-menu-item");
    dropdownOption.textContent =
      span.textContent[1] + span.textContent.slice(2, -1).toLowerCase();
    dropdownOption.addEventListener("click", () => {
      span.scrollIntoView({ behavior: "smooth" });
    });
    menu.appendChild(dropdownOption);
  });
  dropdown.appendChild(menu);
};
