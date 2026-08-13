import {
  createNumberPool,
  getNumberStatusLabel,
  nextNumberStatus,
  reserveNumberForEvent,
} from './raffleNumbers.js';
import { APP_CONFIG } from './config.js';
import { state } from './state.js';
import { loadAppState, saveUsers, saveEvents, savePayments, saveSession } from './storage.js';
import { formatDate, getEventStatus, getEventStatusLabel, setActiveTab } from './helpers.js';

const elements = {
  sidebarNav: document.getElementById('sidebarNav'),
  authSection: document.getElementById('authSection'),
  authForm: document.getElementById('authForm'),
  authNameField: document.getElementById('authNameField'),
  authName: document.getElementById('authName'),
  authEmail: document.getElementById('authEmail'),
  authPassword: document.getElementById('authPassword'),
  authSubmitBtn: document.getElementById('authSubmitBtn'),
  authHint: document.getElementById('authHint'),
  authModeTitle: document.getElementById('authModeTitle'),
  authModeText: document.getElementById('authModeText'),
  authModeToggle: document.getElementById('authModeToggle'),
  topActions: document.getElementById('topActions'),
  dashboardSection: document.getElementById('dashboardSection'),
  summaryClients: document.getElementById('summaryClients'),
  summaryEvents: document.getElementById('summaryEvents'),
  summaryUpcoming: document.getElementById('summaryUpcoming'),
  summaryCompleted: document.getElementById('summaryCompleted'),
  summaryPayments: document.getElementById('summaryPayments'),
  dashboardDetails: document.getElementById('dashboardDetails'),
  paymentSummarySection: document.getElementById('paymentSummarySection'),
  paymentSummaryTitle: document.getElementById('paymentSummaryTitle'),
  paymentSummaryList: document.getElementById('paymentSummaryList'),
  adminClientsSection: document.getElementById('adminClientsSection'),
  clientForm: document.getElementById('clientForm'),
  clientName: document.getElementById('clientName'),
  clientEmail: document.getElementById('clientEmail'),
  clientDni: document.getElementById('clientDni'),
  clientPassword: document.getElementById('clientPassword'),
  clientSearch: document.getElementById('clientSearch'),
  saveClientBtn: document.getElementById('saveClientBtn'),
  cancelClientEditBtn: document.getElementById('cancelClientEditBtn'),
  clientList: document.getElementById('clientList'),
  adminEventsSection: document.getElementById('adminEventsSection'),
  eventForm: document.getElementById('eventForm'),
  eventTitle: document.getElementById('eventTitle'),
  eventDate: document.getElementById('eventDate'),
  eventWinnersCount: document.getElementById('eventWinnersCount'),
  eventImage: document.getElementById('eventImage'),
  eventDescription: document.getElementById('eventDescription'),
  eventNumbersEditor: document.getElementById('eventNumbersEditor'),
  saveEventBtn: document.getElementById('saveEventBtn'),
  cancelEventEditBtn: document.getElementById('cancelEventEditBtn'),
  adminEventFilters: document.getElementById('adminEventFilters'),
  adminEventsList: document.getElementById('adminEventsList'),
  clientProfileSection: document.getElementById('clientProfileSection'),
  profileName: document.getElementById('profileName'),
  profileEmail: document.getElementById('profileEmail'),
  profilePassword: document.getElementById('profilePassword'),
  saveProfileBtn: document.getElementById('saveProfileBtn'),
  clientEventsSection: document.getElementById('clientEventsSection'),
  clientEventFilters: document.getElementById('clientEventFilters'),
  clientEventsList: document.getElementById('clientEventsList'),
  clientEventsPrevBtn: document.getElementById('clientEventsPrevBtn'),
  clientEventsNextBtn: document.getElementById('clientEventsNextBtn'),
  paymentSection: document.getElementById('paymentSection'),
  paymentNumberSelector: document.getElementById('paymentNumberSelector'),
  paymentQrDisplay: document.getElementById('paymentQrDisplay'),
  closePaymentBtn: document.getElementById('closePaymentBtn'),
  paymentTitle: document.getElementById('paymentTitle'),
  profilePhoto: document.getElementById('profilePhoto'),
  profilePhotoPreview: document.getElementById('profilePhotoPreview'),
  toast: document.getElementById('toast'),
  receiptModal: document.getElementById('receiptModal'),
  receiptContent: document.getElementById('receiptContent'),
  downloadPdfBtn: document.getElementById('downloadPdfBtn'),
  closeReceiptBtn: document.getElementById('closeReceiptBtn'),
  closeReceiptBtnBottom: document.getElementById('closeReceiptBtnBottom'),
};

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.remove('hidden');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    elements.toast.classList.add('hidden');
  }, 2400);
}

function setSidebarSection(sectionKey) {
  if (!state.currentUser) return;
  state.activeSection = sectionKey;
  renderSidebarNav();

  const adminSections = {
    dashboard: elements.dashboardSection,
    payments: elements.paymentSummarySection,
    clients: elements.adminClientsSection,
    events: elements.adminEventsSection,
  };

  const clientSections = {
    profile: elements.clientProfileSection,
    payments: elements.paymentSummarySection,
    events: elements.clientEventsSection,
  };

  const allSections = { ...adminSections, ...clientSections };

  Object.values(allSections).forEach(section => {
    section.classList.add('hidden');
  });

  const sections = state.currentUser.role === 'admin' ? adminSections : clientSections;
  Object.entries(sections).forEach(([key, section]) => {
    section.classList.toggle('hidden', key !== sectionKey);
  });
}

