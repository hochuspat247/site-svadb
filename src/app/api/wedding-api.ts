import { fixMojibakeText } from "../shared/fix-encoding";
import type {
  GiftBooking,
  GiftCategory,
  Guest,
  MusicWish,
  SiteSection,
  WeddingGift,
} from "../shared/wedding-types";

function normalizeGuest(guest: Guest): Guest {
  return {
    ...guest,
    name: fixMojibakeText(guest.name),
    side: fixMojibakeText(guest.side),
    phone: fixMojibakeText(guest.phone),
    email: fixMojibakeText(guest.email),
    attendanceLabel: fixMojibakeText(guest.attendanceLabel),
    guestNames: fixMojibakeText(guest.guestNames),
    drink: fixMojibakeText(guest.drink),
    allergy: fixMojibakeText(guest.allergy),
  };
}

const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = 8000,
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function registerGuest(data: {
  name: string;
  side: string;
  phone?: string;
  email?: string;
  willAttend: boolean;
  attendanceLabel: string;
  guestsCount: number;
  guestNames?: string;
  drink?: string;
  allergy?: string;
  photo?: string;
}): Promise<{ success: boolean; guest?: Guest; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Registration error:", result);
      return { success: false, error: result.error || "Failed to register" };
    }

    return result;
  } catch (error) {
    console.error("Network error during registration:", error);
    return { success: false, error: "Network error" };
  }
}

export async function fetchGuests(): Promise<Guest[]> {
  try {
    const response = await fetch(`${API_URL}/guests?ts=${Date.now()}`, {
      cache: "no-store",
    });
    const result = await response.json();

    if (!response.ok) {
      console.error("Error fetching guests:", result);
      return [];
    }

    return (result.guests || []).map((guest: Guest) => normalizeGuest(guest));
  } catch (error) {
    console.error("Network error fetching guests:", error);
    return [];
  }
}

export async function fetchGiftCatalog(): Promise<{
  categories: GiftCategory[];
  gifts: WeddingGift[];
}> {
  try {
    const response = await fetch(`${API_URL}/gifts?ts=${Date.now()}`, {
      cache: "no-store",
    });
    const result = await response.json();

    if (!response.ok) {
      console.error("Error fetching gifts:", result);
      return { categories: [], gifts: [] };
    }

    return {
      categories: result.categories || [],
      gifts: result.gifts || [],
    };
  } catch (error) {
    console.error("Network error fetching gifts:", error);
    return { categories: [], gifts: [] };
  }
}

export async function fetchSiteSections(): Promise<SiteSection[]> {
  try {
    const response = await fetchWithTimeout(`${API_URL}/site-builder?ts=${Date.now()}`, {
      cache: "no-store",
    });
    const result = await response.json();

    if (!response.ok) {
      console.error("Error fetching site sections:", result);
      return [];
    }

    return result.sections || [];
  } catch (error) {
    console.error("Network error fetching site sections:", error);
    return [];
  }
}

export async function bookGift(data: {
  giftId: number;
  guestId: string;
  guestName: string;
  selectedCountry?: string;
  contributionAmount?: number | null;
}): Promise<{ success: boolean; booking?: GiftBooking; error?: string; bookedBy?: string }> {
  try {
    const response = await fetch(`${API_URL}/gift/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Gift booking error:", result);
      return { success: false, error: result.error, bookedBy: result.bookedBy };
    }

    return result;
  } catch (error) {
    console.error("Network error during gift booking:", error);
    return { success: false, error: "Network error" };
  }
}

export async function fetchGiftBookings(): Promise<GiftBooking[]> {
  try {
    const response = await fetch(`${API_URL}/gift-bookings?ts=${Date.now()}`, {
      cache: "no-store",
    });
    const result = await response.json();

    if (!response.ok) {
      console.error("Error fetching gift bookings:", result);
      return [];
    }

    return result.bookings || [];
  } catch (error) {
    console.error("Network error fetching gift bookings:", error);
    return [];
  }
}

export async function addMusicWish(data: {
  song: string;
  guestName?: string;
  guestId?: string;
}): Promise<{ success: boolean; musicWish?: MusicWish; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/music`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Music wish error:", result);
      return { success: false, error: result.error || "Failed to add music wish" };
    }

    return result;
  } catch (error) {
    console.error("Network error adding music wish:", error);
    return { success: false, error: "Network error" };
  }
}

export async function fetchMusicWishes(): Promise<MusicWish[]> {
  try {
    const response = await fetch(`${API_URL}/music?ts=${Date.now()}`, {
      cache: "no-store",
    });
    const result = await response.json();

    if (!response.ok) {
      console.error("Error fetching music wishes:", result);
      return [];
    }

    return result.wishes || [];
  } catch (error) {
    console.error("Network error fetching music wishes:", error);
    return [];
  }
}
