/**
 * Inicializador general: despacha a la función de la página actual según
 * el atributo data-page del <body>.
 */

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  const initializers = {
    home: initHomePage,
    catalog: initCatalogPage,
    detail: initDetailPage,
    stands: initStandsPage,
    results: initResultsPage,
    contact: initContactPage,
    login: initLoginPage,
    admin: initAdminPage,
  };

  initializers[page]?.();
});

/* ==================================================
   Modal de inscripción (compartido por home/catalog/detail)
   ================================================== */

function attachInscribirseHandlers() {
  document.querySelectorAll('.btn-inscribirse').forEach((btn) => {
    btn.addEventListener('click', () => openInscriptionModal(btn.dataset.activityId, btn.dataset.activityName));
  });
}

function openInscriptionModal(activityId, activityName) {
  const modalEl = document.getElementById('inscriptionModal');
  if (!modalEl) return;

  document.getElementById('inscriptionModalActivityName').textContent = activityName;
  const form = document.getElementById('inscriptionForm');
  form.querySelector('[name="activity"]').value = activityId;

  restoreFormDraft(form, `inscription_draft_${activityId}`);

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

function initInscriptionModal() {
  const form = document.getElementById('inscriptionForm');
  if (!form) return;

  const alertContainer = document.getElementById('inscriptionAlert');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const activityId = form.querySelector('[name="activity"]').value;

    const { valid } = validateForm(form, {
      fullName: { required: true },
      idNumber: { required: true },
      phone: { required: true },
      email: { required: true, email: true },
      major: { required: true },
    });
    if (!valid) return;

    persistFormDraft(form, `inscription_draft_${activityId}`);

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await api.createInscription(data);
      clearFormDraft(`inscription_draft_${activityId}`);
      form.reset();
      bootstrap.Modal.getInstance(document.getElementById('inscriptionModal'))?.hide();

      const message = response.waitlisted
        ? `Cupo lleno: quedaste en lista de espera en la posición ${response.data.waitlistPosition}.`
        : '¡Inscripción confirmada! Te esperamos en la actividad.';
      window.alert(message);
    } catch (error) {
      showAlert(alertContainer, error.message, 'danger');
    }
  });
}

/* ==================================================
   Home
   ================================================== */

async function initHomePage() {
  initInscriptionModal();
  const container = document.getElementById('featuredActivities');
  const emptyState = document.getElementById('featuredEmpty');

  try {
    const { data } = await api.getFeaturedActivities();
    if (!data.length) {
      container.innerHTML = '';
      emptyState.classList.remove('d-none');
      return;
    }
    container.innerHTML = data.map(createActivityCard).join('');
    attachInscribirseHandlers();
  } catch (error) {
    container.innerHTML = `<div class="col-12"><div class="alert alert-danger">${error.message}</div></div>`;
  }

  try {
    const { data: configuration } = await api.getConfiguration();
    if (configuration.home?.title) document.getElementById('homeHeroTitle').textContent = configuration.home.title;
    if (configuration.home?.description)
      document.getElementById('homeHeroDescription').textContent = configuration.home.description;
  } catch {
    // Si falla, se mantiene el texto estático por defecto.
  }
}

/* ==================================================
   Catálogo
   ================================================== */

let allActivities = [];

async function initCatalogPage() {
  initInscriptionModal();
  const grid = document.getElementById('activitiesGrid');
  const resultsCount = document.getElementById('resultsCount');
  const emptyState = document.getElementById('emptyState');

  try {
    const { data } = await api.getActivities();
    allActivities = data;
    populateFilterOptions(data);
    renderAgenda(data);
    renderCatalogGrid(data);
  } catch (error) {
    grid.innerHTML = `<div class="col-12"><div class="alert alert-danger">${error.message}</div></div>`;
    return;
  }

  const applyFilters = () => {
    const filtered = filterActivities(allActivities, {
      search: document.getElementById('searchInput').value,
      category: document.getElementById('categoryFilter').value,
      date: document.getElementById('dateFilter').value,
      momento: document.getElementById('momentoFilter').value,
    });
    renderCatalogGrid(filtered);
  };

  document.getElementById('searchInput').addEventListener('input', applyFilters);
  document.getElementById('categoryFilter').addEventListener('change', applyFilters);
  document.getElementById('dateFilter').addEventListener('change', applyFilters);
  document.getElementById('momentoFilter').addEventListener('change', applyFilters);
  document.getElementById('clearFiltersBtn').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = 'Todas';
    document.getElementById('dateFilter').value = 'Todas';
    document.getElementById('momentoFilter').value = 'Todos';
    applyFilters();
  });

  function renderCatalogGrid(activities) {
    resultsCount.textContent = `Mostrando ${activities.length} actividad${activities.length === 1 ? '' : 'es'}`;
    emptyState.classList.toggle('d-none', activities.length > 0);
    grid.innerHTML = activities
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time))
      .map(createActivityCard)
      .join('');
    attachInscribirseHandlers();
  }
}

