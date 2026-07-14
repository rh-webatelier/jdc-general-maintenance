/* ============================================================
   JDC GENERAL MAINTENANCE — script.js
   Handles: mobile nav, sticky header, scroll reveal,
            animated counters, and form validation.
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. MOBILE NAV TOGGLE ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the drawer after tapping a link
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 2. STICKY HEADER SHADOW ---------- */
  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 3. SCROLL REVEAL (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    // Show everything immediately if animations are off / unsupported
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- 4. ANIMATED COUNTERS (trust bar) ---------- */
  var counters = document.querySelectorAll(".trustbar__num[data-count]");
  if (counters.length && !prefersReduced && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { countObserver.observe(c); });
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = /\+/.test(el.textContent) ? "+" : "";
    var duration = 1200;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- 5. CURRENT YEAR IN FOOTER ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 5b. PORTFOLIO LIGHTBOX ---------- */
  var gallery = document.getElementById("gallery");
  var lb = document.getElementById("lightbox");
  if (gallery && lb) {
    var lbImg = document.getElementById("lightbox-img");
    var lbCap = document.getElementById("lightbox-caption");
    var items = Array.prototype.slice.call(gallery.querySelectorAll(".gallery__item img"));
    var current = 0;

    function openLb(i) {
      current = (i + items.length) % items.length;
      var img = items[current];
      lbImg.src = img.src;
      lbImg.alt = img.alt || "";
      var cap = img.closest(".gallery__item").querySelector("figcaption");
      lbCap.textContent = cap ? cap.textContent : "";
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function closeLb() {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    items.forEach(function (img, i) {
      img.addEventListener("click", function () { openLb(i); });
    });
    document.getElementById("lightbox-close").addEventListener("click", closeLb);
    document.getElementById("lightbox-next").addEventListener("click", function () { openLb(current + 1); });
    document.getElementById("lightbox-prev").addEventListener("click", function () { openLb(current - 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowRight") openLb(current + 1);
      else if (e.key === "ArrowLeft") openLb(current - 1);
    });
  }

  /* ---------- 6. QUOTE FORM ----------
     Validates client-side, then hands off via a pre-filled mailto: link
     to John's real inbox — no backend/account needed. Swap for a proper
     form service (Formspree, Netlify Forms) later if you want submissions
     to land without opening the visitor's own mail app — see README. */
  var form = document.getElementById("quote-form");
  var note = document.getElementById("form-note");
  var QUOTE_EMAIL = "jdcgeneralmaintenance@gmail.com";

  if (form) {
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var phoneRe = /^[+()\d][\d\s()-]{6,}$/;

    form.addEventListener("submit", function (e) {
      var ok = true;

      // name — required
      ok = validate("name", function (v) { return v.trim().length >= 2; },
        "Please enter your name.") && ok;

      // phone — required, loose format
      ok = validate("phone", function (v) { return phoneRe.test(v.trim()); },
        "Please enter a valid phone number.") && ok;

      // email — optional, but must be valid if filled
      ok = validate("email", function (v) { return v.trim() === "" || emailRe.test(v.trim()); },
        "Please enter a valid email address.") && ok;

      // message — required
      ok = validate("message", function (v) { return v.trim().length >= 5; },
        "Please tell us a little about the job.") && ok;

      if (!ok) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      var name = document.getElementById("name").value.trim();
      var phone = document.getElementById("phone").value.trim();
      var email = document.getElementById("email").value.trim();
      var service = document.getElementById("service").value;
      var message = document.getElementById("message").value.trim();

      var subject = "Quote request" + (service ? ": " + service : "") + " — " + name;
      var bodyLines = [
        "Name: " + name,
        "Phone: " + phone,
        email ? "Email: " + email : null,
        service ? "Service: " + service : null,
        "",
        "Job details:",
        message
      ].filter(function (line) { return line !== null; });

      var mailtoUrl = "mailto:" + QUOTE_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));

      window.location.href = mailtoUrl;

      if (note) {
        note.textContent = "Opening your email app to send this to John — just hit send once it opens.";
        note.classList.add("is-success");
      }
      form.reset();
    });

    // Clear a field's error state as the user corrects it
    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        var field = el.closest(".field");
        if (field) field.classList.remove("field--invalid");
        var err = form.querySelector('.field__error[data-for="' + el.id + '"]');
        if (err) err.textContent = "";
      });
    });
  }

  function validate(id, test, message) {
    var el = document.getElementById(id);
    if (!el) return true;
    var field = el.closest(".field");
    var err = document.querySelector('.field__error[data-for="' + id + '"]');
    var valid = test(el.value);

    if (field) field.classList.toggle("field--invalid", !valid);
    if (err) err.textContent = valid ? "" : message;
    return valid;
  }

})();
