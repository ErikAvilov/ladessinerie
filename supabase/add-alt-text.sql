-- Colonne SEO / accessibilité (requis pour l'admin et les balises alt)
ALTER TABLE illustrations
ADD COLUMN IF NOT EXISTS alt_text text;

COMMENT ON COLUMN illustrations.alt_text IS 'Texte alternatif pour le SEO et l''accessibilité';
