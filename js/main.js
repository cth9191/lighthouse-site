// Lighthouse - shared page behavior (V1 Halftone)
// Jobs: mobile nav, booking form validation, FAQ accordion, scroll reveal,
// and the halftone dome canvas on the landing page.

// ---- Mobile nav ----
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// ---- Booking form ----
const bookingForm = document.querySelector("#booking-form");

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let valid = true;

    bookingForm.querySelectorAll(".field[data-required]").forEach((field) => {
      const input = field.querySelector("input, select");
      const value = input.value.trim();
      let fieldOk = value !== "";

      if (fieldOk && input.type === "email") {
        fieldOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      field.classList.toggle("invalid", !fieldOk);
      if (!fieldOk) valid = false;
    });

    if (valid) {
      bookingForm.closest(".booking-form").classList.add("submitted");
    }
  });

  bookingForm.querySelectorAll(".field input, .field select").forEach((input) => {
    input.addEventListener("input", () => {
      input.closest(".field").classList.remove("invalid");
    });
  });
}

// ---- FAQ accordion ----
document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

// ---- Scroll reveal ----
const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length > 0 && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("revealed"));
}

// ---- Halftone dome (landing page hero) ----
// A dot grid whose brightness follows concentric arcs, like a beacon sweep.
const dome = document.getElementById("dome");

if (dome) {
  const ctx = dome.getContext("2d");
  const W = dome.width, H = dome.height;
  const cx = W / 2, cy = H + 40;   // arc center sits below the canvas
  const maxR = H + 20;
  const gap = 9;                    // dot spacing

  const draw = (t) => {
    ctx.clearRect(0, 0, W, H);
    for (let x = gap / 2; x < W; x += gap) {
      for (let y = gap / 2; y < H; y += gap) {
        const dx = x - cx, dy = y - cy;
        const r = Math.sqrt(dx * dx + dy * dy);
        if (r > maxR) continue;
        const ring = Math.sin(r / 26 - t / 900);
        const fade = 1 - r / maxR;
        const b = Math.max(0, ring * 0.5 + 0.5) * Math.sqrt(fade);
        if (b < 0.08) continue;
        ctx.fillStyle = "rgba(242,242,239," + Math.min(1, b * 1.35).toFixed(3) + ")";
        const size = 1 + b * 2.8;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    draw(0);
  } else {
    const loop = (t) => { draw(t); requestAnimationFrame(loop); };
    loop(0);
  }
}
