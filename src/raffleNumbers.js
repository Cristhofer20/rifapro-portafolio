export function createNumberPool() {
  return Array.from({ length: 100 }, (_, index) => index + 1);
}

export function getNumberStatusLabel(status) {
  const labels = {
    available: 'Disponible',
    sold: 'Vendido',
    blocked: 'Bloqueado',
  };

  return labels[status] || 'Disponible';
}

export function nextNumberStatus(status) {
  const cycle = ['available', 'sold', 'blocked'];
  const index = cycle.indexOf(status);

  if (index === -1) return 'available';
  return cycle[(index + 1) % cycle.length];
}

export function isNumberAvailable(event, number) {
  const numbers = event.numbers || [];
  const selected = numbers.find(item => item.number === Number(number));
  return !selected || selected.status === 'available';
}

export function reserveNumberForEvent(event, number, ownerId) {
  if (!event) return false;

  const normalizedNumber = Number(number);
  if (!Number.isInteger(normalizedNumber) || normalizedNumber < 1 || normalizedNumber > 100) {
    return false;
  }

  const numbers = event.numbers || [];
  const selected = numbers.find(item => item.number === normalizedNumber);

  if (!selected || selected.status !== 'available') {
    return false;
  }

  selected.status = 'sold';
  selected.ownerId = ownerId;
  return true;
}

export function resetNumbersForEvent(event) {
  if (!event || !Array.isArray(event.numbers)) return;

  event.numbers = event.numbers.map(item => ({
    ...item,
    status: 'available',
    ownerId: null,
  }));
}
