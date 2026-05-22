import React, { useEffect, useMemo, useState } from "react";
import {
  clearAdminToken,
  createCategory,
  createGift,
  createGuest,
  createSection,
  deleteCategory,
  deleteGift,
  deleteGuest,
  deleteSection,
  fetchAdminBootstrap,
  fetchUploadedImages,
  loginAdmin,
  persistAdminToken,
  readAdminToken,
  reorderSections,
  updateCategory,
  updateGift,
  updateGuest,
  updateSection,
  uploadSiteImage,
} from "./admin-api";
import { getGiftIconByKey, giftIconOptions } from "../shared/gift-icons";
import AdminMediaLibrary from "./AdminMediaLibrary";
import GalleryImagesEditor from "./GalleryImagesEditor";
import SectionImagePicker from "./SectionImagePicker";
import StoryItemsEditor from "./StoryItemsEditor";
import { parseSectionItems, sectionImageSlots, serializeSectionItems, slugifySectionId } from "./admin-utils";
import type {
  GiftBooking,
  GiftBookingMode,
  GiftCategory,
  Guest,
  MusicWish,
  SiteSection,
  SiteSectionItem,
  SiteSectionType,
  TravelOption,
  WeddingGift,
} from "../shared/wedding-types";

type AdminTab = "sections" | "background" | "media" | "guests" | "categories" | "gifts" | "wishes";

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
type SectionForm = {
  id: string;
  name: string;
  type: SiteSectionType;
  sortOrder: number;
  isActive: boolean;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  note: string;
  primaryImage: string;
  secondaryImage: string;
  backgroundImage: string;
  buttonLabel: string;
  buttonHref: string;
  galleryImagesText: string;
  itemsText: string;
};

const coral = "#E85A4F";
const ink = "#1A1A1A";
const blush = "#FFF7F4";

const sideOptions = ["Со стороны Ивана", "Со стороны Анастасии"];

const bookingModeLabels: Record<GiftBookingMode, string> = {
  single: "Один бронь",
  multiple: "Можно выбрать несколько раз",
  travel: "Выбор направления",
};

const sectionTypeOptions: { value: SiteSectionType; label: string; hint: string }[] = [
  {
    value: "hero",
    label: "Обложка",
    hint: "Главный экран, фото обложки и фон страницы (серое фото за всей карточкой сайта).",
  },
  { value: "text", label: "Текстовый блок", hint: "Свободный информационный блок с текстом." },
  { value: "location", label: "Локация", hint: "Место проведения, адрес, кнопка на карту и фото." },
  { value: "schedule", label: "Расписание", hint: "Тайминг дня с карточками времени." },
  { value: "dress-code", label: "Дресс-код", hint: "Палитра, описание и 1-2 вдохновляющих фото." },
  { value: "story", label: "История пары", hint: "Лента ключевых событий и этапов." },
  { value: "gallery", label: "Галерея", hint: "Сетка фотографий, которую можно полностью заменить." },
  { value: "person", label: "Персона", hint: "Блок про тамаду, ведущего, организатора или любого человека." },
  { value: "gifts", label: "Подарки", hint: "Встроенный блок каталога подарков." },
  { value: "rsvp", label: "Анкета гостя", hint: "Встроенная регистрационная форма." },
  { value: "guests", label: "Список гостей", hint: "Гости, которые подтвердили участие." },
  { value: "music", label: "Музыка", hint: "Форма для музыкальных пожеланий." },
  { value: "faq", label: "FAQ", hint: "Частые вопросы и ответы." },
  { value: "closing", label: "Финальный экран", hint: "Крупная завершающая секция с фото." },
];