function renderSidebarNav() {
  elements.sidebarNav.innerHTML = '';
  elements.sidebarNav.classList.add('hidden');

  if (!state.currentUser) return;

  const navItems = state.currentUser.role === 'admin'
    ? [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'payments', label: 'Ingresos' },
        { key: 'clients', label: 'Gestión de clientes' },
        { key: 'events', label: 'Gestión de eventos' },
      ]
    : [
        { key: 'profile', label: 'Mi perfil' },
        { key: 'payments', label: 'Mis pagos' },
        { key: 'events', label: 'Mis eventos' },
      ];

  const nav = document.createElement('div');
  nav.className = 'sidebar-nav';

  navItems.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = item.label;
    button.className = `sidebar-btn${state.activeSection === item.key ? ' active' : ''}`;
    button.addEventListener('click', () => setSidebarSection(item.key));
    nav.appendChild(button);
  });

  elements.sidebarNav.appendChild(nav);
  elements.sidebarNav.classList.remove('hidden');
}

function renderTopActions() {
  elements.topActions.innerHTML = '';
  if (!state.currentUser) return;

  const welcome = document.createElement('div');
  welcome.className = 'welcome-text';
  welcome.innerHTML = `<strong>${state.currentUser.name}</strong> (${state.currentUser.role})`;

  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Cerrar sesión';
  logoutBtn.className = 'secondary small';
  logoutBtn.addEventListener('click', () => {
    state.currentUser = null;
    state.activeSection = null;
    saveSession(state);
    renderApp();
    showToast('Has cerrado sesión');
  });

  elements.topActions.appendChild(welcome);
  elements.topActions.appendChild(logoutBtn);
}

function renderDashboard() {
  const totalClients = state.users.filter(user => user.role === 'client').length;
  const totalEvents = state.events.length;
  const upcoming = state.events.filter(e => getEventStatus(e) === 'upcoming').length;
  const completed = state.events.filter(e => getEventStatus(e) === 'completed').length;
  const totalPayments = state.payments.length;

  elements.summaryClients.textContent = totalClients;
  elements.summaryEvents.textContent = totalEvents;
  elements.summaryUpcoming.textContent = upcoming;
  elements.summaryCompleted.textContent = completed;
  elements.summaryPayments.textContent = totalPayments;

  elements.dashboardDetails.innerHTML = `
    <div class="card-item">
      <div class="content">
        <h3>Resumen rápido</h3>
        <p>Clientes registrados: <strong>${totalClients}</strong></p>
        <p>Eventos creados: <strong>${totalEvents}</strong></p>
        <p>Ganadores seleccionados: <strong>${state.events.reduce((sum, event) => sum + event.winners.length, 0)}</strong></p>
        <p>Pagos realizados: <strong>${totalPayments}</strong></p>
      </div>
    </div>
  `;
}

