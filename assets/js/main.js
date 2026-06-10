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

// Counter animation — .counter-num and .stat-num with data-target
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const start = parseInt(el.dataset.start, 10);
  const suffix = el.dataset.suffix || "";
  if (isNaN(target)) return;
  const from = isNaN(start) ? 0 : start;
  const duration = parseInt(el.dataset.duration, 10) || 1100;
  const t0 = performance.now();
  function step(now) {
    const progress = Math.min((now - t0) / duration, 1);
    const eased = progress === 1 ? 1 : progress === 0 ? 0 : Math.pow(2, 10 * progress - 10);
    const current = Math.round(from + eased * (target - from));
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

document.querySelectorAll(".counter-num[data-target], .stat-num[data-target]").forEach((el) => {
  counterObserver.observe(el);
});

// Page hero: staggered text + ken burns (about and similar)
document.querySelectorAll(".page-hero--animate").forEach((hero) => {
  const start = () => hero.classList.add("is-loaded");
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(start));
  } else {
    requestAnimationFrame(start);
  }
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

/* ── Newspaper archive flipbook ────────────────────────────── */
document.querySelectorAll("[data-flipbook]").forEach((root) => {
  const dataEl = root.querySelector("[data-flipbook-data]");
  if (!dataEl) return;
  let pages = [];
  try {
    pages = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }
  if (!pages.length) return;

  const isRtl = root.getAttribute("dir") === "rtl";
  const book = root.querySelector("[data-flip-book]");
  const staticImg = root.querySelector("[data-flip-static]");
  const leaf = root.querySelector("[data-flip-leaf]");
  const front = root.querySelector("[data-flip-front]");
  const back = root.querySelector("[data-flip-back]");
  const prevBtn = root.querySelector("[data-flip-prev]");
  const nextBtn = root.querySelector("[data-flip-next]");
  const dateEl = root.querySelector("[data-flip-date]");
  const counterEl = root.querySelector("[data-flip-counter]");
  const range = root.querySelector("[data-flip-range]");
  const expand = root.querySelector("[data-flip-expand]");

  const total = pages.length;
  const FWD = isRtl ? 180 : -180;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let animating = false;

  range.min = 0;
  range.max = total - 1;
  range.value = 0;

  const preload = (i) => {
    if (i >= 0 && i < total) {
      const im = new Image();
      im.src = pages[i].img;
    }
  };

  const render = () => {
    staticImg.src = pages[index].img;
    staticImg.alt = pages[index].date;
    dateEl.textContent = pages[index].date;
    counterEl.textContent = index + 1 + " / " + total;
    range.value = index;
    expand.href = pages[index].img;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;
    preload(index + 1);
    preload(index - 1);
  };

  const go = (target) => {
    if (animating || target < 0 || target >= total || target === index) return;
    const forward = target > index;

    if (reduceMotion) {
      index = target;
      render();
      return;
    }

    animating = true;
    root.classList.add("flipbook--turning");

    if (forward) {
      // Leaf shows the current page turning away; static reveals the next page beneath.
      front.src = pages[index].img;
      back.src = pages[index].img;
      staticImg.src = pages[target].img;
      leaf.style.transition = "none";
      leaf.style.transform = "rotateY(0deg)";
      void leaf.offsetWidth;
      leaf.style.transition = "";
      leaf.style.transform = "rotateY(" + FWD + "deg)";
    } else {
      front.src = pages[target].img;
      back.src = pages[index].img;
      staticImg.src = pages[index].img;
      leaf.style.transition = "none";
      leaf.style.transform = "rotateY(" + FWD + "deg)";
      void leaf.offsetWidth;
      leaf.style.transition = "";
      leaf.style.transform = "rotateY(0deg)";
    }

    let settled = false;
    const done = (e) => {
      if (e && e.propertyName && e.propertyName !== "transform") return;
      if (settled) return;
      settled = true;
      leaf.removeEventListener("transitionend", done);
      index = target;
      root.classList.remove("flipbook--turning");
      leaf.style.transition = "none";
      leaf.style.transform = "rotateY(0deg)";
      animating = false;
      render();
    };
    leaf.addEventListener("transitionend", done);
    setTimeout(done, 1100);
  };

  prevBtn.addEventListener("click", () => go(index - 1));
  nextBtn.addEventListener("click", () => go(index + 1));
  range.addEventListener("change", () => go(parseInt(range.value, 10)));

  root.tabIndex = 0;
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      isRtl ? go(index - 1) : go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      isRtl ? go(index + 1) : go(index - 1);
    }
  });

  let sx = 0, sy = 0, touching = false;
  book.addEventListener("touchstart", (e) => {
    if (animating) return;
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
    touching = true;
  }, { passive: true });
  book.addEventListener("touchend", (e) => {
    if (!touching) return;
    touching = false;
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      const swipedLeft = dx < 0;
      if (isRtl) swipedLeft ? go(index - 1) : go(index + 1);
      else swipedLeft ? go(index + 1) : go(index - 1);
    }
  }, { passive: true });

  book.addEventListener("click", () => {
    if (!animating) window.open(pages[index].img, "_blank", "noopener");
  });

  render();
});

