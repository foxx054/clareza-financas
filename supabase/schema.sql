-- Execute no SQL Editor de um projeto Supabase novo.
create table public.transacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  descricao text not null check (char_length(trim(descricao)) between 2 and 120),
  valor numeric(11,2) not null check (valor > 0 and valor <= 999999999.99),
  tipo text not null check (tipo in ('receita', 'despesa')),
  categoria text not null default 'Outros' check (categoria in ('Salário','Freelance','Alimentação','Moradia','Transporte','Lazer','Saúde','Educação','Outros')),
  data date not null default current_date,
  criado_em timestamptz not null default now()
);
create index transacoes_usuario_data on public.transacoes(user_id, data desc, criado_em desc);
alter table public.transacoes enable row level security;
revoke all on public.transacoes from anon;
grant select, insert on public.transacoes to authenticated;
create policy "Ler próprias transações" on public.transacoes for select to authenticated using ((select auth.uid()) = user_id);
create policy "Inserir próprias transações" on public.transacoes for insert to authenticated with check ((select auth.uid()) = user_id);
