-- Tabel pentru nutriționiști
create table nutritionists (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  years_experience int,
  price_range text,
  photo_url text,
  created_at timestamp with time zone default now()
);

-- Tabel pentru utilizatori
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text default 'client',
  created_at timestamp with time zone default now()
);
