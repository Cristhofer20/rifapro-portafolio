export function formatDate(dateString) {
  const date = new Date(dateString);
  return isNaN(date) ? '-' : date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getEventStatus(event) {
  if (event.status === 'completed') return 'completed';
  const eventDate = new Date(event.date);
  const now = new Date();
  if (eventDate >= new Date(now.toDateString())) return 'upcoming';
  return 'past';
}

export function getEventStatusLabel(event) {
  const status = getEventStatus(event);
  if (status === 'upcoming') return 'Próxima';
  if (status === 'completed') return 'Realizada';
  return 'Anterior';
}

export function setActiveTab(tabContainer, filter) {
  const buttons = Array.from(tabContainer.querySelectorAll('button'));
  buttons.forEach(button => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
}
