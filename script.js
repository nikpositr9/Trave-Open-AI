const body = document.body;
const menuButton = document.querySelector("[data-menu-open]");
const closeButton = document.querySelector("[data-menu-close]");
const navPanel = document.querySelector(".nav-panel");
const toast = document.querySelector(".toast");
let toastTimer;

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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
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
