import React, { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";
import { resolveSiteImage } from "../shared/site-photos";
import type { SiteSectionItem } from "../shared/wedding-types";
import AdminMediaLibrary from "./AdminMediaLibrary";

type StoryItemsEditorProps = {
  items: SiteSectionItem[];
  onChange: (items: SiteSectionItem[]) => void;
  uploads: { url: string; filename: string }[];
  uploadBusy: boolean;
  onUpload: (file: File) => Promise<string>;
};

const coral = "#E85A4F";

const emptyItem = (): SiteSectionItem => ({
  title: "",
  subtitle: "",
  text: "",
  image: "",
});

export default function StoryItemsEditor({
  items,
  onChange,
  uploads,
  uploadBusy,
  onUpload,
}: StoryItemsEditorProps) {
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);

  const updateItems = (next: SiteSectionItem[]) => {
    onChange(next);
  };

  const updateItem = (index: number, patch: Partial<SiteSectionItem>) => {
    const next = items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
    updateItems(next);
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = items.slice();
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateItems(next);
  };

  return (
    <div className="rounded-2xl border border-[#f0e8e8] bg-white p-4 md:col-span-2">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div style={{ fontWeight: 800 }}>Этапы истории</div>
          <div className="mt-1 text-sm" style={{ color: "#888" }}>
            У каждого этапа — заголовок, период, текст и своё фото. Порядок сверху вниз на сайте.
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white"
          style={{ background: coral, fontWeight: 700 }}
          onClick={() => updateItems([...items, emptyItem()])}
        >
          <Plus size={16} />
          Добавить этап
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#f0e8e8] px-4 py-10 text-center text-sm" style={{ color: "#999" }}>
          Пока нет этапов — нажмите «Добавить этап».
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li key={`story-item-${index}`} className="rounded-2xl border border-[#f0e8e8] bg-[#fff9f8] p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div style={{ fontWeight: 800 }}>Этап {index + 1}</div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="rounded-lg p-2"
                    style={{ background: "#f5f5f5" }}
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-2"
                    style={{ background: "#f5f5f5" }}
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-2"
                    style={{ background: "#fff1ef", color: coral }}
                    onClick={() => updateItems(items.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-extrabold tracking-wide" style={{ color: "#666" }}>
                    Заголовок
                  </span>
                  <input
                    value={item.title}
                    onChange={(event) => updateItem(index, { title: event.target.value })}
                    placeholder="Первая встреча"
                    className="mt-1 w-full rounded-xl border border-[#f0e8e8] bg-white px-3 py-2.5 outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-extrabold tracking-wide" style={{ color: "#666" }}>
                    Период / дата
                  </span>
                  <input
                    value={item.subtitle || ""}
                    onChange={(event) => updateItem(index, { subtitle: event.target.value })}
                    placeholder="Весна 2021"
                    className="mt-1 w-full rounded-xl border border-[#f0e8e8] bg-white px-3 py-2.5 outline-none"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-xs font-extrabold tracking-wide" style={{ color: "#666" }}>
                    Текст
                  </span>
                  <textarea
                    rows={3}
                    value={item.text || ""}
                    onChange={(event) => updateItem(index, { text: event.target.value })}
                    placeholder="Расскажите, что произошло в этот момент..."
                    className="mt-1 w-full resize-y rounded-xl border border-[#f0e8e8] bg-white px-3 py-2.5 outline-none"
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap items-start gap-4 rounded-xl border border-[#f0e8e8] bg-white p-3">
                <div className="h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-[#f3f3f3]">
                  {item.image ? (
                    <img src={resolveSiteImage(item.image)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs" style={{ color: "#aaa" }}>
                      Нет фото
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
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
                        if (!file) return;
                        void onUpload(file).then((url) => updateItem(index, { image: url }));
                        event.target.value = "";
                      }}
                    />
                    Загрузить
                  </label>
                  <button
                    type="button"
                    className="rounded-full border px-4 py-2 text-sm"
                    style={{ borderColor: "#f0e8e8", fontWeight: 700 }}
                    onClick={() => setPickerIndex(index)}
                  >
                    Из медиатеки
                  </button>
                  {item.image ? (
                    <button
                      type="button"
                      className="rounded-full px-4 py-2 text-sm"
                      style={{ background: "#f5f5f5", fontWeight: 700 }}
                      onClick={() => updateItem(index, { image: "" })}
                    >
                      Убрать фото
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pickerIndex !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f0e8e8] px-5 py-4">
              <div style={{ fontWeight: 900, fontSize: 18 }}>
                Фото для этапа {pickerIndex + 1}
              </div>
              <button
                type="button"
                className="rounded-full p-2"
                style={{ background: "#f5f5f5" }}
                onClick={() => setPickerIndex(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-5">
              <AdminMediaLibrary
                uploads={uploads}
                uploadBusy={uploadBusy}
                onUpload={async (file) => {
                  const url = await onUpload(file);
                  if (pickerIndex !== null) {
                    updateItem(pickerIndex, { image: url });
                    setPickerIndex(null);
                  }
                }}
                onPick={(picked) => {
                  updateItem(pickerIndex, { image: picked });
                  setPickerIndex(null);
                }}
                pickLabel="Выбрать"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
