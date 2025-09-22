
# UI + Alt Radar pack

Dodaje:
- górny banner (components/Banner.tsx)
- lewy sidebar z wyszukiwarką (components/Sidebar.tsx)
- wspólny Layout (components/Layout.tsx) podpięty w pages/_app.tsx
- endpoint /api/character (parsuje tibia.com lub używa TibiaData v4)
- strony: /character/[name] (profil + zapis logu), /alts (Alt Radar)
- baza logów w localStorage (przeglądarka).

## Instalacja (GitHub → Vercel)
1) Prześlij do repo **zawartość** tego ZIP-a tak, by pliki nadpisały istniejące:
   - components/Banner.tsx
   - components/Sidebar.tsx
   - components/Layout.tsx
   - lib/altDetection.ts
   - pages/_app.tsx
   - pages/api/character.ts
   - pages/character/[name].tsx
   - pages/alts.tsx
2) Otwórz package.json w repo i **dodaj zależność**:
   - "cheerio": "^1.0.0-rc.12" (w dependencies)
3) Zrób commit. Na Vercel kliknij **Redeploy**.

## Uwaga dot. danych
- /api/character najpierw próbuje TibiaData v4 (`https://api.tibiadata.com/v4/character/<name>.json`), a gdy to się nie uda, skrapuje `tibia.com/community/?name=...` i wydobywa "Last Login".
- Alt Radar działa na danych zebranych z odwiedzanych profili (localStorage po stronie użytkownika). Jeśli chcesz zbierać globalnie, trzeba dodać bazę (np. Vercel KV / Postgres). Mogę dorzucić gotowy moduł pod Vercel KV na życzenie.
