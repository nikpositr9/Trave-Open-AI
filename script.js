const body = document.body;
const menuButton = document.querySelector("[data-menu-open]");
const closeButton = document.querySelector("[data-menu-close]");
const navPanel = document.querySelector(".nav-panel");
const toast = document.querySelector(".toast");
const tourLightbox = document.querySelector("[data-tour-lightbox-modal]");
const tourLightboxImage = document.querySelector("[data-tour-lightbox-image]");
const tourLightboxTitle = document.querySelector("[data-tour-lightbox-title]");
const tourLightboxText = document.querySelector("[data-tour-lightbox-text]");
const tourLightboxClose = document.querySelector("[data-tour-lightbox-close]");
const tourLightboxPrevious = document.querySelector(
  "[data-tour-lightbox-prev]",
);
const tourLightboxNext = document.querySelector("[data-tour-lightbox-next]");
const tourLightboxCounter = document.querySelector(
  "[data-tour-lightbox-counter]",
);
const tourSlider = document.querySelector("[data-tour-slider]");
const tourSliderTrack = document.querySelector("[data-tour-slider-track]");
const tourSliderPrevious = document.querySelector("[data-tour-slider-prev]");
const tourSliderNext = document.querySelector("[data-tour-slider-next]");
const tourSliderCurrent = document.querySelector("[data-tour-slider-current]");
const tourSliderThumbnails = document.querySelectorAll(
  "[data-tour-slider-thumb]",
);
const tourLightboxCards = [
  ...document.querySelectorAll("[data-tour-lightbox]"),
];
const contactMethodInputs = document.querySelectorAll(
  'input[name="contact_method"]',
);
const contactInput = document.querySelector("[data-contact-input]");
const contactLabel = document.querySelector("[data-contact-label]");
const tourDateInput = document.querySelector("[data-tour-date]");
let toastTimer;
let activeLightboxTrigger;
let tourSlideIndex = 0;
let tourLightboxIndex = 0;
let tourSliderTouchStart = null;

function setMenu(open) {
  body.classList.toggle("nav-open", open);
  menuButton?.setAttribute("aria-expanded", String(open));
  if (navPanel) navPanel.inert = !open;
}

function notify(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

menuButton?.addEventListener("click", () => setMenu(true));
closeButton?.addEventListener("click", () => setMenu(false));

navPanel?.addEventListener("click", (event) => {
  if (event.target === navPanel || event.target.closest(".nav-links a")) {
    setMenu(false);
  }
});

function renderTourLightbox(index) {
  if (!tourLightbox || !tourLightboxImage) return;
  if (!tourLightboxCards.length) return;

  tourLightboxIndex =
    (index + tourLightboxCards.length) % tourLightboxCards.length;
  const card = tourLightboxCards[tourLightboxIndex];
  const image = card.querySelector("img");
  const title = card.querySelector("h3")?.textContent || "";
  const text = card.querySelector("p")?.textContent || "";

  tourLightboxImage.src = card.href;
  tourLightboxImage.alt = image?.alt || title;
  if (tourLightboxTitle) tourLightboxTitle.textContent = title;
  if (tourLightboxText) tourLightboxText.textContent = text;
  if (tourLightboxCounter) {
    tourLightboxCounter.textContent = `${String(tourLightboxIndex + 1).padStart(
      2,
      "0",
    )} / ${String(tourLightboxCards.length).padStart(2, "0")}`;
  }

  showTourSlide(tourLightboxIndex);
}

function openTourLightbox(card) {
  if (!tourLightbox || !tourLightboxImage) return;
  const index = tourLightboxCards.indexOf(card);

  activeLightboxTrigger = card;
  renderTourLightbox(index < 0 ? 0 : index);
  tourLightbox.inert = false;
  tourLightbox.setAttribute("aria-hidden", "false");
  tourLightbox.classList.add("is-open");
  body.classList.add("lightbox-open");
  tourLightboxClose?.focus();
}

function closeTourLightbox() {
  if (!tourLightbox) return;
  tourLightbox.classList.remove("is-open");
  tourLightbox.setAttribute("aria-hidden", "true");
  tourLightbox.inert = true;
  body.classList.remove("lightbox-open");
  activeLightboxTrigger?.focus();
}

tourLightboxCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();
    openTourLightbox(card);
  });
});

function showTourSlide(index) {
  if (!tourSliderTrack) return;
  const slides = tourSliderTrack.querySelectorAll(".tour-photo-card");
  if (!slides.length) return;

  tourSlideIndex = (index + slides.length) % slides.length;
  tourSliderTrack.style.transform = `translateX(-${tourSlideIndex * 100}%)`;

  if (tourSliderCurrent) {
    tourSliderCurrent.textContent = String(tourSlideIndex + 1).padStart(2, "0");
  }

  tourSliderThumbnails.forEach((thumbnail, thumbnailIndex) => {
    const isActive = thumbnailIndex === tourSlideIndex;
    thumbnail.classList.toggle("is-active", isActive);
    if (isActive) {
      thumbnail.setAttribute("aria-current", "true");
    } else {
      thumbnail.removeAttribute("aria-current");
    }
  });
}

