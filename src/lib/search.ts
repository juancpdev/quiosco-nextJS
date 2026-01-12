// Función para normalizar texto (quitar acentos y pasar a minúscula)
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Filtrado genérico de arrays por campos
export function filterBySearch<T>(
  items: T[],
  search: string,
  fields: (item: T) => string[]
): T[] {
  const normalizedSearch = normalizeText(search);

  return items.filter((item) =>
    fields(item).some((field) =>
      normalizeText(field).includes(normalizedSearch)
    )
  );
}
