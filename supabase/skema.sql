-- supabase/skema.sql
-- Skema database ProbStat Mudah (dokumentasi + resep membangun ulang).
-- Jalankan di SQL Editor Supabase pada proyek BARU, dari atas ke bawah.
-- Catatan: file ini disusun ulang dari catatan proyek. Jangan dijalankan di database yang sudah
-- berjalan tanpa dibandingkan dulu (Database > Tables / Policies / Functions).

-- =====================================================================
-- 1. TABEL
-- =====================================================================

-- Profil pengguna. Dibuat otomatis oleh trigger saat daftar (bagian 3).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nama text,
  email text,
  role text not null default 'pelajar' check (role in ('pelajar', 'admin')),
  dibuat timestamptz not null default now()
);

-- Materi yang sudah selesai (satu baris per pengguna per materi).
create table if not exists public.progres (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  slug text not null,
  selesai_pada timestamptz not null default now(),
  unique (user_id, slug)
);

-- Skor kuis. SETIAP percobaan disimpan sebagai baris baru (tidak ditimpa).
create table if not exists public.skor_kuis (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  slug text not null,
  nilai integer not null check (nilai between 0 and 100),
  dibuat timestamptz not null default now()
);

-- Materi yang disimpan (bookmark).
create table if not exists public.bookmark (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  slug text not null,
  dibuat timestamptz not null default now(),
  unique (user_id, slug)
);

create index if not exists progres_user_idx on public.progres (user_id);
create index if not exists skor_kuis_user_idx on public.skor_kuis (user_id, slug, dibuat desc);
create index if not exists bookmark_user_idx on public.bookmark (user_id);

-- =====================================================================
-- 2. FUNGSI is_admin (dipakai policy admin)
-- =====================================================================
-- security definer: berjalan dengan hak pembuatnya, supaya policy tidak berputar-putar
-- (policy di profiles yang membaca profiles). search_path kosong untuk keamanan.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- =====================================================================
-- 3. TRIGGER: profil dibuat otomatis saat pengguna daftar
-- =====================================================================
-- Role selalu 'pelajar' (default kolom). Admin dibuat manual lewat SQL (bagian 7).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nama)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'nama'), ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- 4. EMAIL DI PROFILES (untuk panel admin; tanpa service role key)
-- =====================================================================

-- Saat profil BARU dibuat, salin email dari auth.users
create or replace function public.profiles_isi_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.email := (select u.email from auth.users u where u.id = new.id);
  return new;
end;
$$;
revoke execute on function public.profiles_isi_email() from public, anon, authenticated;

drop trigger if exists profiles_isi_email on public.profiles;
create trigger profiles_isi_email
  before insert on public.profiles
  for each row execute function public.profiles_isi_email();

-- Bila email di auth.users berubah, ikut perbarui profiles
create or replace function public.sinkron_email_profil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;
revoke execute on function public.sinkron_email_profil() from public, anon, authenticated;

drop trigger if exists sinkron_email_profil on auth.users;
create trigger sinkron_email_profil
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.sinkron_email_profil();

-- =====================================================================
-- 5. ROW LEVEL SECURITY (RLS) + POLICY
-- =====================================================================

alter table public.profiles  enable row level security;
alter table public.progres   enable row level security;
alter table public.skor_kuis enable row level security;
alter table public.bookmark  enable row level security;

-- ---- profiles ----
drop policy if exists "profil: lihat milik sendiri" on public.profiles;
create policy "profil: lihat milik sendiri" on public.profiles
  for select to authenticated using (id = (select auth.uid()));

drop policy if exists "profil: tambah milik sendiri" on public.profiles;
create policy "profil: tambah milik sendiri" on public.profiles
  for insert to authenticated with check (id = (select auth.uid()));

drop policy if exists "profil: ubah milik sendiri" on public.profiles;
create policy "profil: ubah milik sendiri" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "admin lihat semua profil" on public.profiles;
create policy "admin lihat semua profil" on public.profiles
  for select to authenticated using (public.is_admin());

