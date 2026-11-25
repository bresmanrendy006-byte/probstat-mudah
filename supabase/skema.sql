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
-- Role selalu 'pelajar' (default kolom). Admin dibuat manual lewat SQL (bagian 8).

create or replace function public.buat_profil()
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

revoke execute on function public.buat_profil() from public, anon, authenticated;

drop trigger if exists saat_user_baru on auth.users;
create trigger saat_user_baru
  after insert on auth.users
  for each row execute function public.buat_profil();

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


-- =====================================================================
-- 9. RIWAYAT HITUNGAN (kalkulator, hanya untuk pengguna yang login)
-- =====================================================================
-- Simpan paling banyak 50 entri terbaru per pengguna (trigger batasi_riwayat).
-- Riwayat tidak bisa diubah (tanpa policy update), hanya dilihat, ditambah, dan dihapus.

create table if not exists public.riwayat_hitungan (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  jenis text not null check (char_length(jenis) between 1 and 30),
  input jsonb not null check (char_length(input::text) <= 5000),
  hasil jsonb not null check (char_length(hasil::text) <= 5000),
  dibuat timestamptz not null default now()
);

create index if not exists riwayat_user_idx
  on public.riwayat_hitungan (user_id, dibuat desc);

alter table public.riwayat_hitungan enable row level security;

drop policy if exists "riwayat: lihat milik sendiri" on public.riwayat_hitungan;
create policy "riwayat: lihat milik sendiri" on public.riwayat_hitungan
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "riwayat: tambah milik sendiri" on public.riwayat_hitungan;
create policy "riwayat: tambah milik sendiri" on public.riwayat_hitungan
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "riwayat: hapus milik sendiri" on public.riwayat_hitungan;
create policy "riwayat: hapus milik sendiri" on public.riwayat_hitungan
  for delete to authenticated using (user_id = (select auth.uid()));

drop policy if exists "admin lihat semua riwayat" on public.riwayat_hitungan;
create policy "admin lihat semua riwayat" on public.riwayat_hitungan
  for select to authenticated using (public.is_admin());

revoke all on public.riwayat_hitungan from anon;
revoke update on public.riwayat_hitungan from authenticated;

create or replace function public.batasi_riwayat()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.riwayat_hitungan
  where user_id = new.user_id
    and id not in (
      select id from public.riwayat_hitungan
      where user_id = new.user_id
      order by dibuat desc, id desc
      limit 50
    );
  return null;
end;
$$;

revoke execute on function public.batasi_riwayat() from public, anon, authenticated;

drop trigger if exists batasi_riwayat on public.riwayat_hitungan;
create trigger batasi_riwayat
  after insert on public.riwayat_hitungan
  for each row execute function public.batasi_riwayat();

  -- =====================================================================
-- 10. JAWABAN PER SOAL (untuk "Soal yang sering salah" dan bank soal)
-- =====================================================================
-- Satu baris per soal per percobaan kuis. Tidak bisa diubah atau dihapus pengguna.
-- soal_id mengacu ke id di src/data/soal.js (mis. 'psk-001'); id soal tidak boleh diubah.

create table if not exists public.jawaban_soal (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  soal_id text not null check (char_length(soal_id) between 1 and 30),
  slug text not null check (char_length(slug) between 1 and 100),
  benar boolean not null,
  dibuat timestamptz not null default now()
);

create index if not exists jawaban_user_soal_idx
  on public.jawaban_soal (user_id, soal_id);
create index if not exists jawaban_user_dibuat_idx
  on public.jawaban_soal (user_id, dibuat desc);

alter table public.jawaban_soal enable row level security;

drop policy if exists "jawaban: lihat milik sendiri" on public.jawaban_soal;
create policy "jawaban: lihat milik sendiri" on public.jawaban_soal
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "jawaban: tambah milik sendiri" on public.jawaban_soal;
create policy "jawaban: tambah milik sendiri" on public.jawaban_soal
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "admin lihat semua jawaban" on public.jawaban_soal;
create policy "admin lihat semua jawaban" on public.jawaban_soal
  for select to authenticated using (public.is_admin());

revoke all on public.jawaban_soal from anon;
revoke update, delete on public.jawaban_soal from authenticated;

-- =====================================================================
-- 11. CATATAN PRIBADI (satu catatan per pengguna per materi)
-- =====================================================================
create table if not exists public.catatan (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  slug text not null check (char_length(slug) between 1 and 100),
  isi text not null check (char_length(isi) between 1 and 2000),
  dibuat timestamptz not null default now(),
  diubah timestamptz not null default now(),
  unique (user_id, slug)
);

create index if not exists catatan_user_diubah_idx
  on public.catatan (user_id, diubah desc);

alter table public.catatan enable row level security;

drop policy if exists "catatan: lihat milik sendiri" on public.catatan;
create policy "catatan: lihat milik sendiri" on public.catatan
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "catatan: tambah milik sendiri" on public.catatan;
create policy "catatan: tambah milik sendiri" on public.catatan
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "catatan: ubah milik sendiri" on public.catatan;
create policy "catatan: ubah milik sendiri" on public.catatan
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "catatan: hapus milik sendiri" on public.catatan;
create policy "catatan: hapus milik sendiri" on public.catatan
  for delete to authenticated using (user_id = (select auth.uid()));

drop policy if exists "admin lihat semua catatan" on public.catatan;
create policy "admin lihat semua catatan" on public.catatan
  for select to authenticated using (public.is_admin());

revoke all on public.catatan from anon;