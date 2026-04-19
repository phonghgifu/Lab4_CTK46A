-- 1. CREATE PROFILES TABLE
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

comment on table public.profiles is 'User profiles - extends auth.users';
create index profiles_display_name_idx on public.profiles (display_name);

-- 2. CREATE FUNCTION TO AUTO-CREATE PROFILE ON USER SIGNUP
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

-- 3. CREATE POST STATUS ENUM
create type post_status as enum ('draft', 'published');

-- 4. CREATE POSTS TABLE
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

comment on table public.posts is 'Blog posts';
create index posts_author_id_idx on public.posts (author_id);
create index posts_status_idx on public.posts (status);
create index posts_published_at_idx on public.posts (published_at desc);
create index posts_slug_idx on public.posts (slug);

-- 5. CREATE FUNCTION TO GENERATE SLUG
create or replace function public.generate_slug(title text)
returns text
language plpgsql
as $$
declare
  base_slug text;
  final_slug text;
  counter integer := 0;
begin
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;
  while exists (select 1 from public.posts where slug = final_slug) loop
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;
  return final_slug;
end;
$$;

-- 6. CREATE TRIGGER TO AUTO-GENERATE SLUG
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

-- 7. CREATE COMMENTS TABLE
create table public.comments (
  id uuid default gen_random_uuid() not null,
  post_id uuid not null references public.posts on delete cascade,
  author_id uuid not null references public.profiles on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

comment on table public.comments is 'Comments on blog posts';
create index comments_post_id_idx on public.comments (post_id);
create index comments_author_id_idx on public.comments (author_id);
create index comments_created_at_idx on public.comments (created_at desc);

-- 8. CREATE FUNCTION TO UPDATE updated_at TIMESTAMP
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
