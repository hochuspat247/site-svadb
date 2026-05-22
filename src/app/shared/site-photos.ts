import photo01 from "../../assets/photos/photo_2026-05-22_13-58-55.jpg";
import photo02 from "../../assets/photos/photo_2026-05-22_13-59-02.jpg";
import photo03 from "../../assets/photos/photo_2026-05-22_13-59-06.jpg";
import photo04 from "../../assets/photos/photo_2026-05-22_13-59-10.jpg";
import photo05 from "../../assets/photos/photo_2026-05-22_13-59-15.jpg";
import photo06 from "../../assets/photos/photo_2026-05-22_13-59-18.jpg";
import photo07 from "../../assets/photos/photo_2026-05-22_13-59-22.jpg";
import photo08 from "../../assets/photos/photo_2026-05-22_13-59-25.jpg";
import photo09 from "../../assets/photos/photo_2026-05-22_13-59-29.jpg";
import photo10 from "../../assets/photos/photo_2026-05-22_13-59-32.jpg";
import photo11 from "../../assets/photos/photo_2026-05-22_13-59-36.jpg";
import photo12 from "../../assets/photos/photo_2026-05-22_13-59-40.jpg";
import photo13 from "../../assets/photos/photo_2026-05-22_13-59-44.jpg";
import photo14 from "../../assets/photos/photo_2026-05-22_13-59-47.jpg";
import photo15 from "../../assets/photos/photo_2026-05-22_13-59-50.jpg";
import photo16 from "../../assets/photos/photo_2026-05-22_13-59-54.jpg";
import photo17 from "../../assets/photos/photo_2026-05-22_14-00-00.jpg";
import photo18 from "../../assets/photos/photo_2026-05-22_14-00-04.jpg";

const photoLibrary = {
  "photo-01": photo01,
  "photo-02": photo02,
  "photo-03": photo03,
  "photo-04": photo04,
  "photo-05": photo05,
  "photo-06": photo06,
  "photo-07": photo07,
  "photo-08": photo08,
  "photo-09": photo09,
  "photo-10": photo10,
  "photo-11": photo11,
  "photo-12": photo12,
  "photo-13": photo13,
  "photo-14": photo14,
  "photo-15": photo15,
  "photo-16": photo16,
  "photo-17": photo17,
  "photo-18": photo18,
} as const;

export const sitePhotoOptions = [
  { id: "photo-01", label: "Портрет 1", src: photo01 },
  { id: "photo-02", label: "Портрет 2", src: photo02 },
  { id: "photo-03", label: "Портрет 3", src: photo03 },
  { id: "photo-04", label: "Танец", src: photo04 },
  { id: "photo-05", label: "Светлый кадр", src: photo05 },
  { id: "photo-06", label: "Прогулка", src: photo06 },
  { id: "photo-07", label: "Улыбка", src: photo07 },
  { id: "photo-08", label: "Нежность", src: photo08 },
  { id: "photo-09", label: "Деталь", src: photo09 },
  { id: "photo-10", label: "Обложка", src: photo10 },
  { id: "photo-11", label: "Крупный план", src: photo11 },
  { id: "photo-12", label: "Романтика", src: photo12 },
  { id: "photo-13", label: "История", src: photo13 },
  { id: "photo-14", label: "Настроение", src: photo14 },
  { id: "photo-15", label: "Объятия", src: photo15 },
  { id: "photo-16", label: "Тепло", src: photo16 },
  { id: "photo-17", label: "Семья", src: photo17 },
  { id: "photo-18", label: "Праздник", src: photo18 },
] as const;

function getMediaOrigin() {
  const apiUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

  if (apiUrl.startsWith("http")) {
    try {
      return new URL(apiUrl).origin;
    } catch {
      return "";
    }
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "";
}

export function resolveSiteImage(value?: string | null) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  const normalized = trimmed.toLowerCase();

  if (photoLibrary[normalized as keyof typeof photoLibrary]) {
    return photoLibrary[normalized as keyof typeof photoLibrary];
  }

  if (photoLibrary[trimmed as keyof typeof photoLibrary]) {
    return photoLibrary[trimmed as keyof typeof photoLibrary];
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("/uploads/")) {
    const origin = getMediaOrigin();
    return origin ? `${origin}${trimmed}` : trimmed;
  }

  return trimmed;
}

export function getDefaultGalleryImages() {
  return sitePhotoOptions.map((item) => item.id);
}