-- ---- progres ----
drop policy if exists "progres: lihat milik sendiri" on public.progres;
create policy "progres: lihat milik sendiri" on public.progres
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "progres: tambah milik sendiri" on public.progres;
create policy "progres: tambah milik sendiri" on public.progres
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "progres: hapus milik sendiri" on public.progres;
create policy "progres: hapus milik sendiri" on public.progres
  for delete to authenticated using (user_id = (select auth.uid()));

drop policy if exists "admin lihat semua progres" on public.progres;
create policy "admin lihat semua progres" on public.progres
  for select to authenticated using (public.is_admin());

-- ---- skor_kuis (tidak ada ubah/hapus: riwayat percobaan bersifat tetap) ----
drop policy if exists "skor: lihat milik sendiri" on public.skor_kuis;
create policy "skor: lihat milik sendiri" on public.skor_kuis
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "skor: tambah milik sendiri" on public.skor_kuis;
create policy "skor: tambah milik sendiri" on public.skor_kuis
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "admin lihat semua skor" on public.skor_kuis;
create policy "admin lihat semua skor" on public.skor_kuis
  for select to authenticated using (public.is_admin());

-- ---- bookmark ----
drop policy if exists "bookmark: lihat milik sendiri" on public.bookmark;
create policy "bookmark: lihat milik sendiri" on public.bookmark
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "bookmark: tambah milik sendiri" on public.bookmark;
create policy "bookmark: tambah milik sendiri" on public.bookmark
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "bookmark: hapus milik sendiri" on public.bookmark;
create policy "bookmark: hapus milik sendiri" on public.bookmark
  for delete to authenticated using (user_id = (select auth.uid()));

drop policy if exists "admin lihat semua bookmark" on public.bookmark;
create policy "admin lihat semua bookmark" on public.bookmark
  for select to authenticated using (public.is_admin());

-- =====================================================================
-- 6. KEAMANAN ROLE: pengguna TIDAK bisa mengubah role sendiri
-- =====================================================================
-- Hak tulis di profiles dibatasi per kolom. Kolom role dan email tidak termasuk,
-- jadi hanya lewat fungsi ubah_role (di bawah) atau SQL Editor role bisa berubah.

revoke insert, update on public.profiles from authenticated;
grant insert (id, nama), update (nama) on public.profiles to authenticated;

-- =====================================================================
-- 7. FUNGSI ubah_role (dipanggil dari panel admin lewat supabase.rpc)
-- =====================================================================
-- Hanya admin. Admin terakhir tidak bisa diturunkan (dijaga di database).

create or replace function public.ubah_role(id_pengguna uuid, role_baru text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  role_lama text;
  jumlah_admin integer;
begin
  if not public.is_admin() then
    raise exception 'Hanya admin yang boleh mengubah role.' using errcode = '42501';
  end if;

  if role_baru not in ('pelajar', 'admin') then
    raise exception 'Role tidak valid.' using errcode = '22023';
  end if;

  select role into role_lama from public.profiles where id = id_pengguna for update;
  if not found then
    raise exception 'Pengguna tidak ditemukan.' using errcode = 'P0002';
  end if;

  if role_lama = 'admin' and role_baru <> 'admin' then
    -- Kunci semua baris admin supaya dua penurunan bersamaan tidak sama-sama lolos
    perform 1 from public.profiles where role = 'admin' for update;
    select count(*) into jumlah_admin from public.profiles where role = 'admin';
    if jumlah_admin <= 1 then
      raise exception 'Tidak bisa menurunkan satu-satunya admin.' using errcode = 'P0001';
    end if;
  end if;

  update public.profiles set role = role_baru where id = id_pengguna;
end;
$$;

revoke execute on function public.ubah_role(uuid, text) from public, anon;
grant execute on function public.ubah_role(uuid, text) to authenticated;

-- =====================================================================
-- 8. MEMBUAT ADMIN PERTAMA (manual; jangan simpan sandi di kode)
-- =====================================================================
-- Daftar dulu lewat form biasa di situs, lalu jalankan (ganti emailnya):
--
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'emailmu@contoh.com');
--
-- Jangan simpan role di user_metadata (bisa dipalsukan pengguna).