function populateFilterOptions(activities) {
  const categorySelect = document.getElementById('categoryFilter');
  const dateSelect = document.getElementById('dateFilter');

  const categories = [...new Set(activities.map((a) => a.category))];
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  const dates = [...new Set(activities.map((a) => new Date(a.date).toISOString().slice(0, 10)))].sort();
  dates.forEach((date) => {
    const option = document.createElement('option');
    option.value = date;
    option.textContent = date;
    dateSelect.appendChild(option);
  });
}

function renderAgenda(activities) {
  const agendaList = document.getElementById('agendaList');
  if (!activities.length) {
    agendaList.innerHTML = '<p class="text-muted">No hay actividades programadas.</p>';
    return;
  }

  const soonestDate = activities
    .map((a) => new Date(a.date).toISOString().slice(0, 10))
    .sort()[0];

  const todaysActivities = activities
    .filter((a) => new Date(a.date).toISOString().slice(0, 10) === soonestDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  document.getElementById('agendaDateLabel').textContent = formatDate(soonestDate);

  agendaList.innerHTML = todaysActivities
    .map(
      (a) => `
      <div class="d-flex align-items-start gap-3 py-2 border-bottom">
        <div class="fw-bold text-primary" style="min-width: 60px;">${escapeHtml(a.time)}</div>
        <div>
          <div class="fw-semibold">${escapeHtml(a.name)}</div>
          <div class="text-muted small">${escapeHtml(a.location)}</div>
        </div>
      </div>`
    )
    .join('');
}

/* ==================================================
   Detalle de actividad
   ================================================== */

async function initDetailPage() {
  initInscriptionModal();
  const container = document.getElementById('activityDetail');
  const id = new URLSearchParams(window.location.search).get('id');

  if (!id) {
    container.innerHTML = '<div class="alert alert-warning">No se especificó una actividad.</div>';
    return;
  }

  try {
    const { data: activity } = await api.getActivityById(id);
    const statusInfo = getStatusInfo(activity.status);
    const isCancelled = activity.status === 'cancelled';
    const isFull = activity.status === 'full';

    let buttonHtml = `<button class="btn btn-primary btn-lg btn-inscribirse" data-activity-id="${activity._id}" data-activity-name="${escapeHtml(activity.name)}">Inscribirse</button>`;
    if (isCancelled) buttonHtml = '<button class="btn btn-secondary btn-lg" disabled>Actividad Cancelada</button>';
    else if (isFull) buttonHtml = `<button class="btn btn-warning btn-lg btn-inscribirse" data-activity-id="${activity._id}" data-activity-name="${escapeHtml(activity.name)}">Unirse a Lista de Espera</button>`;

    let resultHtml = '';
    if (activity.result) {
      resultHtml = `
        <div class="card mt-4 border-0" style="background-color: var(--bg-surface);">
          <div class="card-body">
            <h4 class="mb-3">🏆 Resultados</h4>
            <p class="mb-1"><strong>1er lugar:</strong> ${escapeHtml(activity.result.firstPlace || '—')}</p>
            <p class="mb-1"><strong>2do lugar:</strong> ${escapeHtml(activity.result.secondPlace || '—')}</p>
            <p class="mb-0"><strong>3er lugar:</strong> ${escapeHtml(activity.result.thirdPlace || '—')}</p>
          </div>
        </div>`;
    }

    container.innerHTML = `
      ${activity.image ? `<img src="${escapeHtml(activity.image)}" alt="Imagen representativa de ${escapeHtml(activity.name)}" class="w-100 rounded mb-4" style="max-height: 320px; object-fit: cover;">` : ''}
      <div class="d-flex justify-content-between align-items-start mb-3">
        <span class="badge ${statusInfo.badgeClass} text-white fs-6">${statusInfo.label}</span>
        <span class="badge bg-light text-dark border fs-6">${escapeHtml(activity.category)}</span>
      </div>
      <h1>${escapeHtml(activity.name)}</h1>
      <p class="lead text-muted">${escapeHtml(activity.description)}</p>
      <ul class="list-unstyled mb-4">
        <li class="mb-2"><i class="bi bi-calendar"></i> ${formatDate(activity.date)} — ${escapeHtml(activity.time)}</li>
        <li class="mb-2"><i class="bi bi-geo-alt"></i> ${escapeHtml(activity.location)}</li>
        <li class="mb-2"><i class="bi bi-people"></i> ${activity.takenSpots}/${activity.maxCapacity} cupos ocupados</li>
        ${activity.requirements ? `<li class="mb-2"><i class="bi bi-clipboard-check"></i> Requisitos: ${escapeHtml(activity.requirements)}</li>` : ''}
      </ul>
      ${buttonHtml}
      ${resultHtml}
    `;
    attachInscribirseHandlers();
  } catch (error) {
    container.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

/* ==================================================
   Stands
   ================================================== */

async function initStandsPage() {
  const grid = document.getElementById('standsGrid');
  const emptyState = document.getElementById('standsEmpty');
  const categoryFilter = document.getElementById('standCategoryFilter');
  const searchInput = document.getElementById('standSearchInput');

  let stands = [];
  try {
    const { data } = await api.getStands();
    stands = data;
  } catch (error) {
    grid.innerHTML = `<div class="col-12"><div class="alert alert-danger">${error.message}</div></div>`;
    return;
  }

  const categories = [...new Set(stands.map((s) => s.category))];
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const render = (list) => {
    emptyState.classList.toggle('d-none', list.length > 0);
    grid.innerHTML = list.map(createStandCard).join('');
  };

  const applyFilters = () => {
    const search = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;

    const filtered = stands.filter((stand) => {
      const matchesSearch =
        !search ||
        stand.name.toLowerCase().includes(search) ||
        stand.description.toLowerCase().includes(search) ||
        stand.owner.toLowerCase().includes(search);
      const matchesCategory = category === 'Todas' || stand.category === category;
      return matchesSearch && matchesCategory;
    });

    render(filtered);
  };

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  document.getElementById('clearStandFiltersBtn').addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = 'Todas';
    applyFilters();
  });

  render(stands);
}

/* ==================================================
   Ganadores / Resultados
   ================================================== */

async function initResultsPage() {
  const loading = document.getElementById('resultsLoading');
  const featuredSection = document.getElementById('featuredPodium');
  const listSection = document.getElementById('resultsListSection');
  const noResultsAtAll = document.getElementById('noResultsAtAll');
  const grid = document.getElementById('resultsGrid');
  const emptyState = document.getElementById('resultsEmpty');
  const searchInput = document.getElementById('resultsSearchInput');
  const categoryFilter = document.getElementById('resultsCategoryFilter');

  let results = [];
  try {
    const { data } = await api.getActivityResults();
    results = data;
  } catch (error) {
    loading.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    return;
  }

  loading.classList.add('d-none');

  if (!results.length) {
    noResultsAtAll.classList.remove('d-none');
    return;
  }

  // El backend ya ordena por result.publishedAt descendente, así que el
  // primero es el evento concluido más reciente.
  const [featured, ...rest] = results;

  featuredSection.classList.remove('d-none');
  document.getElementById('featuredActivityName').textContent = featured.name;
  document.getElementById('featuredDate').textContent = formatDate(featured.result.publishedAt);
  document.getElementById('featuredFirst').textContent = featured.result.firstPlace || '—';
  document.getElementById('featuredSecond').textContent = featured.result.secondPlace || '—';
  document.getElementById('featuredThird').textContent = featured.result.thirdPlace || '—';

  if (!rest.length) return;

  listSection.classList.remove('d-none');

  const categories = [...new Set(rest.map((a) => a.category))];
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const renderResultCard = (activity) => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="badge bg-light text-dark border">${escapeHtml(activity.category)}</span>
            <span class="text-muted small"><i class="bi bi-calendar"></i> ${formatDate(activity.result.publishedAt)}</span>
          </div>
          <h5 class="mb-3">${escapeHtml(activity.name)}</h5>
          <div class="d-flex flex-column gap-2">
            <div class="d-flex align-items-center gap-2"><span class="fs-5">🥇</span> <span>${escapeHtml(activity.result.firstPlace || '—')}</span></div>
            ${activity.result.secondPlace ? `<div class="d-flex align-items-center gap-2"><span class="fs-5">🥈</span> <span>${escapeHtml(activity.result.secondPlace)}</span></div>` : ''}
            ${activity.result.thirdPlace ? `<div class="d-flex align-items-center gap-2"><span class="fs-5">🥉</span> <span>${escapeHtml(activity.result.thirdPlace)}</span></div>` : ''}
          </div>
        </div>
      </div>
    </div>`;

  const render = (list) => {
    emptyState.classList.toggle('d-none', list.length > 0);
    grid.innerHTML = list.map(renderResultCard).join('');
  };

  const applyFilters = () => {
    const search = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const filtered = rest.filter((activity) => {
      const matchesSearch = !search || activity.name.toLowerCase().includes(search);
      const matchesCategory = category === 'Todas' || activity.category === category;
      return matchesSearch && matchesCategory;
    });
    render(filtered);
  };

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  document.getElementById('clearResultsFiltersBtn').addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = 'Todas';
    applyFilters();
  });

  render(rest);
}

/* ==================================================
   Contacto
   ================================================== */

async function initContactPage() {
  try {
    const { data: configuration } = await api.getConfiguration();
    if (configuration.contact?.title) document.getElementById('contactTitle').textContent = configuration.contact.title;
    if (configuration.contact?.description)
      document.getElementById('contactDescription').textContent = configuration.contact.description;
  } catch {
    // Se mantiene el texto estático por defecto.
  }

  const form = document.getElementById('contactForm');
  const alertContainer = document.getElementById('contactAlert');
  restoreFormDraft(form, 'contact_draft');
  persistFormDraft(form, 'contact_draft');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { valid } = validateForm(form, {
      fullName: { required: true },
      email: { required: true, email: true },
      subject: { required: true },
      message: { required: true },
    });
    if (!valid) return;

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await api.sendContact(data);
      showAlert(alertContainer, response.message, 'success');
      form.reset();
      clearFormDraft('contact_draft');
    } catch (error) {
      showAlert(alertContainer, error.message, 'danger');
    }
  });
}

/* ==================================================
   Login (simulado, sin autenticación real)
   ================================================== */

function initLoginPage() {
  document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem('campusfest_admin', 'true');
    window.location.href = '/admin/dashboard.html';
  });
}

/* ==================================================
   Panel de Administración
   ================================================== */

function initAdminPage() {
  if (!isAdminLoggedIn()) {
    window.location.href = '/login.html';
    return;
  }

  initActivitiesTab();
  initStandsSection();
  initConfigurationSection();
  initInscriptionsTab();
  initResultsTab();
}

// --- Actividades ---

let adminActivitiesCache = [];

async function initActivitiesTab() {
  const tableBody = document.getElementById('activitiesTableBody');
  const form = document.getElementById('activityForm');
  const modalEl = document.getElementById('activityModal');
  const modal = new bootstrap.Modal(modalEl);

  async function loadActivities() {
    const { data } = await api.getActivities();
    adminActivitiesCache = data;
    tableBody.innerHTML = data
      .map((activity) => {
        const statusInfo = getStatusInfo(activity.status);
        return `
        <tr>
          <td>${escapeHtml(activity.name)}</td>
          <td>${escapeHtml(activity.category)}</td>
          <td><span class="badge ${statusInfo.badgeClass} text-white">${statusInfo.label}</span></td>
          <td>${activity.takenSpots}/${activity.maxCapacity}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-primary me-1 btn-edit-activity" data-id="${activity._id}">Editar</button>
            <button class="btn btn-sm btn-outline-danger btn-delete-activity" data-id="${activity._id}">Eliminar</button>
          </td>
        </tr>`;
      })
      .join('');

    tableBody.querySelectorAll('.btn-edit-activity').forEach((btn) => {
      btn.addEventListener('click', () => openActivityModal(btn.dataset.id));
    });
    tableBody.querySelectorAll('.btn-delete-activity').forEach((btn) => {
      btn.addEventListener('click', () => deleteActivity(btn.dataset.id));
    });

    populateResultActivitySelect(data);
    populateInscriptionActivityFilter(data);
  }

  function openActivityModal(id) {
    form.reset();
    clearFieldErrors(form);
    form.querySelector('[name="_id"]').value = '';
    document.getElementById('activityModalTitle').textContent = 'Nueva Actividad';

    if (id) {
      const activity = adminActivitiesCache.find((a) => a._id === id);
      if (!activity) return;
      form.querySelector('[name="_id"]').value = activity._id;
      form.querySelector('[name="name"]').value = activity.name;
      form.querySelector('[name="description"]').value = activity.description;
      form.querySelector('[name="category"]').value = activity.category;
      form.querySelector('[name="date"]').value = new Date(activity.date).toISOString().slice(0, 10);
      form.querySelector('[name="time"]').value = activity.time;
      form.querySelector('[name="location"]').value = activity.location;
      form.querySelector('[name="requirements"]').value = activity.requirements || '';
      form.querySelector('[name="image"]').value = activity.image || '';
      form.querySelector('[name="maxCapacity"]').value = activity.maxCapacity;
      form.querySelector('[name="status"]').value = activity.status;
      document.getElementById('activityModalTitle').textContent = 'Editar Actividad';
    }
    modal.show();
  }

  async function deleteActivity(id) {
    if (!window.confirm('¿Seguro que querés eliminar esta actividad? Esta acción no se puede deshacer.')) return;
    try {
      await api.deleteActivity(id);
      await loadActivities();
    } catch (error) {
      window.alert(error.message);
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { valid } = validateForm(form, {
      name: { required: true },
      description: { required: true },
      category: { required: true },
      date: { required: true },
      time: { required: true },
      location: { required: true },
      maxCapacity: { required: true },
    });
    if (!valid) return;

    const id = form.querySelector('[name="_id"]').value;
    const data = Object.fromEntries(new FormData(form).entries());
    delete data._id;
    data.maxCapacity = Number(data.maxCapacity);

    try {
      if (id) await api.updateActivity(id, data);
      else await api.createActivity(data);
      modal.hide();
      await loadActivities();
    } catch (error) {
      window.alert(error.message);
    }
  });

  document.getElementById('newActivityBtn').addEventListener('click', () => openActivityModal(null));

  await loadActivities();
}

// --- Stands (dentro de "Páginas e Info") ---

let adminStandsCache = [];

function initStandsSection() {
  const tableBody = document.getElementById('standsTableBody');
  const form = document.getElementById('standForm');
  const modalEl = document.getElementById('standModal');
  const modal = new bootstrap.Modal(modalEl);

  async function loadStands() {
    const { data } = await api.getStands();
    adminStandsCache = data;
    tableBody.innerHTML = data
      .map(
        (stand) => `
        <tr>
          <td>${escapeHtml(stand.name)}</td>
          <td>${escapeHtml(stand.category)}</td>
          <td>${escapeHtml(stand.owner)}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-primary btn-edit-stand" data-id="${stand._id}">Editar</button>
          </td>
        </tr>`
      )
      .join('');

    tableBody.querySelectorAll('.btn-edit-stand').forEach((btn) => {
      btn.addEventListener('click', () => openStandModal(btn.dataset.id));
    });
  }

  function openStandModal(id) {
    form.reset();
    clearFieldErrors(form);
    form.querySelector('[name="_id"]').value = '';
    document.getElementById('standModalTitle').textContent = 'Nuevo Stand';

    if (id) {
      const stand = adminStandsCache.find((s) => s._id === id);
      if (!stand) return;
      form.querySelector('[name="_id"]').value = stand._id;
      form.querySelector('[name="name"]').value = stand.name;
      form.querySelector('[name="category"]').value = stand.category;
      form.querySelector('[name="owner"]').value = stand.owner;
      form.querySelector('[name="location"]').value = stand.location;
      form.querySelector('[name="description"]').value = stand.description || '';
      form.querySelector('[name="image"]').value = stand.image || '';
      document.getElementById('standModalTitle').textContent = 'Editar Stand';
    }
    modal.show();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { valid } = validateForm(form, {
      name: { required: true },
      category: { required: true },
      owner: { required: true },
      location: { required: true },
    });
    if (!valid) return;

    const id = form.querySelector('[name="_id"]').value;
    const data = Object.fromEntries(new FormData(form).entries());
    delete data._id;

    try {
      if (id) await api.updateStand(id, data);
      else await api.createStand(data);
      modal.hide();
      await loadStands();
    } catch (error) {
      window.alert(error.message);
    }
  });

  document.getElementById('newStandBtn').addEventListener('click', () => openStandModal(null));

  loadStands();
}

// --- Configuration (dentro de "Páginas e Info") ---

async function initConfigurationSection() {
  const homeForm = document.getElementById('homeConfigForm');
  const contactForm = document.getElementById('contactConfigForm');
  const alertContainer = document.getElementById('configAlert');

  try {
    const { data } = await api.getConfiguration();
    homeForm.querySelector('[name="title"]').value = data.home?.title || '';
    homeForm.querySelector('[name="description"]').value = data.home?.description || '';
    contactForm.querySelector('[name="title"]').value = data.contact?.title || '';
    contactForm.querySelector('[name="description"]').value = data.contact?.description || '';
    contactForm.querySelector('[name="contactEmail"]').value = data.contact?.contactEmail || '';
    contactForm.querySelector('[name="contactPhone"]').value = data.contact?.contactPhone || '';
  } catch (error) {
    showAlert(alertContainer, error.message, 'danger');
  }

  homeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(homeForm).entries());
    try {
      await api.updateConfiguration('home', data);
      showAlert(alertContainer, 'Sección de inicio actualizada correctamente.', 'success');
    } catch (error) {
      showAlert(alertContainer, error.message, 'danger');
    }
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(contactForm).entries());
    try {
      await api.updateConfiguration('contact', data);
      showAlert(alertContainer, 'Sección de contacto actualizada correctamente.', 'success');
    } catch (error) {
      showAlert(alertContainer, error.message, 'danger');
    }
  });
}

// --- Inscripciones y Espera ---

function populateInscriptionActivityFilter(activities) {
  const select = document.getElementById('inscriptionActivityFilter');
  if (!select || select.dataset.populated) return;
  activities.forEach((activity) => {
    const option = document.createElement('option');
    option.value = activity._id;
    option.textContent = activity.name;
    select.appendChild(option);
  });
  select.dataset.populated = 'true';
}

function initInscriptionsTab() {
  const tableBody = document.getElementById('inscriptionsTableBody');
  const filterSelect = document.getElementById('inscriptionActivityFilter');

  async function loadInscriptions() {
    const query = filterSelect.value && filterSelect.value !== 'Todas' ? `?activity=${filterSelect.value}` : '';
    const { data } = await api.getAdminInscriptions(query);

    tableBody.innerHTML = data
      .map((inscription) => {
        const statusLabels = { confirmed: 'Confirmada', waitlisted: 'Lista de espera', cancelled: 'Cancelada' };
        return `
        <tr>
          <td>${escapeHtml(inscription.fullName)}</td>
          <td>${escapeHtml(inscription.email)}</td>
          <td>${escapeHtml(inscription.activity?.name || '—')}</td>
          <td>${statusLabels[inscription.status] || inscription.status}${inscription.waitlistPosition ? ` (#${inscription.waitlistPosition})` : ''}</td>
          <td class="text-end">
            ${
              inscription.status !== 'cancelled'
                ? `<button class="btn btn-sm btn-outline-danger btn-cancel-inscription" data-id="${inscription._id}">Cancelar</button>`
                : ''
            }
          </td>
        </tr>`;
      })
      .join('');

    tableBody.querySelectorAll('.btn-cancel-inscription').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!window.confirm('¿Cancelar esta inscripción?')) return;
        try {
          await api.updateInscription(btn.dataset.id, { status: 'cancelled' });
          await loadInscriptions();
        } catch (error) {
          window.alert(error.message);
        }
      });
    });
  }

  filterSelect.addEventListener('change', loadInscriptions);
  loadInscriptions();
}

// --- Publicar Resultados ---

function populateResultActivitySelect(activities) {
  const select = document.getElementById('resultActivitySelect');
  if (!select || select.dataset.populated) return;
  activities.forEach((activity) => {
    const option = document.createElement('option');
    option.value = activity._id;
    option.textContent = activity.name;
    select.appendChild(option);
  });
  select.dataset.populated = 'true';
}

function initResultsTab() {
  const form = document.getElementById('resultForm');
  const alertContainer = document.getElementById('resultAlert');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const activityId = document.getElementById('resultActivitySelect').value;
    if (!activityId) {
      showAlert(alertContainer, 'Seleccioná una actividad primero.', 'warning');
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      await api.publishActivityResult(activityId, data);
      showAlert(alertContainer, 'Resultado publicado correctamente.', 'success');
      form.reset();
    } catch (error) {
      showAlert(alertContainer, error.message, 'danger');
    }
  });
}