function renderClientList() {
  const filter = state.clientSearchTerm.toLowerCase();
  const clients = state.users
    .filter(user => user.role === 'client')
    .filter(client => {
      if (!filter) return true;
      return [client.name, client.email, client.dni || '']
        .some(value => value.toLowerCase().includes(filter));
    });

  if (clients.length === 0) {
    elements.clientList.innerHTML = '<p>No hay clientes que coincidan con la búsqueda.</p>';
    return;
  }

  const cards = clients
    .map(client => {
      const participatedEvents = state.events.filter(event => event.participants.includes(client.id));
      const paidEvents = state.payments.filter(payment => payment.userId === client.id);
      const eventNames = participatedEvents.length
        ? participatedEvents.map(event => event.title).join(', ')
        : 'No ha participado aún';
      return `
        <div class="client-card">
          <div class="client-card-image" style="background-image: url('${client.photo || 'https://via.placeholder.com/260x260?text=Sin+foto'}')"></div>
          <div class="content">
            <div class="client-card-header">
              <div>
                <h3>${client.name}</h3>
                <p class="client-meta">DNI: <strong>${client.dni || '-'}</strong></p>
                <p class="client-meta">Correo: <strong>${client.email}</strong></p>
              </div>
              <div class="client-card-actions">
                <button class="small" data-action="edit" data-id="${client.id}">Editar</button>
                <button class="small danger" data-action="delete" data-id="${client.id}">Eliminar</button>
              </div>
            </div>
            <div class="client-card-body">
              <p class="client-meta">Registrado: ${formatDate(client.createdAt)}</p>
              <p class="client-meta">Pagos registrados: <strong>${paidEvents.length}</strong></p>
              <p class="client-events"><strong>Rifas participadas:</strong> ${eventNames}</p>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  elements.clientList.innerHTML = `<div class="client-grid">${cards}</div>`;

  elements.clientList.querySelectorAll('button').forEach(button => {
    const id = button.dataset.id;
    if (button.dataset.action === 'edit') {
      button.addEventListener('click', () => startEditClient(id));
    } else {
      button.addEventListener('click', () => deleteClient(id));
    }
  });
}

function startEditClient(id) {
  const client = state.users.find(user => user.id === id);
  if (!client) return;
  state.editingClientId = id;
  elements.clientName.value = client.name;
  elements.clientEmail.value = client.email;
  elements.clientDni.value = client.dni || '';
  elements.clientPassword.value = '';
  elements.saveClientBtn.textContent = 'Guardar cambios';
  elements.cancelClientEditBtn.classList.remove('hidden');
}

function resetClientForm() {
  state.editingClientId = null;
  elements.clientName.value = '';
  elements.clientEmail.value = '';
  elements.clientDni.value = '';
  elements.clientPassword.value = '';
  elements.saveClientBtn.textContent = 'Agregar cliente';
  elements.cancelClientEditBtn.classList.add('hidden');
}

function saveClient(event) {
  event.preventDefault();
  const name = elements.clientName.value.trim();
  const email = elements.clientEmail.value.trim().toLowerCase();
  const dni = elements.clientDni.value.trim();
  const password = elements.clientPassword.value.trim();

  if (!name || !email || !dni) {
    showToast('Completa nombre, correo y DNI para el cliente');
    return;
  }

  if (state.editingClientId) {
    const client = state.users.find(user => user.id === state.editingClientId);
    if (!client) return;
    client.name = name;
    client.email = email;
    client.dni = dni;
    if (password) client.password = password;
    saveUsers(state);
    resetClientForm();
    renderClientList();
    showToast('Cliente actualizado');
    return;
  }

  if (state.users.some(user => user.email === email)) {
    showToast('Ya existe un cliente con ese correo');
    return;
  }

  state.users.push({
    id: `user-${Date.now()}`,
    name,
    email,
    dni,
    password: password || 'cliente123',
    role: 'client',
    createdAt: new Date().toISOString(),
  });
  saveUsers(state);
  resetClientForm();
  renderClientList();
  showToast('Cliente registrado');
}

function deleteClient(id) {
  if (!confirm('¿Eliminar este cliente?')) return;
  state.users = state.users.filter(user => user.id !== id);
  state.events.forEach(event => {
    event.participants = event.participants.filter(pid => pid !== id);
    event.winners = event.winners.filter(pid => pid !== id);
  });
  saveUsers(state);
  saveEvents(state);
  renderClientList();
  renderClientEvents();
  showToast('Cliente eliminado');
}

function renderAdminEvents() {
  const filter = state.adminEventFilter;
  const filtered = state.events.filter(event => {
    const status = getEventStatus(event);
    return filter === 'all' || filter === status || (filter === 'past' && status === 'past');
  });

  if (filtered.length === 0) {
    elements.adminEventsList.innerHTML = '<p>No hay eventos disponibles.</p>';
    return;
  }

  elements.adminEventsList.innerHTML = filtered
    .map(event => {
      const status = getEventStatus(event);
      const participants = state.users.filter(user => event.participants.includes(user.id));
      const winners = state.users.filter(user => event.winners.includes(user.id));
      return `
        <div class="card-item">
          <img src="${event.image || 'https://via.placeholder.com/360x180?text=Premio'}" alt="Imagen del premio" />
          <div class="content">
            <div>
              <h3>${event.title}</h3>
              <p>${event.description || 'Sin descripción'}</p>
              <p><strong>Fecha:</strong> ${formatDate(event.date)} • <span class="badge ${status}">${getEventStatusLabel(event)}</span></p>
              <p><strong>Participantes:</strong> ${participants.length}</p>
              <p><strong>Ganadores:</strong> ${winners.length}</p>
            </div>
            <div class="actions-row" style="margin-top: 12px; gap: 10px;">
              <button class="small" data-action="edit-event" data-id="${event.id}">Editar</button>
              <button class="small danger" data-action="delete-event" data-id="${event.id}">Eliminar</button>
              <button class="small" data-action="details-event" data-id="${event.id}">Ver detalles</button>
              ${status !== 'completed' ? `<button class="small" data-action="draw-event" data-id="${event.id}">Sacar ganadores</button>` : ''}
            </div>
            ${winners.length ? `<p style="margin-top:12px;"><strong>Ganadores:</strong> ${winners.map(w => w.name).join(', ')}</p>` : ''}
          </div>
        </div>
      `;
    })
    .join('');

  elements.adminEventsList.querySelectorAll('button').forEach(button => {
    const id = button.dataset.id;
    const action = button.dataset.action;
    if (action === 'edit-event') button.addEventListener('click', () => startEditEvent(id));
    if (action === 'delete-event') button.addEventListener('click', () => deleteEvent(id));
    if (action === 'draw-event') button.addEventListener('click', () => drawEventWinners(id));
    if (action === 'details-event') button.addEventListener('click', () => showEventDetails(id));
  });
}

function renderEventNumbersEditor(event) {
  ensureEventNumbers(event);

  const numbers = (event.numbers || []).slice(0, 100);
  const header = `
    <div class="event-number-editor-header">
      <span>Estados de números de la rifa</span>
      <span>${numbers.filter(item => item.status === 'available').length} disponibles</span>
    </div>
    <div class="event-number-grid">
      ${numbers.map(item => `
        <button
          type="button"
          class="event-number-btn"
          data-status="${item.status || 'available'}"
          data-number="${item.number}"
          title="Número ${item.number}: ${getNumberStatusLabel(item.status || 'available')}"
        >${item.number}</button>
      `).join('')}
    </div>
  `;

  elements.eventNumbersEditor.innerHTML = header;
  elements.eventNumbersEditor.classList.remove('hidden');

  elements.eventNumbersEditor.querySelectorAll('.event-number-btn').forEach(button => {
    button.addEventListener('click', () => {
      const eventForEdit = state.events.find(entry => entry.id === state.editingEventId);
      if (!eventForEdit) return;
      const number = Number(button.dataset.number);
      const item = eventForEdit.numbers.find(entry => entry.number === number);
      if (!item) return;
      item.status = nextNumberStatus(item.status || 'available');
      item.ownerId = item.status === 'sold' ? item.ownerId : null;
      renderEventNumbersEditor(eventForEdit);
    });
  });
}

function saveEvent(event) {
  event.preventDefault();
  const title = elements.eventTitle.value.trim();
  const date = elements.eventDate.value;
  const description = elements.eventDescription.value.trim();
  const winnersCount = Number(elements.eventWinnersCount.value);

  if (!title || !date || !winnersCount || winnersCount <= 0) {
    showToast('Completa título, fecha y número de ganadores');
    return;
  }

  if (state.editingEventId) {
    const existing = state.events.find(entry => entry.id === state.editingEventId);
    if (!existing) return;
    existing.title = title;
    existing.date = date;
    existing.description = description;
    existing.image = elements.eventImage.value.trim();
    existing.winnersCount = winnersCount;
    ensureEventNumbers(existing);
    saveEvents(state);
    resetEventForm();
    renderAdminEvents();
    showToast('Evento actualizado');
    return;
  }

  const newEvent = {
    id: `event-${Date.now()}`,
    title,
    date,
    description,
    image: elements.eventImage.value.trim(),
    winnersCount,
    participants: [],
    winners: [],
    status: 'upcoming',
    createdAt: new Date().toISOString(),
    numbers: createNumberPool().map(number => ({ number, status: 'available', ownerId: null })),
  };

  state.events.push(newEvent);
  saveEvents(state);
  resetEventForm();
  renderAdminEvents();
  showToast('Evento creado');
}

function startEditEvent(id) {
  const event = state.events.find(entry => entry.id === id);
  if (!event) return;
  state.editingEventId = id;
  elements.eventTitle.value = event.title;
  elements.eventDate.value = event.date;
  elements.eventDescription.value = event.description;
  elements.eventImage.value = event.image || '';
  elements.eventWinnersCount.value = event.winnersCount;
  elements.saveEventBtn.textContent = 'Guardar cambios';
  elements.cancelEventEditBtn.classList.remove('hidden');
  renderEventNumbersEditor(event);
}

function resetEventForm() {
  state.editingEventId = null;
  elements.eventForm.reset();
  elements.eventNumbersEditor.innerHTML = '';
  elements.eventNumbersEditor.classList.add('hidden');
  elements.saveEventBtn.textContent = 'Crear evento';
  elements.cancelEventEditBtn.classList.add('hidden');
}

function deleteEvent(id) {
  if (!confirm('¿Eliminar este evento?')) return;
  state.events = state.events.filter(entry => entry.id !== id);
  saveEvents(state);
  renderAdminEvents();
  renderClientEvents();
  showToast('Evento eliminado');
}

function drawEventWinners(id) {
  const event = state.events.find(entry => entry.id === id);
  if (!event) return;
  if (event.participants.length === 0) {
    showToast('No hay participantes registrados en este evento');
    return;
  }

  const available = [...event.participants];
  const selected = [];

  while (selected.length < event.winnersCount && available.length > 0) {
    const index = Math.floor(Math.random() * available.length);
    selected.push(available.splice(index, 1)[0]);
  }

  event.winners = selected;
  event.status = 'completed';
  saveEvents(state);
  renderAdminEvents();
  renderClientEvents();
  showToast('Ganadores seleccionados');
}

function showEventDetails(id) {
  const event = state.events.find(entry => entry.id === id);
  if (!event) return;
  const participants = state.users.filter(user => event.participants.includes(user.id));
  const winners = state.users.filter(user => event.winners.includes(user.id));
  const status = getEventStatus(event);

  const detailsHtml = `
    <div class="card-item">
      <img src="${event.image || 'https://via.placeholder.com/360x180?text=Premio'}" alt="Imagen del premio" />
      <div class="content">
        <div>
          <h3>${event.title}</h3>
          <p>${event.description || 'Sin descripción'}</p>
          <p><strong>Fecha:</strong> ${formatDate(event.date)}</p>
          <p><strong>Estado:</strong> ${getEventStatusLabel(event)}</p>
          <p><strong>Participantes:</strong> ${participants.length}</p>
          <p><strong>Ganadores totales:</strong> ${event.winnersCount}</p>
          <p><strong>Ganadores seleccionados:</strong> ${winners.length}</p>
          <p><strong>Lista de participantes:</strong> ${participants.length ? participants.map(p => p.name).join(', ') : 'Ninguno'}</p>
          <p><strong>Lista de ganadores:</strong> ${winners.length ? winners.map(w => w.name).join(', ') : 'Ninguno'}</p>
        </div>
      </div>
    </div>
  `;

  elements.dashboardDetails.innerHTML = detailsHtml;
}

function renderProfile() {
  if (!state.currentUser) return;
  elements.profileName.value = state.currentUser.name;
  elements.profileEmail.value = state.currentUser.email;
  elements.profilePassword.value = '';
  renderProfilePhoto();
}

function saveProfile(event) {
  event.preventDefault();
  if (!state.currentUser) return;
  const name = elements.profileName.value.trim();
  const password = elements.profilePassword.value.trim();
  if (!name) {
    showToast('El nombre no puede quedar vacío');
    return;
  }
  state.currentUser.name = name;
  if (password) state.currentUser.password = password;
  saveUsers(state);
  renderTopActions();
  showToast('Perfil actualizado');
}

function handleProfilePhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const imageData = reader.result;
    state.currentUser.photo = imageData;
    renderProfilePhoto();
    saveUsers(state);
  };
  reader.readAsDataURL(file);
}

function renderProfilePhoto() {
  if (state.currentUser && state.currentUser.photo) {
    elements.profilePhotoPreview.style.backgroundImage = `url('${state.currentUser.photo}')`;
    elements.profilePhotoPreview.classList.remove('hidden');
  } else {
    elements.profilePhotoPreview.classList.add('hidden');
  }
}

function renderPaymentSummary() {
  const isAdmin = state.currentUser?.role === 'admin';
  elements.paymentSummaryTitle.textContent = isAdmin ? '💰 Ingresos' : '💳 Mis Pagos';

  if (!state.payments || state.payments.length === 0) {
    elements.paymentSummaryList.innerHTML = '<p>No hay pagos registrados aún.</p>';
    return;
  }

  if (isAdmin) {
    const eventRevenue = state.events
      .map(event => {
        const eventPayments = state.payments.filter(payment => payment.eventId === event.id);
        const total = eventPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
        return { event, total, count: eventPayments.length };
      })
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total);

    const totalRevenue = eventRevenue.reduce((sum, item) => sum + item.total, 0);

    if (eventRevenue.length === 0) {
      elements.paymentSummaryList.innerHTML = '<p>No hay ingresos registrados en ningún evento todavía.</p>';
      return;
    }

    const rows = eventRevenue
      .map(({ event, total, count }) => `
        <div class="card-item">
          <div class="content">
            <h3>${event.title}</h3>
            <p><strong>Participaciones:</strong> ${count}</p>
            <p><strong>Ingresos:</strong> S/ ${total}</p>
            <p><strong>Fecha:</strong> ${formatDate(event.date)}</p>
          </div>
        </div>
      `)
      .join('');

    elements.paymentSummaryList.innerHTML = `
      <div class="card-item">
        <div class="content">
          <h3>Resumen general</h3>
          <p><strong>Ingresos totales:</strong> S/ ${totalRevenue}</p>
          <p><strong>Rifas con ingresos:</strong> ${eventRevenue.length}</p>
        </div>
      </div>
      ${rows}
    `;
    return;
  }

  let paymentsToShow = state.payments.filter(p => p.userId === state.currentUser.id);

  if (paymentsToShow.length === 0) {
    elements.paymentSummaryList.innerHTML = '<p>No hay pagos registrados aún.</p>';
    return;
  }

  const rows = paymentsToShow
    .slice()
    .reverse()
    .map(payment => {
      const user = state.users.find(u => u.id === payment.userId);
      const event = state.events.find(e => e.id === payment.eventId);
      return `
        <div class="card-item">
          <div class="content">
            <h3>${event ? event.title : 'Evento eliminado'}</h3>
            <p><strong>Cliente:</strong> ${user ? user.name : 'Usuario desconocido'}</p>
            <p><strong>Método:</strong> ${payment.method.toUpperCase()}</p>
            <p><strong>Número:</strong> ${payment.number ?? 'Sin número'}</p>
            <p><strong>Monto:</strong> S/ ${payment.amount}</p>
            <p><strong>Fecha:</strong> ${formatDate(payment.date)}</p>
          </div>
        </div>
      `;
    })
    .join('');

  elements.paymentSummaryList.innerHTML = rows;
}

function ensureEventNumbers(event) {
  if (!event) return;
  if (!Array.isArray(event.numbers) || event.numbers.length === 0) {
    event.numbers = createNumberPool().map(number => ({ number, status: 'available', ownerId: null }));
  }
}

function renderClientEvents() {
  if (!state.currentUser) return;
  const filter = state.clientEventFilter;
  const filtered = state.events.filter(event => {
    const status = getEventStatus(event);
    return filter === 'all' || filter === status || (filter === 'past' && status === 'past');
  });

  if (filtered.length === 0) {
    elements.clientEventsList.innerHTML = '<p>No hay eventos para esta categoría.</p>';
    return;
  }

  elements.clientEventsList.innerHTML = filtered
    .map(event => {
      ensureEventNumbers(event);
      const status = getEventStatus(event);
      const availableNumbers = (event.numbers || []).filter(item => item.status === 'available').length;
      const hasPaid = state.payments.some(payment => payment.userId === state.currentUser.id && payment.eventId === event.id);
      const winners = state.users.filter(user => event.winners.includes(user.id));
      const actionButton = status === 'upcoming'
        ? hasPaid
          ? `<button class="small secondary" disabled>Pago S/10 recibido</button>`
          : `<button class="small" data-action="pay-event" data-id="${event.id}">Pagar S/10 para participar</button>`
        : '';

      return `
        <div class="card-item">
          <img src="${event.image || 'https://via.placeholder.com/360x180?text=Premio'}" alt="Imagen del premio" />
          <div class="content">
            <div>
              <h3>${event.title}</h3>
              <p>${event.description || 'Sin descripción'}</p>
              <p><strong>Fecha:</strong> ${formatDate(event.date)} • <span class="badge ${status}">${getEventStatusLabel(event)}</span></p>
              <p><strong>Participantes:</strong> ${event.participants.length}</p>
              <p><strong>Números disponibles:</strong> ${availableNumbers}/100</p>
              ${status === 'upcoming' ? '<p><strong>Costo:</strong> S/10 por participación</p>' : ''}
            </div>
            <div class="actions-row">
              ${actionButton}
            </div>
            ${status === 'completed' ? `<p><strong>Ganadores:</strong> ${winners.length ? winners.map(w => w.name).join(', ') : 'Ninguno'}</p>` : ''}
          </div>
        </div>
      `;
    })
    .join('');

  elements.clientEventsList.querySelectorAll('button').forEach(button => {
    const id = button.dataset.id;
    const action = button.dataset.action;
    if (action === 'pay-event') {
      button.addEventListener('click', () => showPaymentForEvent(id));
    }
  });
}

function renderNumberSelector(event) {
  ensureEventNumbers(event);
  const selectedNumber = Number(elements.paymentSection.dataset.selectedNumber || 0);
  const numbers = event.numbers || [];

  elements.paymentNumberSelector.innerHTML = `
    <div style="margin: 12px 0 8px; color: var(--silver); font-weight: 600;">
      Elige un número disponible para esta rifa
    </div>
    <div class="number-grid">
      ${numbers.map(item => {
        const isSelected = selectedNumber === item.number;
        const isDisabled = item.status !== 'available';
        return `<button
          type="button"
          class="number-btn ${isSelected ? 'selected' : ''}"
          data-number="${item.number}"
          ${isDisabled ? 'disabled' : ''}
        >${item.number}</button>`;
      }).join('')}
    </div>
  `;

  elements.paymentNumberSelector.querySelectorAll('.number-btn').forEach(button => {
    button.addEventListener('click', () => {
      const nextNumber = Number(button.dataset.number);
      elements.paymentSection.dataset.selectedNumber = nextNumber;
      renderNumberSelector(event);
    });
  });
}

function showPaymentForEvent(eventId) {
  const event = state.events.find(entry => entry.id === eventId);
  if (!event) return;
  ensureEventNumbers(event);
  delete elements.paymentSection.dataset.selectedNumber;
  elements.paymentSection.classList.remove('hidden');
  elements.paymentQrDisplay.innerHTML = `<div style="text-align:center; color: var(--muted);">Selecciona Yape o Plin para ver el QR de pago.</div>`;
  elements.paymentTitle.textContent = `Pago S/10 para participar en ${event.title}`;
  elements.paymentSection.dataset.eventId = eventId;
  renderNumberSelector(event);
}

function showPaymentMethod(method) {
  const eventId = elements.paymentSection.dataset.eventId;
  const event = state.events.find(entry => entry.id === eventId);
  if (!event) {
    showToast('Evento no encontrado');
    return;
  }

  ensureEventNumbers(event);
  const selectedNumber = Number(elements.paymentSection.dataset.selectedNumber || 0);
  if (!selectedNumber || !event.numbers.some(item => item.number === selectedNumber && item.status === 'available')) {
    showToast('Debes elegir un número disponible antes de pagar');
    return;
  }

  const userId = state.currentUser?.id;
  const amount = APP_CONFIG.paymentAmount;
  const qrInfo = method === 'yape' ? 'DEMO-YAPE-RIFAPRO' : 'DEMO-PLIN-RIFAPRO';

  elements.paymentQrDisplay.innerHTML = `
    <div class="qr-container">
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrInfo)}" alt="QR ${method}" class="qr-image" />
      <div class="qr-info">
        <p class="qr-method">💳 ${method.toUpperCase()}</p>
        <p class="qr-number">Código de demostración</p>
        <p class="qr-amount">Monto: <strong>S/ ${amount}</strong></p>
        <p class="qr-instruction">N° elegido: <strong>${selectedNumber}</strong> • Simulación de pago para demostración de portafolio</p>
      </div>
      <button id="confirmPaymentBtn" class="confirm-btn">Confirmar pago</button>
    </div>
  `;

  document.getElementById('confirmPaymentBtn').addEventListener('click', () => {
    if (!userId) {
      showToast('Error: usuario no identificado');
      return;
    }

    const reserved = reserveNumberForEvent(event, selectedNumber, userId);
    if (!reserved) {
      showToast('El número seleccionado ya no está disponible');
      return;
    }

    const paymentId = `payment-${Date.now()}`;
    const paymentDate = new Date().toISOString();

    state.payments.push({
      id: paymentId,
      eventId: event.id,
      userId,
      method,
      amount,
      number: selectedNumber,
      date: paymentDate,
    });

    if (!event.participants.includes(userId)) {
      event.participants.push(userId);
    }

    savePayments(state);
    saveEvents(state);
    renderDashboard();
    renderPaymentSummary();
    renderClientEvents();
    elements.paymentSection.classList.add('hidden');
    showReceipt(paymentId, event, method, amount, paymentDate, selectedNumber);
    showToast(`🎉 Pago registrado con el número ${selectedNumber}`);
  });
}

function showReceipt(paymentId, event, method, amount, paymentDate, selectedNumber = null) {
  const user = state.currentUser;
  const receiptHTML = generateReceiptHTML(paymentId, event, user, method, amount, paymentDate, selectedNumber);
  
  elements.receiptContent.innerHTML = receiptHTML;
  elements.receiptModal.classList.remove('hidden');

  // Listener para descargar PDF
  elements.downloadPdfBtn.onclick = () => {
    const element = document.getElementById('receiptContentForPdf');
    const opt = {
      margin: 10,
      filename: `comprobante-${paymentId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    html2pdf().set(opt).from(element).save();
  };
}

