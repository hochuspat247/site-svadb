import React from "react";
import type { SiteSectionItem } from "../shared/wedding-types";

type PersonProfileEditorProps = {
  profile: SiteSectionItem;
  onChange: (profile: SiteSectionItem) => void;
};

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
      className={`mt-2 w-full rounded-2xl border border-[#f0e8e8] px-4 py-3 outline-none focus:border-[#E85A4F] ${props.className || ""}`}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`mt-2 w-full rounded-2xl border border-[#f0e8e8] px-4 py-3 outline-none focus:border-[#E85A4F] ${props.className || ""}`}
    />
  );
}

export default function PersonProfileEditor({ profile, onChange }: PersonProfileEditorProps) {
  const patch = (next: Partial<SiteSectionItem>) => onChange({ ...profile, ...next });

  return (
    <div className="rounded-2xl border border-[#f0e8e8] bg-[#fff9f8] p-4 md:col-span-2">
      <div className="mb-4">
        <div style={{ fontWeight: 800 }}>Карточка ведущего</div>
        <div className="mt-1 text-sm" style={{ color: "#888" }}>
          Розовая карточка на сайте: имя, должность и короткое описание.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <FieldLabel>Имя и фамилия *</FieldLabel>
          <TextInput
            value={profile.title}
            onChange={(event) => patch({ title: event.target.value })}
            placeholder="Иван Иванов"
          />
        </label>

        <label className="block md:col-span-2">
          <FieldLabel>Должность / роль</FieldLabel>
          <TextInput
            value={profile.subtitle || ""}
            onChange={(event) => patch({ subtitle: event.target.value })}
            placeholder="Ведущий и церемониймейстер"
          />
        </label>

        <label className="block md:col-span-2">
          <FieldLabel>Описание</FieldLabel>
          <TextArea
            rows={4}
            value={profile.text || ""}
            onChange={(event) => patch({ text: event.target.value })}
            placeholder="Лёгкий, живой, без кринжа и с чувством момента."
          />
        </label>
      </div>

      <p className="mt-3 text-sm" style={{ color: "#999" }}>
        Заголовок секции, общий текст и фото редактируются в полях выше.
      </p>
    </div>
  );
}
