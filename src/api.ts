export const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://abdo238923.pythonanywhere.com/api";
export async function fetchProperties() {
  const res = await fetch(`${API_BASE}/properties/`);
  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json();
}

export async function fetchProperty(id: string) {
  const res = await fetch(`${API_BASE}/properties/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch property");
  return res.json();
}

export async function fetchAreas() {
  const res = await fetch(`${API_BASE}/areas/`);
  if (!res.ok) throw new Error("Failed to fetch areas");
  return res.json();
}