function generateReceiptHTML(paymentId, event, user, method, amount, paymentDate, selectedNumber = null) {
  const formattedDate = new Date(paymentDate).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${paymentId}-${method}`)}`;

  return `
    <div id="receiptContentForPdf" style="background: #fff; padding: 30px; color: #000; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #081028; padding-bottom: 20px;">
        <h1 style="margin: 0; color: #081028; font-size: 28px;">COMPROBANTE DE PAGO</h1>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">App de Rifas</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #081028; font-size: 14px; text-transform: uppercase;">Datos del Pago</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold; color: #081028; width: 40%;">N° de Comprobante:</td>
            <td style="padding: 8px; color: #333;">${paymentId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold; color: #081028;">Fecha:</td>
            <td style="padding: 8px; color: #333;">${formattedDate}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold; color: #081028;">Método de Pago:</td>
            <td style="padding: 8px; color: #333;">${method.toUpperCase()}</td>
          </tr>
          ${selectedNumber !== null ? `<tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold; color: #081028;">Número Elegido:</td>
            <td style="padding: 8px; color: #333;">${selectedNumber}</td>
          </tr>` : ''}
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #081028; font-size: 14px; text-transform: uppercase;">Cliente</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold; color: #081028; width: 40%;">Nombre:</td>
            <td style="padding: 8px; color: #333;">${user.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold; color: #081028;">Correo:</td>
            <td style="padding: 8px; color: #333;">${user.email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold; color: #081028;">DNI:</td>
            <td style="padding: 8px; color: #333;">${user.dni || 'No registrado'}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #081028; font-size: 14px; text-transform: uppercase;">Evento</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold; color: #081028; width: 40%;">Rifa:</td>
            <td style="padding: 8px; color: #333;">${event.title}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold; color: #081028;">Descripción:</td>
            <td style="padding: 8px; color: #333;">${event.description || 'Sin descripción'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold; color: #081028;">Fecha del Evento:</td>
            <td style="padding: 8px; color: #333;">${new Date(event.date).toLocaleDateString('es-PE')}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #081028; font-size: 14px; text-transform: uppercase;">Monto</h3>
        <div style="text-align: center; padding: 15px; background: #f0f4f8; border-radius: 5px;">
          <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">Monto Total</p>
          <h2 style="margin: 0; color: #081028; font-size: 32px;">S/ ${amount}.00</h2>
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${qrImageUrl}" alt="QR de confirmación" style="width: 150px; height: 150px; border: 2px solid #081028; padding: 10px;">
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Código de verificación</p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 2px solid #ddd;">
        <p style="margin: 5px 0; font-size: 12px; color: #666;">✓ Pago de demostración registrado</p>
        <p style="margin: 5px 0 0 0; font-size: 10px; color: #999;">Comprobante generado únicamente como demostración del proyecto.</p>
      </div>
    </div>
  `;
}

