# VIVA — Málaga & Valencia

PWA mobile-first per scoprire esperienze da fare subito a Málaga e Valencia.

## Incluso nel prototipo V1

- onboarding: città, interessi e budget;
- Home con esperienze vicine e disponibili ora;
- esplorazione in lista o mappa;
- salvataggi;
- scheda esperienza e CTA di prenotazione;
- sfide tra amici: codice gruppo, massimo cinque persone e podio;
- manifest e service worker per installazione PWA su iPhone e Android;
- configurazione pronta per Cloudflare Workers Static Assets.

I contenuti mostrati sono dati dimostrativi di interfaccia, non disponibilità o prezzi in tempo reale.

## Avvio locale

```bash
npm install
npm run dev
```

## Verifica e build

```bash
npm run check
npm run build
```

## Pubblicazione su Cloudflare

Dopo aver autenticato Wrangler con l’account Cloudflare scelto:

```bash
npm run deploy
```

Cloudflare pubblicherà gli asset generati in `dist/` tramite il Worker definito in `wrangler.jsonc`.

