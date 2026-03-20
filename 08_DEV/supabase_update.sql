-- ══════════════════════════════════════════
--  K-STUDIO — полная схема БД (Fresha-стиль)
--  Запусти ЦЕЛИКОМ в Supabase SQL Editor
-- ══════════════════════════════════════════

-- 1. Таблица услуг
create table if not exists public.services (
  id               uuid default gen_random_uuid() primary key,
  name             text not null,
  duration_minutes integer not null default 60,
  price            integer not null default 0,
  description      text,
  emoji            text default '✨',
  is_active        boolean default true,
  sort_order       integer default 0,
  created_at       timestamptz default now()
);

-- 1a. Добавить колонку specialization_tag (если ещё нет)
alter table public.services add column if not exists specialization_tag text;

-- 1b. Уникальный индекс на name (защита от дублей)
create unique index if not exists services_name_unique on public.services(name);

-- 2. Таблица бронирований
create table if not exists public.bookings (
  id           uuid default gen_random_uuid() primary key,
  master_id    uuid references public.masters(id) on delete set null,
  service_id   uuid references public.services(id) on delete set null,
  client_name  text not null,
  client_phone text not null,
  date         date not null,
  start_time   time not null,
  status       text default 'new',
  created_at   timestamptz default now()
);

-- 3. Добавить booking_id в time_slots (если ещё нет)
alter table public.time_slots add column if not exists booking_id uuid;

-- 4. RLS для новых таблиц
alter table public.services enable row level security;
alter table public.bookings  enable row level security;

drop policy if exists "allow_all" on public.services;
drop policy if exists "allow_all" on public.bookings;

create policy "allow_all" on public.services for all using (true) with check (true);
create policy "allow_all" on public.bookings  for all using (true) with check (true);

-- 5. Стартовые услуги с specialization_tag
insert into public.services (name, duration_minutes, price, emoji, sort_order, specialization_tag) values
  ('Маникюр',              60,  3000, '💅', 1, 'Маникюр / Педикюр'),
  ('Педикюр',              90,  4000, '🦶', 2, 'Маникюр / Педикюр'),
  ('Маникюр + Педикюр',   150,  6500, '✨', 3, 'Маникюр / Педикюр'),
  ('Наращивание ногтей',  120,  5500, '💎', 4, 'Наращивание ногтей'),
  ('Коррекция ресниц',     60,  3500, '👁', 5, 'Ресницы'),
  ('Наращивание ресниц',  120,  6000, '🌟', 6, 'Ресницы'),
  ('Коррекция бровей',     30,  2000, '🖊', 7, 'Брови'),
  ('Окрашивание бровей',   60,  2500, '🎨', 8, 'Брови'),
  ('Экспресс 4 руки',      60,  8000, '🤲', 9, 'Массаж'),
  ('Экспресс 6 рук',       60, 11000, '🙌',10, 'Массаж'),
  ('Экспресс 8 рук',       60, 14000, '✨',11, 'Массаж')
on conflict (name) do update set specialization_tag = excluded.specialization_tag, price = excluded.price, duration_minutes = excluded.duration_minutes;

-- 6. Добавить колонку specialization в masters (если ещё нет)
alter table public.masters add column if not exists specialization text;

-- 1c. Удалить дубликаты (оставить строку с MIN created_at)
delete from public.services s1
using public.services s2
where s1.name = s2.name
  and s1.created_at > s2.created_at;