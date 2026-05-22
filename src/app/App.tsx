import React, { useEffect, useMemo, useState } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Heart, Gift, Utensils, Cake, Sparkles, MapPin, Calendar, Upload, Check, Plane, BedDouble, Coffee, UtensilsCrossed, ChefHat, Wine, ArrowUpRight, Users, Camera, Compass, Home, Car, Sofa, Tv, Music, Gamepad2, Package, BookHeart, Palette, HelpCircle, ListMusic, ImageIcon, Smartphone, Mouse, Battery, ShoppingBag, Wrench, Monitor, Ticket, Mountain, CircleDollarSign, Dumbbell, Store, Globe, Wallet, Palette as PaletteIcon, Box, Bike, X } from "lucide-react";
import { registerGuest, fetchGiftCatalog, fetchGuests, bookGift, fetchGiftBookings, addMusicWish, fetchMusicWishes } from "./api/wedding-api";
import { getGiftIconByKey } from "./shared/gift-icons";
import type { GiftBooking, GiftCategory, Guest, MusicWish, TravelOption, WeddingGift } from "./shared/wedding-types";
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

const BG = photo10;
const DANCE = photo04;
const VENUE = photo18;
const FAMILY = photo17;
const DRESS2 = photo01;
const DRESS3 = photo18;

const MOOD_IMAGES = [
  photo01,
  photo02,
  photo03,
  photo04,
  photo05,
  photo06,
  photo07,
  photo08,
  photo09,
  photo10,
  photo11,
  photo12,
  photo13,
  photo14,
  photo15,
  photo16,
  photo17,
  photo18,
];

const MOOD_LABELS = [
  "Нежность",
  "Взгляд",
  "Рядом",
  "Закат",
  "Улыбки",
  "Тепло",
  "Объятия",
  "Свет",
  "История",
  "Магия",
  "Момент",
  "Тишина",
  "Искры",
  "Романтика",
  "Чувства",
  "Память",
  "Семья",
  "Любовь",
];

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

// РџСЂРёРјРµСЂС‹ РіРѕСЃС‚РµР№ (Р·Р°РјРµРЅРёС‚Рµ РЅР° СЂРµР°Р»СЊРЅС‹С… РїРѕСЃР»Рµ СЂРµРіРёСЃС‚СЂР°С†РёРё)
const GROOM_GUESTS = [
  // { name: "Р”РјРёС‚СЂРёР№ РћСЂР»РѕРІ", role: "РЎРІРёРґРµС‚РµР»СЊ" },
];

const BRIDE_GUESTS = [
  // { name: "Р•РєР°С‚РµСЂРёРЅР° Р›РµР±РµРґРµРІР°", role: "РЎРІРёРґРµС‚РµР»СЊРЅРёС†Р°" },
];

const AVATAR_COLORS = ["#F4B6BE", "#FBD3D8", "#F4E1D2", "#D9A89A", "#FFC4B0", "#FFE0DC"];

function initials(name: string) {
  return name
    .split(/[\s&Рё]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function GuestAvatar({ name, idx, isYou = false, photo }: { name: string; idx: number; isYou?: boolean; photo?: string | null }) {
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
            <img src={photo} alt={name} className="w-full h-full object-cover" />
          ) : (
            initials(name)
          )}
        </div>
        {isYou && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 sm:px-2 py-0.5 rounded-full" style={{ background: "#1a1a1a", color: "white", fontSize: 8, fontWeight: 800, letterSpacing: "0.08em" }}>
            Р’Р«
          </div>
        )}
      </div>
      <div className="text-center px-1">
        <div style={{ fontWeight: 700, fontSize: "clamp(10px, 2.5vw, 12px)", lineHeight: 1.2 }}>{name}</div>
      </div>
    </div>
  );
}

