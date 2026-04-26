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

// Sector accordion hover effect
const sectorContainer = document.getElementById("sectorsContainer");
if (sectorContainer) {
  sectorContainer.addEventListener("mouseover", (e) => {
    if (e.target.closest(".sector-item")) {
      sectorContainer.classList.add("hovering");
    }
  });
  sectorContainer.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget || !e.relatedTarget.closest(".sector-item")) {
      sectorContainer.classList.remove("hovering");
    }
  });
}
