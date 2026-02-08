function cleanPhone(value) {
  return (value || "").replace(/\D/g, "");
}

function isValidEmail(value) {
  const v = (value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidPhone(value) {
  const digits = cleanPhone(value);
  return digits.length === 10 && digits.startsWith("05");
}

function setError(fieldKey, message) {
  const errorEl = document.getElementById(`e-${fieldKey}`);
  if (errorEl) errorEl.textContent = message || "";
}



export function validateField(fieldKey, value) {
  const v = (value || "").trim();
  if (fieldKey === "name") {
    if (!v) return { ok: false, message: "חובה למלא שם מלא" };
    if (v.length < 2) return { ok: false, message: "שם קצר מדי" };
    return { ok: true, message: "" };
  }

  if (fieldKey === "phone") {
    if (!v) return { ok: false, message: "חובה למלא מספר נייד" };
    if (!isValidPhone(v)) return { ok: false, message: "מספר נייד לא תקין" };
    return { ok: true, message: "" };
  }

  if (fieldKey === "email") {
    if (!v) return { ok: false, message: "חובה למלא אימייל" };
    if (!isValidEmail(v)) return { ok: false, message: "אימייל לא תקין" };
    return { ok: true, message: "" };
  }


  if (fieldKey === "city") {
    if (!v) return { ok: false, message: "בחרו אולם תצוגה" };
    return { ok: true, message: "" };
  }

  return { ok: true, message: "" };
}


export function validateAll(formState) {
  let allOk = true;

  const requiredFields = ["name", "phone", "city", "email"];
  for (const key of requiredFields) {
    const result = validateField(key, formState[key]);
    setError(key, result.message);
    if (!result.ok) allOk = false;
  }

  return allOk;
}

export function getPhoneDigits(value) {
  return cleanPhone(value);
}
