import React, { useState } from "react";
import { ImagePlus, Trash2, X } from "lucide-react";
import { resolveSiteImage } from "../shared/site-photos";
import AdminMediaLibrary from "./AdminMediaLibrary";

type SectionImagePickerProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  uploads: { url: string; filename: string }[];
  uploadBusy: boolean;
  onUpload: (file: File) => Promise<string>;
};

const coral = "#E85A4F";
const ink = "#1A1A1A";

export default function SectionImagePicker({
  label,
  hint,
  value,
  onChange,
  uploads,
  uploadBusy,
  onUpload,
}: SectionImagePickerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleUpload = async (file: File) => {
    const url = await onUpload(file);
    onChange(url);
    setPickerOpen(false);
  };

  return (
    <div className="rounded-2xl border border-[#f0e8e8] bg-[#fffcfb] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div style={{ fontWeight: 800 }}>{label}</div>
          {hint ? (
            <div className="mt-1 text-sm" style={{ color: "#888" }}>
              {hint}
            </div>
          ) : null}
        </div>
        {value ? (
          <button
            type="button"
            className="rounded-full p-2"
            style={{ background: "#fff1ef", color: coral }}
            onClick={() => onChange("")}
            title="Убрать фото"
          >
            <Trash2 size={16} />
          </button>
        ) : null}
      </div>

      <div className="mt-3 overflow-hidden rounded-xl bg-[#f3f3f3]">
        {value ? (
          <img src={resolveSiteImage(value)} alt="" className="aspect-[4/3] w-full object-cover" />
        ) : (
          <div
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2"
            style={{ color: "#aaa" }}
          >
            <ImagePlus size={28} />
            <span className="text-sm">Фото не выбрано</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <label
          className="inline-flex cursor-pointer items-center rounded-full px-4 py-2 text-sm"
          style={{
            background: coral,
            color: "white",
            fontWeight: 700,
            opacity: uploadBusy ? 0.6 : 1,
          }}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={uploadBusy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleUpload(file);
              event.target.value = "";
            }}
          />
          Загрузить
        </label>
        <button
          type="button"
          className="rounded-full border px-4 py-2 text-sm"
          style={{ borderColor: "#f0e8e8", fontWeight: 700 }}
          onClick={() => setPickerOpen(true)}
        >
          Из медиатеки
        </button>
      </div>

      {pickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f0e8e8] px-5 py-4">
              <div style={{ fontWeight: 900, fontSize: 18 }}>Выбор фото — {label}</div>
              <button
                type="button"
                className="rounded-full p-2"
                style={{ background: "#f5f5f5" }}
                onClick={() => setPickerOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-5">
              <AdminMediaLibrary
                uploads={uploads}
                uploadBusy={uploadBusy}
                onUpload={handleUpload}
                onPick={(picked) => {
                  onChange(picked);
                  setPickerOpen(false);
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