/* ── Newspaper archive — two-page open book (alt design) ───── */
document.querySelectorAll("[data-bookview]").forEach((root) => {
  const dataEl = root.querySelector("[data-bookview-data]");
  if (!dataEl) return;
  let pages = [];
  try {
    pages = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }
  if (!pages.length) return;

  const isRtl = root.getAttribute("dir") === "rtl";
  const leftImg = root.querySelector("[data-book-left]");
  const rightImg = root.querySelector("[data-book-right]");
  const leaf = root.querySelector("[data-book-leaf]");
  const front = root.querySelector("[data-book-front]");
  const back = root.querySelector("[data-book-back]");
  const prevBtn = root.querySelector("[data-book-prev]");
  const nextBtn = root.querySelector("[data-book-next]");
  const dateEl = root.querySelector("[data-book-date]");
  const counterEl = root.querySelector("[data-book-counter]");
  const expand = root.querySelector("[data-book-expand]");

  const total = pages.length;
  const TURN = isRtl ? 180 : -180;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0; // index of the left (leading) page in the spread
  let animating = false;

  const blank =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='14'%3E%3Crect width='10' height='14' fill='%23fdfaf3'/%3E%3C/svg%3E";

  const imgAt = (i) => (i >= 0 && i < total ? pages[i].img : blank);

  const preload = (i) => {
    if (i >= 0 && i < total) {
      const im = new Image();
      im.src = pages[i].img;
    }
  };

  const render = () => {
    leftImg.src = imgAt(index);
    leftImg.alt = pages[index] ? pages[index].date : "";
    rightImg.src = imgAt(index + 1);
    rightImg.alt = pages[index + 1] ? pages[index + 1].date : "";

    const shown = index + 1 < total ? index + 2 : index + 1;
    const lead = pages[index] ? pages[index].date : "";
    dateEl.textContent = lead;
    counterEl.textContent = shown + " / " + total;
    expand.href = imgAt(index);

    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= total - 1;
    preload(index + 2);
    preload(index - 1);
  };

  const go = (target) => {
    if (animating || target < 0 || target >= total || target === index) return;
    const forward = target > index;

    if (reduceMotion) {
      index = target;
      render();
      return;
    }

    animating = true;
    root.classList.add("bookview--turning");

    if (forward) {
      // The right page swings over the spine to become the new left page.
      front.src = imgAt(index + 1);
      back.src = imgAt(index + 1);
      rightImg.src = imgAt(index + 2); // reveal the new right beneath the lifting leaf
      leaf.style.transition = "none";
      leaf.style.transform = "rotateY(0deg)";
      void leaf.offsetWidth;
      leaf.style.transition = "";
      leaf.style.transform = "rotateY(" + TURN + "deg)";
    } else {
      // The left page swings back to the right to reveal the previous spread.
      front.src = imgAt(index);
      back.src = imgAt(index);
      leftImg.src = imgAt(target); // reveal the new left beneath the leaf
      leaf.style.transition = "none";
      leaf.style.transform = "rotateY(" + TURN + "deg)";
      void leaf.offsetWidth;
      leaf.style.transition = "";
      leaf.style.transform = "rotateY(0deg)";
    }

    let settled = false;
    const done = (e) => {
      if (e && e.propertyName && e.propertyName !== "transform") return;
      if (settled) return;
      settled = true;
      leaf.removeEventListener("transitionend", done);
      index = target;
      root.classList.remove("bookview--turning");
      leaf.style.transition = "none";
      leaf.style.transform = "rotateY(0deg)";
      animating = false;
      render();
    };
    leaf.addEventListener("transitionend", done);
    setTimeout(done, 1200);
  };

  prevBtn.addEventListener("click", () => go(index - 1));
  nextBtn.addEventListener("click", () => go(index + 1));

  root.tabIndex = 0;
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      isRtl ? go(index - 1) : go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      isRtl ? go(index + 1) : go(index - 1);
    }
  });

  let sx = 0, sy = 0, touching = false;
  const bookEl = root.querySelector("[data-book-book]");
  bookEl.addEventListener("touchstart", (e) => {
    if (animating) return;
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
    touching = true;
  }, { passive: true });
  bookEl.addEventListener("touchend", (e) => {
    if (!touching) return;
    touching = false;
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      const swipedLeft = dx < 0;
      if (isRtl) swipedLeft ? go(index - 1) : go(index + 1);
      else swipedLeft ? go(index + 1) : go(index - 1);
    }
  }, { passive: true });

  render();
});

