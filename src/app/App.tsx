import React, { useState, useEffect } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Heart, Gift, Utensils, Cake, Sparkles, MapPin, Calendar, Upload, Check, Plane, BedDouble, Coffee, UtensilsCrossed, ChefHat, Wine, ArrowUpRight, Users, Camera, Compass, Home, Car, Sofa, Tv, Music, Gamepad2, Package, BookHeart, Palette, HelpCircle, ListMusic, ImageIcon, Smartphone, Mouse, Battery, ShoppingBag, Wrench, Monitor, Ticket, Mountain, CircleDollarSign, Dumbbell, Store, Globe, Wallet, Palette as PaletteIcon, Box, Bike, X } from "lucide-react";
import { registerGuest, fetchGuests, bookGift, fetchGiftBookings, addMusicWish, fetchMusicWishes } from "./api/wedding-api";

const BG = "https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=2000";
const DANCE = "https://images.unsplash.com/photo-1591604466107-ec97de577aff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1200";
const VENUE = "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1200";
const FAMILY = "https://images.unsplash.com/photo-1606800052052-a08af7148866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1600";
const DRESS2 = "https://images.unsplash.com/photo-1566174053879-31528523f8ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=500";
const DRESS3 = "https://images.unsplash.com/photo-1583939411023-14783179e581?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=500";

