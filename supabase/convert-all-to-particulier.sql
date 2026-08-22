-- À exécuter dans Supabase → SQL Editor si la conversion via l'admin ne suffit pas
UPDATE illustrations
SET category = 'particulier'
WHERE category = 'pro';