/* ── Media gallery lightbox ────────────────────────────────── */
(function () {
  const lightbox = document.getElementById("galleryLightbox");
  if (!lightbox) return;

  const img = lightbox.querySelector(".gallery-lightbox__img");
  const caption = lightbox.querySelector(".gallery-lightbox__caption");
  const counter = lightbox.querySelector("[data-gallery-counter]");
  const prevBtn = lightbox.querySelector("[data-gallery-prev]");
  const nextBtn = lightbox.querySelector("[data-gallery-next]");
  const isRtl = document.documentElement.getAttribute("dir") === "rtl";

  let slides = [];
  let index = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  const getStep = (dir) => (isRtl ? -dir : dir);

  const renderSlide = () => {
    const slide = slides[index];
    if (!slide) return;
    img.src = slide.src;
    img.alt = slide.alt;
    caption.textContent = slide.alt;
    counter.textContent = index + 1 + " / " + slides.length;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;
  };

  const open = (group, startIndex) => {
    slides = Array.from(group.querySelectorAll("[data-gallery-trigger]")).map((btn) => ({
      src: btn.dataset.full,
      alt: btn.dataset.alt || "",
    }));
    index = startIndex;
    renderSlide();
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".gallery-lightbox__close").focus();
  };

  const close = () => {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    img.removeAttribute("src");
  };

  const step = (dir) => {
    const next = index + getStep(dir);
    if (next < 0 || next >= slides.length) return;
    index = next;
    renderSlide();
  };

  document.querySelectorAll("[data-gallery-group]").forEach((group) => {
    group.querySelectorAll("[data-gallery-trigger]").forEach((btn, i) => {
      btn.addEventListener("click", () => open(group, i));
    });
  });

  lightbox.querySelectorAll("[data-gallery-close]").forEach((el) => {
    el.addEventListener("click", close);
  });
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  const dialog = lightbox.querySelector(".gallery-lightbox__dialog");
  dialog.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  dialog.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    step(dx < 0 ? 1 : -1);
  }, { passive: true });
})();
