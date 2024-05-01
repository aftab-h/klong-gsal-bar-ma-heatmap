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

const createChapterMenuLS = (containerId, dropdownId) => {
  const textContainer = document
    .getElementById(containerId)
    .querySelector(".text");
  const dropdown = document.getElementById(dropdownId);
  const menu = document.createElement("sl-menu");
  const headingSpans = textContainer.querySelectorAll("span.heading");

  let menuItem;
  let subMenu;
  let currentVol;
  headingSpans.forEach((span) => {
    const [vol, text] = span.textContent.slice(1, -1).split(".");
    if (!currentVol || currentVol !== vol) {
      menuItem = document.createElement("sl-menu-item");
      menu.appendChild(menuItem);
      subMenu = document.createElement("sl-menu");
      subMenu.setAttribute("slot", "submenu");
      menuItem.innerText = vol;
      menuItem.appendChild(subMenu);
      currentVol = vol;
    }

    const subMenuItem = document.createElement("sl-menu-item");
    subMenuItem.innerText = `${vol}.${text}`;
    subMenuItem.addEventListener("click", () => {
      span.scrollIntoView({ behavior: "smooth" });
    });
    subMenu.appendChild(subMenuItem);
  });

  dropdown.appendChild(menu);
};
