import React, { useMemo, useState } from "react";
import { ImageIcon, Upload } from "lucide-react";
import { resolveSiteImage, sitePhotoOptions } from "../shared/site-photos";
import type { MediaItem } from "./admin-utils";

type Filter = "all" | "uploads" | "library";

type AdminMediaLibraryProps = {
  uploads: { url: string; filename: string }[];
  uploadBusy: boolean;
  onUpload: (file: File) => Promise<void>;
  onPick?: (value: string) => void;
  pickLabel?: string;
};

const coral = "#E85A4F";
const ink = "#1A1A1A";
const blush = "#FFF7F4";

export default function AdminMediaLibrary({
  uploads,
  uploadBusy,
  onUpload,
  onPick,
  pickLabel = "Выбрать",
}: AdminMediaLibraryProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [dragOver, setDragOver] = useState(false);

  const items = useMemo<MediaItem[]>(() => {
    const uploaded = uploads.map((item) => ({
      id: `upload:${item.filename}`,
      label: item.filename,
      src: resolveSiteImage(item.url),
      value: item.url,
      source: "upload" as const,
    }));

    const library = sitePhotoOptions.map((photo) => ({
      id: `lib:${photo.id}`,
      label: photo.label,
      src: photo.src,
      value: photo.id,
      source: "library" as const,
    }));

    return [...uploaded, ...library];
  }, [uploads]);

  const filtered = items.filter((item) => {
    if (filter === "uploads") return item.source === "upload";
    if (filter === "library") return item.source === "library";
    return true;
  });

  const handleFiles = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    await onUpload(file);
  };

  return (
    <div className="space-y-5">
      <label
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 transition"
        style={{
          borderColor: dragOver ? coral : "#e8dede",
          background: dragOver ? "#fff5f3" : blush,
          opacity: uploadBusy ? 0.6 : 1,
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          void handleFiles(event.dataTransfer.files);
        }}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
          className="sr-only"
          disabled={uploadBusy}
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <Upload size={32} style={{ color: coral }} />
        <div className="mt-4 text-center" style={{ fontWeight: 800, fontSize: 18 }}>
          {uploadBusy ? "Загрузка…" : "Перетащите фото сюда или нажмите для выбора"}
        </div>
        <div className="mt-2 text-center text-sm" style={{ color: "#777" }}>
          JPG, PNG, WebP, GIF · до 14 МБ · файлы сохраняются на сервере для всех гостей
        </div>
      </label>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", "Все"],
            ["uploads", `Загруженные (${uploads.length})`],
            ["library", "Стандартные"],
          ] as [Filter, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className="rounded-full px-4 py-2 text-sm"
            style={{
              background: filter === id ? coral : "white",
              color: filter === id ? "white" : ink,
              border: `1px solid ${filter === id ? coral : "#f0e8e8"}`,
              fontWeight: 700,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center rounded-2xl border border-[#f0e8e8] bg-white px-6 py-16"
          style={{ color: "#888" }}
        >
          <ImageIcon size={40} style={{ color: "#ddd" }} />
          <p className="mt-4 text-center">Пока нет файлов в этой категории</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-[#f0e8e8] bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-[#f5f5f5]">
                <img src={item.src} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-end gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                  {onPick ? (
                    <button
                      type="button"
                      className="flex-1 rounded-full px-3 py-2 text-sm text-white"
                      style={{ background: coral, fontWeight: 700 }}
                      onClick={() => onPick(item.value)}
                    >
                      {pickLabel}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="rounded-full bg-white/90 px-3 py-2 text-xs"
                    style={{ fontWeight: 700 }}
                    onClick={() => navigator.clipboard.writeText(item.value)}
                  >
                    Копировать ID
                  </button>
                </div>
              </div>
              <div className="px-3 py-2">
                <div className="truncate text-sm" style={{ fontWeight: 800 }}>
                  {item.label}
                </div>
                <div className="truncate text-xs" style={{ color: "#999" }}>
                  {item.value}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
