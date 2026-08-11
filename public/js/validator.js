/**
 * Validación de formularios en el cliente (RF-14, RF-15) y persistencia de
 * borradores ante fallos de conexión (RNF-23).
 */

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function clearFieldErrors(formEl) {
  formEl.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
}

function markFieldInvalid(formEl, fieldName) {
  const field = formEl.querySelector(`[name="${fieldName}"]`);
  field?.classList.add('is-invalid');
}

/**
 * @param {HTMLFormElement} formEl
 * @param {Object} rules - { fieldName: { required: bool, email: bool } }
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateForm(formEl, rules) {
  clearFieldErrors(formEl);
  const errors = [];

  Object.entries(rules).forEach(([fieldName, rule]) => {
    const field = formEl.querySelector(`[name="${fieldName}"]`);
    const value = field ? field.value.trim() : '';

    if (rule.required && !value) {
      errors.push(`El campo "${fieldName}" es obligatorio.`);
      markFieldInvalid(formEl, fieldName);
      return;
    }
    if (rule.email && value && !EMAIL_REGEX.test(value)) {
      errors.push('El correo electrónico no tiene un formato válido.');
      markFieldInvalid(formEl, fieldName);
    }
  });

  return { valid: errors.length === 0, errors };
}

function persistFormDraft(formEl, storageKey) {
  formEl.addEventListener('input', () => {
    const data = Object.fromEntries(new FormData(formEl).entries());
    localStorage.setItem(storageKey, JSON.stringify(data));
  });
}

function restoreFormDraft(formEl, storageKey) {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    Object.entries(data).forEach(([name, value]) => {
      const field = formEl.querySelector(`[name="${name}"]`);
      if (field) field.value = value;
    });
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function clearFormDraft(storageKey) {
  localStorage.removeItem(storageKey);
}
