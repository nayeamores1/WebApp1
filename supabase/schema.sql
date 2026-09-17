create extension if not exists "pgcrypto";

create table if not exists public.entregas (
  id uuid primary key default gen_random_uuid(),
  titulo varchar(80) not null,
  materia varchar(60) not null,
  descripcion varchar(300) not null default '',
  fecha_limite date not null,
  prioridad varchar(5) not null check (prioridad in ('baja', 'media', 'alta')),
  completada boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.entregas enable row level security;

drop policy if exists "Permitir lectura pública de entregas" on public.entregas;
drop policy if exists "Permitir crear entregas" on public.entregas;
drop policy if exists "Permitir actualizar entregas" on public.entregas;
drop policy if exists "Permitir eliminar entregas" on public.entregas;

create policy "Permitir lectura pública de entregas"
on public.entregas for select to anon using (true);

create policy "Permitir crear entregas"
on public.entregas for insert to anon with check (true);

create policy "Permitir actualizar entregas"
on public.entregas for update to anon using (true) with check (true);

create policy "Permitir eliminar entregas"
on public.entregas for delete to anon using (true);

insert into public.entregas (titulo, materia, descripcion, fecha_limite, prioridad, completada) values
('Prototipo de portafolio', 'Prácticas y Portafolio', 'Organizar los casos de estudio y preparar el prototipo navegable.', current_date + 3, 'alta', false),
('Animación de interfaz', 'Video y Motion Graphics', 'Exportar la versión final y revisar los tiempos.', current_date + 7, 'media', false),
('Investigación de usuarios', 'Investigación en Diseño', 'Corregir conclusiones y agregar resultados de las encuestas.', current_date - 2, 'alta', true);
