import React, { useEffect, useMemo, useState, useTransition } from "react";
import {
  clearAdminToken,
  createCategory,
  createGift,
  createGuest,
  deleteCategory,
  deleteGift,
  deleteGuest,
  fetchAdminBootstrap,
  loginAdmin,
  persistAdminToken,
  readAdminToken,
  updateCategory,
  updateGift,
  updateGuest,
} from "./admin-api";
import { getGiftIconByKey, giftIconOptions } from "../shared/gift-icons";
import type {
  GiftBooking,
  GiftBookingMode,
  GiftCategory,
  Guest,
  MusicWish,
  TravelOption,
  WeddingGift,
} from "../shared/wedding-types";

type AdminTab = "guests" | "categories" | "gifts" | "wishes";

type GuestForm = Omit<Guest, "id" | "createdAt">;
type CategoryForm = {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
};
type GiftForm = Omit<WeddingGift, "id" | "categoryName" | "categoryDescription" | "travelOptions"> & {
  travelOptionsText: string;
};

const pinkLight = "#FBD3D8";
const coral = "#E85A4F";
const ink = "#1A1A1A";

const sideOptions = [
  "Со стороны Ивана",
  "Со стороны Анастасии",
];

const bookingModeLabels: Record<GiftBookingMode, string> = {
  single: "Один бронь",
  multiple: "Можно выбрать несколько раз",
  travel: "Выбор направления",
};

const emptyGuestForm = (): GuestForm => ({
  name: "",
  side: "",
  phone: "",
  email: "",
  willAttend: true,
  attendanceLabel: "",
  guestsCount: 1,
  guestNames: "",
  drink: "",
  allergy: "",
  photo: null,
});

const emptyCategoryForm = (): CategoryForm => ({
  id: "",
  name: "",
  description: "",
  sortOrder: 0,
});

const emptyGiftForm = (): GiftForm => ({
  name: "",
  hint: "",
  iconKey: "Gift",
  priceLabel: "",
  categoryId: "",
  featured: false,
  link: "",
  bookingMode: "single",
  specialCode: "",
  suggestedAmount: null,
  conditionsText: "",
  isActive: true,
  sortOrder: 0,
  travelOptionsText: "",
});

function parseTravelOptions(text: string): TravelOption[] {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => ({ label: item, value: item }));
}

function formatTravelOptions(options: TravelOption[]) {
  return options.map((item) => item.label || item.value).join("\n");
}

function toGuestForm(guest: Guest): GuestForm {
  return {
    name: guest.name,
    side: guest.side,
    phone: guest.phone,
    email: guest.email,
    willAttend: guest.willAttend,
    attendanceLabel: guest.attendanceLabel,
    guestsCount: guest.guestsCount,
    guestNames: guest.guestNames,
    drink: guest.drink,
    allergy: guest.allergy,
    photo: guest.photo,
  };
}

function toCategoryForm(category: GiftCategory): CategoryForm {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    sortOrder: category.sortOrder,
  };
}