function scrollEvents(direction) {
  const wrapper = elements.clientEventsList;
  const scrollAmount = wrapper.clientWidth * 0.9;
  wrapper.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

function authSubmit(event) {
  event.preventDefault();
  const email = elements.authEmail.value.trim().toLowerCase();
  const password = elements.authPassword.value.trim();
  if (!email || !password) {
    showToast('Completa correo y contraseña');
    return;
  }

  if (state.authMode === 'login') {
    const user = state.users.find(u => u.email === email && u.password === password);
    if (!user) {
      showToast('Correo o contraseña incorrectos');
      return;
    }
    state.currentUser = user;
    saveSession(state);
    renderApp();
    showToast(`Bienvenido ${user.name}`);
    return;
  }

  const name = elements.authName.value.trim();
  if (!name) {
    showToast('Ingresa tu nombre completo');
    return;
  }

  if (state.users.some(user => user.email === email)) {
    showToast('Ya existe una cuenta con ese correo');
    return;
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password,
    role: 'client',
    createdAt: new Date().toISOString(),
  };
  state.users.push(newUser);
  saveUsers(state);
  state.currentUser = newUser;
  saveSession(state);
  renderApp();
  showToast('Registro completado. Bienvenido.');
}

function toggleAuthMode() {
  state.authMode = state.authMode === 'login' ? 'register' : 'login';
  updateAuthModeUI();
}

function setFilterListeners() {
  elements.adminEventFilters.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    state.adminEventFilter = button.dataset.filter;
    setActiveTab(elements.adminEventFilters, state.adminEventFilter);
    renderAdminEvents();
  });

  elements.clientEventFilters.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    state.clientEventFilter = button.dataset.filter;
    setActiveTab(elements.clientEventFilters, state.clientEventFilter);
    renderClientEvents();
  });
}

