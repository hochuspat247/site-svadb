import { defaultSiteSections } from "../data/site-builder-defaults.js";
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

const GENERIC_STORY_TITLES = ["Первая встреча", "Путешествия", "Предложение"];

function isGenericStoryItems(remoteItems: SiteSectionItem[]) {
  if (remoteItems.length !== GENERIC_STORY_TITLES.length) {
    return false;
  }

  return remoteItems.every((item, index) => item.title === GENERIC_STORY_TITLES[index]);
}

function mergeStoryItems(
  fallbackItems: SiteSectionItem[] = [],
  remoteItems: SiteSectionItem[] = [],
) {
  if (!fallbackItems.length) {
    return remoteItems;
  }

  if (!remoteItems.length) {
    return fallbackItems;
  }

  const shouldRestoreDefaults =
    remoteItems.length < fallbackItems.length || isGenericStoryItems(remoteItems);

  if (shouldRestoreDefaults) {
    return fallbackItems.map((fallbackItem, index) => ({
      ...fallbackItem,
      image: remoteItems[index]?.image || fallbackItem.image,
    }));
  }

  return remoteItems.map((item, index) => ({
    ...(fallbackItems[index] ?? {}),
    ...item,
    image: item.image || fallbackItems[index]?.image,
  }));
}

const STORY_FALLBACK_IMAGES = [
  "photo-07",
  "photo-06",
  "photo-04",
  "photo-15",
  "photo-17",
  "photo-18",
  "photo-10",
];

export function mergeSiteSections(remote: SiteSection[]) {
  if (remote.length === 0) {
    return [...defaultSiteSections];
  }

  const remoteMap = Object.fromEntries(remote.map((section) => [section.id, section]));
  const knownIds = new Set(defaultSiteSections.map((section) => section.id));

  const mergedDefaults = defaultSiteSections
    .map((fallback) => {
      const fromApi = remoteMap[fallback.id];
      if (!fromApi) {
        return null;
      }

      const mergedSettings = {
        ...fallback.settings,
        ...fromApi.settings,
      };

      if (fallback.id === "story") {
        mergedSettings.items = mergeStoryItems(
          fallback.settings.items,
          fromApi.settings.items ?? [],
        );
      }

      return {
        ...fallback,
        ...fromApi,
        settings: mergedSettings,
      };
    })
    .filter((section): section is SiteSection => section !== null);

  const extraSections = remote.filter((section) => !knownIds.has(section.id));

  return [...mergedDefaults, ...extraSections];
}

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

  return items.map((item, index) => {
    const resolved = resolveSiteImage(item.image);
    const fallback = resolveSiteImage(STORY_FALLBACK_IMAGES[index % STORY_FALLBACK_IMAGES.length]);

    return {
      date: item.subtitle || "",
      title: item.title || "",
      text: item.text || "",
      image: resolved || fallback,
    };
  });
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
