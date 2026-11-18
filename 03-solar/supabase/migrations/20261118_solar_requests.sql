-- Quote and contact requests from the Aurevo Energia solar demo.
-- Only the edge function (service role) reads or writes: RLS is on and there are no policies.
create table if not exists public.solar_requests (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  kind          text not null check (kind in ('quote', 'contact')),
  locale        text not null default 'it' check (locale in ('it', 'en')),
  name          text not null check (char_length(name) between 2 and 120),
  email         text not null check (char_length(email) <= 200),
  phone         text check (char_length(phone) <= 20),
  property      text check (char_length(property) <= 80),
  bill          text check (char_length(bill) <= 80),
  location      text check (char_length(location) <= 120),
  roof          text check (char_length(roof) <= 80),
  battery       text check (char_length(battery) <= 80),
  message       text check (char_length(message) <= 4000),
  privacy_consent boolean not null check (privacy_consent),
  ip_hash       text not null,
  alert_status  text,
  confirm_status text
);

alter table public.solar_requests enable row level security;

-- Rate-limit lookups: requests per IP in the last hour.
create index if not exists solar_requests_ip_time on public.solar_requests (ip_hash, created_at desc);
create index if not exists solar_requests_time on public.solar_requests (created_at desc);

comment on table public.solar_requests is 'Solar demo form submissions (solar-quote edge function). Retention: delete after 24 months.';
