create extension if not exists pgcrypto;

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  side text not null,
  phone text not null default '',
  email text not null default '',
  will_attend boolean not null default true,
  attendance_label text not null default '',
  guests_count integer not null default 1 check (guests_count >= 1),
  guest_names text not null default '',
  drink text not null default '',
  allergy text not null default '',
  photo text,
  created_at timestamptz not null default now()
);

create index if not exists guests_created_at_idx on guests (created_at desc);

create table if not exists gift_bookings (
  id uuid primary key default gen_random_uuid(),
  gift_id integer not null,
  guest_id uuid not null references guests(id) on delete cascade,
  guest_name text not null,
  selected_country text,
  booked_at timestamptz not null default now(),
  check (
    (gift_id in (15, 16) and selected_country is not null)
    or (gift_id not in (15, 16) and selected_country is null)
  )
);

create unique index if not exists gift_bookings_non_travel_unique_idx
  on gift_bookings (gift_id)
  where gift_id not in (15, 16);

create unique index if not exists gift_bookings_travel_guest_unique_idx
  on gift_bookings (guest_id)
  where gift_id in (15, 16);

create index if not exists gift_bookings_booked_at_idx on gift_bookings (booked_at desc);

create table if not exists music_wishes (
  id uuid primary key default gen_random_uuid(),
  song text not null,
  guest_id uuid references guests(id) on delete set null,
  guest_name text not null default 'Guest',
  created_at timestamptz not null default now()
);

create index if not exists music_wishes_created_at_idx on music_wishes (created_at desc);
