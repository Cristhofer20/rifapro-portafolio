// ========================================
// SCROLL AUTOMÁTICO - RifaPro
// ========================================
// Este módulo maneja el scroll automático cuando se hace click en editar

export function initAutoScroll() {
  // Hacer scroll suave en toda la página
  document.documentElement.classList.add('scroll-to-section');
  
  // Mapeo de secciones editables
  const editSections = {
    // Clientes
    'editClientBtn': '#adminClientsSection',
    'editProfileBtn': '#clientProfileSection',
    
    // Eventos
    'editEventBtn': '#adminEventsSection',
    'createEventBtn': '#adminEventsSection',
    
    // Pagos
    'paymentBtn': '#paymentSection',
    
    // Autenticación
    'authModeToggle': '#authSection'
  };

  // Iterar sobre todos los botones de edición
  Object.entries(editSections).forEach(([buttonId, sectionId]) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', (e) => {
        // Pequeño retraso para permitir que se actualice el DOM
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 100);
      });
    }
  });

  // También detectar clics en botones de editar que tienen data-edit-target
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn') || 
        e.target.classList.contains('edit-client-btn') ||
        e.target.classList.contains('edit-event-btn')) {
      
      const targetSection = e.target.getAttribute('data-edit-target');
      if (targetSection) {
        setTimeout(() => {
          scrollToSection(targetSection);
        }, 100);
      }
    }
  });
}

/**
 * Hace scroll a una sección específica con animación
 * @param {string} sectionSelector - Selector CSS de la sección
 */
export function scrollToSection(sectionSelector) {
  const section = document.querySelector(sectionSelector);
  
  if (!section) {
    console.warn(`Sección no encontrada: ${sectionSelector}`);
    return;
  }

  // Scroll suave a la sección
  section.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  // Agregar animación de highlight
  addHighlightAnimation(section);
}

/**
 * Agrega animación de highlight a una sección
 * @param {HTMLElement} element - Elemento a destacar
 */
function addHighlightAnimation(element) {
  // Remover clase si ya existe
  element.classList.remove('scroll-highlight');
  
  // Forzar reflow para reiniciar la animación
  void element.offsetWidth;
  
  // Agregar clase
  element.classList.add('scroll-highlight');
  
  // Remover clase después de la animación
  setTimeout(() => {
    element.classList.remove('scroll-highlight');
  }, 1500);
}

/**
 * Scroll a una sección con offset personalizado
 * @param {string} sectionSelector - Selector CSS de la sección
 * @param {number} offset - Offset en píxeles
 */
export function scrollToSectionWithOffset(sectionSelector, offset = 80) {
  const section = document.querySelector(sectionSelector);
  
  if (!section) {
    console.warn(`Sección no encontrada: ${sectionSelector}`);
    return;
  }

  const topPosition = section.getBoundingClientRect().top + window.scrollY - offset;
  
  window.scrollTo({
    top: topPosition,
    behavior: 'smooth'
  });

  addHighlightAnimation(section);
}

/**
 * Detecta cambios de form y hace scroll si hay errores
 * @param {HTMLFormElement} form - Formulario a monitorear
 */
export function scrollOnFormError(form) {
  form.addEventListener('submit', (e) => {
    // Buscar el primer input inválido
    const invalidInput = form.querySelector(':invalid');
    
    if (invalidInput) {
      e.preventDefault();
      
      invalidInput.focus();
      invalidInput.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      
      // Agregar clase de error visual
      invalidInput.classList.add('input-error');
      setTimeout(() => {
        invalidInput.classList.remove('input-error');
      }, 3000);
    }
  });
}

export default {
  initAutoScroll,
  scrollToSection,
  scrollToSectionWithOffset,
  scrollOnFormError
};
