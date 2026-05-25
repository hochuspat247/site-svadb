import React, { useEffect, useMemo, useState } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Heart, Gift, Utensils, Cake, Sparkles, MapPin, Calendar, Upload, Check, Plane, BedDouble, Coffee, UtensilsCrossed, ChefHat, Wine, ArrowUpRight, ArrowRight, Users, Camera, Compass, Home, Car, Sofa, Tv, Music, Gamepad2, Package, BookHeart, Palette, HelpCircle, ListMusic, ImageIcon, Smartphone, Mouse, Battery, ShoppingBag, Wrench, Monitor, Ticket, Mountain, CircleDollarSign, Dumbbell, Store, Globe, Wallet, Palette as PaletteIcon, Box, Bike, X } from "lucide-react";
import {
  registerGuest,
  fetchGiftCatalog,
  fetchGuests,
  bookGift,
  fetchGiftBookings,
  addMusicWish,
  fetchMusicWishes,
  fetchSiteSections,
} from "./api/wedding-api";
import { defaultSiteSections } from "./data/site-builder-defaults.js";
import { getGiftIconByKey } from "./shared/gift-icons";
import {
  buildSiteContentMap,
  mergeSiteSections,
  getDressColors,
  getFaqItems,
  getScheduleItems,
  getActiveSectionByType,
  getSection,
  getStorySlides,
  isSectionActive,
  sectionSettings,
} from "./shared/site-content";
import { fixMojibakeText } from "./shared/fix-encoding";
import { resolveSiteImage } from "./shared/site-photos";
import type {
  GiftBooking,
  GiftCategory,
  Guest,
  MusicWish,
  SiteSection,
  TravelOption,
  WeddingGift,
} from "./shared/wedding-types";
import photo01 from "../assets/photos/photo_2026-05-22_13-58-55.jpg";
import photo02 from "../assets/photos/photo_2026-05-22_13-59-02.jpg";
import photo03 from "../assets/photos/photo_2026-05-22_13-59-06.jpg";
import photo04 from "../assets/photos/photo_2026-05-22_13-59-10.jpg";
import photo05 from "../assets/photos/photo_2026-05-22_13-59-15.jpg";
import photo06 from "../assets/photos/photo_2026-05-22_13-59-18.jpg";
import photo07 from "../assets/photos/photo_2026-05-22_13-59-22.jpg";
import photo08 from "../assets/photos/photo_2026-05-22_13-59-25.jpg";
import photo09 from "../assets/photos/photo_2026-05-22_13-59-29.jpg";
import photo10 from "../assets/photos/photo_2026-05-22_13-59-32.jpg";
import photo11 from "../assets/photos/photo_2026-05-22_13-59-36.jpg";
import photo12 from "../assets/photos/photo_2026-05-22_13-59-40.jpg";
import photo13 from "../assets/photos/photo_2026-05-22_13-59-44.jpg";
import photo14 from "../assets/photos/photo_2026-05-22_13-59-47.jpg";
import photo15 from "../assets/photos/photo_2026-05-22_13-59-50.jpg";
import photo16 from "../assets/photos/photo_2026-05-22_13-59-54.jpg";
import photo17 from "../assets/photos/photo_2026-05-22_14-00-00.jpg";
import photo18 from "../assets/photos/photo_2026-05-22_14-00-04.jpg";

const CORAL = "#E85A4F";
const CORAL_DARK = "#D14A40";
const PINK = "#F4B6BE";
const PINK_LIGHT = "#FBD3D8";
const INK = "#1a1a1a";

const font = { fontFamily: "'Manrope', sans-serif" };

function Flower({ size = 200, color = PINK, className = "", rotate = 0, style = {} }: any) {
  return (
    <svg
      viewBox="-100 -100 200 200"
      width={size}
      height={size}
      className={className}
      style={{
        transform: `rotate(${rotate}deg)`,
        animation: 'slowSpin 40s linear infinite',
        ...style
      }}
      aria-hidden
    >
      <style>{`
        @keyframes slowSpin {
          from { transform: rotate(${rotate}deg); }
          to { transform: rotate(${rotate + 360}deg); }
        }
      `}</style>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-45" rx="32" ry="55" fill={color} transform={`rotate(${a})`} />
      ))}
      <circle cx="0" cy="0" r="20" fill={color} />
    </svg>
  );
}

function ScallopedBottom({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="block w-full" style={{ height: "24px" }}>
      <path
        d="M0,0 L400,0 L400,8 C390,24 380,8 370,16 C360,24 350,8 340,16 C330,24 320,8 310,16 C300,24 290,8 280,16 C270,24 260,8 250,16 C240,24 230,8 220,16 C210,24 200,8 190,16 C180,24 170,8 160,16 C150,24 140,8 130,16 C120,24 110,8 100,16 C90,24 80,8 70,16 C60,24 50,8 40,16 C30,24 20,8 10,16 C5,20 0,12 0,8 Z"
        fill={color}
      />
    </svg>
  );
}

// Примеры гостей (замените на реальных после регистрации)
const GROOM_GUESTS = [
  // { name: "Дмитрий Орлов", role: "Свидетель" },
];

const BRIDE_GUESTS = [
  // { name: "Екатерина Лебедева", role: "Свидетельница" },
];

const AVATAR_COLORS = ["#F4B6BE", "#FBD3D8", "#F4E1D2", "#D9A89A", "#FFC4B0", "#FFE0DC"];

function initials(name: string) {
  return name
    .split(/[\s&ё]+/i)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function GuestAvatar({ name, idx, isYou = false, photo }: { name: string; idx: number; isYou?: boolean; photo?: string | null }) {
  const displayName = fixMojibakeText(name);
  const bg = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  return (
    <div
      className="flex flex-col items-center gap-1.5 sm:gap-2 group"
      style={{
        animation: `fadeInScale 0.6s ease-out ${idx * 0.1}s both`
      }}
    >
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
      <div className="relative">
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 overflow-hidden"
          style={{
            background: photo ? "transparent" : (isYou ? "#E85A4F" : bg),
            color: isYou ? "white" : "#1a1a1a",
            fontWeight: 800,
            fontSize: "clamp(14px, 3vw, 18px)",
            letterSpacing: "-0.02em",
            border: isYou ? "3px solid white" : "2px solid white",
            boxShadow: isYou ? "0 6px 20px rgba(232,90,79,0.4)" : "0 4px 14px rgba(0,0,0,0.08)",
          }}
        >
          {photo ? (
            <img src={photo} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            initials(displayName)
          )}
        </div>
        {isYou && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 sm:px-2 py-0.5 rounded-full" style={{ background: "#1a1a1a", color: "white", fontSize: 8, fontWeight: 800, letterSpacing: "0.08em" }}>
            Вы
          </div>
        )}
      </div>
      <div className="w-full min-w-0 px-1 text-center">
        <div
          className="break-words"
          style={{ fontWeight: 700, fontSize: "clamp(10px, 2.5vw, 12px)", lineHeight: 1.25, wordBreak: "break-word" }}
        >
          {displayName}
        </div>
      </div>
    </div>
  );
}

