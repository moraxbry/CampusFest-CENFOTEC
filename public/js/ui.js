/**
 * Utilidades de interfaz compartidas: navbar/footer inyectados, tarjetas,
 * badges de estado y helpers de retroalimentación visual (RNF-11, RNF-22).
 */

const STATUS_LABELS = {
  available: { label: 'Disponible', badgeClass: 'badge-disponible' },
  full: { label: 'Lleno', badgeClass: 'badge-lleno' },
  cancelled: { label: 'Cancelado', badgeClass: 'badge-cancelado' },
};

function getStatusInfo(status) {
  return STATUS_LABELS[status] || { label: status, badgeClass: 'bg-secondary' };
}

function formatDate(dateString) {
  // timeZone: 'UTC' evita que se corra un día al convertir a la zona horaria
  // local del navegador, ya que las fechas se guardan como medianoche UTC.
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function escapeHtml(value = '') {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}

function isAdminLoggedIn() {
  return localStorage.getItem('campusfest_admin') === 'true';
}

function renderNavbar(activePage) {
  const links = [
    { href: '/home.html', label: 'Inicio', page: 'home' },
    { href: '/catalog.html', label: 'Actividades', page: 'catalog' },
    { href: '/stands.html', label: 'Stands', page: 'stands' },
    { href: '/results.html', label: 'Ganadores', page: 'results' },
    { href: '/contact.html', label: 'Contacto', page: 'contact' },
  ];

  const navLinks = links
    .map(
      (link) => `
        <li class="nav-item">
          <a class="nav-link${activePage === link.page ? ' active fw-semibold' : ''}" href="${link.href}">${link.label}</a>
        </li>`
    )
    .join('');

  const adminSection = isAdminLoggedIn()
    ? `
      <a class="btn btn-outline-primary btn-sm me-2" href="/admin/dashboard.html">
        <i class="bi bi-shield-lock"></i> Panel Admin
      </a>
      <button class="btn btn-outline-danger btn-sm" id="logoutBtn" type="button">Cerrar Sesión</button>`
    : `<a class="btn btn-outline-primary btn-sm" href="/login.html">Ingresar</a>`;

  return `
    <nav class="navbar navbar-expand-lg sticky-top" style="background-color: var(--bg-primary); border-bottom: 1px solid var(--border-color);">
      <div class="container">
        <a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="/home.html" style="color: var(--ucenfotec-blue-dark);">
          <img src="/img/logoCampustFest.png" alt="Logo CampusFest" height="32">
          CampusFest
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="Abrir menú principal">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            ${navLinks}
          </ul>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-outline-secondary btn-sm" id="darkModeToggle" type="button" aria-label="Cambiar modo oscuro">🌙</button>
            ${adminSection}
          </div>
        </div>
      </div>
    </nav>`;
}

function renderFooter() {
  return `
    <footer class="py-4 mt-5 text-center" style="background-color: var(--bg-secondary); color: var(--text-muted);">
      <div class="container">
        <p class="mb-0">&copy; 2026 CampusFest — Universidad CENFOTEC. Todos los derechos reservados.</p>
      </div>
    </footer>`;
}

function getEffectiveTheme() {
  const stored = localStorage.getItem('campusfest_theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  // data-theme alimenta nuestras variables CSS; data-bs-theme hace que los
  // propios componentes de Bootstrap (cards, tablas, modales, forms) cambien
  // de paleta también, no solo el fondo de <body>.
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-bs-theme', theme);
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function initDarkMode() {
  const toggle = document.getElementById('darkModeToggle');
  applyTheme(getEffectiveTheme());

  toggle?.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('campusfest_theme', next);
    applyTheme(next);
  });
}

function initLayout() {
  const page = document.body.dataset.page;

  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  if (navbarPlaceholder) navbarPlaceholder.outerHTML = renderNavbar(page);

  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) footerPlaceholder.outerHTML = renderFooter();

  initDarkMode();

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('campusfest_admin');
    window.location.href = '/home.html';
  });
}

function showAlert(container, message, type = 'success') {
  if (!container) return;
  container.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${escapeHtml(message)}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>`;
}

function createActivityCard(activity) {
  const statusInfo = getStatusInfo(activity.status);
  const isCancelled = activity.status === 'cancelled';
  const isFull = activity.status === 'full';

  let buttonLabel = 'Inscribirse';
  let buttonDisabled = '';
  if (isCancelled) {
    buttonLabel = 'Actividad Cancelada';
    buttonDisabled = 'disabled';
  } else if (isFull) {
    buttonLabel = 'Lista de Espera';
  }

  return `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="badge ${statusInfo.badgeClass} text-white">${statusInfo.label}</span>
            <span class="badge bg-light text-dark border">${escapeHtml(activity.category)}</span>
          </div>
          <h5 class="card-title">${escapeHtml(activity.name)}</h5>
          <p class="card-text text-muted small flex-grow-1">${escapeHtml(activity.description)}</p>
          <p class="mb-1 small"><i class="bi bi-calendar"></i> ${formatDate(activity.date)} — ${escapeHtml(activity.time)}</p>
          <p class="mb-3 small"><i class="bi bi-geo-alt"></i> ${escapeHtml(activity.location)}</p>
          <div class="d-flex gap-2 mt-auto">
            <a href="/detail.html?id=${activity._id}" class="btn btn-outline-primary btn-sm flex-grow-1">Ver Detalles</a>
            <button class="btn btn-primary btn-sm flex-grow-1 btn-inscribirse" data-activity-id="${activity._id}" data-activity-name="${escapeHtml(activity.name)}" ${buttonDisabled}>
              ${buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function createStandCard(stand) {
  return `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100 shadow-sm">
        ${stand.image ? `<img src="${escapeHtml(stand.image)}" class="card-img-top" alt="${escapeHtml(stand.name)}">` : ''}
        <div class="card-body">
          <span class="badge bg-light text-dark border mb-2">${escapeHtml(stand.category)}</span>
          <h5 class="card-title">${escapeHtml(stand.name)}</h5>
          <p class="card-text text-muted small">${escapeHtml(stand.description)}</p>
          <p class="mb-1 small"><i class="bi bi-person"></i> ${escapeHtml(stand.owner)}</p>
          <p class="mb-0 small"><i class="bi bi-geo-alt"></i> ${escapeHtml(stand.location)}</p>
        </div>
      </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', initLayout);
