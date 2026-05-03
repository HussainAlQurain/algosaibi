const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navMenu.classList.toggle("is-open");
  });

  navMenu.querySelectorAll("a:not(.nav-dropdown-toggle)").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
    });
  });
}

// Mobile companies dropdown toggle
document.querySelectorAll(".nav-dropdown-toggle").forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    if (window.innerWidth <= 900) {
      e.preventDefault();
      toggle.closest(".nav-dropdown").classList.toggle("is-open");
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});

document.querySelectorAll('a[href="#top"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Sector accordion — infinite scroll + hover expand + mouse & touch drag
const sectorContainer = document.getElementById("sectorsContainer");
if (sectorContainer && window.innerWidth > 900) {
  // 1. Build inner track (moves inside the overflow-hidden container)
  const track = document.createElement("div");
  track.className = "sector-track";
  const visibleItems = Array.from(
    sectorContainer.querySelectorAll(".sector-item:not(.sector-item--hidden)")
  );
  visibleItems.forEach((item) => track.appendChild(item));
  sectorContainer.appendChild(track);

  // 2. Measure the base width of one full set (must come before cloning)
  //    Read from DOM so it stays in sync with any CSS value change.
  const ITEM_BASE_W = visibleItems[0] ? visibleItems[0].getBoundingClientRect().width : 200;
  const setWidth = visibleItems.length * ITEM_BASE_W;

  // 3. Clone enough sets so the track always fills beyond the viewport —
  //    prevents any white-space gap before the scroll position wraps.
  const setsNeeded = Math.ceil(window.innerWidth / setWidth) + 1;
  for (let s = 0; s < setsNeeded; s++) {
    visibleItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  }

  let scrollPos = 0;
  let isPaused = false;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let dragDelta = 0;
  const SPEED = 0.5; // px per frame

  function applyTranslate() {
    track.style.transform = `translateX(${-scrollPos}px)`;
  }

  function wrapScroll() {
    if (scrollPos >= setWidth) scrollPos -= setWidth;
    if (scrollPos < 0) scrollPos += setWidth;
  }

  // 4. Auto-scroll loop
  (function step() {
    if (!isPaused && !isDragging) {
      scrollPos += SPEED;
      wrapScroll();
      applyTranslate();
    }
    requestAnimationFrame(step);
  })();

  // 5. Hover: pause + dim others
  sectorContainer.addEventListener("mouseover", (e) => {
    if (e.target.closest(".sector-item")) {
      isPaused = true;
      sectorContainer.classList.add("hovering");
    }
  });
  sectorContainer.addEventListener("mouseout", (e) => {
    if (!sectorContainer.contains(e.relatedTarget)) {
      isPaused = false;
      sectorContainer.classList.remove("hovering");
    }
  });

  // 6. Mouse drag — left/right navigation
  sectorContainer.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartScroll = scrollPos;
    dragDelta = 0;
    sectorContainer.style.cursor = "grabbing";
    e.preventDefault();
  });
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    dragDelta = dragStartX - e.clientX;
    scrollPos = dragStartScroll + dragDelta;
    wrapScroll();
    applyTranslate();
  });
  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    isPaused = false;
    sectorContainer.style.cursor = "";
  });

  // Prevent click navigation if the user actually dragged
  sectorContainer.addEventListener("click", (e) => {
    if (Math.abs(dragDelta) > 6) {
      e.preventDefault();
      dragDelta = 0;
    }
  });

  // 7. Touch drag
  let touchStartX = 0;
  let touchStartScroll = 0;
  sectorContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartScroll = scrollPos;
    isPaused = true;
  }, { passive: true });
  sectorContainer.addEventListener("touchmove", (e) => {
    const delta = touchStartX - e.touches[0].clientX;
    scrollPos = touchStartScroll + delta;
    wrapScroll();
    applyTranslate();
  }, { passive: true });
  sectorContainer.addEventListener("touchend", () => {
    isPaused = false;
  });

} else if (sectorContainer) {
  // Mobile: no scroll, just stack vertically — create track for CSS
  const track = document.createElement("div");
  track.className = "sector-track";
  const items = Array.from(sectorContainer.querySelectorAll(".sector-item:not(.sector-item--hidden)"));
  items.forEach((item) => track.appendChild(item));
  sectorContainer.appendChild(track);
}

// Counter animation — triggers when .counter-num becomes visible
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || "";
  if (isNaN(target)) return;
  const duration = 1600;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".counter-num[data-target]").forEach((el) => {
  counterObserver.observe(el);
});

/* ── News track drag/scroll + progress bar ─────────────────── */
(function () {
  const track = document.getElementById("newsTrack");
  const bar = document.getElementById("newsTrackBar");
  if (!track) return;

  function updateBar() {
    if (!bar) return;
    const max = track.scrollWidth - track.clientWidth;
    const pct = max > 0 ? (track.scrollLeft / max) * 100 : 0;
    bar.style.width = Math.max(10, pct) + "%";
  }

  track.addEventListener("scroll", updateBar, { passive: true });
  updateBar();

  // drag-to-scroll
  let isDragging = false, startX = 0, startScrollLeft = 0;

  track.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    startScrollLeft = track.scrollLeft;
    track.style.cursor = "grabbing";
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = startScrollLeft - (x - startX);
  });
  document.addEventListener("mouseup", () => {
    isDragging = false;
    if (track) track.style.cursor = "grab";
  });
})();