function toGiftForm(gift: WeddingGift): GiftForm {
  return {
    name: gift.name,
    hint: gift.hint,
    iconKey: gift.iconKey,
    priceLabel: gift.priceLabel,
    categoryId: gift.categoryId,
    featured: gift.featured,
    link: gift.link,
    bookingMode: gift.bookingMode,
    specialCode: gift.specialCode,
    suggestedAmount: gift.suggestedAmount,
    conditionsText: gift.conditionsText,
    isActive: gift.isActive,
    sortOrder: gift.sortOrder,
    travelOptionsText: formatTravelOptions(gift.travelOptions),
  };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 12, fontWeight: 800, color: "#666", letterSpacing: "0.04em" }}>
      {children}
    </span>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="mt-2 w-full rounded-2xl border border-[#f0e8e8] bg-white px-4 py-3 outline-none"
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="mt-2 w-full rounded-2xl border border-[#f0e8e8] bg-white px-4 py-3 outline-none"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="mt-2 w-full rounded-2xl border border-[#f0e8e8] bg-white px-4 py-3 outline-none"
    />
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-[28px] p-5 sm:p-6 lg:p-7"
      style={{
        background: "linear-gradient(135deg, #FFF9F8 0%, #FFFFFF 100%)",
        border: "1px solid #F0E8E8",
        boxShadow: "0 16px 40px rgba(0,0,0,0.06)",
      }}
    >
      <div className="mb-5">
        <h2 style={{ fontWeight: 900, fontSize: "clamp(22px, 2vw, 30px)", letterSpacing: "-0.02em" }}>
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2" style={{ color: "#666", lineHeight: 1.6 }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function AdminPage() {
  const [token, setToken] = useState(() => readAdminToken());
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("guests");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [categories, setCategories] = useState<GiftCategory[]>([]);
  const [gifts, setGifts] = useState<WeddingGift[]>([]);
  const [bookings, setBookings] = useState<GiftBooking[]>([]);
  const [wishes, setWishes] = useState<MusicWish[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null);
  const [guestForm, setGuestForm] = useState<GuestForm>(emptyGuestForm());
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategoryForm());
  const [giftForm, setGiftForm] = useState<GiftForm>(emptyGiftForm());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const sortedGuests = useMemo(
    () => guests.slice().sort((a, b) => a.name.localeCompare(b.name, "ru")),
    [guests],
  );
  const sortedCategories = useMemo(
    () => categories.slice().sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "ru")),
    [categories],
  );
  const sortedGifts = useMemo(
    () => gifts.slice().sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "ru")),
    [gifts],
  );

  const bookingCountByGift = useMemo(() => {
    return bookings.reduce<Record<number, number>>((acc, booking) => {
      acc[booking.giftId] = (acc[booking.giftId] || 0) + 1;
      return acc;
    }, {});
  }, [bookings]);

  useEffect(() => {
    if (!token) return;

    let isCancelled = false;

    const loadAdminData = async () => {
      try {
        const result = await fetchAdminBootstrap();

        if (isCancelled) return;

        startTransition(() => {
          setGuests(result.guests);
          setCategories(result.categories);
          setGifts(result.gifts);
          setBookings(result.bookings);
          setWishes(result.wishes);
        });
      } catch (loadError) {
        if (isCancelled) return;

        clearAdminToken();
        setToken("");
        setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить админку");
      }
    };

    loadAdminData();

    return () => {
      isCancelled = true;
    };
  }, [token, startTransition]);

  useEffect(() => {
    if (!selectedGuestId) {
      setGuestForm(emptyGuestForm());
      return;
    }

    const guest = guests.find((item) => item.id === selectedGuestId);
    if (guest) {
      setGuestForm(toGuestForm(guest));
    }
  }, [selectedGuestId, guests]);

  useEffect(() => {
    if (!selectedCategoryId) {
      setCategoryForm(emptyCategoryForm());
      return;
    }

    const category = categories.find((item) => item.id === selectedCategoryId);
    if (category) {
      setCategoryForm(toCategoryForm(category));
    }
  }, [selectedCategoryId, categories]);

  useEffect(() => {
    if (!selectedGiftId) {
      setGiftForm(emptyGiftForm());
      return;
    }

    const gift = gifts.find((item) => item.id === selectedGiftId);
    if (gift) {
      setGiftForm(toGiftForm(gift));
    }
  }, [selectedGiftId, gifts]);

  const resetFeedback = () => {
    setMessage("");
    setError("");
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError("");
    setError("");

    try {
      const nextToken = await loginAdmin(password);
      persistAdminToken(nextToken);
      setToken(nextToken);
      setPassword("");
    } catch (loginIssue) {
      setLoginError(loginIssue instanceof Error ? loginIssue.message : "Не удалось войти");
    }
  };

  const handleGuestSave = async (event: React.FormEvent) => {
    event.preventDefault();
    resetFeedback();

    try {
      const savedGuest = selectedGuestId
        ? await updateGuest(selectedGuestId, guestForm)
        : await createGuest(guestForm);

      setGuests((current) => {
        if (selectedGuestId) {
          return current.map((item) => (item.id === savedGuest.id ? savedGuest : item));
        }

        return [...current, savedGuest];
      });

      setSelectedGuestId(savedGuest.id);
      setMessage(selectedGuestId ? "Гость обновлен" : "Гость добавлен");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Ошибка сохранения гостя");
    }
  };

  const handleGuestDelete = async () => {
    if (!selectedGuestId || !window.confirm("Удалить этого гостя?")) return;

    resetFeedback();

    try {
      await deleteGuest(selectedGuestId);
      setGuests((current) => current.filter((item) => item.id !== selectedGuestId));
      setBookings((current) => current.filter((item) => item.guestId !== selectedGuestId));
      setSelectedGuestId(null);
      setGuestForm(emptyGuestForm());
      setMessage("Гость удален");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Ошибка удаления гостя");
    }
  };

  const handleCategorySave = async (event: React.FormEvent) => {
    event.preventDefault();
    resetFeedback();

    try {
      const savedCategory = selectedCategoryId
        ? await updateCategory(selectedCategoryId, categoryForm)
        : await createCategory(categoryForm);

      setCategories((current) => {
        if (selectedCategoryId) {
          return current.map((item) => (item.id === savedCategory.id ? savedCategory : item));
        }

        return [...current, savedCategory];
      });

      setSelectedCategoryId(savedCategory.id);
      setMessage(selectedCategoryId ? "Категория обновлена" : "Категория добавлена");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Ошибка сохранения категории");
    }
  };

  const handleCategoryDelete = async () => {
    if (!selectedCategoryId || !window.confirm("Удалить эту категорию?")) return;

    resetFeedback();

    try {
      await deleteCategory(selectedCategoryId);
      setCategories((current) => current.filter((item) => item.id !== selectedCategoryId));
      setSelectedCategoryId(null);
      setCategoryForm(emptyCategoryForm());
      setMessage("Категория удалена");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Ошибка удаления категории");
    }
  };

  const handleGiftSave = async (event: React.FormEvent) => {
    event.preventDefault();
    resetFeedback();

    const payload = {
      ...giftForm,
      travelOptions: parseTravelOptions(giftForm.travelOptionsText),
      suggestedAmount:
        giftForm.suggestedAmount === null || giftForm.suggestedAmount === undefined || giftForm.suggestedAmount === 0
          ? null
          : Number(giftForm.suggestedAmount),
    };

    try {
      const savedGift = selectedGiftId
        ? await updateGift(selectedGiftId, payload)
        : await createGift(payload);

      setGifts((current) => {
        if (selectedGiftId) {
          return current.map((item) => (item.id === savedGift.id ? savedGift : item));
        }

        return [...current, savedGift];
      });

      setSelectedGiftId(savedGift.id);
      setMessage(selectedGiftId ? "Подарок обновлен" : "Подарок добавлен");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Ошибка сохранения подарка");
    }
  };

  const handleGiftDelete = async () => {
    if (!selectedGiftId || !window.confirm("Удалить этот подарок?")) return;

    resetFeedback();

    try {
      await deleteGift(selectedGiftId);
      setGifts((current) => current.filter((item) => item.id !== selectedGiftId));
      setBookings((current) => current.filter((item) => item.giftId !== selectedGiftId));
      setSelectedGiftId(null);
      setGiftForm(emptyGiftForm());
      setMessage("Подарок удален");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Ошибка удаления подарка");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#fff8f6] px-4 py-10 sm:px-6 lg:px-8" style={{ color: ink }}>
        <div className="mx-auto max-w-md rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="mb-8">
            <div
              className="inline-flex rounded-full px-4 py-2"
              style={{ background: pinkLight, color: coral, fontWeight: 800 }}
            >
              /admin
            </div>
            <h1 className="mt-5" style={{ fontWeight: 900, fontSize: "clamp(30px, 5vw, 48px)", lineHeight: 1 }}>
              Панель управления
            </h1>
            <p className="mt-4" style={{ color: "#666", lineHeight: 1.7 }}>
              Вход защищен паролем. Сейчас установлен код доступа <code>123456</code>.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <label className="block">
              <FieldLabel>Пароль</FieldLabel>
              <TextInput
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="123456"
              />
            </label>

            {loginError ? (
              <div className="rounded-2xl px-4 py-3" style={{ background: "#FFF1EF", color: coral }}>
                {loginError}
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-full px-5 py-4 text-white transition"
              style={{ background: coral, fontWeight: 800, letterSpacing: "0.08em" }}
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f6]" style={{ color: ink }}>
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-5 rounded-[30px] bg-white px-5 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)] sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex rounded-full px-4 py-2" style={{ background: pinkLight, color: coral, fontWeight: 800 }}>
                wedding admin
              </div>
              <h1 className="mt-4" style={{ fontWeight: 900, fontSize: "clamp(28px, 4vw, 54px)", lineHeight: 1 }}>
                Конструктор свадьбы
              </h1>
              <p className="mt-3 max-w-2xl" style={{ color: "#666", lineHeight: 1.7 }}>
                Здесь можно редактировать гостей, категории и подарки. Все изменения сразу сохраняются в базе
                и адаптированы под мобильный экран.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Гости", value: guests.length },
                { label: "Подарки", value: gifts.length },
                { label: "Брони", value: bookings.length },
                { label: "Песни", value: wishes.length },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl px-4 py-4"
                  style={{ background: "#fff8f6", border: "1px solid #f0e8e8" }}
                >
                  <div style={{ fontSize: 12, color: "#999", fontWeight: 700, letterSpacing: "0.08em" }}>{item.label}</div>
                  <div className="mt-2" style={{ fontWeight: 900, fontSize: 28 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {([
              ["guests", "Гости"],
              ["categories", "Категории"],
              ["gifts", "Подарки"],
              ["wishes", "Песни"],
            ] as [AdminTab, string][]).map(([tabId, label]) => (
              <button
                key={tabId}
                type="button"
                onClick={() => setActiveTab(tabId)}
                className="rounded-full px-4 py-3 text-sm transition"
                style={{
                  background: activeTab === tabId ? coral : "#fff8f6",
                  color: activeTab === tabId ? "white" : ink,
                  fontWeight: 800,
                }}
              >
                {label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                clearAdminToken();
                setToken("");
              }}
              className="rounded-full px-4 py-3 text-sm"
              style={{ background: "#1a1a1a", color: "white", fontWeight: 800, marginLeft: "auto" }}
            >
              Выйти
            </button>
          </div>
        </div>

        {message || error ? (
          <div
            className="mb-5 rounded-2xl px-4 py-3"
            style={{ background: error ? "#FFF1EF" : "#EAF8EE", color: error ? coral : "#2E7D32" }}
          >
            {error || message}
          </div>
        ) : null}

        {activeTab === "guests" ? (
          <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
            <SectionCard title="Список гостей" subtitle="Выбирай гостя из списка или добавляй нового.">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedGuestId(null)}
                  className="w-full rounded-2xl px-4 py-3 text-left"
                  style={{ background: "#fff8f6", fontWeight: 800 }}
                >
                  + Новый гость
                </button>

                {sortedGuests.map((guest) => (
                  <button
                    key={guest.id}
                    type="button"
                    onClick={() => setSelectedGuestId(guest.id)}
                    className="w-full rounded-2xl px-4 py-3 text-left transition"
                    style={{
                      background: selectedGuestId === guest.id ? "#FFF1EF" : "white",
                      border: `1px solid ${selectedGuestId === guest.id ? coral : "#f0e8e8"}`,
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>{guest.name}</div>
                    <div className="mt-1 text-sm" style={{ color: "#666" }}>
                      {guest.side || "Без стороны"} • {guest.willAttend ? "Придет" : "Не придет"}
                    </div>
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard title={selectedGuestId ? "Редактирование гостя" : "Новый гость"}>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleGuestSave}>
                <label className="block md:col-span-2">
                  <FieldLabel>Имя</FieldLabel>
                  <TextInput value={guestForm.name} onChange={(event) => setGuestForm({ ...guestForm, name: event.target.value })} />
                </label>

                <label className="block">
                  <FieldLabel>Сторона</FieldLabel>
                  <Select value={guestForm.side} onChange={(event) => setGuestForm({ ...guestForm, side: event.target.value })}>
                    <option value="">Выберите сторону</option>
                    {sideOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </label>

                <label className="block">
                  <FieldLabel>Формулировка ответа</FieldLabel>
                  <TextInput
                    value={guestForm.attendanceLabel}
                    onChange={(event) => setGuestForm({ ...guestForm, attendanceLabel: event.target.value })}
                    placeholder="Приду с парой"
                  />
                </label>

                <label className="block">
                  <FieldLabel>Телефон</FieldLabel>
                  <TextInput value={guestForm.phone} onChange={(event) => setGuestForm({ ...guestForm, phone: event.target.value })} />
                </label>

                <label className="block">
                  <FieldLabel>Email</FieldLabel>
                  <TextInput value={guestForm.email} onChange={(event) => setGuestForm({ ...guestForm, email: event.target.value })} />
                </label>

                <label className="block">
                  <FieldLabel>Количество гостей</FieldLabel>
                  <TextInput
                    type="number"
                    min={1}
                    value={guestForm.guestsCount}
                    onChange={(event) => setGuestForm({ ...guestForm, guestsCount: Number(event.target.value) || 1 })}
                  />
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-[#f0e8e8] px-4 py-3">
                  <input
                    type="checkbox"
                    checked={guestForm.willAttend}
                    onChange={(event) => setGuestForm({ ...guestForm, willAttend: event.target.checked })}
                  />
                  <span style={{ fontWeight: 700 }}>Гость сможет прийти</span>
                </label>

                <label className="block md:col-span-2">
                  <FieldLabel>Имена спутников</FieldLabel>
                  <TextArea rows={3} value={guestForm.guestNames} onChange={(event) => setGuestForm({ ...guestForm, guestNames: event.target.value })} />
                </label>

                <label className="block">
                  <FieldLabel>Напитки</FieldLabel>
                  <TextInput value={guestForm.drink} onChange={(event) => setGuestForm({ ...guestForm, drink: event.target.value })} />
                </label>

                <label className="block">
                  <FieldLabel>Аллергии</FieldLabel>
                  <TextInput value={guestForm.allergy} onChange={(event) => setGuestForm({ ...guestForm, allergy: event.target.value })} />
                </label>

                <label className="block md:col-span-2">
                  <FieldLabel>Фото гостя (URL или data URL)</FieldLabel>
                  <TextArea
                    rows={2}
                    value={guestForm.photo || ""}
                    onChange={(event) => setGuestForm({ ...guestForm, photo: event.target.value || null })}
                  />
                </label>

                <div className="md:col-span-2 flex flex-wrap gap-3">
                  <button
                    className="rounded-full px-6 py-3 text-white"
                    style={{ background: coral, fontWeight: 800 }}
                    disabled={isPending}
                  >
                    {selectedGuestId ? "Сохранить гостя" : "Добавить гостя"}
                  </button>
                  {selectedGuestId ? (
                    <button
                      type="button"
                      onClick={handleGuestDelete}
                      className="rounded-full px-6 py-3"
                      style={{ background: "#1a1a1a", color: "white", fontWeight: 800 }}
                    >
                      Удалить
                    </button>
                  ) : null}
                </div>
              </form>
            </SectionCard>
          </div>
        ) : null}

        {activeTab === "categories" ? (
          <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
            <SectionCard title="Категории" subtitle="Разделы подарков на публичной странице.">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryId(null)}
                  className="w-full rounded-2xl px-4 py-3 text-left"
                  style={{ background: "#fff8f6", fontWeight: 800 }}
                >
                  + Новая категория
                </button>

                {sortedCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(category.id)}
                    className="w-full rounded-2xl px-4 py-3 text-left"
                    style={{
                      background: selectedCategoryId === category.id ? "#FFF1EF" : "white",
                      border: `1px solid ${selectedCategoryId === category.id ? coral : "#f0e8e8"}`,
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>{category.name}</div>
                    <div className="mt-1 text-sm" style={{ color: "#999" }}>{category.id}</div>
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard title={selectedCategoryId ? "Редактирование категории" : "Новая категория"}>
              <form className="grid gap-4" onSubmit={handleCategorySave}>
                {!selectedCategoryId ? (
                  <label className="block">
                    <FieldLabel>ID категории</FieldLabel>
                    <TextInput
                      value={categoryForm.id}
                      onChange={(event) => setCategoryForm({ ...categoryForm, id: event.target.value })}
                      placeholder="naprimer-home"
                    />
                  </label>
                ) : null}

                <label className="block">
                  <FieldLabel>Название</FieldLabel>
                  <TextInput value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} />
                </label>

                <label className="block">
                  <FieldLabel>Описание</FieldLabel>
                  <TextArea
                    rows={4}
                    value={categoryForm.description}
                    onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })}
                  />
                </label>

                <label className="block">
                  <FieldLabel>Порядок</FieldLabel>
                  <TextInput
                    type="number"
                    value={categoryForm.sortOrder}
                    onChange={(event) => setCategoryForm({ ...categoryForm, sortOrder: Number(event.target.value) || 0 })}
                  />
                </label>

                <div className="flex flex-wrap gap-3">
                  <button className="rounded-full px-6 py-3 text-white" style={{ background: coral, fontWeight: 800 }}>
                    {selectedCategoryId ? "Сохранить категорию" : "Добавить категорию"}
                  </button>
                  {selectedCategoryId ? (
                    <button
                      type="button"
                      onClick={handleCategoryDelete}
                      className="rounded-full px-6 py-3"
                      style={{ background: "#1a1a1a", color: "white", fontWeight: 800 }}
                    >
                      Удалить
                    </button>
                  ) : null}
                </div>
              </form>
            </SectionCard>
          </div>
        ) : null}

        {activeTab === "gifts" ? (
          <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
            <SectionCard
              title="Подарки"
              subtitle="Можно менять тексты, условия, иконки, категории, суммы и режим бронирования."
            >
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedGiftId(null)}
                  className="w-full rounded-2xl px-4 py-3 text-left"
                  style={{ background: "#fff8f6", fontWeight: 800 }}
                >
                  + Новый подарок
                </button>

                {sortedGifts.map((gift) => {
                  const Icon = getGiftIconByKey(gift.iconKey);

                  return (
                    <button
                      key={gift.id}
                      type="button"
                      onClick={() => setSelectedGiftId(gift.id)}
                      className="w-full rounded-2xl px-4 py-3 text-left"
                      style={{
                        background: selectedGiftId === gift.id ? "#FFF1EF" : "white",
                        border: `1px solid ${selectedGiftId === gift.id ? coral : "#f0e8e8"}`,
                        opacity: gift.isActive ? 1 : 0.65,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl p-3" style={{ background: pinkLight }}>
                          <Icon size={18} style={{ color: coral }} />
                        </div>
                        <div className="min-w-0">
                          <div style={{ fontWeight: 800 }}>{gift.name}</div>
                          <div className="mt-1 text-sm" style={{ color: "#666" }}>{gift.categoryName || gift.categoryId}</div>
                          <div className="mt-1 text-xs" style={{ color: "#999" }}>
                            {bookingModeLabels[gift.bookingMode]} • броней: {bookingCountByGift[gift.id] || 0}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title={selectedGiftId ? "Редактирование подарка" : "Новый подарок"}>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleGiftSave}>
                <label className="block md:col-span-2">
                  <FieldLabel>Название</FieldLabel>
                  <TextInput value={giftForm.name} onChange={(event) => setGiftForm({ ...giftForm, name: event.target.value })} />
                </label>

                <label className="block md:col-span-2">
                  <FieldLabel>Описание / условие</FieldLabel>
                  <TextArea rows={3} value={giftForm.hint} onChange={(event) => setGiftForm({ ...giftForm, hint: event.target.value })} />
                </label>

                <label className="block">
                  <FieldLabel>Категория</FieldLabel>
                  <Select value={giftForm.categoryId} onChange={(event) => setGiftForm({ ...giftForm, categoryId: event.target.value })}>
                    <option value="">Выберите категорию</option>
                    {sortedCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </label>

                <label className="block">
                  <FieldLabel>Иконка</FieldLabel>
                  <Select value={giftForm.iconKey} onChange={(event) => setGiftForm({ ...giftForm, iconKey: event.target.value })}>
                    {giftIconOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </label>

                <label className="block">
                  <FieldLabel>Цена / подпись суммы</FieldLabel>
                  <TextInput
                    value={giftForm.priceLabel}
                    onChange={(event) => setGiftForm({ ...giftForm, priceLabel: event.target.value })}
                    placeholder="Любая сумма или ~10 000 ₽"
                  />
                </label>

                <label className="block">
                  <FieldLabel>Рекомендуемая сумма</FieldLabel>
                  <TextInput
                    type="number"
                    value={giftForm.suggestedAmount ?? ""}
                    onChange={(event) => setGiftForm({ ...giftForm, suggestedAmount: event.target.value ? Number(event.target.value) : null })}
                  />
                </label>

                <label className="block md:col-span-2">
                  <FieldLabel>Дополнительные условия</FieldLabel>
                  <TextArea
                    rows={3}
                    value={giftForm.conditionsText}
                    onChange={(event) => setGiftForm({ ...giftForm, conditionsText: event.target.value })}
                    placeholder="Например: укажите сумму, комментарий или формат сертификата"
                  />
                </label>

                <label className="block md:col-span-2">
                  <FieldLabel>Ссылка</FieldLabel>
                  <TextInput value={giftForm.link} onChange={(event) => setGiftForm({ ...giftForm, link: event.target.value })} />
                </label>

                <label className="block">
                  <FieldLabel>Режим бронирования</FieldLabel>
                  <Select
                    value={giftForm.bookingMode}
                    onChange={(event) => setGiftForm({ ...giftForm, bookingMode: event.target.value as GiftBookingMode })}
                  >
                    <option value="single">Один бронь</option>
                    <option value="multiple">Можно выбрать несколько раз</option>
                    <option value="travel">Выбор направления</option>
                  </Select>
                </label>

                <label className="block">
                  <FieldLabel>Special code</FieldLabel>
                  <TextInput
                    value={giftForm.specialCode}
                    onChange={(event) => setGiftForm({ ...giftForm, specialCode: event.target.value })}
                    placeholder="count-multiple или свой код"
                  />
                </label>

                {giftForm.bookingMode === "travel" ? (
                  <label className="block md:col-span-2">
                    <FieldLabel>Варианты направлений</FieldLabel>
                    <TextArea
                      rows={6}
                      value={giftForm.travelOptionsText}
                      onChange={(event) => setGiftForm({ ...giftForm, travelOptionsText: event.target.value })}
                      placeholder="Каждое направление с новой строки"
                    />
                  </label>
                ) : null}

                <label className="flex items-center gap-3 rounded-2xl border border-[#f0e8e8] px-4 py-3">
                  <input type="checkbox" checked={giftForm.featured} onChange={(event) => setGiftForm({ ...giftForm, featured: event.target.checked })} />
                  <span style={{ fontWeight: 700 }}>Особенный подарок</span>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-[#f0e8e8] px-4 py-3">
                  <input type="checkbox" checked={giftForm.isActive} onChange={(event) => setGiftForm({ ...giftForm, isActive: event.target.checked })} />
                  <span style={{ fontWeight: 700 }}>Показывать на сайте</span>
                </label>

                <label className="block">
                  <FieldLabel>Порядок</FieldLabel>
                  <TextInput
                    type="number"
                    value={giftForm.sortOrder}
                    onChange={(event) => setGiftForm({ ...giftForm, sortOrder: Number(event.target.value) || 0 })}
                  />
                </label>

                <div className="md:col-span-2 flex flex-wrap gap-3">
                  <button className="rounded-full px-6 py-3 text-white" style={{ background: coral, fontWeight: 800 }}>
                    {selectedGiftId ? "Сохранить подарок" : "Добавить подарок"}
                  </button>
                  {selectedGiftId ? (
                    <button
                      type="button"
                      onClick={handleGiftDelete}
                      className="rounded-full px-6 py-3"
                      style={{ background: "#1a1a1a", color: "white", fontWeight: 800 }}
                    >
                      Удалить
                    </button>
                  ) : null}
                </div>
              </form>
            </SectionCard>
          </div>
        ) : null}

        {activeTab === "wishes" ? (
          <SectionCard
            title="Музыкальные пожелания"
            subtitle="Список песен, которые уже прислали гости."
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {wishes.map((wish) => (
                <div key={wish.id} className="rounded-2xl border border-[#f0e8e8] bg-white px-4 py-4">
                  <div style={{ fontWeight: 800 }}>{wish.song}</div>
                  <div className="mt-2 text-sm" style={{ color: "#666" }}>
                    {wish.guestName || "Гость"}
                  </div>
                  <div className="mt-2 text-xs" style={{ color: "#999" }}>
                    {new Date(wish.createdAt).toLocaleString("ru-RU")}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}
      </div>
    </div>
  );
}

export default AdminPage;
