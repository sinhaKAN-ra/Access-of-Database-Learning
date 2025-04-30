-- Update the database types to include new tables
ALTER TYPE public.tables ADD VALUE IF NOT EXISTS 'comments';
ALTER TYPE public.tables ADD VALUE IF NOT EXISTS 'ratings';
ALTER TYPE public.tables ADD VALUE IF NOT EXISTS 'user_submitted_use_cases';

-- Update the database schema to include new tables
ALTER TABLE public.comments
  ADD CONSTRAINT comments_database_id_fkey
  FOREIGN KEY (database_id)
  REFERENCES public.databases(id)
  ON DELETE CASCADE;

ALTER TABLE public.ratings
  ADD CONSTRAINT ratings_database_id_fkey
  FOREIGN KEY (database_id)
  REFERENCES public.databases(id)
  ON DELETE CASCADE;

ALTER TABLE public.user_submitted_use_cases
  ADD CONSTRAINT user_submitted_use_cases_database_id_fkey
  FOREIGN KEY (database_id)
  REFERENCES public.databases(id)
  ON DELETE CASCADE; 