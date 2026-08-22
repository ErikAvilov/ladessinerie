-- À coller dans Supabase → SQL Editor → Run
-- Corrige les droits + politiques pour que l'admin puisse modifier les illustrations

-- 1) Droits de table (souvent oubliés)
GRANT SELECT ON TABLE illustrations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE illustrations TO authenticated;

-- 2) Supprimer TOUTES les anciennes politiques (noms variables)
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'illustrations'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.illustrations', pol.policyname);
  END LOOP;
END $$;

ALTER TABLE public.illustrations ENABLE ROW LEVEL SECURITY;

-- 3) Lecture publique
CREATE POLICY "illustrations_select_public"
  ON public.illustrations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4) Écriture réservée aux comptes connectés (admin)
CREATE POLICY "illustrations_insert_authenticated"
  ON public.illustrations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "illustrations_update_authenticated"
  ON public.illustrations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "illustrations_delete_authenticated"
  ON public.illustrations
  FOR DELETE
  TO authenticated
  USING (true);

-- 5) Colonne alt_text si absente
ALTER TABLE public.illustrations
  ADD COLUMN IF NOT EXISTS alt_text text;
