import type {
  GiftBooking,
  GiftCategory,
  Guest,
  MusicWish,
  WeddingGift,
} from "../shared/wedding-types";

const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const ADMIN_TOKEN_KEY = "wedding_admin_token";

function getToken() {
  return window.localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export function persistAdminToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function readAdminToken() {
  return getToken();
}

export async function loginAdmin(password: string) {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Не удалось войти");
  }

  return result.token as string;
}

export async function fetchAdminBootstrap(): Promise<{
  guests: Guest[];
  categories: GiftCategory[];
  gifts: WeddingGift[];
  bookings: GiftBooking[];
  wishes: MusicWish[];
}> {
  const response = await fetch(`${API_URL}/admin/bootstrap`, {
    headers: getHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Не удалось загрузить данные");
  }

  return result;
}

export async function createGuest(payload: Omit<Guest, "id" | "createdAt">) {
  const response = await fetch(`${API_URL}/admin/guests`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Не удалось создать гостя");
  }

  return result.guest as Guest;
}

export async function updateGuest(id: string, payload: Omit<Guest, "id" | "createdAt">) {
  const response = await fetch(`${API_URL}/admin/guests/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Не удалось обновить гостя");
  }

  return result.guest as Guest;
}

export async function deleteGuest(id: string) {
  const response = await fetch(`${API_URL}/admin/guests/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Не удалось удалить гостя");
  }

  return result;
}

export async function createCategory(payload: {
  id?: string;
  name: string;
  description: string;
  sortOrder: number;
}) {
  const response = await fetch(`${API_URL}/admin/categories`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Не удалось создать категорию");
  }

  return result.category as GiftCategory;
}

export async function updateCategory(id: string, payload: {
  name: string;
  description: string;
  sortOrder: number;
}) {
  const response = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Не удалось обновить категорию");
  }

  return result.category as GiftCategory;
}

export async function deleteCategory(id: string) {
  const response = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Не удалось удалить категорию");
  }

  return result;
}

export async function createGift(payload: Omit<WeddingGift, "id" | "categoryName" | "categoryDescription">) {
  const response = await fetch(`${API_URL}/admin/gifts`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Не удалось создать подарок");
  }

  return result.gift as WeddingGift;
}

export async function updateGift(
  id: number,
  payload: Omit<WeddingGift, "id" | "categoryName" | "categoryDescription">,
) {
  const response = await fetch(`${API_URL}/admin/gifts/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Не удалось обновить подарок");
  }

  return result.gift as WeddingGift;
}

export async function deleteGift(id: number) {
  const response = await fetch(`${API_URL}/admin/gifts/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Не удалось удалить подарок");
  }

  return result;
}
