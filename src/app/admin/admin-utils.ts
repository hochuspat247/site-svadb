import type { SiteSectionType } from "../shared/wedding-types";

export function slugifySectionId(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug;
}

export function sectionImageSlots(type: SiteSectionType) {
  return {
    primary: ["hero", "location", "dress-code", "closing", "person", "gallery", "text"].includes(type),
    secondary: ["hero", "dress-code"].includes(type),
    background: type === "hero",
    gallery: type === "gallery",
    items: ["schedule", "story", "faq", "dress-code"].includes(type),
  };
}

export type MediaItem = {
  id: string;
  label: string;
  src: string;
  value: string;
  source: "upload" | "library";
};
