import type { SiteSection, SiteSectionItem, SiteSectionSettings } from "./wedding-types";
import { getDefaultGalleryImages, resolveSiteImage, sitePhotoOptions } from "./site-photos";

const MOOD_LABEL_FALLBACKS = [
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

export function buildSiteContentMap(sections: SiteSection[]) {
  return Object.fromEntries(sections.map((section) => [section.id, section]));
}

export function getSection(
  map: Record<string, SiteSection | undefined>,
  id: string,
) {
  return map[id];
}

export function isSectionActive(section?: SiteSection) {
  return section?.isActive !== false;
}

export function sectionSettings(section?: SiteSection): SiteSectionSettings {
  return section?.settings ?? {};
}

export function splitCoupleNames(title?: string) {
  const value = (title || "Иван и Анастасия").trim();
  const parts = value.split(/\s+(?:и|&)\s+/i);

  if (parts.length >= 2) {
    return {
      groom: parts[0].trim().toUpperCase(),
      bride: parts[1].trim().toUpperCase(),
    };
  }

  return { groom: value.toUpperCase(), bride: "" };
}

export function getGallerySlides(settings: SiteSectionSettings) {
  const imageIds =
    settings.galleryImages?.length > 0
      ? settings.galleryImages
      : getDefaultGalleryImages();

  return imageIds.map((id, index) => ({
    src: resolveSiteImage(id),
    label:
      settings.items?.[index]?.title ||
      sitePhotoOptions.find((photo) => photo.id === id)?.label ||
      MOOD_LABEL_FALLBACKS[index] ||
      "Любовь",
  }));
}

export function getStorySlides(items?: SiteSectionItem[]) {
  if (!items?.length) {
    return [];
  }

  return items.map((item) => ({
    date: item.subtitle || "",
    title: item.title || "",
    text: item.text || "",
    image: resolveSiteImage(item.image),
  }));
}

export function getScheduleItems(items?: SiteSectionItem[]) {
  if (!items?.length) {
    return [];
  }

  return items.map((item) => ({
    time: item.title || "",
    title: item.subtitle || "",
    text: item.text || "",
  }));
}

export function getFaqItems(items?: SiteSectionItem[]) {
  if (!items?.length) {
    return [];
  }

  return items.map((item) => ({
    q: item.title || "",
    a: item.text || "",
  }));
}

export function getDressColors(items?: SiteSectionItem[]) {
  if (!items?.length) {
    return [
      { c: "#F4B6BE", n: "Розовый" },
      { c: "#E85A4F", n: "Коралл" },
      { c: "#F4E1D2", n: "Крем" },
      { c: "#D9A89A", n: "Беж" },
      { c: "#8A8F7A", n: "Шалфей" },
    ];
  }

  return items.map((item) => ({
    c: item.extra || "#F4B6BE",
    n: item.title || "",
  }));
}
