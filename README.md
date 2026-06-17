# Funnel recrutement — À la lumière du Coran

3 pages HTML statiques + formulaire natif, à héberger sur **Vercel** (ou Cloudflare Pages) depuis **GitHub**.
Page de tri (setter / closer) → une page par rôle avec **VSL + formulaire natif multi-étapes**.

```
recrutement-aldc/
├── index.html      → page 1 : "tu sets ou tu closes ?" (2 boutons)
├── setter.html     → VSL setter + formulaire natif (Profil → Dispo → Motivation)
├── closer.html     → VSL closer + formulaire natif
└── assets/
    ├── style.css
    └── form.js     → logique du formulaire (étapes, validation, event pixel, envoi Make)
```

## ⚠️ À remplir avant la mise en ligne

1. **Pixel Meta** — remplace `YOUR_RECRUITMENT_PIXEL_ID` (dans index/setter/closer.html).
2. **VSL** — dans setter.html & closer.html, remplace l'`<iframe src="about:blank">` du bloc `.vsl-wrap` par le code embed de ta VSL.
3. **Webhook Make** — dans `assets/form.js`, remplace `YOUR_MAKE_WEBHOOK_URL` par l'URL de ton webhook Make.

## Le formulaire natif (vs iframe Airtable)
Formulaire **sur la page** = on déclenche le vrai event de conversion au submit. Au moment où le candidat valide :
- `fbq('trackCustom', 'Candidature_Setter')` ou `'Candidature_Closer'`
- POST JSON de toutes les réponses vers le **webhook Make**
- écran de confirmation inline

Champs (3 étapes, calqué sur Moualimy) :
- **Profil** : nom, email, WhatsApp, âge, pays, musulman (oui/non)
- **Dispo** : heures/sem, réactivité <10 min, démarrage, expérience, autres activités
- **Motivation** : c'est quoi le job, pourquoi cette mission, ce qui te différencie, attentes rému, lien Loom/LinkedIn

## Le scénario Make à monter (webhook → Airtable + CAPI)
1. **Webhook** (custom) → récupère le JSON du formulaire. Copie son URL dans `form.js`.
2. **Airtable → Create a record** : mappe chaque champ du JSON sur une colonne (1 base recrutement, 1 table, colonne `poste` pour filtrer setter/closer — ou 2 tables).
3. **Meta Conversions API (CAPI)** : envoie l'event `Candidature_{poste}` au dataset du pixel recrutement (email + téléphone hashés en SHA-256 pour le matching).

→ Je peux te le construire directement (tu as Make connecté). Dis « monte le scénario Make » et je le crée.

## Liens à utiliser
- Ad **Setter** → `…/setter.html` · Ad **Closer** → `…/closer.html` · Organique → `…/`

## Rappel campagne
Coche la **catégorie spéciale « Emploi »** si Meta le demande. Pas de Hyros (le recrutement ne génère pas de CA).
