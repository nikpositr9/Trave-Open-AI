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
let toastTimer;
let activeLightboxTrigger;

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

function openTourLightbox(card) {
  if (!tourLightbox || !tourLightboxImage) return;
  const image = card.querySelector("img");
  const title = card.querySelector("h3")?.textContent || "";
  const text = card.querySelector("p")?.textContent || "";

  activeLightboxTrigger = card;
  tourLightboxImage.src = card.href;
  tourLightboxImage.alt = image?.alt || title;
  if (tourLightboxTitle) tourLightboxTitle.textContent = title;
  if (tourLightboxText) tourLightboxText.textContent = text;
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

document.querySelectorAll("[data-tour-lightbox]").forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();
    openTourLightbox(card);
  });
});

tourLightboxClose?.addEventListener("click", closeTourLightbox);

tourLightbox?.addEventListener("click", (event) => {
  if (event.target === tourLightbox) closeTourLightbox();
});

document.addEventListener("keydown", (event) => {
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
  const step = firstCard ? firstCard.getBoundingClientRect().width + 20 : 420;
  videoTrack.scrollBy({ left: direction * step, behavior: "smooth" });
}

videoPrevious?.addEventListener("click", () => scrollVideos(-1));
videoNext?.addEventListener("click", () => scrollVideos(1));

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
