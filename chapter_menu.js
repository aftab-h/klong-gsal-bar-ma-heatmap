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

const throttle = (callback, delay) => {
  let wait = false;
  return (...args) => {
    if (wait) return;
    callback(...args);
    wait = true;
    setTimeout(() => (wait = false), delay);
  };
};

const stripTitle = (title) =>
  title ? title.replace(/[\[\]]/g, "") : "Chapters";

const sizeInViewport = (element, cTop, cBottom) => {
  const { top: elTop, bottom: elBottom } = element.getBoundingClientRect();
  return Math.min(elBottom, cBottom) - Math.max(elTop, cTop);
};

const updateButtonTextFromPosition = (textContainer, button) => {
  let debounceTimeout;
  textContainer.addEventListener("scroll", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const { top: cTop, bottom: cBottom } =
        textContainer.getBoundingClientRect();
      let visible = [...textContainer.querySelectorAll("section")].filter(
        (section) => {
          const { top: elTop, bottom: elBottom } =
            section.getBoundingClientRect();
          if (elTop >= cTop && elTop <= cBottom) return true;
          if (elBottom >= cTop && elBottom <= cBottom) return true;
          if (elTop <= cTop && elBottom >= cBottom) return true;
        }
      );

      visible = visible.toSorted(
        (a, b) =>
          sizeInViewport(b, cTop, cBottom) - sizeInViewport(a, cTop, cBottom)
      );
      buttonText = (visible[0].querySelector("span.heading") || {}).textContent;
      button.innerText = stripTitle(buttonText);
    }, 100);
  });
};

const createChapterMenu = (wrapperEl) => {
  const textContainer = wrapperEl.querySelector(".text");
  const dropdown = wrapperEl.querySelector("sl-dropdown");

  if (dropdown.querySelector("sl-menu"))
    dropdown.querySelector("sl-menu").remove();

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

  updateButtonTextFromPosition(textContainer, button);
};

const createChapterMenuLS = (wrapperEl) => {
  const textContainer = wrapperEl.querySelector(".text");
  const dropdown = wrapperEl.querySelector("sl-dropdown");

  if (dropdown.querySelector("sl-menu"))
    dropdown.querySelector("sl-menu").remove();

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
  const observer = new MutationObserver(
    throttle((mutationList) => {
      const menuItem = mutationList[0].target;
      const subMenu = menuItem.querySelector("sl-menu");
      if (!subMenu) return;
      subMenu.style.maxHeight =
        window.innerHeight - menuItem.getBoundingClientRect().top - 20 + "px";
    }, 100)
  );

  dropdown.addEventListener("sl-show", () => {
    observer.observe(menu, {
      attributes: true,
      subtree: true
    });
  });
  dropdown.addEventListener("sl-hide", () => observer.disconnect());

  updateButtonTextFromPosition(textContainer, button);
};
