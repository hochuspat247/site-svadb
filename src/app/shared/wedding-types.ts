export type GiftBookingMode = "single" | "multiple" | "travel";

export interface TravelOption {
  label: string;
  value: string;
}

export interface GiftCategory {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
}

export interface WeddingGift {
  id: number;
  name: string;
  hint: string;
  iconKey: string;
  priceLabel: string;
  categoryId: string;
  categoryName?: string;
  categoryDescription?: string;
  featured: boolean;
  link: string;
  bookingMode: GiftBookingMode;
  specialCode: string;
  suggestedAmount: number | null;
  conditionsText: string;
  travelOptions: TravelOption[];
  isActive: boolean;
  sortOrder: number;
}

export interface Guest {
  id: string;
  name: string;
  side: string;
  phone: string;
  email: string;
  willAttend: boolean;
  attendanceLabel: string;
  guestsCount: number;
  guestNames: string;
  drink: string;
  allergy: string;
  photo: string | null;
  createdAt: string;
}

export interface GiftBooking {
  id?: string;
  giftId: number;
  guestId: string;
  guestName: string;
  selectedCountry?: string | null;
  contributionAmount?: number | null;
  giftBookingMode?: GiftBookingMode;
  bookedAt: string;
}

export interface MusicWish {
  id: string;
  song: string;
  guestId?: string | null;
  guestName: string;
  createdAt: string;
}
