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

create table if not exists gift_categories (
  id text primary key,
  name text not null,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists gifts (
  id integer primary key,
  name text not null,
  hint text not null default '',
  icon_key text not null default 'Gift',
  price_label text not null default '',
  category_id text not null references gift_categories(id) on delete restrict,
  featured boolean not null default false,
  link text not null default '',
  booking_mode text not null default 'single',
  special_code text not null default '',
  suggested_amount numeric(12, 2),
  conditions_text text not null default '',
  travel_options jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (booking_mode in ('single', 'multiple', 'travel'))
);

create index if not exists gifts_category_sort_idx on gifts (category_id, sort_order asc);

create table if not exists gift_bookings (
  id uuid primary key default gen_random_uuid(),
  gift_id integer not null,
  guest_id uuid not null references guests(id) on delete cascade,
  guest_name text not null,
  selected_country text,
  contribution_amount numeric(12, 2),
  gift_booking_mode text not null default 'single',
  booked_at timestamptz not null default now()
);

alter table gift_bookings add column if not exists contribution_amount numeric(12, 2);
alter table gift_bookings add column if not exists gift_booking_mode text not null default 'single';

drop index if exists gift_bookings_non_travel_unique_idx;
drop index if exists gift_bookings_travel_guest_unique_idx;
drop index if exists gift_bookings_booked_at_idx;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'gift_bookings_check'
  ) then
    alter table gift_bookings drop constraint gift_bookings_check;
  end if;
end $$;

create index if not exists gift_bookings_gift_id_idx on gift_bookings (gift_id);
create index if not exists gift_bookings_guest_id_idx on gift_bookings (guest_id);
create index if not exists gift_bookings_booked_at_idx on gift_bookings (booked_at desc);

create table if not exists music_wishes (
  id uuid primary key default gen_random_uuid(),
  song text not null,
  guest_id uuid references guests(id) on delete set null,
  guest_name text not null default 'Guest',
  created_at timestamptz not null default now()
);

create index if not exists music_wishes_created_at_idx on music_wishes (created_at desc);
