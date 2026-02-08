import { showrooms } from "./data.js";
import { validateAll, validateField } from "./validation.js";

const backdrop = document.getElementById("bg");
const dialog = document.querySelector(".box");
const closeBtn = document.getElementById("xbtn");

const formView = document.getElementById("viewForm");
const thanksView = document.getElementById("viewThanks");


const onlineBtn = document.getElementById("onlineBtn");
const form = document.getElementById("myForm");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const citySelect = document.getElementById("city");
const consentCheckbox = document.getElementById("ok");

const icons = {
  name: document.getElementById("nameOk"),
  phone: document.getElementById("phoneOk"),
  email: document.getElementById("emailOk"),
  city: document.getElementById("cityOk"),
};
const cityChev = document.getElementById("cityChev");


let isOpen = true;



function fillShowrooms() {
  showrooms.forEach((place) => {
    const opt = document.createElement("option");
    opt.value = place;
    opt.textContent = place;
    citySelect.appendChild(opt);
  });
}

function hideDialog() {
  isOpen = false;
  backdrop.style.display = "none";
}

function rowFor(fieldKey) {
  const el =
    fieldKey === "city"
      ? citySelect
      : fieldKey === "name"
      ? nameInput
      : fieldKey === "phone"
      ? phoneInput
      : emailInput;

  return el.closest(".row");
}

function setRowUI(fieldKey, ok, message) {
  const row = rowFor(fieldKey);
  if (!row) return;

  row.classList.toggle("is-error", !ok);
  row.classList.toggle("is-ok", ok);

  const input = row.querySelector(".inp");
  if (input) input.setAttribute("aria-invalid", String(!ok));

  const errEl = document.getElementById(`e-${fieldKey}`);
  if (errEl) errEl.textContent = message || "";

  row.classList.toggle("has-value", (input?.value || "").trim().length > 0);

  if (icons[fieldKey]) icons[fieldKey].classList.toggle("show", ok);

  if (fieldKey === "city") {
    cityChev.style.display = ok ? "none" : "";
  }
}

// Focus first error ! 
function focusFirstError() {
  const firstErrorRow = dialog.querySelector(".row.is-error");
  if (!firstErrorRow) return;

  const input = firstErrorRow.querySelector("input, select, textarea");
  input?.focus();
}

function validateAndPaint(fieldKey, value) {
  const res = validateField(fieldKey, value);
  setRowUI(fieldKey, res.ok, res.message);
  return res.ok;
}

function getState() {
  return {
    name: nameInput.value,
    phone: phoneInput.value,
    email: emailInput.value,
    city: citySelect.value,
    ok: consentCheckbox.checked,
  };
}

function trapFocus(e) {
  if (!isOpen) return;
  if (e.key !== "Tab") return;

  const focusable = dialog.querySelectorAll(
    'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

function showThanks() {
  formView.classList.add("hide");
  thanksView.classList.remove("hide");
  thanksView.classList.add("fade-in");

  const h2 = thanksView.querySelector("h2");
  h2?.focus();
}

fillShowrooms();

["name", "phone", "email", "city"].forEach((key) => {
  const el =
    key === "city"
      ? citySelect
      : key === "name"
      ? nameInput
      : key === "phone"
      ? phoneInput
      : emailInput;

  const row = el.closest(".row");
  row?.classList.toggle("has-value", (el.value || "").trim().length > 0);
});

nameInput.focus();

closeBtn.addEventListener("click", hideDialog);

document.addEventListener("keydown", (e) => {
  if (!isOpen) return;
  if (e.key === "Escape") hideDialog();
  trapFocus(e);
});

nameInput.addEventListener("input", () =>
  validateAndPaint("name", nameInput.value)
);

phoneInput.addEventListener("input", () =>
  validateAndPaint("phone", phoneInput.value)
);

emailInput.addEventListener("input", () =>
  validateAndPaint("email", emailInput.value)
);

citySelect.addEventListener("change", () =>
  validateAndPaint("city", citySelect.value)
);

[nameInput, phoneInput, emailInput].forEach((el) => {
  el.addEventListener("blur", () => validateAndPaint(el.id, el.value));
});

citySelect.addEventListener("blur", () =>
  validateAndPaint("city", citySelect.value)
);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const state = getState();
  const ok = validateAll(state);

  const required = ["name", "phone", "city", "email"];
  required.forEach((key) => validateAndPaint(key, state[key]));



  // Focus first error ! 
  if (!ok) {
    focusFirstError();
    return;
  }

  
  console.log("Data:", {
    name: state.name,
    phone: state.phone,
    email: state.email,
    city: state.city,
    consent: state.ok,
  });

  showThanks();
});

onlineBtn.addEventListener("click", () => {
  console.log("מינוי חודשי אונליין");
});



