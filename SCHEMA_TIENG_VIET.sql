-- 1. TẠO BẢNG PROFILES
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

comment on table public.profiles is 'Hồ sơ người dùng - mở rộng auth.users';
create index profiles_display_name_idx on public.profiles (display_name);

-- 2. TẠO FUNCTION TỰ ĐỘNG TẠO PROFILE KHI NGƯỜI DÙNG ĐĂNG KÝ
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- 3. TẠO ENUM CHO TRẠNG THÁI BÀI VIẾT
create type post_status as enum ('draft', 'published');

-- 4. TẠO BẢNG POSTS (BÀI VIẾT)
create table public.posts (
  id uuid default gen_random_uuid() not null,
  author_id uuid not null references public.profiles on delete cascade,
  title text not null,
  slug text not null,
  content text,
  excerpt text,
  status post_status default 'draft' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  published_at timestamp with time zone,
  primary key (id),
  unique (slug)
);

comment on table public.posts is 'Bài viết trên blog';
create index posts_author_id_idx on public.posts (author_id);
create index posts_status_idx on public.posts (status);
create index posts_published_at_idx on public.posts (published_at desc);
create index posts_slug_idx on public.posts (slug);

-- 5. TẠO FUNCTION ĐỂ GENERATE SLUG TỪ TIÊU ĐỀ
create or replace function public.generate_slug(title text)
returns text
language plpgsql
as $$
declare
  base_slug text;
  final_slug text;
  counter integer := 0;
begin
  -- Chuyển về chữ thường, thay khoảng trắng và ký tự đặc biệt bằng dấu gạch ngang
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
  -- Xóa dấu gạch ngang ở đầu và cuối
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;
  -- Kiểm tra slug đã tồn tại chưa, nếu có thì thêm số
  while exists (select 1 from public.posts where slug = final_slug) loop
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;
  return final_slug;
end;
$$;

-- 6. TẠO TRIGGER ĐỂ TỰ ĐỘNG TẠO SLUG KHI INSERT
create or replace function public.set_post_slug()
returns trigger
language plpgsql
as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := public.generate_slug(new.title);
  end if;
  return new;
end;
$$;

create trigger posts_set_slug
before insert on public.posts
for each row execute procedure public.set_post_slug();

-- 7. TẠO BẢNG COMMENTS (BÌNH LUẬN)
create table public.comments (
  id uuid default gen_random_uuid() not null,
  post_id uuid not null references public.posts on delete cascade,
  author_id uuid not null references public.profiles on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

comment on table public.comments is 'Bình luận trên bài viết';
create index comments_post_id_idx on public.comments (post_id);
create index comments_author_id_idx on public.comments (author_id);
create index comments_created_at_idx on public.comments (created_at desc);

-- 8. TẠO FUNCTION CẬP NHẬT TIMESTAMP updated_at
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row execute procedure public.update_updated_at();

create trigger posts_updated_at
before update on public.posts
for each row execute procedure public.update_updated_at();