function GuestsBlock({ guests, currentGuestId, isRegistered }: { guests: any[]; currentGuestId: string | null; isRegistered: boolean }) {
  const groom = [...GROOM_GUESTS];
  const bride = [...BRIDE_GUESTS];

  guests.forEach((guest) => {
    const entry = {
      name: fixMojibakeText(guest.name),
      role: "Гость",
      isYou: guest.id === currentGuestId,
      photo: guest.photo,
    };
    const side = fixMojibakeText(guest.side)
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    if (side === "со стороны ивана" || side.includes("иван") || side.includes("жених")) {
      groom.push(entry as any);
    } else if (
      side === "со стороны анастасии" ||
      side.includes("анастаси") ||
      side.includes("невест")
    ) {
      bride.push(entry as any);
    }
  });

  const Column = ({ title, who, list, color }: any) => (
    <div className="flex-1">
      <div className="flex items-baseline justify-between mb-6 lg:mb-8">
        <div>
          <div style={{ fontWeight: 800, fontSize: "clamp(10px, 1vw, 11px)", letterSpacing: "0.25em", color: "#999" }}>СО СТОРОНЫ</div>
          <div className="mt-1.5 lg:mt-2" style={{ fontWeight: 900, fontSize: "clamp(22px, 2.5vw, 34px)", letterSpacing: "-0.01em", color: "#1a1a1a" }}>{who}</div>
        </div>
        <div className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-full" style={{ background: "#E85A4F", color: "white", fontWeight: 800, fontSize: "clamp(11px, 1.1vw, 12px)", letterSpacing: "0.05em" }}>
          {list.length} ГОСТЕЙ
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-7 sm:gap-x-5 sm:gap-y-8 lg:gap-x-6 lg:gap-y-9">
        {list.map((g: any, i: number) => (
          <GuestAvatar key={`${g.name}-${i}`} name={g.name} idx={i} isYou={g.isYou} photo={g.photo} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative">
      <div className="relative">
        <div className="text-center mb-10 lg:mb-14">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:text-left lg:gap-4 mb-4 lg:mb-5">
            <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center" style={{ background: "#FBD3D8" }}>
              <Users size={24} style={{ color: "#E85A4F" }} />
            </div>
          <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>
              НАШИ ГОСТИ
            </div>
          </div>
          <p className="max-w-2xl mx-auto px-4" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
            Самые близкие люди, которые разделят с нами этот день.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-12 xl:gap-16 relative">
          <Column title="Жених" who="ИВАНА" list={groom} color="#E85A4F" />
          <div className="hidden lg:block absolute left-1/2 top-2 bottom-2 w-px" style={{ background: "#F0E8E8" }} />
          <Column title="Невеста" who="АНАСТАСИИ" list={bride} color="#F4B6BE" />
        </div>

        {!isRegistered && (
          <div className="mt-12 lg:mt-16 text-center">
            <a
              href="#rsvp"
              className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-3.5 rounded-full transition active:scale-95"
              style={{ background: "#FBF6F4", color: "#1a1a1a", fontWeight: 800, fontSize: "clamp(11px, 1.1vw, 13px)", letterSpacing: "0.08em" }}
            >
              + ПРИСОЕДИНИТЬСЯ К СПИСКУ
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

type Side = "Со стороны Ивана" | "Со стороны Анастасии" | "";
type Attend = "Приду один/одна" | "Приду с парой" | "Приду с семьёй" | "Не смогу" | "";
type CatalogGiftCard = WeddingGift & {
  category: string;
  price: string;
  special?: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
};

const GUEST_SESSION_KEY = "wedding_guest_session";

function readStoredGuestId() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(GUEST_SESSION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return typeof parsed?.guestId === "string" ? parsed.guestId : null;
  } catch {
    return null;
  }
}

function saveStoredGuestId(guestId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify({ guestId }));
}

function clearStoredGuestId() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(GUEST_SESSION_KEY);
}

export default function App() {
  const [form, setForm] = useState({
    name: "",
    side: "" as Side,
    attend: "" as Attend,
    guests: "",
    photo: null as File | null,
    drink: "",
    allergy: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentGuestId, setCurrentGuestId] = useState<string | null>(null);
  const [storedGuestId, setStoredGuestId] = useState<string | null>(() => readStoredGuestId());
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [giftCategories, setGiftCategories] = useState<GiftCategory[]>([]);
  const [giftCatalog, setGiftCatalog] = useState<WeddingGift[]>([]);
  const [giftBookings, setGiftBookings] = useState<GiftBooking[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [musicWishes, setMusicWishes] = useState<MusicWish[]>([]);
  const [musicInput, setMusicInput] = useState("");
  const [selectedTravelCountries, setSelectedTravelCountries] = useState<Record<number, string>>({});
  const [activeTravelGiftId, setActiveTravelGiftId] = useState<number | null>(null);
  const [showAllGifts, setShowAllGifts] = useState(false);
  const [giftPreviewLimit, setGiftPreviewLimit] = useState(6);
  const [siteSections, setSiteSections] = useState<SiteSection[]>(defaultSiteSections);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const updateGiftPreviewLimit = () => {
      if (window.innerWidth >= 1280) {
        setGiftPreviewLimit(6);
      } else if (window.innerWidth >= 640) {
        setGiftPreviewLimit(4);
      } else {
        setGiftPreviewLimit(2);
      }
    };

    updateGiftPreviewLimit();
    window.addEventListener("resize", updateGiftPreviewLimit);

    return () => window.removeEventListener("resize", updateGiftPreviewLimit);
  }, []);

  useEffect(() => {
    setShowAllGifts(false);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory !== "all" && !giftCategories.some((category) => category.id === selectedCategory)) {
      setSelectedCategory("all");
    }
  }, [giftCategories, selectedCategory]);

  const restoreGuestSession = (guest: Guest) => {
    const attend =
      guest.attendanceLabel === "Приду один/одна" ||
      guest.attendanceLabel === "Приду с парой" ||
      guest.attendanceLabel === "Приду с семьёй" ||
      guest.attendanceLabel === "Не смогу"
        ? guest.attendanceLabel
        : guest.willAttend
          ? "Приду один/одна"
          : "Не смогу";

    const side =
      guest.side === "Со стороны Ивана" || guest.side === "Со стороны Анастасии"
        ? guest.side
        : "";

    setForm({
      name: guest.name,
      side,
      attend,
      guests: guest.guestNames || "",
      photo: null,
      drink: guest.drink || "",
      allergy: guest.allergy || "",
    });
    setPhotoPreview(guest.photo || null);
    setCurrentGuestId(guest.id);
    setIsRegistered(true);
  };

  useEffect(() => {
    if (!storedGuestId || currentGuestId || !allGuests.length) {
      return;
    }

    const guest = allGuests.find((item) => item.id === storedGuestId);
    if (!guest) {
      clearStoredGuestId();
      setStoredGuestId(null);
      return;
    }

    restoreGuestSession(guest);
  }, [storedGuestId, currentGuestId, allGuests]);

  const loadData = async () => {
    const [guestsResult, bookingsResult, wishesResult, catalogResult, sectionsResult] =
      await Promise.allSettled([
        fetchGuests(),
        fetchGiftBookings(),
        fetchMusicWishes(),
        fetchGiftCatalog(),
        fetchSiteSections(),
      ]);

    if (guestsResult.status === "fulfilled") {
      setAllGuests(guestsResult.value);
    }

    if (bookingsResult.status === "fulfilled") {
      setGiftBookings(bookingsResult.value);
    }

    if (wishesResult.status === "fulfilled") {
      setMusicWishes(wishesResult.value);
    }

    if (catalogResult.status === "fulfilled") {
      setGiftCategories(catalogResult.value.categories);
      setGiftCatalog(catalogResult.value.gifts);
    }

    if (sectionsResult.status === "fulfilled" && sectionsResult.value.length) {
      setSiteSections(
        mergeSiteSections(sectionsResult.value).sort((a, b) => a.sortOrder - b.sortOrder),
      );
    }
  };

  const sectionMap = useMemo(
    () => buildSiteContentMap(siteSections),
    [siteSections],
  );

  const heroSettings = sectionSettings(getSection(sectionMap, "hero"));
  const welcomeSettings = sectionSettings(getSection(sectionMap, "welcome"));
  const locationSettings = sectionSettings(getSection(sectionMap, "location"));
  const scheduleSettings = sectionSettings(getSection(sectionMap, "schedule"));
  const dressSettings = sectionSettings(getSection(sectionMap, "dress-code"));
  const storySettings = sectionSettings(getSection(sectionMap, "story"));
  const personSection = useMemo(
    () => getActiveSectionByType(siteSections, "person"),
    [siteSections],
  );
  const personSettings = sectionSettings(personSection);
  const personProfile = personSettings.items?.[0];
  const giftsSettings = sectionSettings(getSection(sectionMap, "gifts"));
  const rsvpSettings = sectionSettings(getSection(sectionMap, "rsvp"));
  const musicSettings = sectionSettings(getSection(sectionMap, "music"));
  const faqSettings = sectionSettings(getSection(sectionMap, "faq"));
  const closingSettings = sectionSettings(getSection(sectionMap, "closing"));

  const siteImages = useMemo(
    () => ({
      bg:
        resolveSiteImage(heroSettings.backgroundImage) ||
        resolveSiteImage(heroSettings.primaryImage) ||
        photo10,
      heroPrimary: resolveSiteImage(heroSettings.primaryImage) || photo10,
      heroSecondary: resolveSiteImage(heroSettings.secondaryImage) || photo04,
      venue: resolveSiteImage(locationSettings.primaryImage) || photo18,
      family: resolveSiteImage(closingSettings.primaryImage) || photo17,
      dressPrimary: resolveSiteImage(dressSettings.primaryImage) || photo01,
      dressSecondary: resolveSiteImage(dressSettings.secondaryImage) || photo18,
    }),
    [
      heroSettings.backgroundImage,
      heroSettings.primaryImage,
      heroSettings.secondaryImage,
      locationSettings.primaryImage,
      closingSettings.primaryImage,
      dressSettings.primaryImage,
      dressSettings.secondaryImage,
    ],
  );

  const defaultStorySlides = useMemo(
    () => getStorySlides(defaultSiteSections.find((section) => section.id === "story")?.settings.items),
    [],
  );
  const storySlides = useMemo(
    () => getStorySlides(storySettings.items),
    [storySettings.items],
  );
  const scheduleItems = useMemo(
    () => getScheduleItems(scheduleSettings.items),
    [scheduleSettings.items],
  );
  const dressColors = useMemo(
    () => getDressColors(dressSettings.items),
    [dressSettings.items],
  );
  const faqItems = useMemo(() => getFaqItems(faqSettings.items), [faqSettings.items]);

  const categories = useMemo(
    () => [
      { id: "all", name: "Все подарки", desc: "" },
      ...giftCategories
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((category) => ({
          id: category.id,
          name: category.name,
          desc: category.description,
        })),
    ],
    [giftCategories],
  );

  const allGifts = useMemo<CatalogGiftCard[]>(
    () =>
      giftCatalog
        .filter((gift) => gift.isActive)
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
        .map((gift) => ({
          ...gift,
          category: gift.categoryId,
          price: gift.priceLabel,
          special: gift.specialCode,
          Icon: getGiftIconByKey(gift.iconKey),
        })),
    [giftCatalog],
  );

  const travelCountriesByGiftId = useMemo<Record<number, TravelOption[]>>(
    () =>
      Object.fromEntries(
        giftCatalog
          .filter((gift) => gift.bookingMode === "travel")
          .map((gift) => [gift.id, gift.travelOptions || []]),
      ),
    [giftCatalog],
  );

  const bookedGifts = useMemo(
    () =>
      giftBookings
        .filter((booking) => booking.giftBookingMode !== "multiple")
        .map((booking) => booking.giftId),
    [giftBookings],
  );

  const travelGiftIds = useMemo(
    () =>
      giftCatalog
        .filter((gift) => gift.bookingMode === "travel")
        .map((gift) => gift.id),
    [giftCatalog],
  );

  const currentGuestTravelBooking = giftBookings.find(
    (booking) => currentGuestId && booking.guestId === currentGuestId && travelGiftIds.includes(Number(booking.giftId)),
  );

  const activeTravelGift = activeTravelGiftId ? allGifts.find((gift) => gift.id === activeTravelGiftId) : null;
  const activeTravelCountries = activeTravelGiftId ? travelCountriesByGiftId[activeTravelGiftId] || [] : [];
  const activeSelectedCountry = activeTravelGiftId ? selectedTravelCountries[activeTravelGiftId] || "" : "";

  const gifts =
    selectedCategory === "all" ? allGifts : allGifts.filter((gift) => gift.category === selectedCategory);

  const visibleGifts = showAllGifts ? gifts : gifts.slice(0, giftPreviewLimit);
  const hiddenGiftsCount = Math.max(gifts.length - visibleGifts.length, 0);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.side || !form.attend) {
      showToast("Заполните имя, сторону и присутствие");
      return;
    }

    if (!photoPreview) {
      showToast("Пожалуйста, загрузите фото");
      return;
    }

    setIsLoading(true);
    const willAttend = form.attend !== "Не смогу";
    const guestsCount = form.attend === "Приду с семьёй" ? 3 : form.attend === "Приду с парой" ? 2 : 1;

    const result = await registerGuest({
      name: form.name,
      side: form.side,
      willAttend,
      attendanceLabel: form.attend,
      guestsCount,
      guestNames: form.guests,
      drink: form.drink,
      allergy: form.allergy,
      photo: photoPreview || undefined,
    });

    setIsLoading(false);

    if (result.success && result.guest) {
      saveStoredGuestId(result.guest.id);
      setStoredGuestId(result.guest.id);
      restoreGuestSession(result.guest);
      setIsRegistered(true);
      showToast("Регистрация подтверждена! Теперь можно бронировать подарок");
      await loadData();
    } else {
      showToast(result.error || "Ошибка регистрации");
    }
  };

  const resetGuestSession = () => {
    clearStoredGuestId();
    setStoredGuestId(null);
    setCurrentGuestId(null);
    setIsRegistered(false);
    setPhotoPreview(null);
    setForm({
      name: "",
      side: "",
      attend: "",
      guests: "",
      photo: null,
      drink: "",
      allergy: "",
    });
  };

  const scrollToRsvp = () => {
    document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleOpenTravelModal = (id: number) => {
    if (!isRegistered || !currentGuestId) {
      showToast("Сначала заполните форму регистрации");
      scrollToRsvp();
      return;
    }

    if (currentGuestTravelBooking) {
      showToast(`Вы уже выбрали направление: ${currentGuestTravelBooking.selectedCountry}`);
      return;
    }

    setActiveTravelGiftId(id);
  };

  const handleBook = async (id: number, selectedCountry?: string) => {
    if (!isRegistered || !currentGuestId) {
      showToast("Сначала заполните форму регистрации");
      scrollToRsvp();
      return;
    }

    const targetGift = giftCatalog.find((gift) => gift.id === id);
    const isTravelGift = targetGift?.bookingMode === "travel";
    const isCountMultiple = targetGift?.bookingMode === "multiple";

    if (isTravelGift) {
      if (!selectedCountry) {
        showToast("Сначала выберите страну или направление");
        return;
      }

      if (currentGuestTravelBooking) {
        showToast(`Вы уже выбрали направление: ${currentGuestTravelBooking.selectedCountry}`);
        return;
      }
    }

    if (!isTravelGift && !isCountMultiple && bookedGifts.includes(id)) return;

    setIsLoading(true);
    const result = await bookGift({
      giftId: id,
      guestId: currentGuestId,
      guestName: form.name,
      selectedCountry,
    });
    setIsLoading(false);

    if (result.success) {
      showToast(isTravelGift ? "Направление выбрано, спасибо!" : "Подарок забронирован, спасибо!");
      await loadData();
    } else if (result.bookedBy) {
      showToast(`Подарок уже забронирован (${result.bookedBy})`);
      await loadData();
    } else {
      showToast(result.error || "Ошибка бронирования");
    }
  };

  const onPhoto = (file: File | null) => {
    setForm({ ...form, photo: file });
    if (file) {
      const r = new FileReader();
      r.onload = () => setPhotoPreview(r.result as string);
      r.readAsDataURL(file);
    } else setPhotoPreview(null);
  };

  const handleMusicSubmit = async () => {
    if (!musicInput.trim()) {
      showToast("Введите название песни");
      return;
    }

    setIsLoading(true);
    const result = await addMusicWish({
      song: musicInput,
      guestName: form.name || undefined,
      guestId: currentGuestId || undefined,
    });
    setIsLoading(false);

    if (result.success) {
      setMusicInput("");
      showToast("Пожелание отправлено!");
      await loadData();
    } else {
      showToast(result.error || "Ошибка отправки");
    }
  };

  return (
    <div style={{ ...font, color: INK }} className="min-h-screen w-full relative overflow-x-hidden">
      {/* TOAST */}
      <div
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none px-4"
        style={{ opacity: toast ? 1 : 0, transform: `translate(-50%, ${toast ? 0 : -20}px)`, maxWidth: "calc(100vw - 32px)" }}
      >
        {toast && (
          <div className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-white text-center" style={{ background: INK, fontSize: 13, fontWeight: 600 }}>
            {toast}
          </div>
        )}
      </div>

      {activeTravelGiftId && activeTravelGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 py-6" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 w-full h-full"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
            onClick={() => setActiveTravelGiftId(null)}
            aria-label="Закрыть окно выбора направления"
          />

          <div
            className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-[28px] sm:rounded-[36px]"
            style={{ background: "white", boxShadow: "0 30px 90px rgba(0,0,0,0.35)" }}
          >
            <div className="relative overflow-hidden px-5 sm:px-8 lg:px-10 pt-7 sm:pt-9 lg:pt-10 pb-6" style={{ background: "linear-gradient(135deg, #FFF9F8 0%, #FFFFFF 100%)" }}>
              <Flower size={96} color={PINK_LIGHT} className="absolute -top-7 -right-8 pointer-events-none" rotate={20} style={{ opacity: 0.85 }} />
              <Flower size={78} color={PINK} className="absolute -bottom-10 -left-8 pointer-events-none" rotate={-15} style={{ opacity: 0.65 }} />

              <button
                type="button"
                onClick={() => setActiveTravelGiftId(null)}
                className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition active:scale-95"
                style={{ background: "white", color: INK, boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>

              <div className="relative pr-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: PINK_LIGHT, color: CORAL, fontSize: 11, fontWeight: 900, letterSpacing: "0.12em" }}>
                  <Plane size={14} strokeWidth={2.5} />
                  ПУТЕШЕСТВИЕ
                </div>
                <div style={{ fontWeight: 900, fontSize: "clamp(26px, 4vw, 46px)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {activeTravelGift.name}
                </div>
                <p className="mt-3 max-w-2xl" style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "#666", lineHeight: 1.65 }}>
                  Выберите одно направление, куда нам будет особенно приятно отправиться. После подтверждения изменить выбор сможет только администратор сайта.
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-8 lg:px-10 py-6 sm:py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeTravelCountries.map((country) => {
                  const checked = activeSelectedCountry === country.value;

                  return (
                    <button
                      key={country.value}
                      type="button"
                      onClick={() => {
                        const giftId = activeTravelGiftId;
                        if (!giftId) return;
                        setSelectedTravelCountries({ ...selectedTravelCountries, [giftId]: country.value });
                      }}
                      className="group flex items-center justify-between gap-4 px-4 sm:px-5 py-4 rounded-2xl border-2 transition-all duration-300 active:scale-[0.99]"
                      style={{
                        background: checked ? "#FFF1EF" : "#FBF6F4",
                        borderColor: checked ? CORAL : "transparent",
                        boxShadow: checked ? "0 8px 22px rgba(232,90,79,0.14)" : "none",
                      }}
                    >
                      <span style={{ fontSize: "clamp(14px, 1.4vw, 16px)", fontWeight: checked ? 900 : 700, color: checked ? CORAL : INK }}>
                        {country.label}
                      </span>
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{
                          background: checked ? CORAL : "white",
                          color: checked ? "white" : "#D8C9C6",
                          border: checked ? `2px solid ${CORAL}` : "2px solid #E8DEDB",
                        }}
                      >
                        {checked && <Check size={16} strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div style={{ fontSize: "clamp(12px, 1.2vw, 14px)", color: "#888", lineHeight: 1.5 }}>
                  {activeSelectedCountry ? `Вы выбрали: ${activeSelectedCountry}` : "Сначала выберите направление из списка"}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!activeSelectedCountry) {
                      showToast("Сначала выберите страну или направление");
                      return;
                    }

                    const giftId = activeTravelGiftId;
                    if (!giftId) return;

                    await handleBook(giftId, activeSelectedCountry);
                    setActiveTravelGiftId(null);
                  }}
                  disabled={isLoading || !activeSelectedCountry}
                  className="px-7 py-4 rounded-full text-white transition active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{
                    background: activeSelectedCountry ? CORAL : "#E5DCD8",
                    boxShadow: activeSelectedCountry ? `0 8px 24px ${CORAL}55` : "none",
                    fontWeight: 900,
                    fontSize: "clamp(12px, 1.2vw, 14px)",
                    letterSpacing: "0.08em",
                    cursor: isLoading || !activeSelectedCountry ? "default" : "pointer",
                  }}
                >
                  <Check size={16} strokeWidth={2.8} />
                  ПОДТВЕРДИТЬ ВЫБОР
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FIXED GRAYSCALE BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback src={siteImages.bg} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(100%) brightness(0.55)" }} />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 overflow-x-clip overflow-y-visible">
        {/* HERO — split cover */}
        <section id="hero" className="relative px-4 sm:px-5 md:px-6 lg:px-10 pt-4 sm:pt-8 lg:pt-10 pb-4 sm:pb-6">
          <div
            className="relative z-10 mx-auto max-w-7xl overflow-hidden bg-[#FFF8F5]"
            style={{
              borderRadius: "clamp(20px, 4vw, 40px)",
              boxShadow: "0 40px 100px rgba(100, 37, 21, 0.12)",
            }}
          >
            <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 lg:min-h-[min(560px,58vh)] lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-5 lg:p-5">
              <div className="relative min-h-[min(62vw,280px)] w-full overflow-hidden rounded-[20px] sm:min-h-[320px] sm:rounded-[22px] lg:min-h-0 lg:h-full lg:rounded-2xl xl:rounded-3xl">
                <ImageWithFallback
                  src={siteImages.heroPrimary}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(115deg, rgba(19,12,10,0.82) 0%, rgba(19,12,10,0.45) 48%, rgba(19,12,10,0.2) 100%)",
                  }}
                />
                <div className="relative z-10 flex min-h-[min(62vw,280px)] flex-col justify-between p-5 text-white sm:min-h-[320px] sm:p-6 lg:min-h-full lg:px-12 lg:py-14">
                  <div className="inline-flex w-fit max-w-full rounded-full bg-white/20 px-3 py-1.5 text-[11px] backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
                    {heroSettings.badge || "Wedding weekend"}
                  </div>
                  <div className="max-w-xl pt-4 sm:pt-0">
                    <div
                      style={{
                        color: "#FFD6CE",
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        fontSize: "clamp(11px, 2.8vw, 14px)",
                      }}
                    >
                      {heroSettings.subtitle || "5-6 сентября 2026"}
                    </div>
                    <h1
                      className="mt-3 sm:mt-5"
                      style={{
                        fontWeight: 900,
                        fontSize: "clamp(28px, 8.5vw, 72px)",
                        lineHeight: 0.95,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {heroSettings.title || "Иван и Анастасия"}
                    </h1>
                    <p
                      className="mt-4 max-w-lg sm:mt-6"
                      style={{ lineHeight: 1.65, color: "rgba(255,255,255,0.88)", fontSize: "clamp(14px, 3.6vw, 17px)" }}
                    >
                      {heroSettings.description ||
                        "Мы будем счастливы провести этот день вместе с вами и собрать вокруг себя самых близких людей."}
                    </p>
                    {heroSettings.buttonLabel ? (
                      <a
                        href={heroSettings.buttonHref || "#schedule"}
                        className="mt-5 flex w-full max-w-sm items-center justify-center gap-2 rounded-full px-5 py-3.5 transition active:scale-[0.98] sm:mt-8 sm:inline-flex sm:w-auto sm:px-6 sm:py-4"
                        style={{ background: CORAL, color: "white", fontWeight: 800, fontSize: "clamp(13px, 3.2vw, 16px)" }}
                      >
                        {heroSettings.buttonLabel}
                        <ArrowRight size={18} />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:h-full lg:grid lg:grid-rows-[1.15fr_0.85fr] lg:gap-3">
                <div
                  className="overflow-hidden rounded-[20px] sm:rounded-[22px] lg:contents"
                  style={{ boxShadow: "0 8px 24px rgba(100, 37, 21, 0.06)" }}
                >
                  <div className="relative aspect-[4/5] max-h-[min(52vh,300px)] w-full overflow-hidden bg-[#F6E8E4] sm:max-h-[320px] lg:aspect-auto lg:max-h-none lg:min-h-[300px] lg:h-full lg:rounded-2xl xl:rounded-3xl">
                    <ImageWithFallback
                      src={siteImages.heroSecondary}
                      alt=""
                      className="h-full w-full object-cover object-[center_22%] lg:object-contain lg:object-center"
                    />
                  </div>
                  <div
                    className="flex flex-col px-4 py-4 sm:px-5 sm:py-5 lg:flex-1 lg:rounded-2xl lg:px-8 lg:py-8 xl:rounded-3xl"
                    style={{
                      background: "linear-gradient(135deg, #FFF5F2 0%, #FFFFFF 100%)",
                      boxShadow: "0 8px 24px rgba(100, 37, 21, 0.06)",
                    }}
                  >
                    <div style={{ color: CORAL, fontWeight: 800, letterSpacing: "0.16em", fontSize: 11 }}>
                      {heroSettings.badge || "Wedding weekend"}
                    </div>
                    <div
                      className="mt-2 sm:mt-3"
                      style={{ fontWeight: 900, fontSize: "clamp(18px, 4.5vw, 40px)", lineHeight: 1.12 }}
                    >
                      {heroSettings.note || "Свадебное приглашение"}
                    </div>
                    <button
                      type="button"
                      onClick={scrollToRsvp}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 transition active:scale-[0.98] sm:mt-5 lg:mt-auto lg:w-fit"
                      style={{
                        background: CORAL,
                        color: "white",
                        fontWeight: 800,
                        fontSize: "clamp(13px, 2.8vw, 15px)",
                        letterSpacing: "0.04em",
                        boxShadow: `0 10px 28px ${CORAL}44`,
                      }}
                    >
                      Заполнить анкету
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WIDE WHITE CARD */}
        <div className="relative px-4 sm:px-4 md:px-6 lg:px-8 pt-6 sm:pt-8 pb-16 sm:pb-32 overflow-x-clip overflow-y-visible">
          {/* decorative flowers peeking from edges */}
          <Flower size={72} color={CORAL} className="absolute top-2 left-3 z-20 pointer-events-none sm:hidden" rotate={-25} style={{ opacity: 0.95 }} />
          <Flower size={130} color={CORAL} className="hidden sm:block absolute top-0 left-2 z-20 pointer-events-none" rotate={-25} style={{ opacity: 0.95 }} />
          <Flower size={120} color={PINK} className="hidden sm:block absolute top-[14%] right-2 z-20 pointer-events-none" rotate={30} />
          <Flower size={110} color={PINK_LIGHT} className="hidden md:block absolute top-[38%] left-2 z-20 pointer-events-none" rotate={10} />
          <Flower size={130} color={CORAL} className="hidden md:block absolute top-[62%] right-2 z-20 pointer-events-none" rotate={-20} style={{ opacity: 0.9 }} />
          <Flower size={100} color={PINK} className="hidden sm:block absolute bottom-24 left-2 z-20 pointer-events-none" rotate={45} />

          <div className="relative z-10 max-w-7xl mx-auto bg-white overflow-hidden" style={{ borderRadius: "clamp(20px, 3vw, 36px)", boxShadow: "0 30px 80px rgba(0,0,0,0.25)" }}>

            {/* ДОРОГИЕ ДРУЗЬЯ + МЕСТО — two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t" style={{ borderColor: "#F0E8E8" }}>
              <div className="p-6 sm:p-8 lg:p-12 xl:p-16 lg:border-r" style={{ borderColor: "#F0E8E8" }}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4 lg:gap-5 mb-5 lg:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: PINK_LIGHT }}>
                    <Heart size={24} style={{ color: CORAL }} fill={CORAL} />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "clamp(22px, 5.5vw, 36px)", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                    {welcomeSettings.title || "Дорогие друзья!"}
                  </div>
                </div>
                <p style={{ fontSize: "clamp(15px, 1.3vw, 17px)", lineHeight: 1.7, color: "#555" }}>
                  {welcomeSettings.description}
                </p>
                {welcomeSettings.note ? (
                  <p className="mt-4" style={{ fontSize: "clamp(14px, 1.2vw, 15px)", lineHeight: 1.65, color: "#777" }}>
                    {welcomeSettings.note}
                  </p>
                ) : null}
              </div>

              <div className="p-6 sm:p-8 lg:p-12 xl:p-16 border-t lg:border-t-0" style={{ borderColor: "#F0E8E8" }}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4 lg:gap-5 mb-5 lg:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: PINK_LIGHT }}>
                    <MapPin size={24} style={{ color: CORAL }} />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "clamp(20px, 5vw, 34px)", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                    {locationSettings.title || "Место проведения"}
                  </div>
                </div>
                <p style={{ fontSize: "clamp(14px, 1.2vw, 16px)", color: "#666", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                  {locationSettings.description}
                </p>
                {locationSettings.note ? (
                  <p className="mt-3" style={{ fontSize: "clamp(13px, 1.1vw, 15px)", color: "#888", lineHeight: 1.6 }}>
                    {locationSettings.note}
                  </p>
                ) : null}
                <div className="mt-6 lg:mt-7 rounded-2xl lg:rounded-3xl overflow-hidden aspect-[16/9]">
                  <ImageWithFallback src={siteImages.venue} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(40%)" }} />
                </div>
                <button
                  className="mt-5 flex w-full max-w-sm items-center justify-center gap-2 rounded-full px-6 py-3 text-white transition active:scale-[0.98] sm:mt-6 sm:inline-flex sm:w-auto sm:px-8 lg:px-10 lg:py-4"
                  style={{ background: CORAL, fontWeight: 800, letterSpacing: "0.08em", fontSize: "clamp(11px, 2.8vw, 13px)" }}
                  onClick={() => window.open(locationSettings.buttonHref || "https://maps.google.com", "_blank")}
                >
                  {locationSettings.buttonLabel || "Посмотреть на карте →"}
                </button>
              </div>
            </div>

            {/* РАСПОРЯДОК ДНЯ — coral wide grid */}
            <div style={{ background: CORAL }} className="text-white relative">
              <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:gap-5 mb-8 sm:mb-10 lg:mb-14">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
                    <Calendar size={24} color="white" />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "clamp(22px, 5.5vw, 52px)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
                    {scheduleSettings.title || "Расписание дня"}
                  </div>
                </div>

                {scheduleItems.length ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {scheduleItems.map((item) => (
                      <div
                        key={`${item.time}-${item.title}`}
                        className="rounded-3xl p-6 sm:p-7"
                        style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
                      >
                        <div style={{ fontWeight: 900, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.1 }}>
                          {item.time}
                        </div>
                        <div className="mt-2" style={{ fontWeight: 800, fontSize: "clamp(18px, 2vw, 24px)" }}>
                          {item.title}
                        </div>
                        {item.text ? (
                          <p className="mt-3" style={{ fontSize: "clamp(15px, 1.4vw, 17px)", opacity: 0.9, lineHeight: 1.6 }}>
                            {item.text}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto text-center">
                    <div className="rounded-3xl p-8 sm:p-10 lg:p-12 xl:p-14" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6 lg:mb-8" style={{ color: CORAL }}>
                        <Calendar size={32} />
                      </div>
                      <div style={{ fontWeight: 900, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "16px" }}>
                        {scheduleSettings.description || "Скоро будет опубликовано"}
                      </div>
                      {scheduleSettings.note ? (
                        <p style={{ fontSize: "clamp(15px, 1.4vw, 18px)", opacity: 0.9, lineHeight: 1.6 }}>
                          {scheduleSettings.note}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
              <ScallopedBottom color={CORAL} />
            </div>

            {/* ДРЕСС-КОД */}
            <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden">
              <Flower size={110} color={PINK} className="hidden xl:block absolute top-14 right-14 pointer-events-none" rotate={20} style={{ opacity: 0.65 }} />
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16">
                <div className="lg:col-span-5 xl:col-span-4">
                  <div style={{ fontWeight: 900, fontSize: "clamp(28px, 3.5vw, 56px)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {(dressSettings.title || "Дресс-код").split(" ").map((word, index, words) => (
                      <React.Fragment key={`${word}-${index}`}>
                        {word}
                        {index < words.length - 1 ? <br /> : null}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="mt-5 lg:mt-6" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.65 }}>
                    {dressSettings.description}
                  </p>
                  <div className="mt-6 lg:mt-8 flex gap-2 lg:gap-2.5 flex-wrap">
                    {dressColors.map((p) => (
                      <div key={p.c} className="flex items-center gap-2 px-3 lg:px-3.5 py-2 rounded-full" style={{ background: "#FBF6F4" }}>
                        <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 border-white" style={{ background: p.c, boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
                        <span style={{ fontSize: "clamp(10px, 1.1vw, 12px)", fontWeight: 700, color: "#444" }}>{p.n}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-7 xl:col-span-8 grid grid-cols-2 gap-3 sm:gap-4 lg:gap-4 xl:gap-6">
                  {[siteImages.dressPrimary, siteImages.dressSecondary].map((src, i) => (
                    <div key={i} className="aspect-[3/4] rounded-2xl lg:rounded-3xl overflow-hidden group">
                      <ImageWithFallback src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-px mx-4 sm:mx-6 md:mx-14" style={{ background: "#F0E8E8" }} />

            {/* НАША ИСТОРИЯ */}
            <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden">
              <Flower size={100} color={PINK_LIGHT} className="hidden xl:block absolute top-16 left-12 pointer-events-none" rotate={15} style={{ opacity: 0.7 }} />
              <Flower size={120} color={PINK} className="hidden xl:block absolute bottom-24 right-14 pointer-events-none" rotate={-18} style={{ opacity: 0.55 }} />

              <div className="relative max-w-6xl mx-auto">
                <div className="text-center mb-10 lg:mb-16">
                  <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:text-left lg:gap-4 mb-4 lg:mb-5">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center" style={{ background: PINK_LIGHT }}>
                      <BookHeart size={24} style={{ color: CORAL }} />
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>
                      {storySettings.title || "Наша история"}
                    </div>
                  </div>
                  <p className="max-w-2xl mx-auto px-4" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                    {storySettings.description || "Путь от первой встречи до «Да»"}
                  </p>
                </div>

                <div className="relative">
                  <svg
                    className="hidden lg:block absolute left-1/2 top-8 bottom-8 -translate-x-1/2 pointer-events-none"
                    width="220"
                    height="100%"
                    viewBox="0 0 220 1180"
                    preserveAspectRatio="none"
                    aria-hidden
                    style={{ overflow: "visible" }}
                  >
                    <path
                      d="M110 0 C20 85 20 155 110 240 C200 325 200 395 110 480 C20 565 20 635 110 720 C200 805 200 875 110 960 C20 1045 20 1115 110 1180"
                      fill="none"
                      stroke={CORAL}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="2 16"
                      opacity="0.55"
                    />
                  </svg>

                  <div className="lg:hidden absolute left-4 top-4 bottom-4 border-l-[3px] border-dotted" style={{ borderColor: PINK }} />

                  <div className="space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
                    {(storySlides.length ? storySlides : defaultStorySlides).map((story, i) => {
                      const isRight = i % 2 === 1;

                      return (
                        <div
                          key={story.title}
                          className={`relative lg:grid lg:grid-cols-[1fr_92px_1fr] lg:items-center lg:gap-7 xl:gap-10 ${isRight ? "" : ""}`}
                          style={{ animation: `fadeInScale 0.7s ease-out ${i * 0.08}s both` }}
                        >
                          <div className={`hidden lg:block lg:row-start-1 ${isRight ? "lg:col-start-3" : "lg:col-start-1"}`}>
                            <div className="group relative rounded-[32px] overflow-hidden aspect-[16/10]" style={{ boxShadow: "0 18px 50px rgba(0,0,0,0.12)" }}>
                              <ImageWithFallback
                                src={story.image}
                                alt={story.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                style={{ filter: "grayscale(18%) contrast(1.03)" }}
                              />
                              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)" }} />
                              <div className="absolute left-5 bottom-5 px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.92)", color: CORAL, fontWeight: 900, fontSize: 11, letterSpacing: "0.12em" }}>
                                {story.date}
                              </div>
                            </div>
                          </div>

                          <div className="absolute lg:static left-0 top-5 z-20 sm:top-6 lg:col-start-2 lg:row-start-1 flex items-center justify-center">
                            <div
                              className="w-10 h-10 lg:w-[92px] lg:h-[92px] rounded-full flex items-center justify-center"
                              style={{
                                background: "white",
                                border: `3px solid ${PINK_LIGHT}`,
                                boxShadow: `0 0 0 8px rgba(251, 211, 216, 0.45), 0 10px 26px rgba(232,90,79,0.18)`,
                              }}
                            >
                              <div
                                className="w-5 h-5 lg:w-9 lg:h-9 rounded-full flex items-center justify-center"
                                style={{ background: CORAL, color: "white", fontWeight: 900, fontSize: "clamp(10px, 1vw, 14px)" }}
                              >
                                {i + 1}
                              </div>
                            </div>
                          </div>

                          <div className={`pl-[3.25rem] sm:pl-14 lg:pl-0 ${isRight ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-3"}`}>
                            <div
                              className="rounded-[22px] p-4 sm:rounded-[28px] sm:p-6 lg:rounded-[32px] lg:p-7 xl:p-8 transition-transform duration-500 hover:-translate-y-1"
                              style={{
                                background: "linear-gradient(135deg, #FFF9F8 0%, #FFFFFF 100%)",
                                border: `1px solid ${PINK_LIGHT}`,
                                boxShadow: "0 14px 40px rgba(0,0,0,0.06)",
                              }}
                            >
                              <div className="lg:hidden mb-4 rounded-2xl overflow-hidden aspect-[16/10]">
                                <ImageWithFallback
                                  src={story.image}
                                  alt={story.title}
                                  className="w-full h-full object-cover"
                                  style={{ filter: "grayscale(18%) contrast(1.03)" }}
                                />
                              </div>

                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: PINK_LIGHT, color: CORAL }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: CORAL }} />
                                <span style={{ fontSize: "clamp(10px, 1vw, 12px)", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                                  {story.date}
                                </span>
                              </div>

                              <h3 style={{ fontWeight: 900, fontSize: "clamp(20px, 2.2vw, 30px)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "12px" }}>
                                {story.title}
                              </h3>
                              <p style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.7 }}>
                                {story.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px mx-4 sm:mx-6 md:mx-14" style={{ background: "#F0E8E8" }} />

            {personSection && isSectionActive(personSection) ? (
              <>
                <div
                  id={personSection.id}
                  className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden"
                >
                  <Flower size={90} color={PINK} className="hidden md:block absolute top-10 left-8 pointer-events-none" rotate={12} style={{ opacity: 0.5 }} />
                  <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                    <div className="order-2 lg:order-1">
                      {personSettings.badge ? (
                        <div
                          className="inline-flex rounded-full px-3 py-1.5 mb-4"
                          style={{ background: PINK_LIGHT, color: CORAL, fontWeight: 800, fontSize: 11, letterSpacing: "0.12em" }}
                        >
                          {personSettings.badge}
                        </div>
                      ) : null}
                      <h2 style={{ fontWeight: 900, fontSize: "clamp(26px, 5vw, 48px)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
                        {personSettings.title || "Наш ведущий"}
                      </h2>
                      {personSettings.subtitle ? (
                        <p className="mt-3" style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: CORAL, fontWeight: 700, lineHeight: 1.4 }}>
                          {personSettings.subtitle}
                        </p>
                      ) : null}
                      {personSettings.description ? (
                        <p className="mt-4" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.7 }}>
                          {personSettings.description}
                        </p>
                      ) : null}
                      {personProfile?.title ? (
                        <div className="mt-6 rounded-2xl px-5 py-4" style={{ background: "#FBF6F4", border: `1px solid ${PINK_LIGHT}` }}>
                          <div style={{ fontWeight: 900, fontSize: "clamp(18px, 2.5vw, 24px)", lineHeight: 1.15 }}>
                            {personProfile.title}
                          </div>
                          {personProfile.subtitle ? (
                            <div className="mt-1" style={{ fontWeight: 700, fontSize: "clamp(13px, 1.2vw, 15px)", color: CORAL }}>
                              {personProfile.subtitle}
                            </div>
                          ) : null}
                          {personProfile.text ? (
                            <p className="mt-2" style={{ fontSize: "clamp(14px, 1.2vw, 15px)", color: "#666", lineHeight: 1.65 }}>
                              {personProfile.text}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                      {personSettings.buttonLabel && personSettings.buttonHref ? (
                        <a
                          href={personSettings.buttonHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 flex w-full max-w-sm items-center justify-center gap-2 rounded-full px-6 py-3.5 text-white transition active:scale-[0.98] sm:inline-flex sm:w-auto"
                          style={{ background: CORAL, fontWeight: 800, fontSize: "clamp(13px, 2.8vw, 15px)" }}
                        >
                          {personSettings.buttonLabel}
                          <ArrowUpRight size={18} />
                        </a>
                      ) : null}
                    </div>
                    <div className="order-1 lg:order-2">
                      <div className="overflow-hidden rounded-[22px] sm:rounded-3xl aspect-[4/5] max-h-[min(72vh,520px)] lg:max-h-none" style={{ boxShadow: "0 18px 50px rgba(0,0,0,0.1)" }}>
                        <ImageWithFallback
                          src={resolveSiteImage(personSettings.primaryImage) || photo11}
                          alt={personProfile?.title || personSettings.title || ""}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-px mx-4 sm:mx-6 md:mx-14" style={{ background: "#F0E8E8" }} />
              </>
            ) : null}

            {/* Music wishes preview */}
            <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-16 xl:py-20 relative overflow-hidden">
              <Flower size={100} color={CORAL} className="hidden xl:block absolute bottom-16 right-12 pointer-events-none" rotate={-25} style={{ opacity: 0.8 }} />
              <div className="relative max-w-6xl mx-auto">
                <div className="rounded-2xl px-4 py-6 sm:rounded-3xl sm:px-6 sm:py-8" style={{ background: PINK_LIGHT, border: `2px solid ${PINK}` }}>
                  <div className="text-center mb-6">
                    <Music size={32} style={{ color: CORAL, margin: "0 auto 16px" }} />
                    <div style={{ fontWeight: 800, fontSize: "clamp(18px, 2vw, 24px)", marginBottom: "8px" }}>
                      {musicSettings.badge || musicSettings.title || "Музыкальное настроение"}
                    </div>
                    <p style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                      {musicSettings.note ||
                        musicSettings.description ||
                        "Легкий джаз на церемонии, романтичные баллады на ужине, танцевальные хиты вечером"}
                    </p>
                  </div>

                  {musicWishes.length > 0 && (
                    <div className="mt-6 pt-6 border-t-2" style={{ borderColor: PINK }}>
                      <div style={{ fontWeight: 700, fontSize: "clamp(14px, 1.4vw, 16px)", marginBottom: "12px", color: CORAL }}>
                        Пожелания гостей:
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {musicWishes.map((wish: any, i: number) => (
                          <div key={wish.id} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: "white" }}>
                            <Music size={16} style={{ color: CORAL, flexShrink: 0, marginTop: "2px" }} />
                            <div className="flex-1">
                              <div style={{ fontSize: "clamp(13px, 1.2vw, 15px)", fontWeight: 600, color: INK, lineHeight: 1.4 }}>
                                {wish.song}
                              </div>
                              <div style={{ fontSize: "clamp(11px, 1.1vw, 12px)", color: "#999", marginTop: "2px" }}>
                                от {wish.guestName}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px mx-4 sm:mx-6 md:mx-14" style={{ background: "#F0E8E8" }} />

            {/* ПОЖЕЛАНИЯ / GIFTS */}
            <div id="gifts" className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden">
              <Flower size={110} color={CORAL} className="hidden xl:block absolute top-12 right-14 pointer-events-none" rotate={-15} style={{ opacity: 0.85 }} />
              <div className="relative">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 lg:gap-6 mb-10 lg:mb-14">
                  <div>
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4 lg:gap-5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: PINK_LIGHT }}>
                        <Gift size={24} style={{ color: CORAL }} />
                      </div>
                      <div style={{ fontWeight: 900, fontSize: "clamp(24px, 6vw, 56px)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
                        {giftsSettings.title || "Пожелания"}
                      </div>
                    </div>
                    <p className="mt-4 lg:mt-5 max-w-xl" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.65 }}>
                      {giftsSettings.description}
                    </p>
                    <div className="mt-4 lg:mt-5 max-w-xl px-4 py-3 rounded-2xl flex items-start gap-3" style={{ background: "#FFF9F8", border: `2px solid ${CORAL}` }}>
                      <Sparkles size={20} style={{ color: CORAL, flexShrink: 0, marginTop: "2px" }} />
                      <p style={{ fontSize: "clamp(13px, 1.2vw, 15px)", color: CORAL_DARK, lineHeight: 1.65, fontWeight: 600 }}>
                        <strong>Важно!</strong> Если хотите что-то подарить из списка — обязательно забронируйте, нажав кнопку "Забронировать подарок". Это поможет избежать неловких ситуаций, когда несколько человек дарят одно и то же.
                      </p>
                    </div>
                  </div>
                  {!isRegistered && (
                    <div className="inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 lg:py-3 rounded-full shrink-0" style={{ background: "#FFF1F0", border: `1px solid ${PINK}` }}>
                      <span style={{ color: CORAL, fontWeight: 700, fontSize: "clamp(11px, 1.1vw, 12px)", letterSpacing: "0.04em" }}>
                        ⚠ СНАЧАЛА ЗАПОЛНИТЕ ФОРМУ НИЖЕ
                      </span>
                    </div>
                  )}
                </div>

                {/* КАТЕГОРИИ ФИЛЬТР */}
                <div className="mb-8 lg:mb-10">
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className="px-4 lg:px-5 py-2.5 lg:py-3 rounded-full transition-all duration-300"
                        style={{
                          background: selectedCategory === cat.id ? CORAL : "#FBF6F4",
                          color: selectedCategory === cat.id ? "white" : "#1a1a1a",
                          fontWeight: 700,
                          fontSize: "clamp(12px, 1.2vw, 14px)",
                          letterSpacing: "0.02em",
                          border: selectedCategory === cat.id ? "none" : "1px solid #F0E8E8",
                        }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                  {selectedCategory !== "all" && (
                    <div className="mt-4 px-4 py-3 rounded-2xl" style={{ background: "#FFF9F8", border: "1px solid #FFE8E6" }}>
                      <p style={{ fontSize: "clamp(13px, 1.2vw, 14px)", color: "#666", lineHeight: 1.6 }}>
                        {categories.find(c => c.id === selectedCategory)?.desc}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 xl:gap-6">
                  {visibleGifts.map((g, i) => {
                    const booked = bookedGifts.includes(g.id);
                    const Icon = g.Icon;
                    const isFeatured = g.featured;
                    const isTravelGift = travelGiftIds.includes(g.id);
                    const isCountMultiple = g.bookingMode === "multiple";
                    const giftLink = g.link;
                    const bookingsForGift = giftBookings.filter((b) => b.giftId === g.id);
                    const bookingCount = bookingsForGift.length;
                    const isUnavailable = booked && !isCountMultiple && !isTravelGift;
                    const currentGuestBookedThisTravelGift = Boolean(
                      currentGuestId && bookingsForGift.some((b) => b.guestId === currentGuestId)
                    );
                    const currentGiftTravelBooking = bookingsForGift.find(
                      (b) => currentGuestId && b.guestId === currentGuestId
                    );
                    return (
                      <div
                        key={g.id}
                        className="group relative rounded-2xl lg:rounded-3xl overflow-hidden transition-all duration-500 flex flex-col"
                        style={{
                          background: isFeatured ? "linear-gradient(135deg, #FFF9F8 0%, #FFFFFF 100%)" : "white",
                          border: isFeatured ? `2px solid ${CORAL}` : `1px solid ${isUnavailable ? "#EEE" : "#F0E8E8"}`,
                          opacity: isUnavailable ? 0.55 : 1,
                          boxShadow: isFeatured ? "0 8px 24px rgba(232,90,79,0.15)" : "none",
                        }}
                      >
                        {isFeatured && !booked && (
                          <div className="absolute top-4 lg:top-5 left-4 lg:left-5 z-10 px-3 lg:px-3.5 py-1.5 rounded-full flex items-center gap-1.5" style={{ background: CORAL, color: "white" }}>
                            <Sparkles size={12} strokeWidth={3} />
                            <span style={{ fontSize: "clamp(9px, 1vw, 10px)", fontWeight: 800, letterSpacing: "0.08em" }}>ОСОБЕННОЕ</span>
                          </div>
                        )}
                        {isUnavailable && (
                          <div className="absolute top-4 lg:top-5 right-4 lg:right-5 z-10 px-3 lg:px-3.5 py-1.5 rounded-full flex items-center gap-1.5" style={{ background: INK, color: "white" }}>
                            <Check size={12} strokeWidth={3} />
                            <span style={{ fontSize: "clamp(9px, 1vw, 10px)", fontWeight: 800, letterSpacing: "0.08em" }}>ВЗЯТО</span>
                          </div>
                        )}

                        <div className="p-6 lg:p-7 xl:p-8 flex-1 flex flex-col">
                          <div className="flex items-start justify-between mb-7 lg:mb-8">
                            <div
                              className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]"
                              style={{ background: isUnavailable ? "#F5F5F5" : `linear-gradient(135deg, ${PINK_LIGHT} 0%, ${PINK} 100%)` }}
                            >
                              <Icon size={24} strokeWidth={1.8} style={{ color: isUnavailable ? "#999" : CORAL }} />
                            </div>
                            <div style={{ fontWeight: 900, fontSize: "clamp(28px, 3vw, 38px)", color: "#EEE3E0", lineHeight: 1, letterSpacing: "-0.04em" }}>
                              {String(i + 1).padStart(2, "0")}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div style={{ fontWeight: 800, fontSize: "clamp(17px, 1.6vw, 21px)", lineHeight: 1.25, letterSpacing: "-0.01em" }}>{g.name}</div>
                            <div className="mt-2" style={{ fontSize: "clamp(12px, 1.2vw, 14px)", color: "#999", lineHeight: 1.5 }}>{g.hint}</div>
                            {g.conditionsText && (
                              <div className="mt-3 rounded-2xl px-3 py-3" style={{ background: "#FFF9F8", color: "#666", fontSize: "clamp(12px, 1.1vw, 13px)", lineHeight: 1.55 }}>
                                {g.conditionsText}
                              </div>
                            )}
                            {giftLink && (
                              <a
                                href={giftLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105"
                                style={{ background: PINK_LIGHT, color: CORAL, fontSize: "clamp(11px, 1.1vw, 12px)", fontWeight: 700 }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>ПОСМОТРЕТЬ</span>
                                <ArrowUpRight size={12} strokeWidth={2.5} />
                              </a>
                            )}
                          </div>

                          {isTravelGift ? (
                            <div className="mt-7 lg:mt-8 pt-5 lg:pt-6" style={{ borderTop: "1px dashed #F0E8E8" }}>
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                  <div style={{ fontSize: "clamp(13px, 1.3vw, 15px)", color: "#666", fontWeight: 700 }}>
                                    Выбрали {bookingCount} {bookingCount === 1 ? "человек" : bookingCount < 5 ? "человека" : "человек"}
                                  </div>
                                  <div className="mt-1" style={{ fontSize: "clamp(12px, 1.1vw, 13px)", color: "#999", lineHeight: 1.45 }}>
                                    Откройте список направлений и выберите одно.
                                  </div>
                                </div>
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: PINK_LIGHT }}>
                                  <Globe size={18} style={{ color: CORAL }} />
                                </div>
                              </div>

                              {currentGiftTravelBooking && (
                                <div className="mb-4 px-4 py-3 rounded-2xl flex items-center gap-2" style={{ background: "#E8F5E9", color: "#2E7D32", fontSize: 13, fontWeight: 800 }}>
                                  <Check size={16} strokeWidth={2.5} />
                                  <span>Ваш выбор: {currentGiftTravelBooking.selectedCountry}</span>
                                </div>
                              )}

                              <button
                                onClick={() => handleOpenTravelModal(g.id)}
                                disabled={isLoading || Boolean(currentGuestTravelBooking) || currentGuestBookedThisTravelGift}
                                className="w-full py-3.5 lg:py-4 rounded-full transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                                style={{
                                  background: currentGuestTravelBooking || currentGuestBookedThisTravelGift ? "#F5F5F5" : CORAL,
                                  color: currentGuestTravelBooking || currentGuestBookedThisTravelGift ? "#999" : "white",
                                  cursor: isLoading || currentGuestTravelBooking || currentGuestBookedThisTravelGift ? "default" : "pointer",
                                  boxShadow: currentGuestTravelBooking || currentGuestBookedThisTravelGift ? "none" : `0 6px 18px ${CORAL}55`,
                                  opacity: isLoading ? 0.6 : 1,
                                  fontWeight: 700,
                                  fontSize: "clamp(12px, 1.2vw, 14px)",
                                  letterSpacing: "0.05em"
                                }}
                              >
                                {currentGuestTravelBooking || currentGuestBookedThisTravelGift ? (
                                  <>
                                    <Check size={16} strokeWidth={2.5} />
                                    <span>НАПРАВЛЕНИЕ ВЫБРАНО</span>
                                  </>
                                ) : (
                                  <>
                                    <Compass size={16} strokeWidth={2.5} />
                                    <span>ВЫБРАТЬ НАПРАВЛЕНИЕ</span>
                                  </>
                                )}
                              </button>
                            </div>
                          ) : isCountMultiple ? (
                            <div className="mt-7 lg:mt-8 pt-5 lg:pt-6" style={{ borderTop: "1px dashed #F0E8E8" }}>
                              <div className="flex items-center justify-between mb-4">
                                <div style={{ fontSize: "clamp(13px, 1.3vw, 15px)", color: "#666", fontWeight: 600 }}>
                                  Выбрали {bookingCount} {bookingCount === 1 ? "человек" : bookingCount < 5 ? "человека" : "человек"}
                                </div>
                              </div>
                              <button
                                onClick={() => handleBook(g.id)}
                                disabled={isLoading}
                                className="w-full py-3.5 lg:py-4 rounded-full transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                                style={{
                                  background: CORAL,
                                  color: "white",
                                  cursor: isLoading ? "default" : "pointer",
                                  boxShadow: `0 6px 18px ${CORAL}55`,
                                  opacity: isLoading ? 0.6 : 1,
                                  fontWeight: 700,
                                  fontSize: "clamp(12px, 1.2vw, 14px)",
                                  letterSpacing: "0.05em"
                                }}
                              >
                                <Gift size={16} strokeWidth={2.5} />
                                <span>ВЫБРАТЬ ЭТОТ ПОДАРОК</span>
                              </button>
                            </div>
                          ) : (
                            <button
                            onClick={() => handleBook(g.id)}
                            disabled={booked || isLoading}
                            className="mt-7 lg:mt-8 w-full py-3.5 lg:py-4 rounded-full transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                            style={{
                              background: booked ? "#F5F5F5" : CORAL,
                              color: booked ? "#999" : "white",
                              cursor: booked || isLoading ? "default" : "pointer",
                              boxShadow: booked ? "none" : `0 6px 18px ${CORAL}55`,
                              opacity: isLoading ? 0.6 : 1,
                              fontWeight: 700,
                              fontSize: "clamp(12px, 1.2vw, 14px)",
                              letterSpacing: "0.05em"
                            }}
                          >
                            {booked ? (
                              <>
                                <Check size={16} strokeWidth={2.5} />
                                <span>ЗАБРОНИРОВАНО</span>
                              </>
                            ) : (
                              <>
                                <Gift size={16} strokeWidth={2.5} />
                                <span>ЗАБРОНИРОВАТЬ ПОДАРОК</span>
                              </>
                            )}
                          </button>
                          )}
                        </div>

                        {!booked && !isCountMultiple && !isTravelGift && (
                          <div
                            className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                            style={{ background: `linear-gradient(90deg, ${PINK}, ${CORAL})` }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {hiddenGiftsCount > 0 && (
                  <div className="mt-8 lg:mt-10 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowAllGifts(true)}
                      className="px-8 lg:px-10 py-3.5 lg:py-4 rounded-full transition-all duration-300 active:scale-[0.98] inline-flex items-center justify-center gap-2"
                      style={{
                        background: CORAL,
                        color: "white",
                        fontWeight: 800,
                        fontSize: "clamp(12px, 1.2vw, 14px)",
                        letterSpacing: "0.08em",
                        boxShadow: `0 8px 24px ${CORAL}55`,
                      }}
                    >
                      <span>ПОКАЗАТЬ ВСЕ ПОДАРКИ</span>
                      <span style={{ opacity: 0.85 }}>+{hiddenGiftsCount}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="h-px mx-4 sm:mx-6 md:mx-14" style={{ background: "#F0E8E8" }} />

            {/* RSVP FORM */}
            <div id="rsvp" className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden">
              <Flower size={100} color={PINK} className="hidden xl:block absolute top-16 left-12 pointer-events-none" rotate={-20} style={{ opacity: 0.6 }} />
              <div className="relative max-w-4xl mx-auto">
                <div className="text-center">
                  <div style={{ fontWeight: 900, fontSize: "clamp(28px, 4vw, 64px)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {rsvpSettings.title || "Анкета гостя"}
                  </div>
                  <p className="mt-4 lg:mt-5" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                    {rsvpSettings.description}
                  </p>
                  {rsvpSettings.note ? (
                    <p className="mt-3" style={{ fontSize: "clamp(13px, 1.2vw, 15px)", color: "#888", lineHeight: 1.6 }}>
                      {rsvpSettings.note}
                    </p>
                  ) : null}
                </div>

                {isRegistered && (
                  <div className="mt-5 flex flex-col gap-3 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between" style={{ background: "#E8F5E9", color: "#2E7D32" }}>
                    <div className="flex items-center gap-3">
                      <Check size={20} />
                      <span style={{ fontWeight: 700, fontSize: 13 }}>Вы зарегистрированы! Спасибо</span>
                    </div>
                    <button
                      type="button"
                      onClick={resetGuestSession}
                      className="rounded-full px-4 py-2 text-sm"
                      style={{ background: "white", color: "#2E7D32", fontWeight: 800 }}
                    >
                      Это не я
                    </button>
                  </div>
                )}

                <form onSubmit={handleRegister} className="mt-6 space-y-5">
                  <div>
                    <label style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 800, color: "#555" }}>
                      ИМЯ И ФАМИЛИЯ *
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      disabled={isRegistered}
                      placeholder="Иван Иванов"
                      className="w-full mt-2 px-5 py-3.5 rounded-2xl outline-none transition border-2"
                      style={{ background: "#FBF6F4", fontSize: 15, borderColor: form.name ? PINK : "transparent", fontWeight: 500 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 800, color: "#555" }}>
                      С ЧЬЕЙ СТОРОНЫ *
                    </label>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {(["Со стороны Ивана", "Со стороны Анастасии"] as Side[]).map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          disabled={isRegistered}
                          onClick={() => setForm({ ...form, side: opt })}
                          className="px-5 py-3.5 rounded-2xl text-left transition border-2"
                          style={{
                            background: form.side === opt ? CORAL : "#FBF6F4",
                            color: form.side === opt ? "white" : INK,
                            borderColor: form.side === opt ? CORAL : "transparent",
                            fontWeight: form.side === opt ? 800 : 600, fontSize: 14
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 800, color: "#555" }}>
                      ВАШЕ ПРИСУТСТВИЕ *
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {(["Приду один/одна", "Приду с парой", "Приду с семьёй", "Не смогу"] as Attend[]).map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          disabled={isRegistered}
                          onClick={() => setForm({ ...form, attend: opt })}
                          className="px-4 py-3.5 rounded-2xl transition border-2"
                          style={{
                            background: form.attend === opt ? CORAL : "#FBF6F4",
                            color: form.attend === opt ? "white" : INK,
                            borderColor: form.attend === opt ? CORAL : "transparent",
                            fontWeight: form.attend === opt ? 800 : 600, fontSize: 13
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.attend && form.attend !== "Приду один/одна" && form.attend !== "Не смогу" && (
                    <div>
                      <label style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 800, color: "#555" }}>
                        ИМЕНА ВАШИХ ГОСТЕЙ
                      </label>
                      <textarea
                        value={form.guests}
                        onChange={(e) => setForm({ ...form, guests: e.target.value })}
                        disabled={isRegistered}
                        placeholder="Мария Иванова, Пётр Иванов"
                        rows={2}
                        className="w-full mt-2 px-5 py-3.5 rounded-2xl outline-none resize-none border-2"
                        style={{ background: "#FBF6F4", fontSize: 14, borderColor: form.guests ? PINK : "transparent", fontWeight: 500 }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 800, color: "#555" }}>
                      ВАШЕ ФОТО *
                    </label>
                    <div className="mt-2 flex items-center gap-4">
                      <label
                        className="cursor-pointer rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border-2 border-dashed"
                        style={{
                          width: 80, height: 80,
                          background: photoPreview ? `url(${photoPreview}) center/cover` : "#FBF6F4",
                          borderColor: photoPreview ? CORAL : "#E5DCD8"
                        }}
                      >
                        {!photoPreview && <Upload size={22} style={{ color: CORAL }} />}
                        <input type="file" accept="image/*" disabled={isRegistered} onChange={(e) => onPhoto(e.target.files?.[0] || null)} className="hidden" />
                      </label>
                      <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>
                        Загрузите портрет. Без фото отправить анкету не получится.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 800, color: "#555" }}>
                        НАПИТКИ
                      </label>
                      <input
                        value={form.drink}
                        onChange={(e) => setForm({ ...form, drink: e.target.value })}
                        disabled={isRegistered}
                        placeholder="Вино, пиво…"
                        className="w-full mt-2 px-4 py-3 rounded-2xl outline-none border-2"
                        style={{ background: "#FBF6F4", fontSize: 13, borderColor: form.drink ? PINK : "transparent", fontWeight: 500 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 800, color: "#555" }}>
                        АЛЛЕРГИИ
                      </label>
                      <input
                        value={form.allergy}
                        onChange={(e) => setForm({ ...form, allergy: e.target.value })}
                        disabled={isRegistered}
                        placeholder="Если есть"
                        className="w-full mt-2 px-4 py-3 rounded-2xl outline-none border-2"
                        style={{ background: "#FBF6F4", fontSize: 13, borderColor: form.allergy ? PINK : "transparent", fontWeight: 500 }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistered || isLoading}
                    className="w-full py-4 rounded-full text-white mt-2 transition active:scale-[0.98]"
                    style={{
                      background: isRegistered ? "#9CCC9F" : CORAL,
                      fontWeight: 800, letterSpacing: "0.08em", fontSize: 14,
                      boxShadow: isRegistered ? "none" : `0 8px 24px ${CORAL}55`,
                      cursor: isRegistered || isLoading ? "default" : "pointer",
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                    {isLoading ? "ОТПРАВКА..." : isRegistered ? "✓ ВЫ ЗАРЕГИСТРИРОВАНЫ" : "ОТПРАВИТЬ ОТВЕТ"}
                  </button>
                </form>
              </div>
            </div>

            <div className="h-px mx-4 sm:mx-6 md:mx-14" style={{ background: "#F0E8E8" }} />

            {/* ГОСТИ */}
            <GuestsBlock guests={allGuests} currentGuestId={currentGuestId} isRegistered={isRegistered} />

            <div className="h-px mx-4 sm:mx-6 md:mx-14" style={{ background: "#F0E8E8" }} />

            {/* ГАЛЕРЕЯ (После свадьбы) */}
            <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden">
              <Flower size={100} color={PINK_LIGHT} className="hidden xl:block absolute bottom-16 left-12 pointer-events-none" rotate={-15} style={{ opacity: 0.7 }} />
              <div className="relative max-w-5xl mx-auto text-center">
                <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:text-left lg:gap-4 mb-4 lg:mb-5">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center" style={{ background: PINK_LIGHT }}>
                    <ImageIcon size={24} style={{ color: CORAL }} />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>ГАЛЕРЕЯ</div>
                </div>

                <p className="max-w-2xl mx-auto px-4 mb-8" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                  После свадьбы здесь появятся фото и видео с нашего праздника
                </p>

                <div className="rounded-3xl p-12 lg:p-16" style={{ background: "linear-gradient(135deg, #FFF9F8 0%, #FFF 100%)", border: `2px dashed ${PINK}` }}>
                  <Camera size={48} style={{ color: CORAL, margin: "0 auto 16px", opacity: 0.5 }} />
                  <div style={{ fontWeight: 800, fontSize: "clamp(18px, 2vw, 24px)", color: "#999", marginBottom: "8px" }}>
                    Скоро здесь появятся фотографии
                  </div>
                  <p style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#aaa", lineHeight: 1.6 }}>
                    {heroSettings.subtitle || "5-6 сентября 2026"}
                  </p>
                </div>
              </div>
            </div>
            <div className="h-px mx-4 sm:mx-6 md:mx-14" style={{ background: "#F0E8E8" }} />

            {/* МУЗЫКАЛЬНЫЕ ПОЖЕЛАНИЯ */}
            <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden">
              <Flower size={100} color={PINK} className="hidden xl:block absolute top-16 right-12 pointer-events-none" rotate={30} style={{ opacity: 0.7 }} />
              <div className="relative max-w-3xl mx-auto">
                <div className="text-center mb-10 lg:mb-12">
                  <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:text-left lg:gap-4 mb-4 lg:mb-5">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center" style={{ background: PINK_LIGHT }}>
                      <ListMusic size={24} style={{ color: CORAL }} />
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>
                      {musicSettings.title || "Ваша песня"}
                    </div>
                  </div>
                  <p className="max-w-2xl mx-auto px-4" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                    {musicSettings.description}
                  </p>
                </div>

                <div className="rounded-3xl p-6 lg:p-8" style={{ background: PINK_LIGHT }}>
                  <textarea
                    value={musicInput}
                    onChange={(e) => setMusicInput(e.target.value)}
                    placeholder="Название песни и исполнитель..."
                    rows={3}
                    className="w-full px-5 py-4 rounded-2xl outline-none resize-none border-2"
                    style={{ background: "white", fontSize: "clamp(14px, 1.3vw, 16px)", borderColor: musicInput ? PINK : "transparent", fontWeight: 500 }}
                  />
                  <button
                    onClick={handleMusicSubmit}
                    disabled={isLoading || !musicInput.trim()}
                    className="mt-4 w-full py-4 rounded-full text-white transition active:scale-[0.98]"
                    style={{
                      background: CORAL,
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      fontSize: "clamp(13px, 1.3vw, 15px)",
                      boxShadow: `0 8px 24px ${CORAL}55`,
                      opacity: isLoading || !musicInput.trim() ? 0.6 : 1,
                      cursor: isLoading || !musicInput.trim() ? "default" : "pointer"
                    }}
                  >
                    {isLoading ? "ОТПРАВКА..." : "ОТПРАВИТЬ ПОЖЕЛАНИЕ"}
                  </button>
                </div>
              </div>
            </div>

            <div className="h-px mx-4 sm:mx-6 md:mx-14" style={{ background: "#F0E8E8" }} />

            {/* FAQ */}
            <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative">
              <div className="relative max-w-4xl mx-auto">
                <div className="text-center mb-10 lg:mb-14">
                  <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:text-left lg:gap-4 mb-4 lg:mb-5">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center" style={{ background: PINK_LIGHT }}>
                      <HelpCircle size={24} style={{ color: CORAL }} />
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>
                      {faqSettings.title || "Вопросы и ответы"}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {(faqItems.length ? faqItems : [
                    { q: "Можно ли с детьми?", a: "Да, дети приветствуются! Для них будет организована отдельная зона с развлечениями." },
                    { q: "Можно ли привести +1?", a: "Пожалуйста, укажите количество гостей при регистрации. Мы будем рады всем!" },
                    { q: "Будет ли трансфер?", a: "Информация о трансфере появится позднее на этом сайте." },
                    { q: "Во сколько заканчивается праздник?", a: "Официальная часть завершится около 23:00, но веселье может продолжиться!" },
                    { q: "Можно ли дарить цветы?", a: "Мы будем рады любым цветам, но можете выбрать подарок из нашего списка пожеланий." },
                    { q: "Где остановиться?", a: "Рекомендации по отелям в Краснодаре появятся позднее." },
                  ]).map((faq, i) => (
                    <details key={i} className="group rounded-2xl lg:rounded-3xl overflow-hidden transition-all" style={{ background: "#FBF6F4", border: "1px solid #F0E8E8" }}>
                      <summary className="px-6 py-5 lg:px-8 lg:py-6 cursor-pointer list-none flex items-center justify-between" style={{ fontWeight: 700, fontSize: "clamp(15px, 1.4vw, 18px)" }}>
                        <span>{faq.q}</span>
                        <ArrowUpRight size={20} className="transition-transform duration-300 group-open:rotate-90" style={{ color: CORAL }} />
                      </summary>
                      <div className="px-6 pb-5 lg:px-8 lg:pb-6" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.7 }}>
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* CLOSING WITH FAMILY PHOTO */}
        <section className="relative">
          <div className="relative h-[60vh] sm:h-[70vh] lg:h-[85vh] xl:h-[90vh]">
            <div className="absolute inset-0 overflow-hidden">
              <ImageWithFallback src={siteImages.family} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(100%) brightness(0.6)" }} />
            </div>
            <Flower size={64} color={CORAL} className="absolute top-4 left-4 z-10 pointer-events-none sm:hidden" rotate={-15} style={{ opacity: 0.9 }} />
            <Flower size={80} color={CORAL} className="hidden sm:block absolute top-8 left-6 lg:top-16 lg:left-16 z-10 pointer-events-none" rotate={-15} style={{ opacity: 0.9 }} />
            <Flower size={96} color={PINK} className="absolute bottom-6 right-4 z-10 pointer-events-none sm:bottom-10 sm:right-8 lg:bottom-16 lg:right-16" rotate={25} />
            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-12">
              <div className="text-center text-white max-w-2xl">
                <div style={{ fontWeight: 900, fontSize: "clamp(28px, 5vw, 72px)", lineHeight: 0.95, letterSpacing: "-0.02em" }}>
                  {(closingSettings.title || "Будем ждать вас с нетерпением!").split(" ").map((word, index, words) => (
                    <React.Fragment key={`${word}-${index}`}>
                      {index > 0 && index === Math.ceil(words.length / 2) ? <br /> : null}
                      {word}{index < words.length - 1 ? " " : ""}
                    </React.Fragment>
                  ))}
                </div>
                {closingSettings.description ? (
                  <p className="mt-6" style={{ fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.6, opacity: 0.9 }}>
                    {closingSettings.description}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
