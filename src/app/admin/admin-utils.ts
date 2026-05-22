import type { SiteSectionItem, SiteSectionType } from "../shared/wedding-types";

export function serializeSectionItems(items: SiteSectionItem[] = []) {
  return items
    .map((item) =>
      [item.title, item.subtitle || "", item.text || "", item.extra || "", item.image || ""].join(" | "),
    )
    .join("\n");
}

export function parseSectionItems(text: string): SiteSectionItem[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = "", subtitle = "", body = "", extra = "", image = ""] = line
        .split("|")
        .map((part) => part.trim());
      return {
        title,
        subtitle,
        text: body,
        extra,
        image,
      };
    })
    .filter((item) => item.title);
}

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
    personProfile: type === "person",
  };
}

export function emptyPersonProfile(): SiteSectionItem {
  return { title: "", subtitle: "", text: "" };
}

export function personProfileFromItems(items: SiteSectionItem[] = []): SiteSectionItem {
  const first = items[0];
  if (!first) return emptyPersonProfile();
  return {
    title: first.title || "",
    subtitle: first.subtitle || "",
    text: first.text || "",
  };
}

export type MediaItem = {
  id: string;
  label: string;
  src: string;
  value: string;
  source: "upload" | "library";
};