function updateAuthModeUI() {
  const isLogin = state.authMode === 'login';
  elements.authModeText.textContent = isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?';
  elements.authModeToggle.textContent = isLogin ? 'Registrarse' : 'Iniciar sesión';
  elements.authModeToggle.classList.toggle('secondary', true);
  elements.authNameField.classList.toggle('hidden', isLogin);
  elements.authSubmitBtn.textContent = isLogin ? 'Entrar' : 'Registrarse';
  elements.authModeTitle.textContent = isLogin ? 'Iniciar sesión' : 'Registro cliente';
  elements.authHint.textContent = isLogin
    ? 'Inicia sesión con tu cuenta o crea una nueva cuenta de cliente.'
    : 'Regístrate como cliente y comienza a participar en rifas';
}

function renderApp() {
  renderTopActions();
  const isAuthenticated = Boolean(state.currentUser);
  elements.authSection.classList.toggle('hidden', isAuthenticated);

  const showAdmin = isAuthenticated && state.currentUser.role === 'admin';
  const showClient = isAuthenticated && state.currentUser.role === 'client';

  if (!isAuthenticated) {
    elements.sidebarNav.classList.add('hidden');
    state.activeSection = null;
    updateAuthModeUI();
    return;
  }

  if (!state.activeSection) {
    state.activeSection = showAdmin ? 'dashboard' : 'profile';
  }

  Object.values({
    dashboard: elements.dashboardSection,
    paymentSummary: elements.paymentSummarySection,
    adminClients: elements.adminClientsSection,
    adminEvents: elements.adminEventsSection,
    clientProfile: elements.clientProfileSection,
    clientEvents: elements.clientEventsSection,
  }).forEach(section => section.classList.add('hidden'));

  renderSidebarNav();

  if (showAdmin) {
    setSidebarSection(state.activeSection || 'dashboard');
    renderDashboard();
    renderPaymentSummary();
    renderClientList();
    renderAdminEvents();
    return;
  }

  if (showClient) {
    setSidebarSection(state.activeSection || 'profile');
    renderPaymentSummary();
    renderProfile();
    renderClientEvents();
  }
}

