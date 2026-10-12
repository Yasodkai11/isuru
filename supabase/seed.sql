-- ========================================================
-- ISURU GEMS - CEYLON GEMSTONE E-COMMERCE SEED DATA
-- Insert authentic natural Ceylon gemstones into public.gemstones
-- ========================================================

insert into public.gemstones (
  id,
  slug,
  name,
  variety,
  carat,
  origin,
  cut,
  dimensions,
  color,
  treatment,
  clarity,
  price,
  currency,
  in_stock,
  featured,
  description,
  certificate_lab,
  certificate_number,
  certificate_pdf_url,
  images
) values
(
  'e7f53941-86a0-4352-87f5-234208a00001',
  'ceylon-royal-blue-sapphire-4-28ct',
  'Ceylon Royal Blue Sapphire (Unheated)',
  'Royal Blue Sapphire',
  4.28,
  'Ratnapura (City of Gems)',
  'Cushion Brilliant',
  '9.84 x 8.12 x 5.96 mm',
  'Vivid Royal Blue',
  'None / Unheated (Certified 100% Natural)',
  'Eye Clean / VVS1',
  18500.00,
  'USD',
  true,
  true,
  'An extraordinary specimen from the historic gem gravels of Ratnapura. Possessing the intensely saturated, velvety Royal Blue hue revered by connoisseurs worldwide. Completely unheated with museum-grade brilliance and exceptional depth.',
  'GRS & NGJA',
  'GRS2024-089921',
  '/certs/GRS2024-089921.pdf',
  '[
    {"url": "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=85", "alt": "Glistening unheated 4.28 carat Ceylon Royal Blue Cushion cut sapphire"},
    {"url": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85", "alt": "Macro facet view of the 4.28ct Ceylon Royal Blue sapphire"}
  ]'::jsonb
),
(
  'e7f53941-86a0-4352-87f5-234208a00002',
  'padparadscha-sapphire-oval-3-15ct',
  'Ceylon Padparadscha Sapphire (Lotus Blossom)',
  'Padparadscha Sapphire',
  3.15,
  'Pelmadulla, Sri Lanka',
  'Oval Mixed Cut',
  '8.75 x 7.10 x 5.22 mm',
  'Sunset Salmon Pink-Orange',
  'Unheated',
  'VS',
  24000.00,
  'USD',
  true,
  true,
  'Named after the Sinhalese word for lotus blossom (Padma Raga), this natural Ceylon Padparadscha captures the sacred equilibrium between soft rose pink and golden sunset orange. Unheated with definitive Swiss SSEF pedigree.',
  'SSEF & NGJA',
  'SSEF-118492',
  '/certs/SSEF-118492.pdf',
  '[
    {"url": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85", "alt": "Rare 3.15 carat natural Ceylon Padparadscha sapphire in delicate pink-orange sunset hues"},
    {"url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85", "alt": "Side profile showing depth and fire of Ceylon Padparadscha sapphire"}
  ]'::jsonb
),
(
  'e7f53941-86a0-4352-87f5-234208a00003',
  'cornflower-blue-sapphire-round-2-85ct',
  'Cornflower Blue Sapphire (Classic Ceylon)',
  'Cornflower Blue Sapphire',
  2.85,
  'Elahera, Sri Lanka',
  'Round Brilliant',
  '8.02 x 8.00 x 5.15 mm',
  'Vibrant Cornflower Blue',
  'Traditional Gentle Heat Only',
  'VVS',
  9200.00,
  'USD',
  true,
  true,
  'The quintessence of Ceylon blue sapphires: luminous, lively, and pure cornflower hue that sparkles across lighting environments without extinguishing into dark tones.',
  'GIA & NGJA',
  'GIA-2215904321',
  null,
  '[
    {"url": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85", "alt": "Vibrant 2.85 carat round brilliant Ceylon Cornflower blue sapphire"}
  ]'::jsonb
),
(
  'e7f53941-86a0-4352-87f5-234208a00004',
  'golden-yellow-sapphire-pushparaga-5-60ct',
  'Ceylon Golden Pushparaga (Yellow Sapphire)',
  'Yellow Sapphire (Pushparaga)',
  5.60,
  'Balangoda, Sri Lanka',
  'Emerald Cut',
  '11.20 x 8.45 x 6.10 mm',
  'Imperial Honey Gold',
  'Unheated',
  'Eye Clean / Flawless',
  11400.00,
  'USD',
  true,
  false,
  'Revered in Vedic gemology as Pushparaga and associated with auspicious fortune and wisdom. Cut in an aristocratic emerald step profile showing radiant amber gold flashes.',
  'NGJA Certified',
  'NGJA-2024-C9081',
  null,
  '[
    {"url": "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85", "alt": "Flawless 5.60 carat Ceylon Yellow Sapphire emerald cut"}
  ]'::jsonb
),
(
  'e7f53941-86a0-4352-87f5-234208a00005',
  'ceylon-star-sapphire-cabochon-6-80ct',
  'Ceylon Asterism Star Sapphire Cabochon',
  'Star Sapphire',
  6.80,
  'Ratnapura (City of Gems)',
  'High Dome Oval Cabochon',
  '11.80 x 9.90 x 7.30 mm',
  'Silvery Denim Blue',
  'Unheated (Natural Rutile Needles)',
  'Translucent with Crisp 6-Ray Star',
  14800.00,
  'USD',
  true,
  false,
  'A rare phenomenon gem exhibiting sharp, centered asterism. Under sunlight or single-source beam, six razor-sharp light rays glide seamlessly across the high-domed cabochon surface.',
  'GIA & NGJA',
  'GIA-5542198034',
  null,
  '[
    {"url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85", "alt": "Sharp 6-ray star sapphire cabochon from Sri Lanka"}
  ]'::jsonb
),
(
  'e7f53941-86a0-4352-87f5-234208a00006',
  'ceylon-ruby-cushion-2-05ct',
  'Natural Ceylon Ruby (Pigeon Blood Glow)',
  'Ceylon Ruby',
  2.05,
  'Pelmadulla, Sri Lanka',
  'Cushion Brilliant',
  '7.60 x 6.55 x 4.80 mm',
  'Vibrant Crimson Pink-Red',
  'Unheated',
  'VS',
  16200.00,
  'USD',
  true,
  true,
  'Famous for high fluorescence under ultraviolet daylight, Ceylon rubies shine with an internal scarlet luminescence rarely matched by stones from other mining regions.',
  'GRS Certified',
  'GRS-RUB-88412',
  null,
  '[
    {"url": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85", "alt": "Luminous Ceylon Ruby cushion cut showing natural crimson fluorescence"}
  ]'::jsonb
)
on conflict (slug) do nothing;
