let lastScrollTop = 0;
const navbar = document.getElementById("stickynav");

if (navbar) {
  // Hide sticky nav while scrolling down and reveal it when scrolling up.
  window.addEventListener("scroll", () => {
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
      navbar.classList.add("hidden");
    } else {
      navbar.classList.remove("hidden");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });

  navbar.addEventListener("mouseover", () => {
    navbar.classList.remove("hidden");
  });
}

function setActiveNavbarLink() {
  // Keep nav highlighting accurate on every page without hardcoded active classes.
  const current = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-item a.nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    const hrefWithoutHash = (href || "").split("#")[0];
    const hrefPath = hrefWithoutHash.split("?")[0];
    const linkFile = hrefPath.split("/").pop() || "index.html";

    if (!linkFile) {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
      return;
    }

    if (linkFile === current || (linkFile === "index.html" && current === "")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });
}

function findMenuProductTarget(product) {
  if (!product) {
    return null;
  }

  // Normalize labels so URL values still match product titles reliably.
  const normalizeProductLabel = (value) =>
    (value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

  const normalizedProduct = normalizeProductLabel(product);

  const getMatch = (selector, tabButtonId) => {
    const links = document.querySelectorAll(selector);
    const match = Array.from(links).find((link) => {
      const label = (link.textContent || "").trim();
      return normalizeProductLabel(label) === normalizedProduct;
    });

    if (!match) {
      return null;
    }

    return { link: match, tabButtonId };
  };

  return (
    getMatch(
      "#image-caption-coffee .list-group-item > .product-title",
      "coffee-tab",
    ) ||
    getMatch(
      "#image-caption-pastries .list-group-item > .product-title",
      "pastry-tab",
    ) ||
    getMatch(
      "#image-caption-specialdrinks .list-group-item > .product-title",
      "specialdrinks-tab",
    ) ||
    getMatch(
      "#image-caption-savory .list-group-item > .product-title",
      "savory-tab",
    )
  );
}

function initMenuTabs() {
  const tabButtons = document.querySelectorAll("#menuTabs .nav-link");

  if (!tabButtons.length) {
    return;
  }

  const tabs = Array.from(tabButtons);

  const showTabAt = (index) => {
    const button = tabs[index];
    if (!button || !window.bootstrap || !window.bootstrap.Tab) {
      return;
    }

    const tabInstance = new window.bootstrap.Tab(button);
    tabInstance.show();
    button.focus({ preventScroll: true });
  };

  const hasActive = Array.from(tabButtons).some((button) =>
    button.classList.contains("active"),
  );

  if (!hasActive && window.bootstrap && window.bootstrap.Tab) {
    const firstTab = new window.bootstrap.Tab(tabButtons[0]);
    firstTab.show();
  }

  tabs.forEach((button, index) => {
    button.addEventListener("keydown", (event) => {
      let targetIndex = index;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        targetIndex = (index + 1) % tabs.length;
        showTabAt(targetIndex);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        targetIndex = (index - 1 + tabs.length) % tabs.length;
        showTabAt(targetIndex);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        showTabAt(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        showTabAt(tabs.length - 1);
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showTabAt(index);
      }
    });
  });

  const params = new URLSearchParams(window.location.search);
  const product = (params.get("product") || "").trim().toLowerCase();

  if (product && window.bootstrap && window.bootstrap.Tab) {
    const target = findMenuProductTarget(product);
    const targetTabButton = document.getElementById(
      target ? target.tabButtonId : "coffee-tab",
    );

    if (targetTabButton) {
      const targetTab = new window.bootstrap.Tab(targetTabButton);
      targetTab.show();
    }
  }
}

function initMenuProductFromUrl() {
  const coffeeItems = document.querySelectorAll(
    "#image-caption-coffee .list-group-item",
  );

  const pastryItems = document.querySelectorAll(
    "#image-caption-pastries .list-group-item",
  );

  const specialDrinksItems = document.querySelectorAll(
    "#image-caption-specialdrinks .list-group-item",
  );

  const savoryItems = document.querySelectorAll(
    "#image-caption-savory .list-group-item",
  );

  if (
    !coffeeItems.length &&
    !pastryItems.length &&
    !specialDrinksItems.length &&
    !savoryItems.length
  ) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const product = (params.get("product") || "").trim().toLowerCase();

  if (!product) {
    return;
  }

  const target = findMenuProductTarget(product);
  const targetLink = target ? target.link : null;

  if (!targetLink) {
    return;
  }

  if (window.bootstrap && window.bootstrap.Tab) {
    const targetTabButton = document.getElementById(target.tabButtonId);
    if (targetTabButton) {
      const targetTab = new window.bootstrap.Tab(targetTabButton);
      targetTab.show();
    }
  }

  [coffeeItems, pastryItems, specialDrinksItems, savoryItems].forEach(
    (items) => {
      items.forEach((item) => {
        item.classList.remove("show-description");
        const link = item.querySelector(".product-title");
        if (link) {
          link.classList.remove("product-link-highlight");
          link.setAttribute("aria-expanded", "false");
        }
      });
    },
  );

  const targetItem = targetLink.closest(".list-group-item");
  if (!targetItem) {
    return;
  }

  const scrollToTargetWithOffset = () => {
    // Compensate for sticky nav so deep-linked cards are not hidden behind it.
    const stickyNav = document.getElementById("stickynav");
    const navHeight = stickyNav ? stickyNav.getBoundingClientRect().height : 0;
    const spacing = 12;

    if (stickyNav) {
      stickyNav.classList.remove("hidden");
    }

    const targetY =
      window.scrollY +
      targetItem.getBoundingClientRect().top -
      navHeight -
      spacing;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: "smooth",
    });
  };

  targetItem.setAttribute("data-auto-opened", "true");
  targetItem.classList.add("show-description");
  targetLink.classList.add("product-link-highlight");
  targetLink.setAttribute("aria-expanded", "true");
  targetLink.focus({ preventScroll: true });

  // Run scroll twice to handle both tab activation and late image/layout shifts.
  window.requestAnimationFrame(() => {
    window.setTimeout(scrollToTargetWithOffset, 120);
  });

  if (document.readyState === "complete") {
    window.setTimeout(scrollToTargetWithOffset, 320);
  } else {
    window.addEventListener(
      "load",
      () => {
        window.setTimeout(scrollToTargetWithOffset, 120);
      },
      { once: true },
    );
  }

  window.setTimeout(() => {
    targetLink.classList.remove("product-link-highlight");

    if (targetItem.getAttribute("data-auto-opened") === "true") {
      targetItem.classList.remove("show-description");
      targetLink.setAttribute("aria-expanded", "false");
      targetItem.removeAttribute("data-auto-opened");
    }
  }, 2200);

  const cleanUrl = `${window.location.pathname}${window.location.hash || ""}`;
  window.history.replaceState({}, "", cleanUrl);
}

