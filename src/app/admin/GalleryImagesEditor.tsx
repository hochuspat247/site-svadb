import React, { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";
import { resolveSiteImage } from "../shared/site-photos";
import AdminMediaLibrary from "./AdminMediaLibrary";

type GalleryImagesEditorProps = {
  images: string[];
  onChange: (images: string[]) => void;
  uploads: { url: string; filename: string }[];
  uploadBusy: boolean;
  onUpload: (file: File) => Promise<string>;
};

const coral = "#E85A4F";

export default function GalleryImagesEditor({
  images,
  onChange,
  uploads,
  uploadBusy,
  onUpload,
}: GalleryImagesEditorProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const move = (index: number, direction: -1 | 1) => {
    const next = images.slice();
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="rounded-2xl border border-[#f0e8e8] bg-white p-4 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div style={{ fontWeight: 800 }}>Галерея</div>
          <div className="mt-1 text-sm" style={{ color: "#888" }}>
            Порядок карточек на сайте — сверху вниз. {images.length} фото.
          </div>
        </div>
        <div className="flex gap-2">
          <label
            className="inline-flex cursor-pointer items-center rounded-full px-4 py-2 text-sm text-white"
            style={{ background: coral, fontWeight: 700, opacity: uploadBusy ? 0.6 : 1 }}
          >
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploadBusy}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void onUpload(file).then((url) => onChange([...images, url]));
                }
                event.target.value = "";
              }}
            />
            <Plus size={16} className="mr-1" />
            Загрузить
          </label>
          <button
            type="button"
            className="inline-flex items-center rounded-full border px-4 py-2 text-sm"
            style={{ borderColor: "#f0e8e8", fontWeight: 700 }}
            onClick={() => setPickerOpen(true)}
          >
            <Plus size={16} className="mr-1" />
            Из медиатеки
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-[#f0e8e8] px-4 py-10 text-center text-sm" style={{ color: "#999" }}>
          Добавьте хотя бы одно фото
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {images.map((image, index) => (
            <li
              key={`${image}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-[#f0e8e8] bg-[#fff9f8] p-3"
            >
              <img
                src={resolveSiteImage(image)}
                alt=""
                className="h-16 w-16 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1 truncate text-sm" style={{ fontWeight: 600 }}>
                {image}
              </div>
              <div className="flex shrink-0 gap-1">
                <button type="button" className="rounded-lg p-2" style={{ background: "#f5f5f5" }} onClick={() => move(index, -1)} disabled={index === 0}>
                  <ArrowUp size={16} />
                </button>
                <button type="button" className="rounded-lg p-2" style={{ background: "#f5f5f5" }} onClick={() => move(index, 1)} disabled={index === images.length - 1}>
                  <ArrowDown size={16} />
                </button>
                <button
                  type="button"
                  className="rounded-lg p-2"
                  style={{ background: "#fff1ef", color: coral }}
                  onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f0e8e8] px-5 py-4">
              <div style={{ fontWeight: 900, fontSize: 18 }}>Добавить в галерею</div>
              <button type="button" className="rounded-full p-2" style={{ background: "#f5f5f5" }} onClick={() => setPickerOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-5">
              <AdminMediaLibrary
                uploads={uploads}
                uploadBusy={uploadBusy}
                onUpload={async (file) => {
                  const url = await onUpload(file);
                  onChange([...images, url]);
                  setPickerOpen(false);
                }}
                onPick={(picked) => {
                  onChange([...images, picked]);
                  setPickerOpen(false);
                }}
                pickLabel="Добавить"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
