const scrollIntoViewAndWait = (element, container) => {
  return new Promise((resolve) => {
    if ("onscrollend" in window) {
      container.addEventListener("scrollend", resolve, { once: true });
      element.scrollIntoView({
        behavior: "smooth"
      });
    } else {
      /* onscrollend is not supported in Safari, so scroll immediately (without animation) */
      element.scrollIntoView();
      resolve();
    }
  });
};

const updateButtonTextFromPosition = (textContainer, callback) => {
  const observer = new IntersectionObserver(callback, {
    root: textContainer,
    rootMargin: "-30% 0px -50% 0px"
  });
  textContainer.querySelectorAll("span.heading").forEach((span) => {
    observer.observe(span);
  });
};

const stripTitle = (title) => title[1] + title.slice(2, -1).toLowerCase();

const createChapterMenu = (containerId, dropdownId) => {
  const textContainer = document
    .getElementById(containerId)
    .querySelector(".text");
  const dropdown = document.getElementById(dropdownId);
  const button = dropdown.querySelector("sl-button");
  const menu = document.createElement("sl-menu");
  const headingSpans = textContainer.querySelectorAll("span.heading");

  headingSpans.forEach((span) => {
    const dropdownOption = document.createElement("sl-menu-item");
    dropdownOption.textContent = stripTitle(span.textContent);
    dropdownOption.addEventListener("click", () => {
      scrollIntoViewAndWait(span, textContainer).then(
        () => (button.innerText = stripTitle(span.textContent))
      );
    });
    menu.appendChild(dropdownOption);
  });
  dropdown.appendChild(menu);

  updateButtonTextFromPosition(textContainer, ([entry]) => {
    if (entry.isIntersecting) {
      button.innerText = stripTitle(entry.target.textContent);
    }
  });
};

const createChapterMenuLS = (containerId, dropdownId) => {
  const textContainer = document
    .getElementById(containerId)
    .querySelector(".text");
  const dropdown = document.getElementById(dropdownId);
  const button = dropdown.querySelector("sl-button");
  const menu = document.createElement("sl-menu");
  const headingSpans = textContainer.querySelectorAll("span.heading");

  let menuItem;
  let subMenu;
  let currentVol;
  headingSpans.forEach((span) => {
    const [vol, text] = stripTitle(span.textContent).split(".");
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
      scrollIntoViewAndWait(span, textContainer).then(
        () => (button.innerText = stripTitle(span.textContent))
      );
    });
    subMenu.appendChild(subMenuItem);
  });

  dropdown.appendChild(menu);
  updateButtonTextFromPosition(textContainer, ([entry]) => {
    if (entry.isIntersecting) {
      button.innerText = stripTitle(entry.target.textContent);
    }
  });
};