function initCoffeeDescriptionToggle() {
  const coffeeItems = document.querySelectorAll(
    "#image-caption-coffee .list-group-item",
  );
  const pastryItems = document.querySelectorAll(
    "#image-caption-pastries .list-group-item",
  );
  const specialDrinksItems = document.querySelectorAll(
    "#image-caption-specialdrinks .list-group-item",
  );
  const savoryItems = document.querySelectorAll(
    "#image-caption-savory .list-group-item",
  );

  if (
    !coffeeItems.length &&
    !pastryItems.length &&
    !specialDrinksItems.length &&
    !savoryItems.length
  ) {
    return;
  }

  const allItems = [
    ...coffeeItems,
    ...pastryItems,
    ...specialDrinksItems,
    ...savoryItems,
  ];

  const clearAllItems = () => {
    // Keep only one expanded card at a time for cleaner keyboard/mouse UX.
    allItems.forEach((menuItem) => {
      menuItem.removeAttribute("data-auto-opened");
      menuItem.classList.remove("show-description");

      const link = menuItem.querySelector(".product-title");
      if (link) {
        link.classList.remove("product-link-highlight");
        link.setAttribute("aria-expanded", "false");
      }
    });
  };

  const bindToggle = (item) => {
    const triggerLink = item.querySelector(".product-title");

    if (!triggerLink) {
      return;
    }

    triggerLink.setAttribute("tabindex", "0");
    triggerLink.setAttribute("role", "button");
    triggerLink.setAttribute("aria-expanded", "false");

    const toggleItem = () => {
      const willOpen = !item.classList.contains("show-description");

      clearAllItems();

      if (willOpen) {
        item.classList.add("show-description");
        triggerLink.setAttribute("aria-expanded", "true");
      }
    };

    triggerLink.addEventListener("click", toggleItem);
    triggerLink.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleItem();
      }
    });
  };

  coffeeItems.forEach(bindToggle);
  pastryItems.forEach(bindToggle);
  specialDrinksItems.forEach(bindToggle);
  savoryItems.forEach(bindToggle);
}

setActiveNavbarLink();
initMenuTabs();
initMenuProductFromUrl();
initCoffeeDescriptionToggle();
