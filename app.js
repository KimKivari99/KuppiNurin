// Track previous scroll position to detect scroll direction.
let lastScrollTop = 0;
// Shared reference to the sticky top navigation element.
const navbar = document.getElementById("stickynav");

// Hide navbar on scroll down
window.addEventListener("scroll", () => {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    // Scrolling DOWN
    navbar.classList.add("hidden");
  } else {
    // Scrolling UP
    navbar.classList.remove("hidden");
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// Show navbar on mouseover
navbar.addEventListener("mouseover", () => {
  navbar.classList.remove("hidden");
});

// Prevent placeholder links from jumping the page to top.
document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
  });
});

function setActiveNavbarLink() {
  // Mark current page link as active, including cases where current page link uses href="#".
  const current = window.location.pathname.split("/").pop() || "index.html";
  const pageAliases = {
    etusivu: "index.html",
    menu: "menu.html",
  };

  document.querySelectorAll(".nav-item .nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    const label = (link.textContent || "").trim().toLowerCase();

    let linkFile = "";
    if (href && !href.startsWith("#")) {
      linkFile = href.split("/").pop() || "index.html";
    } else {
      // Support nav items that use href="#" on their own page.
      linkFile = pageAliases[label] || "";
    }

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

// Resolve a product name from URL to a matching menu card title and its tab.
function findMenuProductTarget(product) {
  // Find the target product title element and the tab that contains it.
  if (!product) {
    return null;
  }

  // Convert labels into a comparison-safe key so different text forms still match.
  // Example: "Chai Latte", "chai-latte", and "CHAI  LATTE" all become "chailatte".
  const normalizeProductLabel = (value) =>
    (value || "")
      // Make matching case-insensitive.
      .toLowerCase()
      // Split accented characters into base + combining mark (for reliable accent stripping).
      .normalize("NFD")
      // Remove all combining diacritic marks.
      .replace(/[\u0300-\u036f]/g, "")
      // Keep only letters and numbers so spaces/punctuation do not affect matching.
      .replace(/[^a-z0-9]/g, "");

  // Normalize the incoming URL product value once and reuse it for all comparisons.
  const normalizedProduct = normalizeProductLabel(product);

  // Search one product section and return both the found title element and its tab id.
  const getMatch = (selector, tabButtonId) => {
    // Collect all product-title nodes in the current section.
    const links = document.querySelectorAll(selector);
    // Find first title whose normalized text equals the normalized URL product value.
    const match = Array.from(links).find((link) => {
      const label = (link.textContent || "").trim();
      return normalizeProductLabel(label) === normalizedProduct;
    });

    // Return null when this section does not contain a matching product.
    if (!match) {
      return null;
    }

    // Return the matched title node and the tab button id used to activate the right tab.
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
    )
  );
}

// Wire tab keyboard navigation and optionally open tab from ?product query.
function initMenuTabs() {
  // Initialize keyboard-accessible Bootstrap tabs and open tab from URL product query.
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

// Open, highlight, and scroll to the product card defined in ?product=... .
function initMenuProductFromUrl() {
  // Deep-link behavior: highlight and scroll to product card from ?product=... query.
  const coffeeItems = document.querySelectorAll(
    "#image-caption-coffee .list-group-item",
  );

  const pastryItems = document.querySelectorAll(
    "#image-caption-pastries .list-group-item",
  );

  const specialDrinksItems = document.querySelectorAll(
    "#image-caption-specialdrinks .list-group-item",
  );

  if (
    !coffeeItems.length &&
    !pastryItems.length &&
    !specialDrinksItems.length
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

  coffeeItems.forEach((item) => {
    // Reset any previously open/highlighted cards before applying URL target state.
    item.classList.remove("show-description");
    const link = item.querySelector(".product-title");
    if (link) {
      link.classList.remove("product-link-highlight");
      link.setAttribute("aria-expanded", "false");
    }
  });

  pastryItems.forEach((item) => {
    // Reset any previously open/highlighted cards before applying URL target state.
    item.classList.remove("show-description");
    const link = item.querySelector(".product-title");
    if (link) {
      link.classList.remove("product-link-highlight");
      link.setAttribute("aria-expanded", "false");
    }
  });

  const targetItem = targetLink.closest(".list-group-item");
  if (!targetItem) {
    return;
  }

  const scrollToTargetWithOffset = () => {
    // Offset scroll by sticky navbar height so target is fully visible on all breakpoints.
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

  // First pass: after tab activation/paint.
  window.requestAnimationFrame(() => {
    window.setTimeout(scrollToTargetWithOffset, 120);
  });

  // Second pass: after images/layout settle in responsive mode.
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

  // Keep the landing highlight brief so it behaves like a guided focus cue.
  window.setTimeout(() => {
    targetLink.classList.remove("product-link-highlight");

    if (targetItem.getAttribute("data-auto-opened") === "true") {
      targetItem.classList.remove("show-description");
      targetLink.setAttribute("aria-expanded", "false");
      targetItem.removeAttribute("data-auto-opened");
    }
  }, 2200);

  // Remove query after using it once so refresh doesn't re-apply fixed state.
  const cleanUrl = `${window.location.pathname}${window.location.hash || ""}`;
  window.history.replaceState({}, "", cleanUrl);
}

// Toggle menu card description overlays with mouse and keyboard interactions.
function initCoffeeDescriptionToggle() {
  // Toggle product description overlays by click or keyboard on product titles.
  const coffeeItems = document.querySelectorAll(
    "#image-caption-coffee .list-group-item",
  );
  const pastryItems = document.querySelectorAll(
    "#image-caption-pastries .list-group-item",
  );
  const specialDrinksItems = document.querySelectorAll(
    "#image-caption-specialdrinks .list-group-item",
  );

  if (
    !coffeeItems.length &&
    !pastryItems.length &&
    !specialDrinksItems.length
  ) {
    return;
  }

  const allItems = [...coffeeItems, ...pastryItems, ...specialDrinksItems];

  const clearAllItems = () => {
    // Keep only one expanded product card at a time.
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
}

// Initialize page behaviors for nav state, tabs, deep links, and card toggles.
setActiveNavbarLink();
initMenuTabs();
initMenuProductFromUrl();
initCoffeeDescriptionToggle();