function GuestsBlock({ guests, currentGuestId, isRegistered }: { guests: any[]; currentGuestId: string | null; isRegistered: boolean }) {
  const groom = [...GROOM_GUESTS];
  const bride = [...BRIDE_GUESTS];

  guests.forEach((guest) => {
    const entry = { name: guest.name, role: "Р“РѕСЃС‚СЊ", isYou: guest.id === currentGuestId, photo: guest.photo };
    if (guest.side === "РЎРѕ СЃС‚РѕСЂРѕРЅС‹ РРІР°РЅР°") groom.push(entry as any);
    else if (guest.side === "РЎРѕ СЃС‚РѕСЂРѕРЅС‹ РђРЅР°СЃС‚Р°СЃРёРё") bride.push(entry as any);
  });

  const Column = ({ title, who, list, color }: any) => (
    <div className="flex-1">
      <div className="flex items-baseline justify-between mb-6 lg:mb-8">
        <div>
          <div style={{ fontWeight: 800, fontSize: "clamp(10px, 1vw, 11px)", letterSpacing: "0.25em", color: "#999" }}>РЎРћ РЎРўРћР РћРќР«</div>
          <div className="mt-1.5 lg:mt-2" style={{ fontWeight: 900, fontSize: "clamp(22px, 2.5vw, 34px)", letterSpacing: "-0.01em", color: "#1a1a1a" }}>{who}</div>
        </div>
        <div className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-full" style={{ background: "#E85A4F", color: "white", fontWeight: 800, fontSize: "clamp(11px, 1.1vw, 12px)", letterSpacing: "0.05em" }}>
          {list.length} Р“РћРЎРўР•Р™
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
          <div className="inline-flex items-center gap-3 lg:gap-4 mb-4 lg:mb-5">
            <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center" style={{ background: "#FBD3D8" }}>
              <Users size={24} style={{ color: "#E85A4F" }} />
            </div>
            <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>
              РќРђРЁР Р“РћРЎРўР
            </div>
          </div>
          <p className="max-w-2xl mx-auto px-4" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
            РЎР°РјС‹Рµ Р±Р»РёР·РєРёРµ Р»СЋРґРё, РєРѕС‚РѕСЂС‹Рµ СЂР°Р·РґРµР»СЏС‚ СЃ РЅР°РјРё СЌС‚РѕС‚ РґРµРЅСЊ.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-12 xl:gap-16 relative">
          <Column title="Р–РµРЅРёС…" who="РР’РђРќРђ" list={groom} color="#E85A4F" />
          <div className="hidden lg:block absolute left-1/2 top-2 bottom-2 w-px" style={{ background: "#F0E8E8" }} />
          <Column title="РќРµРІРµСЃС‚Р°" who="РђРќРђРЎРўРђРЎРР" list={bride} color="#F4B6BE" />
        </div>

        {!isRegistered && (
          <div className="mt-12 lg:mt-16 text-center">
            <a
              href="#rsvp"
              className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-3.5 rounded-full transition active:scale-95"
              style={{ background: "#FBF6F4", color: "#1a1a1a", fontWeight: 800, fontSize: "clamp(11px, 1.1vw, 13px)", letterSpacing: "0.08em" }}
            >
              + РџР РРЎРћР•Р”РРќРРўР¬РЎРЇ Рљ РЎРџРРЎРљРЈ
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

type Side = "РЎРѕ СЃС‚РѕСЂРѕРЅС‹ РРІР°РЅР°" | "РЎРѕ СЃС‚РѕСЂРѕРЅС‹ РђРЅР°СЃС‚Р°СЃРёРё" | "";
type Attend = "РџСЂРёРґСѓ РѕРґРёРЅ/РѕРґРЅР°" | "РџСЂРёРґСѓ СЃ РїР°СЂРѕР№" | "РџСЂРёРґСѓ СЃ СЃРµРјСЊС‘Р№" | "РќРµ СЃРјРѕРіСѓ" | "";
type CatalogGiftCard = WeddingGift & {
  category: string;
  price: string;
  special?: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
};

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

  const loadData = async () => {
    const [guests, bookings, wishes, catalog] = await Promise.all([
      fetchGuests(),
      fetchGiftBookings(),
      fetchMusicWishes(),
      fetchGiftCatalog(),
    ]);

    setAllGuests(guests);
    setGiftBookings(bookings);
    setMusicWishes(wishes);
    setGiftCategories(catalog.categories);
    setGiftCatalog(catalog.gifts);
  };

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
      showToast("Р—Р°РїРѕР»РЅРёС‚Рµ РёРјСЏ, СЃС‚РѕСЂРѕРЅСѓ Рё РїСЂРёСЃСѓС‚СЃС‚РІРёРµ");
      return;
    }

    setIsLoading(true);
    const willAttend = form.attend !== "РќРµ СЃРјРѕРіСѓ";
    const guestsCount = form.attend === "РџСЂРёРґСѓ СЃ СЃРµРјСЊС‘Р№" ? 3 : form.attend === "РџСЂРёРґСѓ СЃ РїР°СЂРѕР№" ? 2 : 1;

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
      setIsRegistered(true);
      setCurrentGuestId(result.guest.id);
      showToast("Р РµРіРёСЃС‚СЂР°С†РёСЏ РїРѕРґС‚РІРµСЂР¶РґРµРЅР°! РўРµРїРµСЂСЊ РјРѕР¶РЅРѕ Р±СЂРѕРЅРёСЂРѕРІР°С‚СЊ РїРѕРґР°СЂРѕРє");
      await loadData();
    } else {
      showToast(result.error || "РћС€РёР±РєР° СЂРµРіРёСЃС‚СЂР°С†РёРё");
    }
  };

  const handleOpenTravelModal = (id: number) => {
    if (!isRegistered || !currentGuestId) {
      showToast("РЎРЅР°С‡Р°Р»Р° Р·Р°РїРѕР»РЅРёС‚Рµ С„РѕСЂРјСѓ СЂРµРіРёСЃС‚СЂР°С†РёРё");
      document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (currentGuestTravelBooking) {
      showToast(`Р’С‹ СѓР¶Рµ РІС‹Р±СЂР°Р»Рё РЅР°РїСЂР°РІР»РµРЅРёРµ: ${currentGuestTravelBooking.selectedCountry}`);
      return;
    }

    setActiveTravelGiftId(id);
  };

  const handleBook = async (id: number, selectedCountry?: string) => {
    if (!isRegistered || !currentGuestId) {
      showToast("РЎРЅР°С‡Р°Р»Р° Р·Р°РїРѕР»РЅРёС‚Рµ С„РѕСЂРјСѓ СЂРµРіРёСЃС‚СЂР°С†РёРё");
      document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const targetGift = giftCatalog.find((gift) => gift.id === id);
    const isTravelGift = targetGift?.bookingMode === "travel";
    const isCountMultiple = targetGift?.bookingMode === "multiple";

    if (isTravelGift) {
      if (!selectedCountry) {
        showToast("РЎРЅР°С‡Р°Р»Р° РІС‹Р±РµСЂРёС‚Рµ СЃС‚СЂР°РЅСѓ РёР»Рё РЅР°РїСЂР°РІР»РµРЅРёРµ");
        return;
      }

      if (currentGuestTravelBooking) {
        showToast(`Р’С‹ СѓР¶Рµ РІС‹Р±СЂР°Р»Рё РЅР°РїСЂР°РІР»РµРЅРёРµ: ${currentGuestTravelBooking.selectedCountry}`);
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
      showToast(isTravelGift ? "РќР°РїСЂР°РІР»РµРЅРёРµ РІС‹Р±СЂР°РЅРѕ, СЃРїР°СЃРёР±Рѕ!" : "РџРѕРґР°СЂРѕРє Р·Р°Р±СЂРѕРЅРёСЂРѕРІР°РЅ, СЃРїР°СЃРёР±Рѕ!");
      await loadData();
    } else if (result.bookedBy) {
      showToast(`РџРѕРґР°СЂРѕРє СѓР¶Рµ Р·Р°Р±СЂРѕРЅРёСЂРѕРІР°РЅ (${result.bookedBy})`);
      await loadData();
    } else {
      showToast(result.error || "РћС€РёР±РєР° Р±СЂРѕРЅРёСЂРѕРІР°РЅРёСЏ");
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
      showToast("Р’РІРµРґРёС‚Рµ РЅР°Р·РІР°РЅРёРµ РїРµСЃРЅРё");
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
      showToast("РџРѕР¶РµР»Р°РЅРёРµ РѕС‚РїСЂР°РІР»РµРЅРѕ!");
      await loadData();
    } else {
      showToast(result.error || "РћС€РёР±РєР° РѕС‚РїСЂР°РІРєРё");
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
            aria-label="Р—Р°РєСЂС‹С‚СЊ РѕРєРЅРѕ РІС‹Р±РѕСЂР° РЅР°РїСЂР°РІР»РµРЅРёСЏ"
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
                aria-label="Р—Р°РєСЂС‹С‚СЊ"
              >
                <X size={20} />
              </button>

              <div className="relative pr-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: PINK_LIGHT, color: CORAL, fontSize: 11, fontWeight: 900, letterSpacing: "0.12em" }}>
                  <Plane size={14} strokeWidth={2.5} />
                  РџРЈРўР•РЁР•РЎРўР’РР•
                </div>
                <div style={{ fontWeight: 900, fontSize: "clamp(26px, 4vw, 46px)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {activeTravelGift.name}
                </div>
                <p className="mt-3 max-w-2xl" style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "#666", lineHeight: 1.65 }}>
                  Р’С‹Р±РµСЂРёС‚Рµ РѕРґРЅРѕ РЅР°РїСЂР°РІР»РµРЅРёРµ, РєСѓРґР° РЅР°Рј Р±СѓРґРµС‚ РѕСЃРѕР±РµРЅРЅРѕ РїСЂРёСЏС‚РЅРѕ РѕС‚РїСЂР°РІРёС‚СЊСЃСЏ. РџРѕСЃР»Рµ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ РёР·РјРµРЅРёС‚СЊ РІС‹Р±РѕСЂ СЃРјРѕР¶РµС‚ С‚РѕР»СЊРєРѕ Р°РґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ СЃР°Р№С‚Р°.
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
                  {activeSelectedCountry ? `Р’С‹ РІС‹Р±СЂР°Р»Рё: ${activeSelectedCountry}` : "РЎРЅР°С‡Р°Р»Р° РІС‹Р±РµСЂРёС‚Рµ РЅР°РїСЂР°РІР»РµРЅРёРµ РёР· СЃРїРёСЃРєР°"}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!activeSelectedCountry) {
                      showToast("РЎРЅР°С‡Р°Р»Р° РІС‹Р±РµСЂРёС‚Рµ СЃС‚СЂР°РЅСѓ РёР»Рё РЅР°РїСЂР°РІР»РµРЅРёРµ");
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
                  РџРћР”РўР’Р•Р Р”РРўР¬ Р’Р«Р‘РћР 
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FIXED GRAYSCALE BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback src={BG} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(100%) brightness(0.55)" }} />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 overflow-x-hidden">
        {/* HERO */}
        <section className="px-4 sm:px-6 lg:px-12 pt-16 sm:pt-20 lg:pt-24 xl:pt-32 pb-20 sm:pb-24 lg:pb-32 text-white relative overflow-hidden">
          <Flower size={140} color={PINK} className="hidden lg:block absolute top-12 right-12 xl:right-20" rotate={20} style={{ opacity: 0.95 }} />
          <Flower size={90} color={PINK_LIGHT} className="hidden lg:block absolute top-56 left-12 xl:left-20" rotate={-15} />
          <div className="max-w-2xl mx-auto">
            <h1 style={{ fontWeight: 900, fontSize: "clamp(36px, 6vw, 88px)", lineHeight: 0.95, letterSpacing: "-0.02em" }}>
              РЎР’РђР”Р•Р‘РќРћР•<br/>РџР РР“Р›РђРЁР•РќРР•
            </h1>
          </div>
        </section>

        {/* WIDE WHITE CARD */}
        <div className="relative px-2 sm:px-4 md:px-6 lg:px-8 pb-20 sm:pb-32 overflow-x-hidden">
          {/* decorative flowers peeking from edges */}
          <Flower size={130} color={CORAL} className="hidden 2xl:block absolute -top-10 left-2 z-20 pointer-events-none" rotate={-25} style={{ opacity: 0.95 }} />
          <Flower size={120} color={PINK} className="hidden 2xl:block absolute top-[14%] right-2 z-20 pointer-events-none" rotate={30} />
          <Flower size={110} color={PINK_LIGHT} className="hidden 2xl:block absolute top-[38%] left-2 z-20 pointer-events-none" rotate={10} />
          <Flower size={130} color={CORAL} className="hidden 2xl:block absolute top-[62%] right-2 z-20 pointer-events-none" rotate={-20} style={{ opacity: 0.9 }} />
          <Flower size={100} color={PINK} className="hidden 2xl:block absolute bottom-24 left-2 z-20 pointer-events-none" rotate={45} />

          <div className="relative z-10 max-w-7xl mx-auto bg-white overflow-hidden" style={{ borderRadius: "clamp(20px, 3vw, 36px) clamp(20px, 3vw, 36px) 0 0", boxShadow: "0 30px 80px rgba(0,0,0,0.25)" }}>

            {/* HERO: NAMES + DANCE вЂ” wide editorial split */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:min-h-[700px] xl:min-h-[750px] overflow-hidden">
                <ImageWithFallback src={DANCE} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(100%) contrast(1.05)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)" }} />
                <div
                  className="absolute left-4 sm:left-6 lg:left-12 xl:left-16 top-[42%] px-5 sm:px-7 lg:px-9 py-2.5 sm:py-3 lg:py-3.5 text-white"
                  style={{ background: CORAL, fontWeight: 900, letterSpacing: "0.15em", fontSize: "clamp(13px, 1.6vw, 18px)", transform: "rotate(-10deg)", boxShadow: "0 8px 24px rgba(232,90,79,0.35)", borderRadius: "8px" }}
                >
                  РЎР’РђР”Р¬Р‘Рђ
                </div>
                <div
                  className="absolute right-4 sm:right-6 lg:right-12 xl:right-16 bottom-4 sm:bottom-6 lg:bottom-12 xl:bottom-16 w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44 xl:w-48 xl:h-48 rounded-full flex flex-col items-center justify-center text-white text-center"
                  style={{ background: CORAL, fontWeight: 800, boxShadow: "0 12px 32px rgba(0,0,0,0.3)", padding: "12px" }}
                >
                  <div style={{ fontSize: "clamp(16px, 1.8vw, 22px)", lineHeight: 1.1, marginBottom: "4px", fontWeight: 900 }}>5-6</div>
                  <div style={{ fontSize: "clamp(14px, 1.5vw, 18px)", lineHeight: 1, fontWeight: 800, letterSpacing: "0.05em" }}>РЎР•РќРў.</div>
                  <div style={{ fontSize: "clamp(16px, 1.8vw, 22px)", lineHeight: 1.1, marginTop: "4px", fontWeight: 900 }}>2026</div>
                </div>
              </div>

              <div className="lg:col-span-5 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 xl:px-12 xl:py-14 flex flex-col justify-center relative">
                <Flower size={90} color={PINK_LIGHT} className="hidden lg:block absolute top-8 right-8 pointer-events-none" rotate={20} style={{ opacity: 0.7 }} />
                <div className="relative max-w-full">
                  <div style={{ color: CORAL, fontWeight: 800, letterSpacing: "0.2em", fontSize: "clamp(12px, 1.4vw, 15px)", lineHeight: 1.4 }}>5-6 РЎР•РќРўРЇР‘Р РЇ 2026</div>
                  <h1 className="mt-4 sm:mt-6 lg:mt-8" style={{ fontWeight: 900, fontSize: "clamp(44px, 5.5vw, 82px)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
                    РР’РђРќ
                  </h1>
                  <div className="my-2 sm:my-3 lg:my-4 flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <div className="h-px flex-1" style={{ background: INK }} />
                    <span style={{ fontWeight: 800, fontSize: "clamp(16px, 2vw, 22px)", color: CORAL }}>&amp;</span>
                    <div className="h-px flex-1" style={{ background: INK }} />
                  </div>
                  <h1 style={{ fontWeight: 900, fontSize: "clamp(38px, 4.8vw, 72px)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
                    РђРќРђРЎРўРђРЎРРЇ
                  </h1>
                  <p className="mt-6 sm:mt-8 lg:mt-10" style={{ fontSize: "clamp(15px, 1.4vw, 17px)", color: "#555", lineHeight: 1.6 }}>
                    Р‘СѓРґРµРј СЃС‡Р°СЃС‚Р»РёРІС‹ РІРёРґРµС‚СЊ РІР°СЃ РІ СЌС‚РѕС‚ РґРµРЅСЊ СЂСЏРґРѕРј.
                  </p>
                </div>
              </div>
            </div>

            {/* Р”РћР РћР“РР• Р”Р РЈР—Р¬РЇ + РњР•РЎРўРћ вЂ” two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t" style={{ borderColor: "#F0E8E8" }}>
              <div className="p-6 sm:p-8 lg:p-12 xl:p-16 lg:border-r" style={{ borderColor: "#F0E8E8" }}>
                <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 mb-5 lg:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: PINK_LIGHT }}>
                    <Heart size={24} style={{ color: CORAL }} fill={CORAL} />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "clamp(22px, 2.5vw, 36px)", letterSpacing: "-0.01em", lineHeight: 1.1 }}>Р”РћР РћР“РР• Р”Р РЈР—Р¬РЇ!</div>
                </div>
                <p style={{ fontSize: "clamp(15px, 1.3vw, 17px)", lineHeight: 1.7, color: "#555" }}>
                  РЎ СЂР°РґРѕСЃС‚СЊСЋ Рё С‚СЂРµРїРµС‚РѕРј РїСЂРёРіР»Р°С€Р°РµРј РІР°СЃ СЂР°Р·РґРµР»РёС‚СЊ СЃ РЅР°РјРё РѕРґРёРЅ РёР· СЃР°РјС‹С… СЃС‡Р°СЃС‚Р»РёРІС‹С… РґРЅРµР№ РЅР°С€РµР№ Р¶РёР·РЅРё вЂ” РґРµРЅСЊ РЅР°С€РµР№ СЃРІР°РґСЊР±С‹. Р‘СѓРґРµРј СЃС‡Р°СЃС‚Р»РёРІС‹ РІРёРґРµС‚СЊ РІР°СЃ СЂСЏРґРѕРј, С‡С‚РѕР±С‹ РІРјРµСЃС‚Рµ СЃРѕР·РґР°С‚СЊ РІРѕСЃРїРѕРјРёРЅР°РЅРёСЏ, РєРѕС‚РѕСЂС‹Рµ РѕСЃС‚Р°РЅСѓС‚СЃСЏ СЃ РЅР°РјРё РЅР°РІСЃРµРіРґР°.
                </p>
              </div>

              <div className="p-6 sm:p-8 lg:p-12 xl:p-16 border-t lg:border-t-0" style={{ borderColor: "#F0E8E8" }}>
                <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 mb-5 lg:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: PINK_LIGHT }}>
                    <MapPin size={24} style={{ color: CORAL }} />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "clamp(20px, 2.5vw, 34px)", letterSpacing: "-0.01em", lineHeight: 1.1 }}>РњР•РЎРўРћ РџР РћР’Р•Р”Р•РќРРЇ</div>
                </div>
                <p style={{ fontSize: "clamp(14px, 1.2vw, 16px)", color: "#666", lineHeight: 1.7 }}>
                  Рі. РљСЂР°СЃРЅРѕРґР°СЂ<br/>РўРѕС‡РЅС‹Р№ Р°РґСЂРµСЃ РїРѕСЏРІРёС‚СЃСЏ РїРѕР·РґРЅРµРµ РЅР° СЃР°Р№С‚Рµ
                </p>
                <div className="mt-6 lg:mt-7 rounded-2xl lg:rounded-3xl overflow-hidden aspect-[16/9]">
                  <ImageWithFallback src={VENUE} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(40%)" }} />
                </div>
                <button
                  className="mt-5 lg:mt-6 px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 rounded-full text-white transition active:scale-[0.98] inline-flex items-center gap-2"
                  style={{ background: CORAL, fontWeight: 800, letterSpacing: "0.08em", fontSize: "clamp(11px, 1.2vw, 13px)" }}
                  onClick={() => window.open("https://maps.google.com", "_blank")}
                >
                  РџРћРЎРњРћРўР Р•РўР¬ РќРђ РљРђР РўР• в†’
                </button>
              </div>
            </div>

            {/* Р РђРЎРџРћР РЇР”РћРљ Р”РќРЇ вЂ” coral wide grid */}
            <div style={{ background: CORAL }} className="text-white relative">
              <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24">
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 mb-10 lg:mb-14">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
                    <Calendar size={24} color="white" />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "clamp(24px, 3.5vw, 52px)", letterSpacing: "-0.02em" }}>Р РђРЎРџРћР РЇР”РћРљ Р”РќРЇ</div>
                </div>

                <div className="max-w-3xl mx-auto text-center">
                  <div className="rounded-3xl p-8 sm:p-10 lg:p-12 xl:p-14" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6 lg:mb-8" style={{ color: CORAL }}>
                      <Calendar size={32} />
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "16px" }}>
                      РЎРєРѕСЂРѕ Р±СѓРґРµС‚ РѕРїСѓР±Р»РёРєРѕРІР°РЅ
                    </div>
                    <p style={{ fontSize: "clamp(15px, 1.4vw, 18px)", opacity: 0.9, lineHeight: 1.6 }}>
                      Р”РµС‚Р°Р»СЊРЅРѕРµ СЂР°СЃРїРёСЃР°РЅРёРµ С†РµСЂРµРјРѕРЅРёРё, Р±Р°РЅРєРµС‚Р° Рё СЂР°Р·РІР»РµС‡РµРЅРёР№ РїРѕСЏРІРёС‚СЃСЏ РїРѕР·РґРЅРµРµ.<br/>РЎР»РµРґРёС‚Рµ Р·Р° РѕР±РЅРѕРІР»РµРЅРёСЏРјРё РЅР° СЃР°Р№С‚Рµ!
                    </p>
                  </div>
                </div>
              </div>
              <ScallopedBottom color={CORAL} />
            </div>

            {/* Р”Р Р•РЎРЎ-РљРћР” */}
            <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden">
              <Flower size={110} color={PINK} className="hidden xl:block absolute top-14 right-14 pointer-events-none" rotate={20} style={{ opacity: 0.65 }} />
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16">
                <div className="lg:col-span-5 xl:col-span-4">
                  <div style={{ fontWeight: 900, fontSize: "clamp(28px, 3.5vw, 56px)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                    Р”Р Р•РЎРЎ<br/>вЂ” РљРћР”
                  </div>
                  <p className="mt-5 lg:mt-6" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.65 }}>
                    РџСЂРѕСЃРёРј РїСЂРёРґРµСЂР¶РёРІР°С‚СЊСЃСЏ РЅРµР¶РЅРѕР№ РїР°Р»РёС‚СЂС‹: РїС‹Р»СЊРЅРѕ-СЂРѕР·РѕРІС‹Р№, РєРѕСЂР°Р»Р»РѕРІС‹Р№, РєСЂРµРјРѕРІС‹Р№, Р±РµР¶РµРІС‹Р№. РР·Р±РµРіР°Р№С‚Рµ Р±РµР»РѕРіРѕ Рё С‡С‘СЂРЅРѕРіРѕ.
                  </p>
                  <div className="mt-6 lg:mt-8 flex gap-2 lg:gap-2.5 flex-wrap">
                    {[
                      { c: "#F4B6BE", n: "Р РѕР·РѕРІС‹Р№" },
                      { c: "#E85A4F", n: "РљРѕСЂР°Р»Р»" },
                      { c: "#F4E1D2", n: "РљСЂРµРј" },
                      { c: "#D9A89A", n: "Р‘РµР¶" },
                      { c: "#8A8F7A", n: "РЁР°Р»С„РµР№" },
                    ].map((p) => (
                      <div key={p.c} className="flex items-center gap-2 px-3 lg:px-3.5 py-2 rounded-full" style={{ background: "#FBF6F4" }}>
                        <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 border-white" style={{ background: p.c, boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
                        <span style={{ fontSize: "clamp(10px, 1.1vw, 12px)", fontWeight: 700, color: "#444" }}>{p.n}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-7 xl:col-span-8 grid grid-cols-3 gap-3 lg:gap-4 xl:gap-6">
                  {[DRESS2, DRESS3].map((src, i) => (
                    <div key={i} className="aspect-[3/4] rounded-2xl lg:rounded-3xl overflow-hidden group">
                      <ImageWithFallback src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-px mx-4 sm:mx-6 md:mx-14" style={{ background: "#F0E8E8" }} />

            {/* РќРђРЁРђ РРЎРўРћР РРЇ */}
            <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden">
              <Flower size={100} color={PINK_LIGHT} className="hidden xl:block absolute top-16 left-12 pointer-events-none" rotate={15} style={{ opacity: 0.7 }} />
              <Flower size={120} color={PINK} className="hidden xl:block absolute bottom-24 right-14 pointer-events-none" rotate={-18} style={{ opacity: 0.55 }} />

              <div className="relative max-w-6xl mx-auto">
                <div className="text-center mb-10 lg:mb-16">
                  <div className="inline-flex items-center gap-3 lg:gap-4 mb-4 lg:mb-5">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center" style={{ background: PINK_LIGHT }}>
                      <BookHeart size={24} style={{ color: CORAL }} />
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>РќРђРЁРђ РРЎРўРћР РРЇ</div>
                  </div>
                  <p className="max-w-2xl mx-auto px-4" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                    РџСѓС‚СЊ РѕС‚ РїРµСЂРІРѕР№ РІСЃС‚СЂРµС‡Рё РґРѕ В«Р”Р°В»
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

                  <div className="lg:hidden absolute left-5 top-5 bottom-5 border-l-4 border-dotted" style={{ borderColor: PINK }} />

                  <div className="space-y-8 lg:space-y-10 xl:space-y-12">
                    {[
                      {
                        date: "2 РєСѓСЂСЃ",
                        title: "РЁР°С…РјР°С‚С‹",
                        text: "Р’СЃС‘ РЅР°С‡Р°Р»РѕСЃСЊ РЅР° СЃРµРєС†РёРё С€Р°С…РјР°С‚. РЇ РїСЂРёС€Р»Р° РЅР° Р·Р°РЅСЏС‚РёРµ, Рё РµРґРёРЅСЃС‚РІРµРЅРЅРѕРµ СЃРІРѕР±РѕРґРЅРѕРµ РјРµСЃС‚Рѕ РѕРєР°Р·Р°Р»РѕСЃСЊ РЅР°РїСЂРѕС‚РёРІ РРІР°РЅР°. РњС‹ СЂР°Р·Р»РѕР¶РёР»Рё С„РёРіСѓСЂС‹, РЅР°С‡Р°Р»Рё РїР°СЂС‚РёСЋ вЂ” Рё РЅРµР·Р°РјРµС‚РЅРѕ СЂР°Р·РіРѕРІРѕСЂРёР»РёСЃСЊ. РЇ СЂР°СЃСЃРєР°Р·Р°Р»Р° Рѕ С…Р°РєР°С‚РѕРЅР°С…, РїРѕРєР°Р·Р°Р»Р° С„Р°РєСѓР»СЊС‚РµС‚. Р’Р°РЅСЏ Р·Р°РіРѕСЂРµР»СЃСЏ РёРґРµРµР№ Рё РїРµСЂРµРІС‘Р»СЃСЏ РЅР° СЌРєРѕРЅРѕРјРёС‡РµСЃРєРёР№.",
                        image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
                      },
                      {
                        date: "Р›РµС‚Рѕ 2024",
                        title: "РђРґР»РµСЂ Рё Р¤РР§Рђ",
                        text: "Р’РјРµСЃС‚Рµ РїРѕРµС…Р°Р»Рё РІ РђРґР»РµСЂ РїРѕ РїСЂРѕРіСЂР°РјРјРµ РїСЂРѕС„РєРѕРјР°. Рђ РїРѕС‚РѕРј РїСЂРѕС€Р»Рё РѕС‚Р±РѕСЂ РЅР° С„РѕСЂСѓРј В«Р¤РР§РђВ». РќР°С€Р° РєРѕРјР°РЅРґР° Avenir Р·Р°РЅСЏР»Р° РїРµСЂРІРѕРµ РјРµСЃС‚Рѕ РЅР° С…Р°РєР°С‚РѕРЅРµ! РњС‹ СЃС‚Р°Р»Рё РµС‰С‘ Р±Р»РёР¶Рµ.",
                        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
                      },
                      {
                        date: "РЎРµРЅС‚СЏР±СЂСЊ 2024",
                        title: "РРґРµР°С‚РѕРЅ",
                        text: "РџРѕСЃР»Рµ РјРµСЂРѕРїСЂРёСЏС‚РёСЏ В«РРґРµР°С‚РѕРЅВ», РєРѕС‚РѕСЂРѕРµ РјС‹ РѕСЂРіР°РЅРёР·РѕРІР°Р»Рё РІ СѓРЅРёРІРµСЂСЃРёС‚РµС‚Рµ, Р’Р°РЅСЏ РїСЂРµРґР»РѕР¶РёР» РјРЅРµ СЃС‚Р°С‚СЊ РїР°СЂРѕР№. РЇ РЅРµ СЂР°Р·РґСѓРјС‹РІР°Р»Р° РЅРё СЃРµРєСѓРЅРґС‹ вЂ” С‚Р°Рє РЅР°С‡Р°Р»РёСЃСЊ РЅР°С€Рё РѕС‚РЅРѕС€РµРЅРёСЏ.",
                        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
                      },
                      {
                        date: "РќРѕСЏР±СЂСЊ 2024",
                        title: "РџСЂРµРґР»РѕР¶РµРЅРёРµ",
                        text: "Р’Р°РЅСЏ РІСЃС‚Р°Р» РЅР° РѕРґРЅРѕ РєРѕР»РµРЅРѕ Рё СЃРґРµР»Р°Р» РјРЅРµ РїСЂРµРґР»РѕР¶РµРЅРёРµ СЂСѓРєРё Рё СЃРµСЂРґС†Р°. РљРѕРЅРµС‡РЅРѕ, СЏ СЃРєР°Р·Р°Р»Р° В«Р”Р°!В» РњС‹ СЃС‚СЂРѕРёРј Avenir РІРјРµСЃС‚Рµ Рё РїР»Р°РЅРёСЂСѓРµРј РЅР°С€Сѓ СЃРѕРІРјРµСЃС‚РЅСѓСЋ Р¶РёР·РЅСЊ.",
                        image: "https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
                      },
                      {
                        date: "РСЋРЅСЊ 2025",
                        title: "РќРѕРІС‹Р№ РґРѕРј",
                        text: "РњС‹ СЃСЉРµС…Р°Р»РёСЃСЊ Рё РЅР°С‡Р°Р»Рё РґРµР»Р°С‚СЊ СЂРµРјРѕРЅС‚ РІ РЅР°С€РµР№ РїРµСЂРІРѕР№ СЃРѕРІРјРµСЃС‚РЅРѕР№ РєРІР°СЂС‚РёСЂРµ. РљР°Р¶РґС‹Р№ РґРµРЅСЊ вЂ” РЅРѕРІРѕРµ РїСЂРёРєР»СЋС‡РµРЅРёРµ, РєР°Р¶РґРѕРµ СЂРµС€РµРЅРёРµ РїСЂРёРЅРёРјР°РµРј РІРјРµСЃС‚Рµ. РЎС‚СЂРѕРёРј РЅР°С€Рµ СЃРµРјРµР№РЅРѕРµ РіРЅС‘Р·РґС‹С€РєРѕ СЃРІРѕРёРјРё СЂСѓРєР°РјРё.",
                        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
                      },
                      {
                        date: "28 РѕРєС‚СЏР±СЂСЏ 2025",
                        title: "Р РѕСЃРїРёСЃСЊ",
                        text: "РћС„РёС†РёР°Р»СЊРЅРѕ СЃС‚Р°Р»Рё РјСѓР¶РµРј Рё Р¶РµРЅРѕР№! Р’ СЌС‚РѕС‚ РґРµРЅСЊ РјС‹ СЂР°СЃРїРёСЃР°Р»РёСЃСЊ Рё СЃРґРµР»Р°Р»Рё РїРµСЂРІС‹Р№ С€Р°Рі Рє РЅР°С€РµР№ Р±РѕР»СЊС€РѕР№ СЃРІР°РґСЊР±Рµ. РўРµРїРµСЂСЊ РјС‹ вЂ” СЃРµРјСЊСЏ РЅРµ С‚РѕР»СЊРєРѕ РїРѕ СЃРµСЂРґС†Сѓ, РЅРѕ Рё РїРѕ РґРѕРєСѓРјРµРЅС‚Р°Рј.",
                        image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
                      },
                      {
                        date: "РЎРµРЅС‚СЏР±СЂСЊ 2026",
                        title: "РЎРІР°РґСЊР±Р°",
                        text: "Р РІРѕС‚ РјС‹ Р·РґРµСЃСЊ вЂ” РіРѕС‚РѕРІС‹ РѕС‚РїСЂР°Р·РґРЅРѕРІР°С‚СЊ РЅР°С€Сѓ Р»СЋР±РѕРІСЊ РІРјРµСЃС‚Рµ СЃРѕ РІСЃРµРјРё, РєС‚Рѕ РЅР°Рј РґРѕСЂРѕРі. РќР°С€Р° РёСЃС‚РѕСЂРёСЏ вЂ” СЌС‚Рѕ Р»СЋР±РѕРІСЊ, РѕР±С‰РёРµ РјРµС‡С‚С‹, РїРѕР±РµРґС‹ Рё РІРµСЂР° РІ С‚Рѕ, С‡С‚Рѕ РІРјРµСЃС‚Рµ РјС‹ РјРѕР¶РµРј РІСЃС‘. РЎРїР°СЃРёР±Рѕ, С‡С‚Рѕ СЂР°Р·РґРµР»РёС‚Рµ СЃ РЅР°РјРё СЌС‚РѕС‚ РґРµРЅСЊ!",
                        image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
                      },
                    ].map((story, i) => {
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

                          <div className="absolute lg:static left-0 top-7 z-20 lg:col-start-2 lg:row-start-1 flex items-center justify-center">
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

                          <div className={`pl-14 lg:pl-0 ${isRight ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-3"}`}>
                            <div
                              className="rounded-[28px] lg:rounded-[32px] p-5 sm:p-6 lg:p-7 xl:p-8 transition-transform duration-500 hover:-translate-y-1"
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

            {/* MOODBOARD */}
            <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden">
              <Flower size={100} color={CORAL} className="hidden xl:block absolute bottom-16 right-12 pointer-events-none" rotate={-25} style={{ opacity: 0.8 }} />
              <div className="relative max-w-6xl mx-auto">
                <div className="text-center mb-10 lg:mb-14">
                  <div className="inline-flex items-center gap-3 lg:gap-4 mb-4 lg:mb-5">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center" style={{ background: PINK_LIGHT }}>
                      <Palette size={24} style={{ color: CORAL }} />
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>РђРўРњРћРЎР¤Р•Р Рђ</div>
                  </div>
                  <p className="max-w-2xl mx-auto px-4" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                    Р§РµРіРѕ РѕР¶РёРґР°С‚СЊ: СЂРѕРјР°РЅС‚РёРєР°, С‚РµРїР»Рѕ Рё РЅР°СЃС‚РѕСЏС‰РёРµ СЌРјРѕС†РёРё
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-10 lg:mb-12">
                  {MOOD_IMAGES.map((src, i) => (
                    <div key={i} className="aspect-square rounded-2xl lg:rounded-3xl flex items-center justify-center text-center transition-transform duration-300 hover:scale-105 overflow-hidden relative group">
                      <ImageWithFallback
                        src={src}
                        alt={MOOD_LABELS[i] || "Любовь"}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ filter: "grayscale(30%) brightness(0.7)" }}
                      />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(232,90,79,0.2) 0%, rgba(244,182,190,0.3) 100%)" }} />
                      <div className="relative z-10 px-4" style={{ fontWeight: 800, fontSize: "clamp(16px, 2vw, 22px)", color: "white", letterSpacing: "-0.01em", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                        {MOOD_LABELS[i] || "Любовь"}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-8 rounded-3xl" style={{ background: PINK_LIGHT, border: `2px solid ${PINK}` }}>
                  <div className="text-center mb-6">
                    <Music size={32} style={{ color: CORAL, margin: "0 auto 16px" }} />
                    <div style={{ fontWeight: 800, fontSize: "clamp(18px, 2vw, 24px)", marginBottom: "8px" }}>РњСѓР·С‹РєР°Р»СЊРЅРѕРµ РЅР°СЃС‚СЂРѕРµРЅРёРµ</div>
                    <p style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                      Р›РµРіРєРёР№ РґР¶Р°Р· РЅР° С†РµСЂРµРјРѕРЅРёРё, СЂРѕРјР°РЅС‚РёС‡РЅС‹Рµ Р±Р°Р»Р»Р°РґС‹ РЅР° СѓР¶РёРЅРµ, С‚Р°РЅС†РµРІР°Р»СЊРЅС‹Рµ С…РёС‚С‹ РІРµС‡РµСЂРѕРј
                    </p>
                  </div>

                  {musicWishes.length > 0 && (
                    <div className="mt-6 pt-6 border-t-2" style={{ borderColor: PINK }}>
                      <div style={{ fontWeight: 700, fontSize: "clamp(14px, 1.4vw, 16px)", marginBottom: "12px", color: CORAL }}>
                        РџРѕР¶РµР»Р°РЅРёСЏ РіРѕСЃС‚РµР№:
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
                                РѕС‚ {wish.guestName}
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

            {/* РџРћР–Р•Р›РђРќРРЇ / GIFTS */}
            <div id="gifts" className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden">
              <Flower size={110} color={CORAL} className="hidden xl:block absolute top-12 right-14 pointer-events-none" rotate={-15} style={{ opacity: 0.85 }} />
              <div className="relative">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 lg:gap-6 mb-10 lg:mb-14">
                  <div>
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: PINK_LIGHT }}>
                        <Gift size={24} style={{ color: CORAL }} />
                      </div>
                      <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>РџРћР–Р•Р›РђРќРРЇ</div>
                    </div>
                    <p className="mt-4 lg:mt-5 max-w-xl" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.65 }}>
                      Р’Р°С€Рµ РїСЂРёСЃСѓС‚СЃС‚РІРёРµ вЂ” Р»СѓС‡С€РёР№ РїРѕРґР°СЂРѕРє. Р•СЃР»Рё С…РѕС‚РёС‚Рµ Р±РѕР»СЊС€РµРіРѕ вЂ” РІС‹Р±РµСЂРёС‚Рµ РёРґРµСЋ РёР· СЃРїРёСЃРєР°.
                    </p>
                    <div className="mt-4 lg:mt-5 max-w-xl px-4 py-3 rounded-2xl flex items-start gap-3" style={{ background: "#FFF9F8", border: `2px solid ${CORAL}` }}>
                      <Sparkles size={20} style={{ color: CORAL, flexShrink: 0, marginTop: "2px" }} />
                      <p style={{ fontSize: "clamp(13px, 1.2vw, 15px)", color: CORAL_DARK, lineHeight: 1.65, fontWeight: 600 }}>
                        <strong>Р’Р°Р¶РЅРѕ!</strong> Р•СЃР»Рё С…РѕС‚РёС‚Рµ С‡С‚Рѕ-С‚Рѕ РїРѕРґР°СЂРёС‚СЊ РёР· СЃРїРёСЃРєР° вЂ” РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ Р·Р°Р±СЂРѕРЅРёСЂСѓР№С‚Рµ, РЅР°Р¶Р°РІ РєРЅРѕРїРєСѓ "Р—Р°Р±СЂРѕРЅРёСЂРѕРІР°С‚СЊ РїРѕРґР°СЂРѕРє". Р­С‚Рѕ РїРѕРјРѕР¶РµС‚ РёР·Р±РµР¶Р°С‚СЊ РЅРµР»РѕРІРєРёС… СЃРёС‚СѓР°С†РёР№, РєРѕРіРґР° РЅРµСЃРєРѕР»СЊРєРѕ С‡РµР»РѕРІРµРє РґР°СЂСЏС‚ РѕРґРЅРѕ Рё С‚Рѕ Р¶Рµ.
                      </p>
                    </div>
                  </div>
                  {!isRegistered && (
                    <div className="inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 lg:py-3 rounded-full shrink-0" style={{ background: "#FFF1F0", border: `1px solid ${PINK}` }}>
                      <span style={{ color: CORAL, fontWeight: 700, fontSize: "clamp(11px, 1.1vw, 12px)", letterSpacing: "0.04em" }}>
                        вљ  РЎРќРђР§РђР›Рђ Р—РђРџРћР›РќРРўР• Р¤РћР РњРЈ РќРР–Р•
                      </span>
                    </div>
                  )}
                </div>

                {/* РљРђРўР•Р“РћР РР Р¤РР›Р¬РўР  */}
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
                            <span style={{ fontSize: "clamp(9px, 1vw, 10px)", fontWeight: 800, letterSpacing: "0.08em" }}>РћРЎРћР‘Р•РќРќРћР•</span>
                          </div>
                        )}
                        {isUnavailable && (
                          <div className="absolute top-4 lg:top-5 right-4 lg:right-5 z-10 px-3 lg:px-3.5 py-1.5 rounded-full flex items-center gap-1.5" style={{ background: INK, color: "white" }}>
                            <Check size={12} strokeWidth={3} />
                            <span style={{ fontSize: "clamp(9px, 1vw, 10px)", fontWeight: 800, letterSpacing: "0.08em" }}>Р’Р—РЇРўРћ</span>
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
                            {(g.price || g.suggestedAmount) && (
                              <div className="mt-4 inline-flex rounded-full px-3 py-1.5" style={{ background: "#FFF1EF", color: CORAL, fontSize: "clamp(11px, 1.1vw, 12px)", fontWeight: 800 }}>
                                {g.price || `Рекомендуемая сумма: ${g.suggestedAmount}`}
                              </div>
                            )}
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
                                <span>РџРћРЎРњРћРўР Р•РўР¬</span>
                                <ArrowUpRight size={12} strokeWidth={2.5} />
                              </a>
                            )}
                          </div>

                          {isTravelGift ? (
                            <div className="mt-7 lg:mt-8 pt-5 lg:pt-6" style={{ borderTop: "1px dashed #F0E8E8" }}>
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                  <div style={{ fontSize: "clamp(13px, 1.3vw, 15px)", color: "#666", fontWeight: 700 }}>
                                    Р’С‹Р±СЂР°Р»Рё {bookingCount} {bookingCount === 1 ? "С‡РµР»РѕРІРµРє" : bookingCount < 5 ? "С‡РµР»РѕРІРµРєР°" : "С‡РµР»РѕРІРµРє"}
                                  </div>
                                  <div className="mt-1" style={{ fontSize: "clamp(12px, 1.1vw, 13px)", color: "#999", lineHeight: 1.45 }}>
                                    РћС‚РєСЂРѕР№С‚Рµ СЃРїРёСЃРѕРє РЅР°РїСЂР°РІР»РµРЅРёР№ Рё РІС‹Р±РµСЂРёС‚Рµ РѕРґРЅРѕ.
                                  </div>
                                </div>
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: PINK_LIGHT }}>
                                  <Globe size={18} style={{ color: CORAL }} />
                                </div>
                              </div>

                              {currentGiftTravelBooking && (
                                <div className="mb-4 px-4 py-3 rounded-2xl flex items-center gap-2" style={{ background: "#E8F5E9", color: "#2E7D32", fontSize: 13, fontWeight: 800 }}>
                                  <Check size={16} strokeWidth={2.5} />
                                  <span>Р’Р°С€ РІС‹Р±РѕСЂ: {currentGiftTravelBooking.selectedCountry}</span>
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
                                    <span>РќРђРџР РђР’Р›Р•РќРР• Р’Р«Р‘Р РђРќРћ</span>
                                  </>
                                ) : (
                                  <>
                                    <Compass size={16} strokeWidth={2.5} />
                                    <span>Р’Р«Р‘Р РђРўР¬ РќРђРџР РђР’Р›Р•РќРР•</span>
                                  </>
                                )}
                              </button>
                            </div>
                          ) : isCountMultiple ? (
                            <div className="mt-7 lg:mt-8 pt-5 lg:pt-6" style={{ borderTop: "1px dashed #F0E8E8" }}>
                              <div className="flex items-center justify-between mb-4">
                                <div style={{ fontSize: "clamp(13px, 1.3vw, 15px)", color: "#666", fontWeight: 600 }}>
                                  Р’С‹Р±СЂР°Р»Рё {bookingCount} {bookingCount === 1 ? "С‡РµР»РѕРІРµРє" : bookingCount < 5 ? "С‡РµР»РѕРІРµРєР°" : "С‡РµР»РѕРІРµРє"}
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
                                <span>Р’Р«Р‘Р РђРўР¬ Р­РўРћРў РџРћР”РђР РћРљ</span>
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
                                <span>Р—РђР‘Р РћРќРР РћР’РђРќРћ</span>
                              </>
                            ) : (
                              <>
                                <Gift size={16} strokeWidth={2.5} />
                                <span>Р—РђР‘Р РћРќРР РћР’РђРўР¬ РџРћР”РђР РћРљ</span>
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
                      <span>РџРћРљРђР—РђРўР¬ Р’РЎР• РџРћР”РђР РљР</span>
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
                    РђРќРљР•РўРђ Р“РћРЎРўРЇ
                  </div>
                  <p className="mt-4 lg:mt-5" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                    РџРѕР¶Р°Р»СѓР№СЃС‚Р°, Р·Р°РїРѕР»РЅРёС‚Рµ РґРѕ 1 СЃРµРЅС‚СЏР±СЂСЏ. РџРѕСЃР»Рµ СЂРµРіРёСЃС‚СЂР°С†РёРё РѕС‚РєСЂРѕРµС‚СЃСЏ Р±СЂРѕРЅРёСЂРѕРІР°РЅРёРµ РїРѕРґР°СЂРєР°.
                  </p>
                </div>

                {isRegistered && (
                  <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: "#E8F5E9", color: "#2E7D32" }}>
                    <Check size={20} />
                    <span style={{ fontWeight: 700, fontSize: 13 }}>Р’С‹ Р·Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°РЅС‹! РЎРїР°СЃРёР±Рѕ</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="mt-6 space-y-5">
                  <div>
                    <label style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 800, color: "#555" }}>
                      РРњРЇ Р Р¤РђРњРР›РРЇ *
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      disabled={isRegistered}
                      placeholder="РРІР°РЅ РРІР°РЅРѕРІ"
                      className="w-full mt-2 px-5 py-3.5 rounded-2xl outline-none transition border-2"
                      style={{ background: "#FBF6F4", fontSize: 15, borderColor: form.name ? PINK : "transparent", fontWeight: 500 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 800, color: "#555" }}>
                      РЎ Р§Р¬Р•Р™ РЎРўРћР РћРќР« *
                    </label>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {(["РЎРѕ СЃС‚РѕСЂРѕРЅС‹ РРІР°РЅР°", "РЎРѕ СЃС‚РѕСЂРѕРЅС‹ РђРЅР°СЃС‚Р°СЃРёРё"] as Side[]).map((opt) => (
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
                      Р’РђРЁР• РџР РРЎРЈРўРЎРўР’РР• *
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {(["РџСЂРёРґСѓ РѕРґРёРЅ/РѕРґРЅР°", "РџСЂРёРґСѓ СЃ РїР°СЂРѕР№", "РџСЂРёРґСѓ СЃ СЃРµРјСЊС‘Р№", "РќРµ СЃРјРѕРіСѓ"] as Attend[]).map((opt) => (
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

                  {form.attend && form.attend !== "РџСЂРёРґСѓ РѕРґРёРЅ/РѕРґРЅР°" && form.attend !== "РќРµ СЃРјРѕРіСѓ" && (
                    <div>
                      <label style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 800, color: "#555" }}>
                        РРњР•РќРђ Р’РђРЁРРҐ Р“РћРЎРўР•Р™
                      </label>
                      <textarea
                        value={form.guests}
                        onChange={(e) => setForm({ ...form, guests: e.target.value })}
                        disabled={isRegistered}
                        placeholder="РњР°СЂРёСЏ РРІР°РЅРѕРІР°, РџС‘С‚СЂ РРІР°РЅРѕРІ"
                        rows={2}
                        className="w-full mt-2 px-5 py-3.5 rounded-2xl outline-none resize-none border-2"
                        style={{ background: "#FBF6F4", fontSize: 14, borderColor: form.guests ? PINK : "transparent", fontWeight: 500 }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 800, color: "#555" }}>
                      Р’РђРЁР• Р¤РћРўРћ В· РџРћ Р–Р•Р›РђРќРР®
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
                        Р—Р°РіСЂСѓР·РёС‚Рµ РїРѕСЂС‚СЂРµС‚ вЂ” РѕРЅ СѓРєСЂР°СЃРёС‚ СЃС‚РµРЅСѓ РіРѕСЃС‚РµР№ РЅР° РЅР°С€РµРј РїСЂР°Р·РґРЅРёРєРµ.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 800, color: "#555" }}>
                        РќРђРџРРўРљР
                      </label>
                      <input
                        value={form.drink}
                        onChange={(e) => setForm({ ...form, drink: e.target.value })}
                        disabled={isRegistered}
                        placeholder="Р’РёРЅРѕ, РїРёРІРѕвЂ¦"
                        className="w-full mt-2 px-4 py-3 rounded-2xl outline-none border-2"
                        style={{ background: "#FBF6F4", fontSize: 13, borderColor: form.drink ? PINK : "transparent", fontWeight: 500 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, letterSpacing: "0.08em", fontWeight: 800, color: "#555" }}>
                        РђР›Р›Р•Р Р“РР
                      </label>
                      <input
                        value={form.allergy}
                        onChange={(e) => setForm({ ...form, allergy: e.target.value })}
                        disabled={isRegistered}
                        placeholder="Р•СЃР»Рё РµСЃС‚СЊ"
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
                    {isLoading ? "РћРўРџР РђР’РљРђ..." : isRegistered ? "вњ“ Р’Р« Р—РђР Р•Р“РРЎРўР РР РћР’РђРќР«" : "РћРўРџР РђР’РРўР¬ РћРўР’Р•Рў"}
                  </button>
                </form>
              </div>
            </div>

            <div className="h-px mx-4 sm:mx-6 md:mx-14" style={{ background: "#F0E8E8" }} />

            {/* Р“РћРЎРўР */}
            <GuestsBlock guests={allGuests} currentGuestId={currentGuestId} isRegistered={isRegistered} />

            <div className="h-px mx-4 sm:mx-6 md:mx-14" style={{ background: "#F0E8E8" }} />

            {/* Р“РђР›Р•Р Р•РЇ (РџРѕСЃР»Рµ СЃРІР°РґСЊР±С‹) */}
            <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden">
              <Flower size={100} color={PINK_LIGHT} className="hidden xl:block absolute bottom-16 left-12 pointer-events-none" rotate={-15} style={{ opacity: 0.7 }} />
              <div className="relative max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-3 lg:gap-4 mb-4 lg:mb-5">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center" style={{ background: PINK_LIGHT }}>
                    <ImageIcon size={24} style={{ color: CORAL }} />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>Р“РђР›Р•Р Р•РЇ</div>
                </div>

                <p className="max-w-2xl mx-auto px-4 mb-8" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                  РџРѕСЃР»Рµ СЃРІР°РґСЊР±С‹ Р·РґРµСЃСЊ РїРѕСЏРІСЏС‚СЃСЏ С„РѕС‚Рѕ Рё РІРёРґРµРѕ СЃ РЅР°С€РµРіРѕ РїСЂР°Р·РґРЅРёРєР°
                </p>

                <div className="rounded-3xl p-12 lg:p-16" style={{ background: "linear-gradient(135deg, #FFF9F8 0%, #FFF 100%)", border: `2px dashed ${PINK}` }}>
                  <Camera size={48} style={{ color: CORAL, margin: "0 auto 16px", opacity: 0.5 }} />
                  <div style={{ fontWeight: 800, fontSize: "clamp(18px, 2vw, 24px)", color: "#999", marginBottom: "8px" }}>
                    РЎРєРѕСЂРѕ Р·РґРµСЃСЊ РїРѕСЏРІСЏС‚СЃСЏ С„РѕС‚РѕРіСЂР°С„РёРё
                  </div>
                  <p style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#aaa", lineHeight: 1.6 }}>
                    5-6 СЃРµРЅС‚СЏР±СЂСЏ 2026
                  </p>
                </div>
              </div>
            </div>
            <div className="h-px mx-4 sm:mx-6 md:mx-14" style={{ background: "#F0E8E8" }} />

            {/* РњРЈР—Р«РљРђР›Р¬РќР«Р• РџРћР–Р•Р›РђРќРРЇ */}
            <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden">
              <Flower size={100} color={PINK} className="hidden xl:block absolute top-16 right-12 pointer-events-none" rotate={30} style={{ opacity: 0.7 }} />
              <div className="relative max-w-3xl mx-auto">
                <div className="text-center mb-10 lg:mb-12">
                  <div className="inline-flex items-center gap-3 lg:gap-4 mb-4 lg:mb-5">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center" style={{ background: PINK_LIGHT }}>
                      <ListMusic size={24} style={{ color: CORAL }} />
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>Р’РђРЁРђ РџР•РЎРќРЇ</div>
                  </div>
                  <p className="max-w-2xl mx-auto px-4" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                    РљР°РєСѓСЋ РїРµСЃРЅСЋ РІС‹ С…РѕС‚РёС‚Рµ СѓСЃР»С‹С€Р°С‚СЊ РЅР° РЅР°С€РµР№ СЃРІР°РґСЊР±Рµ?
                  </p>
                </div>

                <div className="rounded-3xl p-6 lg:p-8" style={{ background: PINK_LIGHT }}>
                  <textarea
                    value={musicInput}
                    onChange={(e) => setMusicInput(e.target.value)}
                    placeholder="РќР°Р·РІР°РЅРёРµ РїРµСЃРЅРё Рё РёСЃРїРѕР»РЅРёС‚РµР»СЊ..."
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
                    {isLoading ? "РћРўРџР РђР’РљРђ..." : "РћРўРџР РђР’РРўР¬ РџРћР–Р•Р›РђРќРР•"}
                  </button>
                </div>
              </div>
            </div>

            <div className="h-px mx-4 sm:mx-6 md:mx-14" style={{ background: "#F0E8E8" }} />

            {/* FAQ */}
            <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative">
              <div className="relative max-w-4xl mx-auto">
                <div className="text-center mb-10 lg:mb-14">
                  <div className="inline-flex items-center gap-3 lg:gap-4 mb-4 lg:mb-5">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center" style={{ background: PINK_LIGHT }}>
                      <HelpCircle size={24} style={{ color: CORAL }} />
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>Р’РћРџР РћРЎР« Р РћРўР’Р•РўР«</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { q: "РњРѕР¶РЅРѕ Р»Рё СЃ РґРµС‚СЊРјРё?", a: "Р”Р°, РґРµС‚Рё РїСЂРёРІРµС‚СЃС‚РІСѓСЋС‚СЃСЏ! Р”Р»СЏ РЅРёС… Р±СѓРґРµС‚ РѕСЂРіР°РЅРёР·РѕРІР°РЅР° РѕС‚РґРµР»СЊРЅР°СЏ Р·РѕРЅР° СЃ СЂР°Р·РІР»РµС‡РµРЅРёСЏРјРё." },
                    { q: "РњРѕР¶РЅРѕ Р»Рё РїСЂРёРІРµСЃС‚Рё +1?", a: "РџРѕР¶Р°Р»СѓР№СЃС‚Р°, СѓРєР°Р¶РёС‚Рµ РєРѕР»РёС‡РµСЃС‚РІРѕ РіРѕСЃС‚РµР№ РїСЂРё СЂРµРіРёСЃС‚СЂР°С†РёРё. РњС‹ Р±СѓРґРµРј СЂР°РґС‹ РІСЃРµРј!" },
                    { q: "Р‘СѓРґРµС‚ Р»Рё С‚СЂР°РЅСЃС„РµСЂ?", a: "РРЅС„РѕСЂРјР°С†РёСЏ Рѕ С‚СЂР°РЅСЃС„РµСЂРµ РїРѕСЏРІРёС‚СЃСЏ РїРѕР·РґРЅРµРµ РЅР° СЌС‚РѕРј СЃР°Р№С‚Рµ." },
                    { q: "Р’Рѕ СЃРєРѕР»СЊРєРѕ Р·Р°РєР°РЅС‡РёРІР°РµС‚СЃСЏ РїСЂР°Р·РґРЅРёРє?", a: "РћС„РёС†РёР°Р»СЊРЅР°СЏ С‡Р°СЃС‚СЊ Р·Р°РІРµСЂС€РёС‚СЃСЏ РѕРєРѕР»Рѕ 23:00, РЅРѕ РІРµСЃРµР»СЊРµ РјРѕР¶РµС‚ РїСЂРѕРґРѕР»Р¶РёС‚СЊСЃСЏ!" },
                    { q: "РњРѕР¶РЅРѕ Р»Рё РґР°СЂРёС‚СЊ С†РІРµС‚С‹?", a: "РњС‹ Р±СѓРґРµРј СЂР°РґС‹ Р»СЋР±С‹Рј С†РІРµС‚Р°Рј, РЅРѕ РјРѕР¶РµС‚Рµ РІС‹Р±СЂР°С‚СЊ РїРѕРґР°СЂРѕРє РёР· РЅР°С€РµРіРѕ СЃРїРёСЃРєР° РїРѕР¶РµР»Р°РЅРёР№." },
                    { q: "Р“РґРµ РѕСЃС‚Р°РЅРѕРІРёС‚СЊСЃСЏ?", a: "Р РµРєРѕРјРµРЅРґР°С†РёРё РїРѕ РѕС‚РµР»СЏРј РІ РљСЂР°СЃРЅРѕРґР°СЂРµ РїРѕСЏРІСЏС‚СЃСЏ РїРѕР·РґРЅРµРµ." },
                  ].map((faq, i) => (
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
          <div className="relative h-[60vh] sm:h-[70vh] lg:h-[85vh] xl:h-[90vh] overflow-hidden">
            <ImageWithFallback src={FAMILY} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(100%) brightness(0.6)" }} />
            <Flower size={120} color={PINK} className="hidden lg:block absolute bottom-12 lg:bottom-16 right-8 lg:right-16" rotate={25} />
            <Flower size={80} color={CORAL} className="hidden lg:block absolute top-12 lg:top-16 left-8 lg:left-16" rotate={-15} style={{ opacity: 0.9 }} />
            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-12">
              <div className="text-center text-white max-w-2xl">
                <div style={{ fontWeight: 900, fontSize: "clamp(28px, 5vw, 72px)", lineHeight: 0.95, letterSpacing: "-0.02em" }}>
                  Р‘РЈР”Р•Рњ Р–Р”РђРўР¬ Р’РђРЎ<br/>РЎ РќР•РўР•Р РџР•РќРР•Рњ!
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