function bindEvents() {
  elements.authForm.addEventListener('submit', authSubmit);
  elements.authModeToggle.addEventListener('click', toggleAuthMode);
  elements.clientForm.addEventListener('submit', saveClient);
  elements.cancelClientEditBtn.addEventListener('click', resetClientForm);
  elements.eventForm.addEventListener('submit', saveEvent);
  elements.cancelEventEditBtn.addEventListener('click', resetEventForm);
  elements.saveProfileBtn.addEventListener('click', saveProfile);
  elements.profilePhoto.addEventListener('change', handleProfilePhoto);
  elements.clientEventsPrevBtn.addEventListener('click', () => scrollEvents(-1));
  elements.clientEventsNextBtn.addEventListener('click', () => scrollEvents(1));
  elements.closePaymentBtn.addEventListener('click', () => elements.paymentSection.classList.add('hidden'));
  elements.closeReceiptBtn.addEventListener('click', () => elements.receiptModal.classList.add('hidden'));
  elements.closeReceiptBtnBottom.addEventListener('click', () => elements.receiptModal.classList.add('hidden'));
  elements.paymentSection.querySelectorAll('[data-method]').forEach(button => {
    button.addEventListener('click', () => showPaymentMethod(button.dataset.method));
  });
  elements.clientSearch.addEventListener('input', event => {
    state.clientSearchTerm = event.target.value;
    renderClientList();
  });
  setFilterListeners();
}

function ensureDefaultAdmin() {
  const adminEmail = APP_CONFIG.defaultAdmin.email.toLowerCase();

  const adminExists = state.users.some(
    user => user.email?.toLowerCase() === adminEmail
  );

  if (!adminExists) {
    state.users.push({
      id: 'admin-default',
      ...APP_CONFIG.defaultAdmin,
      createdAt: new Date().toISOString()
    });

    saveUsers(state);
  }
}

function initialize() {
  loadAppState(state);
  ensureDefaultAdmin();
  bindEvents();
  renderApp();
}

initialize();

