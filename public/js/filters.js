/**
 * Lógica de filtrado combinado del catálogo (RF-08): texto libre, categoría,
 * fecha y momento temporal respecto a la hora actual.
 */

function computeMomento(activity) {
  const now = new Date();
  const storedDate = new Date(activity.date);
  const [hours, minutes] = (activity.time || '00:00').split(':').map(Number);
  // Se reconstruye en hora local a partir de los componentes UTC almacenados,
  // para no correr de día al comparar con la hora actual del navegador.
  const activityDate = new Date(
    storedDate.getUTCFullYear(),
    storedDate.getUTCMonth(),
    storedDate.getUTCDate(),
    hours || 0,
    minutes || 0
  );

  const isSameDay = activityDate.toDateString() === now.toDateString();

  if (isSameDay && activityDate <= now) return 'en_proceso';
  if (activityDate > now) return 'futuro';
  return 'pasado';
}

/**
 * @param {Array} activities
 * @param {{ search: string, category: string, date: string, momento: string }} filters
 */
function filterActivities(activities, filters) {
  const { search = '', category = 'Todas', date = 'Todas', momento = 'Todos' } = filters;
  const searchLower = search.trim().toLowerCase();

  return activities.filter((activity) => {
    if (searchLower) {
      const matchesText =
        activity.name.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower);
      if (!matchesText) return false;
    }

    if (category !== 'Todas' && activity.category !== category) return false;

    if (date !== 'Todas') {
      const activityDateStr = new Date(activity.date).toISOString().slice(0, 10);
      if (activityDateStr !== date) return false;
    }

    if (momento !== 'Todos' && computeMomento(activity) !== momento) return false;

    return true;
  });
}
