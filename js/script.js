// ===============================
// NAV HIGHLIGHT ON SCROLL
// ===============================
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav a");
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) current = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
});

// ===============================
// BOOTSTRAP CAROUSEL HOVER PAUSE
// ===============================
const apsisCarousel = document.querySelector("#apsisCarousel");
if (apsisCarousel) {
  const carousel = bootstrap.Carousel.getInstance(apsisCarousel) || new bootstrap.Carousel(apsisCarousel);
  apsisCarousel.addEventListener("mouseenter", () => carousel.pause());
  apsisCarousel.addEventListener("mouseleave", () => carousel.cycle());
}

// ===============================
// SCROLL-BASED ANIMATIONS
// ===============================
window.addEventListener("scroll", () => {
  const screenHeight = window.innerHeight;

  // Animate service cards once
  document.querySelectorAll(".service-card:not(.animated)").forEach((card) => {
    if (card.getBoundingClientRect().top < screenHeight - 100) {
      card.classList.add("animate__animated", "animate__fadeInUp", "animated");
    }
  });

  // Fade-up elements once
  document.querySelectorAll(".fade-up:not(.shown)").forEach((el) => {
    if (el.getBoundingClientRect().top < screenHeight * 0.9) {
      el.classList.add("show", "shown");
    }
  });

  // About section fade-in once
  const aboutSection = document.querySelector(".about-section");
  if (aboutSection && !aboutSection.classList.contains("shown")) {
    if (aboutSection.getBoundingClientRect().top < screenHeight - 100) {
      aboutSection.classList.add("show", "shown");
    }
  }
});



// ===============================
// CONTACT FORM HANDLER
// ===============================

