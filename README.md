# LiveWall – The Digital Experience Show

3D interactieve gameshow die functioneert als contactformulier voor [livewall.nl](https://livewall.nl). Gebruikers vullen het formulier in door mee te doen aan een korte 3D televisieproductie.

## Tech stack

- **Vite** + **React 18** + **TypeScript**
- **Three.js** + **React Three Fiber** + **@react-three/drei**
- **Zustand** (state), **Howler** (audio)
- Formulier wordt naar de LiveWall API gestuurd (zie `.env.example`)

## Ontwikkelen

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Configuratie

- Kopieer `.env.example` naar `.env` en vul `VITE_LIVEWALL_API_URL` in met het eindpoint voor contactformulier-submissies (POST JSON: name, company, email, phone, category, budget).
- Audio: plaats bestanden in `public/audio/` (intro.mp3, drumroll.mp3, applaus.mp3, confetti.mp3, whoosh.mp3). Zonder bestanden werkt de ervaring stil.
- Presentator: plaats een GLB in `public/models/` en pas `Host.tsx` aan om `useGLTF` te gebruiken. Speler: Ready Player Me of eigen GLB in `PlayerAvatar.tsx`.

## Flow

1. **Opening** – Welkomsttekst, knop “Start mijn experience”
2. **Ronde 1** – Naam en bedrijfsnaam (tekst op LED-wall)
3. **Ronde 2** – E-mail en telefoon
4. **Ronde 3** – Keuze uit vier experience-categorieën (platforms)
5. **Ronde 4** – Budget-rad, daarna “Dit is perfect” of “Kies andere experience”
6. **Finale** – Overzicht, knop “Lanceer mijn aanvraag” → API-call en bevestiging

## Projectstructuur

Zie het implementatieplan voor de volledige opzet. Belangrijke mappen:

- `src/store/` – Zustand store (stap, formulierdata)
- `src/scenes/` – Studio-scene
- `src/components/studio/` – Vloer, licht, podium, LED-wall, publiek
- `src/components/characters/` – Presentator en speler (placeholders)
- `src/components/props/` – Categorieplatforms, budget-rad
- `src/components/ui/` – Overlay-knoppen en formulier
- `src/flow/` – Stappen en validatie
- `src/api/` – `submitContact` naar livewall.nl