const sectionExamples: Record<SiteSectionType, string> = {
  hero: "Поле элементов не обязательно для hero-блока.",
  text: "Можно не заполнять элементы и работать только заголовками и текстом.",
  location: "Элементы не обязательны. Адрес и подсказки лучше писать в description и note.",
  schedule: "Пример строки: 15:00 | Сбор гостей | Встречаемся, знакомимся и начинаем вечер",
  "dress-code": "Пример строки: Пудровый |  |  | #F4B6BE",
  story: "Для истории используйте редактор этапов ниже — у каждого пункта своё фото.",
  gallery: "Для галереи важнее список фото, а не элементы.",
  person: "Пример строки: Иван Иванов | Ведущий | Живой формат без кринжа и пафоса",
  gifts: "Элементы не используются, блок берет данные из каталога подарков.",
  rsvp: "Элементы не используются, блок берет форму регистрации.",
  guests: "Элементы не используются, блок берет список гостей из базы.",
  music: "Элементы не используются, блок берет форму музыкальных пожеланий.",
  faq: "Пример строки: Можно ли с детьми? |  | Да, конечно, мы будем рады",
  closing: "Элементы не обязательны, достаточно заголовка и главного фото.",
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

function sectionTemplate(type: SiteSectionType): SectionForm {
  return {
    id: "",
    name: "",
    type,
    sortOrder: 0,
    isActive: true,
    badge: "",
    title: "",
    subtitle: "",
    description: "",
    note: "",
    primaryImage: "",
    secondaryImage: "",
    backgroundImage: "",
    buttonLabel: "",
    buttonHref: "",
    galleryImagesText: "",
    itemsText: "",
  };
}

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

function parseGalleryImages(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
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

function toSectionForm(section: SiteSection): SectionForm {
  return {
    id: section.id,
    name: section.name,
    type: section.type,
    sortOrder: section.sortOrder,
    isActive: section.isActive,
    badge: section.settings.badge || "",
    title: section.settings.title || "",
    subtitle: section.settings.subtitle || "",
    description: section.settings.description || "",
    note: section.settings.note || "",
    primaryImage: section.settings.primaryImage || "",
    secondaryImage: section.settings.secondaryImage || "",
    backgroundImage: section.settings.backgroundImage || "",
    buttonLabel: section.settings.buttonLabel || "",
    buttonHref: section.settings.buttonHref || "",
    galleryImagesText: (section.settings.galleryImages || []).join("\n"),
    itemsText: serializeSectionItems(section.settings.items || []),
  };
}

function sectionPayload(form: SectionForm) {
  return {
    name: form.name,
    type: form.type,
    sortOrder: form.sortOrder,
    isActive: form.isActive,
    settings: {
      badge: form.badge,
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      note: form.note,
      primaryImage: form.primaryImage || null,
      secondaryImage: form.secondaryImage || null,
      backgroundImage: form.backgroundImage || null,
      buttonLabel: form.buttonLabel,
      buttonHref: form.buttonHref,
      galleryImages: parseGalleryImages(form.galleryImagesText),
      items: parseSectionItems(form.itemsText),
    },
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

export default function AdminPage() {
  const [token, setToken] = useState(() => readAdminToken());
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("sections");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [guests, setGuests] = useState<Guest[]>([]);
  const [categories, setCategories] = useState<GiftCategory[]>([]);
  const [gifts, setGifts] = useState<WeddingGift[]>([]);
  const [bookings, setBookings] = useState<GiftBooking[]>([]);
  const [wishes, setWishes] = useState<MusicWish[]>([]);
  const [sections, setSections] = useState<SiteSection[]>([]);

  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const [guestForm, setGuestForm] = useState<GuestForm>(emptyGuestForm());
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(emptyCategoryForm());
  const [giftForm, setGiftForm] = useState<GiftForm>(emptyGiftForm());
  const [sectionForm, setSectionForm] = useState<SectionForm>(sectionTemplate("person"));

  const [uploadedImages, setUploadedImages] = useState<{ url: string; filename: string }[]>([]);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [pageBackgroundImage, setPageBackgroundImage] = useState("");

  const sortedGuests = useMemo(
    () => guests.slice().sort((a, b) => a.name.localeCompare(b.name, "ru")),
    [guests],
  );
  const sortedCategories = useMemo(
    () =>
      categories
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "ru")),
    [categories],
  );
  const sortedGifts = useMemo(
    () =>
      gifts
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "ru")),
    [gifts],
  );
  const sortedSections = useMemo(
    () =>
      sections
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "ru")),
    [sections],
  );

  const heroSection = useMemo(
    () => sections.find((section) => section.id === "hero" || section.type === "hero"),
    [sections],
  );

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const result = await fetchAdminBootstrap();
        setGuests(result.guests);
        setCategories(result.categories);
        setGifts(result.gifts);
        setBookings(result.bookings);
        setWishes(result.wishes);
        setSections(result.sections);

        try {
          const uploads = await fetchUploadedImages();
          setUploadedImages(uploads);
        } catch {
          setUploadedImages([]);
        }
      } catch (loadError) {
        clearAdminToken();
        setToken("");
        setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить админку");
      }
    };

    load();
  }, [token]);

  useEffect(() => {
    if (!selectedGuestId) {
      setGuestForm(emptyGuestForm());
      return;
    }
    const guest = guests.find((item) => item.id === selectedGuestId);
    if (guest) setGuestForm(toGuestForm(guest));
  }, [selectedGuestId, guests]);

  useEffect(() => {
    if (!selectedCategoryId) {
      setCategoryForm(emptyCategoryForm());
      return;
    }
    const category = categories.find((item) => item.id === selectedCategoryId);
    if (category) setCategoryForm(toCategoryForm(category));
  }, [selectedCategoryId, categories]);

  useEffect(() => {
    if (!selectedGiftId) {
      setGiftForm(emptyGiftForm());
      return;
    }
    const gift = gifts.find((item) => item.id === selectedGiftId);
    if (gift) setGiftForm(toGiftForm(gift));
  }, [selectedGiftId, gifts]);

  useEffect(() => {
    if (!selectedSectionId) {
      return;
    }
    const section = sections.find((item) => item.id === selectedSectionId);
    if (section) setSectionForm(toSectionForm(section));
  }, [selectedSectionId, sections]);

  useEffect(() => {
    setPageBackgroundImage(heroSection?.settings.backgroundImage || heroSection?.settings.primaryImage || "");
  }, [heroSection]);

  const resetFeedback = () => {
    setMessage("");
    setError("");
  };

  const uploadImageFile = async (file: File) => {
    setUploadBusy(true);
    try {
      const uploaded = await uploadSiteImage(file);
      const catalog = await fetchUploadedImages();
      setUploadedImages(catalog);
      return uploaded.url;
    } finally {
      setUploadBusy(false);
    }
  };

  const validateSectionForm = () => {
    const name = sectionForm.name.trim();
    if (!name) {
      return "Укажите название блока (как он будет виден в списке слева).";
    }

    if (!sectionForm.type) {
      return "Выберите тип блока.";
    }

    if (!selectedSectionId) {
      const id = slugifySectionId(sectionForm.id || name);
      if (!id) {
        return "Укажите ID блока латиницей или кириллицей (например: hero-main).";
      }
    }

    return null;
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError("");
    try {
      const nextToken = await loginAdmin(password);
      persistAdminToken(nextToken);
      setToken(nextToken);
      setPassword("");
    } catch (issue) {
      setLoginError(issue instanceof Error ? issue.message : "Не удалось войти");
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setToken("");
  };

  const handleGuestSave = async (event: React.FormEvent) => {
    event.preventDefault();
    resetFeedback();
    try {
      const guest = selectedGuestId
        ? await updateGuest(selectedGuestId, guestForm)
        : await createGuest(guestForm);

      setGuests((current) =>
        selectedGuestId
          ? current.map((item) => (item.id === guest.id ? guest : item))
          : [...current, guest],
      );
      setSelectedGuestId(guest.id);
      setMessage(selectedGuestId ? "Гость обновлён" : "Гость добавлен");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Не удалось сохранить гостя");
    }
  };

  const handleCategorySave = async (event: React.FormEvent) => {
    event.preventDefault();
    resetFeedback();
    try {
      const category = selectedCategoryId
        ? await updateCategory(selectedCategoryId, categoryForm)
        : await createCategory(categoryForm);

      setCategories((current) =>
        selectedCategoryId
          ? current.map((item) => (item.id === category.id ? category : item))
          : [...current, category],
      );
      setSelectedCategoryId(category.id);
      setMessage(selectedCategoryId ? "Категория обновлена" : "Категория добавлена");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Не удалось сохранить категорию");
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
      const gift = selectedGiftId
        ? await updateGift(selectedGiftId, payload)
        : await createGift(payload);

      setGifts((current) =>
        selectedGiftId
          ? current.map((item) => (item.id === gift.id ? gift : item))
          : [...current, gift],
      );
      setSelectedGiftId(gift.id);
      setMessage(selectedGiftId ? "Подарок обновлён" : "Подарок добавлен");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Не удалось сохранить подарок");
    }
  };

  const handlePageBackgroundSave = async () => {
    if (!heroSection) {
      setError("Блок «Обложка» не найден. Создайте секцию hero в списке блоков.");
      return;
    }

    resetFeedback();

    try {
      const form = toSectionForm(heroSection);
      const updated = await updateSection(heroSection.id, {
        ...sectionPayload({
          ...form,
          backgroundImage: pageBackgroundImage,
        }),
      });

      setSections((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      if (selectedSectionId === updated.id) {
        setSectionForm(toSectionForm(updated));
      }
      setMessage("Фон страницы сохранён. Обновите сайт у гостей (Ctrl+F5).");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Не удалось сохранить фон страницы");
    }
  };

  const handleSectionSave = async (event: React.FormEvent) => {
    event.preventDefault();
    resetFeedback();

    const validationError = validateSectionForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const sectionId = selectedSectionId || slugifySectionId(sectionForm.id || sectionForm.name);
      const section = selectedSectionId
        ? await updateSection(selectedSectionId, sectionPayload(sectionForm))
        : await createSection({
            id: sectionId,
            ...sectionPayload(sectionForm),
          });

      setSections((current) =>
        selectedSectionId
          ? current.map((item) => (item.id === section.id ? section : item))
          : [...current, section],
      );
      setSelectedSectionId(section.id);
      setSectionForm(toSectionForm(section));
      setMessage(selectedSectionId ? "Блок обновлён" : "Блок добавлен");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Не удалось сохранить блок");
    }
  };

  const handleSectionMove = async (sectionId: string, direction: -1 | 1) => {
    const index = sortedSections.findIndex((item) => item.id === sectionId);
    const targetIndex = index + direction;

    if (index < 0 || targetIndex < 0 || targetIndex >= sortedSections.length) {
      return;
    }

    resetFeedback();

    const next = sortedSections.slice();
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

    try {
      const updated = await reorderSections(next.map((item) => item.id));
      setSections(updated);
      setMessage("Порядок блоков обновлён");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Не удалось переставить блок");
    }
  };

  const handleSectionTypeChange = (type: SiteSectionType) => {
    setSectionForm((current) => ({ ...current, type }));
  };

  const galleryImages = useMemo(
    () => parseGalleryImages(sectionForm.galleryImagesText),
    [sectionForm.galleryImagesText],
  );

  const imageSlots = sectionImageSlots(sectionForm.type);

  const handleDelete = async (kind: "guest" | "category" | "gift" | "section") => {
    if (kind === "guest" && selectedGuestId && window.confirm("Удалить этого гостя?")) {
      await deleteGuest(selectedGuestId);
      setGuests((current) => current.filter((item) => item.id !== selectedGuestId));
      setSelectedGuestId(null);
      setGuestForm(emptyGuestForm());
      setMessage("Гость удалён");
    }

    if (kind === "category" && selectedCategoryId && window.confirm("Удалить эту категорию?")) {
      await deleteCategory(selectedCategoryId);
      setCategories((current) => current.filter((item) => item.id !== selectedCategoryId));
      setSelectedCategoryId(null);
      setCategoryForm(emptyCategoryForm());
      setMessage("Категория удалена");
    }

    if (kind === "gift" && selectedGiftId && window.confirm("Удалить этот подарок?")) {
      await deleteGift(selectedGiftId);
      setGifts((current) => current.filter((item) => item.id !== selectedGiftId));
      setSelectedGiftId(null);
      setGiftForm(emptyGiftForm());
      setMessage("Подарок удалён");
    }

    if (kind === "section" && selectedSectionId && window.confirm("Удалить этот блок?")) {
      await deleteSection(selectedSectionId);
      setSections((current) => current.filter((item) => item.id !== selectedSectionId));
      setSelectedSectionId(null);
      setSectionForm(sectionTemplate("person"));
      setMessage("Блок удалён");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#fff8f6] px-4 py-10 sm:px-6 lg:px-8" style={{ color: ink }}>
        <div className="mx-auto max-w-md rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="mb-8">
            <div
              className="inline-flex rounded-full px-4 py-2"
              style={{ background: "#FBD3D8", color: coral, fontWeight: 800 }}
            >
              /admin
            </div>
            <h1 className="mt-5" style={{ fontWeight: 900, fontSize: "clamp(30px, 5vw, 48px)", lineHeight: 1 }}>
              Панель управления
            </h1>
            <p className="mt-4" style={{ color: "#666", lineHeight: 1.7 }}>
              Вход защищён паролем. Сейчас используется код доступа <code>123456</code>.
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
              <div
                className="inline-flex rounded-full px-4 py-2"
                style={{ background: "#FBD3D8", color: coral, fontWeight: 800 }}
              >
                wedding admin
              </div>
              <h1 className="mt-4" style={{ fontWeight: 900, fontSize: "clamp(28px, 4vw, 54px)", lineHeight: 1 }}>
                Конструктор свадебного сайта
              </h1>
              <p className="mt-3 max-w-3xl" style={{ color: "#666", lineHeight: 1.7 }}>
                Здесь можно менять структуру лендинга, переставлять блоки, добавлять новые секции вроде блока про тамаду, а также редактировать гостей, подарки и категории.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { label: "Блоки", value: sections.length },
                { label: "Гости", value: guests.length },
                { label: "Подарки", value: gifts.length },
                { label: "Брони", value: bookings.length },
                { label: "Песни", value: wishes.length },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl px-4 py-4"
                  style={{ background: blush, border: "1px solid #f0e8e8" }}
                >
                  <div style={{ fontSize: 12, color: "#999", fontWeight: 700, letterSpacing: "0.08em" }}>{item.label}</div>
                  <div className="mt-2" style={{ fontWeight: 900, fontSize: 28 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {([
              ["sections", "Блоки сайта"],
              ["background", "Фон страницы"],
              ["media", "Медиатека"],
              ["guests", "Гости"],
              ["categories", "Категории"],
              ["gifts", "Подарки"],
              ["wishes", "Песни"],
            ] as [AdminTab, string][]).map(([tabId, label]) => (
              <button
                key={tabId}
                type="button"
                onClick={() => setActiveTab(tabId)}
                className="rounded-full px-5 py-3"
                style={{
                  background: activeTab === tabId ? coral : blush,
                  color: activeTab === tabId ? "white" : ink,
                  fontWeight: 800,
                }}
              >
                {label}
              </button>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full px-5 py-3"
              style={{ background: "#1a1a1a", color: "white", fontWeight: 800, marginLeft: "auto" }}
            >
              Выйти
            </button>
          </div>

          {message ? (
            <div className="mt-5 rounded-2xl bg-[#ECFFF2] px-4 py-3" style={{ color: "#2A7A48" }}>
              {message}
            </div>
          ) : null}
          {error ? (
            <div className="mt-5 rounded-2xl bg-[#FFF1EF] px-4 py-3" style={{ color: coral }}>
              {error}
            </div>
          ) : null}
        </div>

        {activeTab === "background" ? (
          <SectionCard
            title="Фон всей страницы"
            subtitle="Серое фото за белой карточкой сайта — видно по краям при прокрутке. Можно загрузить своё или выбрать из медиатеки."
          >
            {heroSection ? (
              <div className="mx-auto max-w-xl space-y-6">
                <SectionImagePicker
                  label="Фоновое фото"
                  hint="Рекомендуется горизонтальное фото, хорошо смотрится в ч/б"
                  value={pageBackgroundImage}
                  onChange={setPageBackgroundImage}
                  uploads={uploadedImages}
                  uploadBusy={uploadBusy}
                  onUpload={async (file) => {
                    const url = await uploadImageFile(file);
                    setPageBackgroundImage(url);
                    return url;
                  }}
                />
                <button
                  type="button"
                  onClick={() => void handlePageBackgroundSave()}
                  className="w-full rounded-full px-6 py-4 text-white"
                  style={{ background: coral, fontWeight: 800 }}
                >
                  Сохранить фон страницы
                </button>
                <p className="text-center text-sm" style={{ color: "#888" }}>
                  То же поле есть в блоке «Обложка» → раздел «Изображения».
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#f0e8e8] bg-[#fff9f8] px-5 py-8 text-center" style={{ color: "#666" }}>
                Секция «Обложка» (hero) не найдена. Откройте вкладку «Блоки сайта» и добавьте блок типа «Обложка».
              </div>
            )}
          </SectionCard>
        ) : null}

        {activeTab === "sections" ? (
          <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
            <SectionCard title="Секции сайта" subtitle="Порядок блоков на публичной странице и быстрые кнопки для перестановки.">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSectionId(null);
                    const type: SiteSectionType = "text";
                    setSectionForm({
                      ...sectionTemplate(type),
                      name: "Новый блок",
                      id: `block-${Date.now()}`,
                      type,
                    });
                  }}
                  className="w-full rounded-2xl px-4 py-3 text-left"
                  style={{ background: blush, fontWeight: 800 }}
                >
                  + Новый блок
                </button>

                {sortedSections.map((section, index) => (
                  <div
                    key={section.id}
                    className="rounded-2xl border px-4 py-3"
                    style={{
                      background: selectedSectionId === section.id ? "#FFF1EF" : "white",
                      borderColor: selectedSectionId === section.id ? coral : "#f0e8e8",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSectionId(section.id);
                        setSectionForm(toSectionForm(section));
                      }}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div style={{ fontWeight: 800 }}>{section.name}</div>
                          <div className="mt-1 text-sm" style={{ color: "#777" }}>
                            {sectionTypeOptions.find((item) => item.value === section.type)?.label} · {section.isActive ? "виден" : "скрыт"}
                          </div>
                        </div>
                        <div className="rounded-full px-3 py-1" style={{ background: blush, fontSize: 12, fontWeight: 800 }}>
                          #{section.sortOrder}
                        </div>
                      </div>
                    </button>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSectionMove(section.id, -1)}
                        disabled={index === 0}
                        className="rounded-full px-3 py-2"
                        style={{ background: blush, fontWeight: 800, opacity: index === 0 ? 0.5 : 1 }}
                      >
                        Вверх
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSectionMove(section.id, 1)}
                        disabled={index === sortedSections.length - 1}
                        className="rounded-full px-3 py-2"
                        style={{ background: blush, fontWeight: 800, opacity: index === sortedSections.length - 1 ? 0.5 : 1 }}
                      >
                        Вниз
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title={selectedSectionId ? "Редактирование блока" : "Новый блок"}
              subtitle={
                sectionTypeOptions.find((item) => item.value === sectionForm.type)?.hint ||
                "Заполните поля и нажмите «Сохранить» — изменения появятся на сайте у всех гостей."
              }
            >
              <form className="space-y-8" onSubmit={handleSectionSave}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2 rounded-2xl border border-[#f0e8e8] bg-[#fffefb] px-4 py-3 text-sm" style={{ color: "#666" }}>
                    {selectedSectionId ? (
                      <>
                        ID блока: <strong style={{ color: ink }}>{selectedSectionId}</strong>
                      </>
                    ) : (
                      <>ID создастся автоматически из названия, если поле ID оставить пустым.</>
                    )}
                  </div>

                {!selectedSectionId ? (
                  <label className="block">
                    <FieldLabel>ID блока (латиница, необязательно)</FieldLabel>
                    <TextInput
                      value={sectionForm.id}
                      onChange={(event) => setSectionForm({ ...sectionForm, id: event.target.value })}
                      placeholder="hero-main"
                    />
                  </label>
                ) : null}

                <label className="block">
                  <FieldLabel>Название в админке *</FieldLabel>
                  <TextInput
                    value={sectionForm.name}
                    onChange={(event) => setSectionForm({ ...sectionForm, name: event.target.value })}
                    placeholder="Блок про тамаду"
                  />
                </label>

                <label className="block">
                  <FieldLabel>Тип блока</FieldLabel>
                  <Select
                    value={sectionForm.type}
                    onChange={(event) => handleSectionTypeChange(event.target.value as SiteSectionType)}
                  >
                    {sectionTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </label>

                <label className="block">
                  <FieldLabel>Порядок</FieldLabel>
                  <TextInput
                    type="number"
                    value={sectionForm.sortOrder}
                    onChange={(event) => setSectionForm({ ...sectionForm, sortOrder: Number(event.target.value) || 0 })}
                  />
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-[#f0e8e8] px-4 py-3 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={sectionForm.isActive}
                    onChange={(event) => setSectionForm({ ...sectionForm, isActive: event.target.checked })}
                  />
                  <span style={{ fontWeight: 700 }}>Показывать блок на сайте</span>
                </label>
                </div>

                <div>
                  <h3 className="mb-4" style={{ fontWeight: 900, fontSize: 18 }}>
                    Тексты
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <FieldLabel>Бейдж</FieldLabel>
                  <TextInput
                    value={sectionForm.badge}
                    onChange={(event) => setSectionForm({ ...sectionForm, badge: event.target.value })}
                    placeholder="Например: Наш ведущий"
                  />
                </label>

                <label className="block">
                  <FieldLabel>Заголовок</FieldLabel>
                  <TextInput
                    value={sectionForm.title}
                    onChange={(event) => setSectionForm({ ...sectionForm, title: event.target.value })}
                  />
                </label>

                <label className="block">
                  <FieldLabel>Подзаголовок</FieldLabel>
                  <TextInput
                    value={sectionForm.subtitle}
                    onChange={(event) => setSectionForm({ ...sectionForm, subtitle: event.target.value })}
                  />
                </label>

                <label className="block md:col-span-2">
                  <FieldLabel>Описание</FieldLabel>
                  <TextArea
                    rows={3}
                    value={sectionForm.description}
                    onChange={(event) => setSectionForm({ ...sectionForm, description: event.target.value })}
                  />
                </label>

                <label className="block md:col-span-2">
                  <FieldLabel>Дополнительная заметка</FieldLabel>
                  <TextArea
                    rows={2}
                    value={sectionForm.note}
                    onChange={(event) => setSectionForm({ ...sectionForm, note: event.target.value })}
                  />
                </label>

                <label className="block">
                  <FieldLabel>Кнопка</FieldLabel>
                  <TextInput
                    value={sectionForm.buttonLabel}
                    onChange={(event) => setSectionForm({ ...sectionForm, buttonLabel: event.target.value })}
                    placeholder="Написать ведущему"
                  />
                </label>

                <label className="block">
                  <FieldLabel>Ссылка кнопки</FieldLabel>
                  <TextInput
                    value={sectionForm.buttonHref}
                    onChange={(event) => setSectionForm({ ...sectionForm, buttonHref: event.target.value })}
                    placeholder="https://t.me/..."
                  />
                </label>
                  </div>
                </div>

                {imageSlots.primary || imageSlots.secondary || imageSlots.background || imageSlots.gallery ? (
                  <div>
                    <h3 className="mb-4" style={{ fontWeight: 900, fontSize: 18 }}>
                      Изображения
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {imageSlots.background ? (
                        <div className="md:col-span-2">
                          <SectionImagePicker
                            label="Фон всей страницы"
                            hint="Серое фото позади белой карточки сайта (видно по краям при прокрутке)"
                            value={sectionForm.backgroundImage}
                            onChange={(backgroundImage) =>
                              setSectionForm((current) => ({ ...current, backgroundImage }))
                            }
                            uploads={uploadedImages}
                            uploadBusy={uploadBusy}
                            onUpload={uploadImageFile}
                          />
                        </div>
                      ) : null}
                      {imageSlots.primary ? (
                        <SectionImagePicker
                          label="Основное фото"
                          hint="Крупное фото блока на сайте"
                          value={sectionForm.primaryImage}
                          onChange={(primaryImage) => setSectionForm((current) => ({ ...current, primaryImage }))}
                          uploads={uploadedImages}
                          uploadBusy={uploadBusy}
                          onUpload={uploadImageFile}
                        />
                      ) : null}
                      {imageSlots.secondary ? (
                        <SectionImagePicker
                          label="Второе фото"
                          hint="Дополнительный кадр (обложка, дресс-код)"
                          value={sectionForm.secondaryImage}
                          onChange={(secondaryImage) => setSectionForm((current) => ({ ...current, secondaryImage }))}
                          uploads={uploadedImages}
                          uploadBusy={uploadBusy}
                          onUpload={uploadImageFile}
                        />
                      ) : null}
                      {imageSlots.gallery ? (
                        <GalleryImagesEditor
                          images={galleryImages}
                          onChange={(next) =>
                            setSectionForm((current) => ({
                              ...current,
                              galleryImagesText: next.join("\n"),
                            }))
                          }
                          uploads={uploadedImages}
                          uploadBusy={uploadBusy}
                          onUpload={uploadImageFile}
                        />
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {imageSlots.items ? (
                <div>
                  <h3 className="mb-4" style={{ fontWeight: 900, fontSize: 18 }}>
                    {sectionForm.type === "story" ? "История пары" : "Элементы списка"}
                  </h3>
                  {sectionForm.type === "story" ? (
                    <StoryItemsEditor
                      itemsText={sectionForm.itemsText}
                      onChange={(itemsText) => setSectionForm((current) => ({ ...current, itemsText }))}
                      uploads={uploadedImages}
                      uploadBusy={uploadBusy}
                      onUpload={uploadImageFile}
                    />
                  ) : (
                    <label className="block">
                      <FieldLabel>Элементы блока</FieldLabel>
                      <TextArea
                        rows={6}
                        value={sectionForm.itemsText}
                        onChange={(event) => setSectionForm({ ...sectionForm, itemsText: event.target.value })}
                        placeholder={sectionExamples[sectionForm.type]}
                      />
                    </label>
                  )}
                </div>
                ) : null}

                <div className="flex flex-wrap gap-3 border-t border-[#f0e8e8] pt-6">
                  <button className="rounded-full px-6 py-3 text-white" style={{ background: coral, fontWeight: 800 }}>
                    {selectedSectionId ? "Сохранить блок" : "Добавить блок"}
                  </button>
                  {selectedSectionId ? (
                    <button
                      type="button"
                      onClick={() => handleDelete("section")}
                      className="rounded-full px-6 py-3"
                      style={{ background: "#1a1a1a", color: "white", fontWeight: 800 }}
                    >
                      Удалить блок
                    </button>
                  ) : null}
                </div>
              </form>
            </SectionCard>
          </div>
        ) : null}

        {activeTab === "media" ? (
          <SectionCard
            title="Медиатека"
            subtitle="Все фото в одном месте: загрузка с компьютера и стандартные кадры. В блоках сайта выбирайте «Из медиатеки»."
          >
            <AdminMediaLibrary
              uploads={uploadedImages}
              uploadBusy={uploadBusy}
              onUpload={async (file) => {
                resetFeedback();
                try {
                  await uploadImageFile(file);
                  setMessage("Фото загружено. Выберите его в блоке сайта или скопируйте ID.");
                } catch (uploadIssue) {
                  setError(uploadIssue instanceof Error ? uploadIssue.message : "Не удалось загрузить фото");
                }
              }}
            />
          </SectionCard>
        ) : null}

        {activeTab === "guests" ? (
          <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
            <SectionCard title="Гости" subtitle="Список гостей, которые будут отображаться на публичной странице.">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedGuestId(null)}
                  className="w-full rounded-2xl px-4 py-3 text-left"
                  style={{ background: blush, fontWeight: 800 }}
                >
                  + Новый гость
                </button>

                {sortedGuests.map((guest) => (
                  <button
                    key={guest.id}
                    type="button"
                    onClick={() => setSelectedGuestId(guest.id)}
                    className="w-full rounded-2xl px-4 py-3 text-left"
                    style={{
                      background: selectedGuestId === guest.id ? "#FFF1EF" : "white",
                      border: `1px solid ${selectedGuestId === guest.id ? coral : "#f0e8e8"}`,
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>{guest.name}</div>
                    <div className="mt-1 text-sm" style={{ color: "#777" }}>{guest.side || "Без стороны"}</div>
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
                    <option value="">Выберите</option>
                    {sideOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
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
                  <TextArea rows={2} value={guestForm.photo || ""} onChange={(event) => setGuestForm({ ...guestForm, photo: event.target.value || null })} />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-[#f0e8e8] px-4 py-3 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={guestForm.willAttend}
                    onChange={(event) => setGuestForm({ ...guestForm, willAttend: event.target.checked })}
                  />
                  <span style={{ fontWeight: 700 }}>Гость сможет прийти</span>
                </label>
                <div className="md:col-span-2 flex flex-wrap gap-3">
                  <button className="rounded-full px-6 py-3 text-white" style={{ background: coral, fontWeight: 800 }}>
                    {selectedGuestId ? "Сохранить гостя" : "Добавить гостя"}
                  </button>
                  {selectedGuestId ? (
                    <button
                      type="button"
                      onClick={() => handleDelete("guest")}
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
            <SectionCard title="Категории подарков">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryId(null)}
                  className="w-full rounded-2xl px-4 py-3 text-left"
                  style={{ background: blush, fontWeight: 800 }}
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
                    <div className="mt-1 text-sm" style={{ color: "#777" }}>{category.id}</div>
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard title={selectedCategoryId ? "Редактирование категории" : "Новая категория"}>
              <form className="grid gap-4" onSubmit={handleCategorySave}>
                {!selectedCategoryId ? (
                  <label className="block">
                    <FieldLabel>ID категории</FieldLabel>
                    <TextInput value={categoryForm.id} onChange={(event) => setCategoryForm({ ...categoryForm, id: event.target.value })} />
                  </label>
                ) : null}
                <label className="block">
                  <FieldLabel>Название</FieldLabel>
                  <TextInput value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} />
                </label>
                <label className="block">
                  <FieldLabel>Описание</FieldLabel>
                  <TextArea rows={4} value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} />
                </label>
                <label className="block">
                  <FieldLabel>Порядок</FieldLabel>
                  <TextInput type="number" value={categoryForm.sortOrder} onChange={(event) => setCategoryForm({ ...categoryForm, sortOrder: Number(event.target.value) || 0 })} />
                </label>
                <div className="flex flex-wrap gap-3">
                  <button className="rounded-full px-6 py-3 text-white" style={{ background: coral, fontWeight: 800 }}>
                    {selectedCategoryId ? "Сохранить категорию" : "Добавить категорию"}
                  </button>
                  {selectedCategoryId ? (
                    <button
                      type="button"
                      onClick={() => handleDelete("category")}
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
            <SectionCard title="Подарки" subtitle="Можно менять тексты, режим брони, ссылки и специальные условия.">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedGiftId(null)}
                  className="w-full rounded-2xl px-4 py-3 text-left"
                  style={{ background: blush, fontWeight: 800 }}
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
                        <div className="rounded-2xl p-3" style={{ background: "#FBD3D8" }}>
                          <Icon size={18} style={{ color: coral }} />
                        </div>
                        <div className="min-w-0">
                          <div style={{ fontWeight: 800 }}>{gift.name}</div>
                          <div className="mt-1 text-sm" style={{ color: "#666" }}>{gift.categoryName || gift.categoryId}</div>
                          <div className="mt-1 text-xs" style={{ color: "#999" }}>
                            {bookingModeLabels[gift.bookingMode]} · броней: {bookings.filter((item) => item.giftId === gift.id).length}
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
                  <FieldLabel>Описание</FieldLabel>
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
                  <FieldLabel>Подпись суммы</FieldLabel>
                  <TextInput value={giftForm.priceLabel} onChange={(event) => setGiftForm({ ...giftForm, priceLabel: event.target.value })} />
                </label>
                <label className="block">
                  <FieldLabel>Рекомендуемая сумма</FieldLabel>
                  <TextInput type="number" value={giftForm.suggestedAmount ?? ""} onChange={(event) => setGiftForm({ ...giftForm, suggestedAmount: event.target.value ? Number(event.target.value) : null })} />
                </label>
                <label className="block md:col-span-2">
                  <FieldLabel>Дополнительные условия</FieldLabel>
                  <TextArea rows={3} value={giftForm.conditionsText} onChange={(event) => setGiftForm({ ...giftForm, conditionsText: event.target.value })} />
                </label>
                <label className="block md:col-span-2">
                  <FieldLabel>Ссылка</FieldLabel>
                  <TextInput value={giftForm.link} onChange={(event) => setGiftForm({ ...giftForm, link: event.target.value })} />
                </label>
                <label className="block">
                  <FieldLabel>Режим брони</FieldLabel>
                  <Select value={giftForm.bookingMode} onChange={(event) => setGiftForm({ ...giftForm, bookingMode: event.target.value as GiftBookingMode })}>
                    <option value="single">Один бронь</option>
                    <option value="multiple">Можно выбрать несколько раз</option>
                    <option value="travel">Выбор направления</option>
                  </Select>
                </label>
                <label className="block">
                  <FieldLabel>Special code</FieldLabel>
                  <TextInput value={giftForm.specialCode} onChange={(event) => setGiftForm({ ...giftForm, specialCode: event.target.value })} />
                </label>
                {giftForm.bookingMode === "travel" ? (
                  <label className="block md:col-span-2">
                    <FieldLabel>Направления (каждое с новой строки)</FieldLabel>
                    <TextArea rows={6} value={giftForm.travelOptionsText} onChange={(event) => setGiftForm({ ...giftForm, travelOptionsText: event.target.value })} />
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
                  <TextInput type="number" value={giftForm.sortOrder} onChange={(event) => setGiftForm({ ...giftForm, sortOrder: Number(event.target.value) || 0 })} />
                </label>
                <div className="md:col-span-2 flex flex-wrap gap-3">
                  <button className="rounded-full px-6 py-3 text-white" style={{ background: coral, fontWeight: 800 }}>
                    {selectedGiftId ? "Сохранить подарок" : "Добавить подарок"}
                  </button>
                  {selectedGiftId ? (
                    <button
                      type="button"
                      onClick={() => handleDelete("gift")}
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
          <SectionCard title="Музыкальные пожелания" subtitle="Песни, которые гости уже добавили через сайт.">
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