const MOOD_IMAGES = [
  "https://images.unsplash.com/photo-1759990620822-4ce60525e579?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1776267771539-f0c4778c55be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1772412922232-8cfbc0e83cdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1559982483-d1dff2e4a1b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1595970938999-b58d1e26739f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1639549612000-49f2cd888f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1596457221755-b96bc3a6df18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1664674845489-2f0e9cf699ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
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
    .split(/[\s&и]+/)
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
            ВЫ
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
    const entry = { name: guest.name, role: "Гость", isYou: guest.id === currentGuestId, photo: guest.photo };
    if (guest.side === "Со стороны Ивана") groom.push(entry as any);
    else if (guest.side === "Со стороны Анастасии") bride.push(entry as any);
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
          <div className="inline-flex items-center gap-3 lg:gap-4 mb-4 lg:mb-5">
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
type TravelCountry = { label: string; value: string };

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
  const [allGuests, setAllGuests] = useState<any[]>([]);
  const [bookedGifts, setBookedGifts] = useState<number[]>([]);
  const [giftBookings, setGiftBookings] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [musicWishes, setMusicWishes] = useState<any[]>([]);
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

  const loadData = async () => {
    const [guests, bookings, wishes] = await Promise.all([
      fetchGuests(),
      fetchGiftBookings(),
      fetchMusicWishes()
    ]);
    setAllGuests(guests);
    setGiftBookings(bookings);
    setMusicWishes(wishes);
    const bookedIds = bookings.map((b: any) => b.giftId);
    setBookedGifts(bookedIds);
  };

  const categories = [
    { id: "all", name: "Все подарки" },
    { id: "home", name: "Дом и быт", desc: "Все для нашего уютного дома: техника, мебель, посуда и повседневные вещи" },
    { id: "experiences", name: "Впечатления и путешествия", desc: "Незабываемые эмоции: поездки, развлечения, приключения вдвоем" },
    { id: "health", name: "Здоровье и спорт", desc: "Забота о здоровье: СПА, массаж, спортзал" },
    { id: "certificates", name: "Сертификаты и деньги", desc: "Универсальные подарки: сертификаты в магазины, рестораны, финансовая помощь" },
    { id: "nastya", name: "Для Насти", desc: "Подарки специально для невесты" },
    { id: "vanya", name: "Для Вани", desc: "Подарки специально для жениха" },
  ];

  const allGifts = [
    // Самое важное
    { id: 1, name: "Квартира", hint: "вклад в наше семейное гнёздышко в Санкт-Петербурге", Icon: Home, price: "Любая сумма", category: "home", featured: true },
    { id: 2, name: "Автомобиль", hint: "семейная машина для путешествий", Icon: Car, price: "Любая сумма", category: "home", featured: true },

    // Дом и быт
    { id: 3, name: "Набор ножей VANHOPPER", hint: "качественные кухонные ножи небольшого размера", Icon: UtensilsCrossed, price: "~3 000 ₽", category: "home", link: "https://hoff.ru/catalog/tovary_dlya_doma/posuda/kuhonnye_prinadlezhnosti/nozhi_i_aksessuary/kuhonnye_nozhi/?page=all&direct=redirect_from_search&query=Ножи&brands=vanhopper" },
    { id: 4, name: "Экран + штативы для проектора", hint: "экран для проектора Wanbo Mozart 1 + штативы для экрана и проектора", Icon: Tv, price: "~20 000 ₽", category: "home" },
    { id: 5, name: "Робот-пылесос с влажной уборкой", hint: "с Wi-Fi, лидаром и базой автоочистки, как Tuvio TR05MLCB", Icon: Home, price: "~30 000 ₽", category: "home", link: "https://market.yandex.ru/card/robot-pylesos-s-wi-fi-lidarom-vlazhnoy-uborkoy-i-bazoy-avtoochistki-tuvio-tr05mlcb-chernyy/103793116027" },
    { id: 6, name: "Набор бокалов Pragma", hint: "стильные бокалы для дома", Icon: Wine, price: "~5 000 ₽", category: "home", link: "https://market.yandex.ru/search?text=набор%20бокалов%20pragma" },
    { id: 7, name: "Автотуалет для Мони", hint: "автоматический самоочищающийся туалет для нашей кошки", Icon: Home, price: "~25 000 ₽", category: "home", link: "https://market.yandex.ru/card/avtomaticheskiy-samoochishchayushchiysya-tualet-dlya-koshek-easy-stefan-belyy-bj-lr68/103594302759" },
    { id: 8, name: "Большой набор Лего", hint: "Эйфелева башня, Колизей или другой большой набор", Icon: Box, price: "~15 000 ₽", category: "home" },
    { id: 9, name: "Аренда в VALO на 1 год", hint: "оплата нашей аренды в Питере, 58 000 ₽/мес × 12 мес", Icon: Home, price: "696 000 ₽", category: "home", special: "valo-1year" },
    { id: 10, name: "Аренда в VALO на 2 года", hint: "оплата нашей аренды в Питере, 58 000 ₽/мес × 24 мес", Icon: Home, price: "1 392 000 ₽", category: "home", special: "valo-2years" },

    // Впечатления и путешествия
    { id: 11, name: "Билеты в Сочи Парк", hint: "день развлечений в парке аттракционов", Icon: Ticket, price: "~5 000 ₽", category: "experiences", link: "https://www.sochipark.ru/" },
    { id: 12, name: "Полет на воздушном шаре", hint: "романтический полет над Питером или в путешествии", Icon: Plane, price: "~15 000 ₽", category: "experiences" },
    { id: 13, name: "Конная прогулка", hint: "прогулка верхом на лошадях", Icon: Heart, price: "~5 000 ₽", category: "experiences" },
    { id: 14, name: "Фотосессия", hint: "профессиональная фотосессия для пары", Icon: Camera, price: "~20 000 ₽", category: "experiences" },
    { id: 15, name: "Тур по России", hint: "Камчатка, Калининград, остров Южный и другие", Icon: Compass, price: "Любая сумма", category: "experiences", special: "tour-russia" },
    { id: 16, name: "Тур за границу", hint: "Турция, Франция, Германия, Китай, Япония, Италия, Канада, США, ОАЭ, Швеция, Египет, Алжир", Icon: Globe, price: "Любая сумма", category: "experiences", special: "tour-abroad" },

    // Здоровье и спорт
    { id: 17, name: "Сертификат в СПА", hint: "отдых и расслабление вдвоем", Icon: Sparkles, price: "Любая сумма", category: "health" },
    { id: 18, name: "Сертификат на массаж", hint: "профессиональный массаж", Icon: Heart, price: "Любая сумма", category: "health" },
    { id: 19, name: "Абонемент в зал VALO", hint: "годовой абонемент в спортзал в нашем доме", Icon: Dumbbell, price: "~60 000 ₽", category: "health" },

    // Сертификаты и деньги
    { id: 20, name: "Ужин в ресторане", hint: "романтический ужин (укажите ресторан при бронировании)", Icon: Utensils, price: "Любая сумма", category: "certificates", special: "count-multiple" },
    { id: 21, name: "Сертификат в кофейню", hint: "Drink it или другая кофейня рядом с домом в Питере", Icon: Coffee, price: "Любая сумма", category: "certificates", special: "count-multiple" },
    { id: 22, name: "Сертификат Wildberries", hint: "подарочный сертификат на любую сумму", Icon: ShoppingBag, price: "Любая сумма", category: "certificates", special: "count-multiple" },
    { id: 23, name: "Сертификат Ozon", hint: "подарочный сертификат на любую сумму", Icon: Store, price: "Любая сумма", category: "certificates", special: "count-multiple" },
    { id: 24, name: "Деньги", hint: "финансовая помощь (укажите сумму при бронировании)", Icon: CircleDollarSign, price: "Любая сумма", category: "certificates", special: "count-multiple" },

    // Для Насти
    { id: 101, name: "Телефон Samsung S26 512GB", hint: "цвет: синий, белый или фиолетовый", Icon: Smartphone, price: "~90 000 ₽", category: "nastya" },
    { id: 102, name: "Мышь Logitech MX Master 3S", hint: "беспроводная, черная (или 4 версия)", Icon: Mouse, price: "~10 000 ₽", category: "nastya", link: "https://www.logitech.com/ru-ru/products/mice/mx-master-3s.html" },
    { id: 103, name: "Powerbank AEON 10000мАч", hint: "портативный аккумулятор, PD 20Вт, фиолетовый", Icon: Battery, price: "~3 000 ₽", category: "nastya" },
    { id: 104, name: "Ticket to Ride: Легенды Запада", hint: "настольная игра Наследие", Icon: Gamepad2, price: "~7 000 ₽", category: "nastya", link: "https://hobbygames.ru/ticket-to-ride-nasledie-legendi-zapada" },
    { id: 105, name: "Сертификат в Intimissimi", hint: "подарочный сертификат в магазин белья", Icon: Gift, price: "Любая сумма", category: "nastya", special: "count-multiple" },

    // Для Вани
    { id: 201, name: "Настольные игры", hint: "корзина игр на Ozon (ссылка будет предоставлена)", Icon: Gamepad2, price: "Любая сумма", category: "vanya", special: "count-multiple" },
    { id: 202, name: "Телефон Samsung S26 256GB", hint: "цвет: белый или черный", Icon: Smartphone, price: "~80 000 ₽", category: "vanya" },
    { id: 203, name: "Сертификат Читай-город", hint: "подарочный сертификат в книжный магазин", Icon: Gift, price: "Любая сумма", category: "vanya", special: "count-multiple" },
    { id: 204, name: "Подставка для планшета", hint: "удобная подставка для работы", Icon: Monitor, price: "~2 000 ₽", category: "vanya" },
    { id: 205, name: "Подставка для телефона", hint: "для рабочего стола", Icon: Smartphone, price: "~1 000 ₽", category: "vanya" },
    { id: 206, name: "Колонки для компьютера", hint: "качественная акустика для ПК", Icon: Music, price: "~10 000 ₽", category: "vanya" },
    { id: 207, name: "Видеокарта для ПК", hint: "мощная графика для работы и игр", Icon: Monitor, price: "~80 000 ₽", category: "vanya" },
    { id: 208, name: "Веб-камера для ПК", hint: "с хорошим разрешением для стримов", Icon: Camera, price: "~15 000 ₽", category: "vanya" },
    { id: 209, name: "Оперативная память для ПК", hint: "апгрейд компьютера", Icon: Wrench, price: "~10 000 ₽", category: "vanya" },
    { id: 210, name: "PlayStation 5", hint: "игровая приставка Sony", Icon: Gamepad2, price: "~60 000 ₽", category: "vanya" },
    { id: 211, name: "Руль + педали + кресло", hint: "полный набор для симулятора гонок: руль, педали, коробка передач, игровое кресло", Icon: Car, price: "~50 000 ₽", category: "vanya" },
    { id: 212, name: "Акции компаний", hint: "покупка акций через Т-Банк для инвестиций", Icon: CircleDollarSign, price: "Любая сумма", category: "vanya", special: "count-multiple" },
    { id: 213, name: "Сертификат в Картинг", hint: "заезды на картах в Санкт-Петербурге", Icon: Car, price: "~5 000 ₽", category: "vanya" },
    { id: 214, name: "Игровое кресло", hint: "сертификат на покупку, нужно долго выбирать", Icon: Sofa, price: "~30 000 ₽", category: "vanya" },
    { id: 215, name: "Прыжок с парашютом", hint: "экстремальный опыт", Icon: Plane, price: "~10 000 ₽", category: "vanya" },
  ];

  const travelCountriesByGiftId: Record<number, TravelCountry[]> = {
    15: [
      { label: "Камчатка", value: "Камчатка" },
      { label: "Калининград", value: "Калининград" },
      { label: "Сахалин", value: "Сахалин" },
      { label: "Алтай", value: "Алтай" },
      { label: "Карелия", value: "Карелия" },
      { label: "Байкал", value: "Байкал" },
    ],
    16: [
      { label: "Турция", value: "Турция" },
      { label: "Франция", value: "Франция" },
      { label: "Германия", value: "Германия" },
      { label: "Китай", value: "Китай" },
      { label: "Япония", value: "Япония" },
      { label: "Италия", value: "Италия" },
      { label: "Канада", value: "Канада" },
      { label: "США", value: "США" },
      { label: "ОАЭ", value: "ОАЭ" },
      { label: "Швеция", value: "Швеция" },
      { label: "Египет", value: "Египет" },
      { label: "Алжир", value: "Алжир" },
    ],
  };

  const travelGiftIds = Object.keys(travelCountriesByGiftId).map(Number);

  const currentGuestTravelBooking = giftBookings.find(
    (booking: any) => currentGuestId && booking.guestId === currentGuestId && travelGiftIds.includes(Number(booking.giftId))
  );

  const activeTravelGift = activeTravelGiftId ? allGifts.find((gift) => gift.id === activeTravelGiftId) : null;
  const activeTravelCountries = activeTravelGiftId ? travelCountriesByGiftId[activeTravelGiftId] || [] : [];
  const activeSelectedCountry = activeTravelGiftId ? selectedTravelCountries[activeTravelGiftId] || "" : "";

  const gifts = selectedCategory === "all"
    ? allGifts
    : allGifts.filter(g => g.category === selectedCategory);

  const visibleGifts = showAllGifts ? gifts : gifts.slice(0, giftPreviewLimit);
  const hiddenGiftsCount = Math.max(gifts.length - visibleGifts.length, 0);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.side || !form.attend) {
      showToast("Заполните имя, сторону и присутствие");
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
      setIsRegistered(true);
      setCurrentGuestId(result.guest.id);
      showToast("Регистрация подтверждена! Теперь можно бронировать подарок");
      await loadData();
    } else {
      showToast(result.error || "Ошибка регистрации");
    }
  };

  const handleOpenTravelModal = (id: number) => {
    if (!isRegistered || !currentGuestId) {
      showToast("Сначала заполните форму регистрации");
      document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
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
      document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const isTravelGift = travelGiftIds.includes(id);

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

    if (!isTravelGift && bookedGifts.includes(id)) return;

    setIsLoading(true);
    const result = await bookGift({
      giftId: id,
      guestId: currentGuestId,
      guestName: form.name,
      selectedCountry,
    });
    setIsLoading(false);

    if (result.success) {
      setBookedGifts([...bookedGifts, id]);
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
              СВАДЕБНОЕ<br/>ПРИГЛАШЕНИЕ
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

            {/* HERO: NAMES + DANCE — wide editorial split */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:min-h-[700px] xl:min-h-[750px] overflow-hidden">
                <ImageWithFallback src={DANCE} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(100%) contrast(1.05)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)" }} />
                <div
                  className="absolute left-4 sm:left-6 lg:left-12 xl:left-16 top-[42%] px-5 sm:px-7 lg:px-9 py-2.5 sm:py-3 lg:py-3.5 text-white"
                  style={{ background: CORAL, fontWeight: 900, letterSpacing: "0.15em", fontSize: "clamp(13px, 1.6vw, 18px)", transform: "rotate(-10deg)", boxShadow: "0 8px 24px rgba(232,90,79,0.35)", borderRadius: "8px" }}
                >
                  СВАДЬБА
                </div>
                <div
                  className="absolute right-4 sm:right-6 lg:right-12 xl:right-16 bottom-4 sm:bottom-6 lg:bottom-12 xl:bottom-16 w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44 xl:w-48 xl:h-48 rounded-full flex flex-col items-center justify-center text-white text-center"
                  style={{ background: CORAL, fontWeight: 800, boxShadow: "0 12px 32px rgba(0,0,0,0.3)", padding: "12px" }}
                >
                  <div style={{ fontSize: "clamp(16px, 1.8vw, 22px)", lineHeight: 1.1, marginBottom: "4px", fontWeight: 900 }}>5-6</div>
                  <div style={{ fontSize: "clamp(14px, 1.5vw, 18px)", lineHeight: 1, fontWeight: 800, letterSpacing: "0.05em" }}>СЕНТ.</div>
                  <div style={{ fontSize: "clamp(16px, 1.8vw, 22px)", lineHeight: 1.1, marginTop: "4px", fontWeight: 900 }}>2026</div>
                </div>
              </div>

              <div className="lg:col-span-5 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 xl:px-12 xl:py-14 flex flex-col justify-center relative">
                <Flower size={90} color={PINK_LIGHT} className="hidden lg:block absolute top-8 right-8 pointer-events-none" rotate={20} style={{ opacity: 0.7 }} />
                <div className="relative max-w-full">
                  <div style={{ color: CORAL, fontWeight: 800, letterSpacing: "0.2em", fontSize: "clamp(12px, 1.4vw, 15px)", lineHeight: 1.4 }}>5-6 СЕНТЯБРЯ 2026</div>
                  <h1 className="mt-4 sm:mt-6 lg:mt-8" style={{ fontWeight: 900, fontSize: "clamp(44px, 5.5vw, 82px)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
                    ИВАН
                  </h1>
                  <div className="my-2 sm:my-3 lg:my-4 flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <div className="h-px flex-1" style={{ background: INK }} />
                    <span style={{ fontWeight: 800, fontSize: "clamp(16px, 2vw, 22px)", color: CORAL }}>&amp;</span>
                    <div className="h-px flex-1" style={{ background: INK }} />
                  </div>
                  <h1 style={{ fontWeight: 900, fontSize: "clamp(38px, 4.8vw, 72px)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
                    АНАСТАСИЯ
                  </h1>
                  <p className="mt-6 sm:mt-8 lg:mt-10" style={{ fontSize: "clamp(15px, 1.4vw, 17px)", color: "#555", lineHeight: 1.6 }}>
                    Будем счастливы видеть вас в этот день рядом.
                  </p>
                </div>
              </div>
            </div>

            {/* ДОРОГИЕ ДРУЗЬЯ + МЕСТО — two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t" style={{ borderColor: "#F0E8E8" }}>
              <div className="p-6 sm:p-8 lg:p-12 xl:p-16 lg:border-r" style={{ borderColor: "#F0E8E8" }}>
                <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 mb-5 lg:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: PINK_LIGHT }}>
                    <Heart size={24} style={{ color: CORAL }} fill={CORAL} />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "clamp(22px, 2.5vw, 36px)", letterSpacing: "-0.01em", lineHeight: 1.1 }}>ДОРОГИЕ ДРУЗЬЯ!</div>
                </div>
                <p style={{ fontSize: "clamp(15px, 1.3vw, 17px)", lineHeight: 1.7, color: "#555" }}>
                  С радостью и трепетом приглашаем вас разделить с нами один из самых счастливых дней нашей жизни — день нашей свадьбы. Будем счастливы видеть вас рядом, чтобы вместе создать воспоминания, которые останутся с нами навсегда.
                </p>
              </div>

              <div className="p-6 sm:p-8 lg:p-12 xl:p-16 border-t lg:border-t-0" style={{ borderColor: "#F0E8E8" }}>
                <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 mb-5 lg:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: PINK_LIGHT }}>
                    <MapPin size={24} style={{ color: CORAL }} />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "clamp(20px, 2.5vw, 34px)", letterSpacing: "-0.01em", lineHeight: 1.1 }}>МЕСТО ПРОВЕДЕНИЯ</div>
                </div>
                <p style={{ fontSize: "clamp(14px, 1.2vw, 16px)", color: "#666", lineHeight: 1.7 }}>
                  г. Краснодар<br/>Точный адрес появится позднее на сайте
                </p>
                <div className="mt-6 lg:mt-7 rounded-2xl lg:rounded-3xl overflow-hidden aspect-[16/9]">
                  <ImageWithFallback src={VENUE} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(40%)" }} />
                </div>
                <button
                  className="mt-5 lg:mt-6 px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 rounded-full text-white transition active:scale-[0.98] inline-flex items-center gap-2"
                  style={{ background: CORAL, fontWeight: 800, letterSpacing: "0.08em", fontSize: "clamp(11px, 1.2vw, 13px)" }}
                  onClick={() => window.open("https://maps.google.com", "_blank")}
                >
                  ПОСМОТРЕТЬ НА КАРТЕ →
                </button>
              </div>
            </div>

            {/* РАСПОРЯДОК ДНЯ — coral wide grid */}
            <div style={{ background: CORAL }} className="text-white relative">
              <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24">
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 mb-10 lg:mb-14">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
                    <Calendar size={24} color="white" />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "clamp(24px, 3.5vw, 52px)", letterSpacing: "-0.02em" }}>РАСПОРЯДОК ДНЯ</div>
                </div>

                <div className="max-w-3xl mx-auto text-center">
                  <div className="rounded-3xl p-8 sm:p-10 lg:p-12 xl:p-14" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6 lg:mb-8" style={{ color: CORAL }}>
                      <Calendar size={32} />
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "16px" }}>
                      Скоро будет опубликован
                    </div>
                    <p style={{ fontSize: "clamp(15px, 1.4vw, 18px)", opacity: 0.9, lineHeight: 1.6 }}>
                      Детальное расписание церемонии, банкета и развлечений появится позднее.<br/>Следите за обновлениями на сайте!
                    </p>
                  </div>
                </div>
              </div>
              <ScallopedBottom color={CORAL} />
            </div>

            {/* ДРЕСС-КОД */}
            <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden">
              <Flower size={110} color={PINK} className="hidden xl:block absolute top-14 right-14 pointer-events-none" rotate={20} style={{ opacity: 0.65 }} />
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16">
                <div className="lg:col-span-5 xl:col-span-4">
                  <div style={{ fontWeight: 900, fontSize: "clamp(28px, 3.5vw, 56px)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                    ДРЕСС<br/>— КОД
                  </div>
                  <p className="mt-5 lg:mt-6" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.65 }}>
                    Просим придерживаться нежной палитры: пыльно-розовый, коралловый, кремовый, бежевый. Избегайте белого и чёрного.
                  </p>
                  <div className="mt-6 lg:mt-8 flex gap-2 lg:gap-2.5 flex-wrap">
                    {[
                      { c: "#F4B6BE", n: "Розовый" },
                      { c: "#E85A4F", n: "Коралл" },
                      { c: "#F4E1D2", n: "Крем" },
                      { c: "#D9A89A", n: "Беж" },
                      { c: "#8A8F7A", n: "Шалфей" },
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

            {/* НАША ИСТОРИЯ */}
            <div className="px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 xl:py-24 relative overflow-hidden">
              <Flower size={100} color={PINK_LIGHT} className="hidden xl:block absolute top-16 left-12 pointer-events-none" rotate={15} style={{ opacity: 0.7 }} />
              <Flower size={120} color={PINK} className="hidden xl:block absolute bottom-24 right-14 pointer-events-none" rotate={-18} style={{ opacity: 0.55 }} />

              <div className="relative max-w-6xl mx-auto">
                <div className="text-center mb-10 lg:mb-16">
                  <div className="inline-flex items-center gap-3 lg:gap-4 mb-4 lg:mb-5">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center" style={{ background: PINK_LIGHT }}>
                      <BookHeart size={24} style={{ color: CORAL }} />
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>НАША ИСТОРИЯ</div>
                  </div>
                  <p className="max-w-2xl mx-auto px-4" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                    Путь от первой встречи до «Да»
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
                        date: "2 курс",
                        title: "Шахматы",
                        text: "Всё началось на секции шахмат. Я пришла на занятие, и единственное свободное место оказалось напротив Ивана. Мы разложили фигуры, начали партию — и незаметно разговорились. Я рассказала о хакатонах, показала факультет. Ваня загорелся идеей и перевёлся на экономический.",
                        image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
                      },
                      {
                        date: "Лето 2024",
                        title: "Адлер и ФИЧА",
                        text: "Вместе поехали в Адлер по программе профкома. А потом прошли отбор на форум «ФИЧА». Наша команда Avenir заняла первое место на хакатоне! Мы стали ещё ближе.",
                        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
                      },
                      {
                        date: "Сентябрь 2024",
                        title: "Идеатон",
                        text: "После мероприятия «Идеатон», которое мы организовали в университете, Ваня предложил мне стать парой. Я не раздумывала ни секунды — так начались наши отношения.",
                        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
                      },
                      {
                        date: "Ноябрь 2024",
                        title: "Предложение",
                        text: "Ваня встал на одно колено и сделал мне предложение руки и сердца. Конечно, я сказала «Да!» Мы строим Avenir вместе и планируем нашу совместную жизнь.",
                        image: "https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
                      },
                      {
                        date: "Июнь 2025",
                        title: "Новый дом",
                        text: "Мы съехались и начали делать ремонт в нашей первой совместной квартире. Каждый день — новое приключение, каждое решение принимаем вместе. Строим наше семейное гнёздышко своими руками.",
                        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
                      },
                      {
                        date: "28 октября 2025",
                        title: "Роспись",
                        text: "Официально стали мужем и женой! В этот день мы расписались и сделали первый шаг к нашей большой свадьбе. Теперь мы — семья не только по сердцу, но и по документам.",
                        image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=900",
                      },
                      {
                        date: "Сентябрь 2026",
                        title: "Свадьба",
                        text: "И вот мы здесь — готовы отпраздновать нашу любовь вместе со всеми, кто нам дорог. Наша история — это любовь, общие мечты, победы и вера в то, что вместе мы можем всё. Спасибо, что разделите с нами этот день!",
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
                    <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>АТМОСФЕРА</div>
                  </div>
                  <p className="max-w-2xl mx-auto px-4" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                    Чего ожидать: романтика, тепло и настоящие эмоции
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-10 lg:mb-12">
                  {["Нежность", "Романтика", "Улыбки", "Танцы", "Закат", "Свечи", "Музыка", "Любовь"].map((mood, i) => (
                    <div key={i} className="aspect-square rounded-2xl lg:rounded-3xl flex items-center justify-center text-center transition-transform duration-300 hover:scale-105 overflow-hidden relative group">
                      <ImageWithFallback
                        src={MOOD_IMAGES[i]}
                        alt={mood}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ filter: "grayscale(30%) brightness(0.7)" }}
                      />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(232,90,79,0.2) 0%, rgba(244,182,190,0.3) 100%)" }} />
                      <div className="relative z-10 px-4" style={{ fontWeight: 800, fontSize: "clamp(16px, 2vw, 22px)", color: "white", letterSpacing: "-0.01em", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{mood}</div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-8 rounded-3xl" style={{ background: PINK_LIGHT, border: `2px solid ${PINK}` }}>
                  <div className="text-center mb-6">
                    <Music size={32} style={{ color: CORAL, margin: "0 auto 16px" }} />
                    <div style={{ fontWeight: 800, fontSize: "clamp(18px, 2vw, 24px)", marginBottom: "8px" }}>Музыкальное настроение</div>
                    <p style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                      Легкий джаз на церемонии, романтичные баллады на ужине, танцевальные хиты вечером
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
                    <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: PINK_LIGHT }}>
                        <Gift size={24} style={{ color: CORAL }} />
                      </div>
                      <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>ПОЖЕЛАНИЯ</div>
                    </div>
                    <p className="mt-4 lg:mt-5 max-w-xl" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.65 }}>
                      Ваше присутствие — лучший подарок. Если хотите большего — выберите идею из списка.
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
                    const isFeatured = (g as any).featured;
                    const isTravelGift = travelGiftIds.includes(g.id);
                    const isCountMultiple = (g as any).special === "count-multiple";
                    const giftLink = (g as any).link;
                    const bookingsForGift = giftBookings.filter((b: any) => b.giftId === g.id);
                    const bookingCount = bookingsForGift.length;
                    const isUnavailable = booked && !isCountMultiple && !isTravelGift;
                    const currentGuestBookedThisTravelGift = Boolean(
                      currentGuestId && bookingsForGift.some((b: any) => b.guestId === currentGuestId)
                    );
                    const currentGiftTravelBooking = bookingsForGift.find(
                      (b: any) => currentGuestId && b.guestId === currentGuestId
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
                    АНКЕТА ГОСТЯ
                  </div>
                  <p className="mt-4 lg:mt-5" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                    Пожалуйста, заполните до 1 сентября. После регистрации откроется бронирование подарка.
                  </p>
                </div>

                {isRegistered && (
                  <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: "#E8F5E9", color: "#2E7D32" }}>
                    <Check size={20} />
                    <span style={{ fontWeight: 700, fontSize: 13 }}>Вы зарегистрированы! Спасибо</span>
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
                      ВАШЕ ФОТО · ПО ЖЕЛАНИЮ
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
                        Загрузите портрет — он украсит стену гостей на нашем празднике.
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
                <div className="inline-flex items-center gap-3 lg:gap-4 mb-4 lg:mb-5">
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
                    5-6 сентября 2026
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
                  <div className="inline-flex items-center gap-3 lg:gap-4 mb-4 lg:mb-5">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center" style={{ background: PINK_LIGHT }}>
                      <ListMusic size={24} style={{ color: CORAL }} />
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>ВАША ПЕСНЯ</div>
                  </div>
                  <p className="max-w-2xl mx-auto px-4" style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#666", lineHeight: 1.6 }}>
                    Какую песню вы хотите услышать на нашей свадьбе?
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
                  <div className="inline-flex items-center gap-3 lg:gap-4 mb-4 lg:mb-5">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center" style={{ background: PINK_LIGHT }}>
                      <HelpCircle size={24} style={{ color: CORAL }} />
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "clamp(26px, 3.5vw, 56px)", letterSpacing: "-0.02em" }}>ВОПРОСЫ И ОТВЕТЫ</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { q: "Можно ли с детьми?", a: "Да, дети приветствуются! Для них будет организована отдельная зона с развлечениями." },
                    { q: "Можно ли привести +1?", a: "Пожалуйста, укажите количество гостей при регистрации. Мы будем рады всем!" },
                    { q: "Будет ли трансфер?", a: "Информация о трансфере появится позднее на этом сайте." },
                    { q: "Во сколько заканчивается праздник?", a: "Официальная часть завершится около 23:00, но веселье может продолжиться!" },
                    { q: "Можно ли дарить цветы?", a: "Мы будем рады любым цветам, но можете выбрать подарок из нашего списка пожеланий." },
                    { q: "Где остановиться?", a: "Рекомендации по отелям в Краснодаре появятся позднее." },
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
                  БУДЕМ ЖДАТЬ ВАС<br/>С НЕТЕРПЕНИЕМ!
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