tourSliderPrevious?.addEventListener("click", () => {
  showTourSlide(tourSlideIndex - 1);
});

tourSliderNext?.addEventListener("click", () => {
  showTourSlide(tourSlideIndex + 1);
});

tourSliderThumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener("click", () => showTourSlide(index));
});

tourSlider?.addEventListener(
  "touchstart",
  (event) => {
    tourSliderTouchStart = event.touches[0]?.clientX ?? null;
  },
  { passive: true },
);

tourSlider?.addEventListener(
  "touchend",
  (event) => {
    if (tourSliderTouchStart === null) return;
    const touchEnd = event.changedTouches[0]?.clientX ?? tourSliderTouchStart;
    const distance = touchEnd - tourSliderTouchStart;

    if (Math.abs(distance) > 45) {
      showTourSlide(tourSlideIndex + (distance < 0 ? 1 : -1));
    }

    tourSliderTouchStart = null;
  },
  { passive: true },
);

tourLightboxClose?.addEventListener("click", closeTourLightbox);
tourLightboxPrevious?.addEventListener("click", () => {
  renderTourLightbox(tourLightboxIndex - 1);
});
tourLightboxNext?.addEventListener("click", () => {
  renderTourLightbox(tourLightboxIndex + 1);
});

tourLightbox?.addEventListener("click", (event) => {
  if (event.target === tourLightbox) closeTourLightbox();
});

const contactSettings = {
  whatsapp: {
    label: "Номер WhatsApp",
    placeholder: "+373 60 000 000",
    type: "tel",
    autocomplete: "tel",
    inputmode: "tel",
  },
  telegram: {
    label: "Telegram",
    placeholder: "@username или номер телефона",
    type: "text",
    autocomplete: "off",
    inputmode: "text",
  },
  email: {
    label: "Email",
    placeholder: "name@example.com",
    type: "email",
    autocomplete: "email",
    inputmode: "email",
  },
};

function updateContactField(method) {
  if (!contactInput || !contactLabel) return;
  const settings = contactSettings[method] || contactSettings.whatsapp;

  contactLabel.textContent = settings.label;
  contactInput.type = settings.type;
  contactInput.placeholder = settings.placeholder;
  contactInput.autocomplete = settings.autocomplete;
  contactInput.inputMode = settings.inputmode;
}

contactMethodInputs.forEach((input) => {
  input.addEventListener("change", () => updateContactField(input.value));
});

if (tourDateInput) {
  tourDateInput.min = new Date().toISOString().slice(0, 10);
}

document.addEventListener("keydown", (event) => {
  const lightboxIsOpen = tourLightbox?.classList.contains("is-open");

  if (lightboxIsOpen && event.key === "ArrowLeft") {
    event.preventDefault();
    renderTourLightbox(tourLightboxIndex - 1);
  }

  if (lightboxIsOpen && event.key === "ArrowRight") {
    event.preventDefault();
    renderTourLightbox(tourLightboxIndex + 1);
  }

  if (event.key === "Escape") {
    setMenu(false);
    closeTourLightbox();
  }
});

document.querySelectorAll("[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    notify("Демонстрационная форма. Отправку подключим следующим этапом.");
    form.reset();
    window.requestAnimationFrame(() => {
      const selectedMethod = form.querySelector(
        'input[name="contact_method"]:checked',
      );
      if (selectedMethod) updateContactField(selectedMethod.value);
    });
  });
});

document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    notify("Здесь будет ваша ссылка. Пришлите её — я добавлю.");
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll("[data-filter]")
      .forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    notify("Фильтрацию подключим после утверждения состава туров.");
  });
});

const videoTrack = document.querySelector("[data-video-track]");
const videoPrevious = document.querySelector("[data-video-prev]");
const videoNext = document.querySelector("[data-video-next]");

function scrollVideos(direction) {
  if (!videoTrack) return;
  const firstCard = videoTrack.querySelector(".video-slide");
  const step = firstCard ? firstCard.getBoundingClientRect().width + 16 : 320;
  videoTrack.scrollBy({ left: direction * step, behavior: "smooth" });
}

videoPrevious?.addEventListener("click", () => scrollVideos(-1));
videoNext?.addEventListener("click", () => scrollVideos(1));

const eventTrack = document.querySelector("[data-event-track]");
const eventPrevious = document.querySelector("[data-event-prev]");
const eventNext = document.querySelector("[data-event-next]");

function scrollEvents(direction) {
  if (!eventTrack) return;
  const firstCard = eventTrack.querySelector(".event-card");
  const step = firstCard ? firstCard.getBoundingClientRect().width + 18 : 320;
  eventTrack.scrollBy({ left: direction * step, behavior: "smooth" });
}

eventPrevious?.addEventListener("click", () => scrollEvents(-1));
eventNext?.addEventListener("click", () => scrollEvents(1));

const clock = document.querySelector("[data-chisinau-clock]");
const chisinauTime = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Chisinau",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function updateClock() {
  if (clock) clock.textContent = chisinauTime.format(new Date());
}

updateClock();
if (clock) window.setInterval(updateClock, 1000);
