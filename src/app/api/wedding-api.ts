import type {
  GiftBooking,
  GiftCategory,
  Guest,
  MusicWish,
  WeddingGift,
} from "../shared/wedding-types";

const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

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
    const response = await fetch(`${API_URL}/guests`);
    const result = await response.json();

    if (!response.ok) {
      console.error("Error fetching guests:", result);
      return [];
    }

    return result.guests || [];
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
    const response = await fetch(`${API_URL}/gifts`);
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
    const response = await fetch(`${API_URL}/gift-bookings`);
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
    const response = await fetch(`${API_URL}/music`);
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
