/* À la lumière du Coran — formulaire de candidature natif, multi-étapes */

// ⚠️ Remplace par l'URL de ton webhook Make (scénario : webhook → Airtable + CAPI Meta)
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/gfizl6vnqpdnnsd5wxcuqvr73m0c79nh";

const ROLE_WORDS = {
  setter: { poste: "Setter", word: "setter", act: "setting" },
  closer: { poste: "Closer", word: "closer", act: "closing" },
};

const root = document.getElementById("form-root");
const role = (root.dataset.role || "setter").toLowerCase();
const R = ROLE_WORDS[role] || ROLE_WORDS.setter;

// ---------- Définition des étapes ----------
// Étape 1 — identique aux deux rôles
const PROFIL_STEP = {
  label: "Étape 1 / 3 — Ton profil",
  fields: [
    { name: "nom", label: "Prénom & nom", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "whatsapp", label: "Numéro WhatsApp", type: "tel", required: true },
    { name: "age", label: "Ton âge", type: "number", required: true, min: 16, max: 80 },
    { name: "pays", label: "Pays de résidence", type: "text", required: true, placeholder: "Ex : France" },
    { name: "musulman", label: "Es-tu musulman(e) ?", type: "radio", required: true, options: ["Oui", "Non"] },
  ],
};

// ----- Parcours SETTER -----
const SETTER_STEPS = [
  PROFIL_STEP,
  {
    label: "Étape 2 / 3 — 💼 Ta disponibilité",
    fields: [
      { name: "jours", label: "📆 Quels jours es-tu disponible ?", type: "checkbox", required: true, exclusiveOption: "Tous les jours", options: ["Tous les jours", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] },
      { name: "heures", label: "⏰ Combien d'heures par semaine serais-tu dispo ?", type: "radio", required: true, options: ["Moins de 10h", "10-20h", "20-30h", "30-40h", "40h+ (full time)"] },
      { name: "reactivite", label: "📨 Peux-tu contacter un lead en moins de 5 min ?", type: "radio", required: true, options: ["Oui sans problème", "La plupart du temps", "Pas toujours"] },
      { name: "demarrage", label: "📅 Quand peux-tu démarrer ?", type: "radio", required: true, options: ["Immédiatement", "1 semaine", "2 semaines", "1 mois", "Plus tard"] },
      { name: "autres_activites", label: "📋 As-tu d'autres activités ou emplois en parallèle ? Si oui, lesquels et combien de temps ça te prend ?", type: "textarea", required: true },
    ],
  },
  {
    label: "Étape 3 / 3 — Ton expérience & ta motivation",
    fields: [
      { name: "experience", label: "As-tu une expérience en setting ? Si oui, laquelle ?", type: "textarea", required: true },
      { name: "remuneration", label: "Qu'attends-tu de ce poste en termes de rémunération ?", type: "text", required: true },
      { name: "pourquoi_toi", label: "Pourquoi je devrais te prendre toi et pas un autre ?", type: "textarea", required: true },
    ],
  },
];

// ----- Parcours CLOSER -----
const CLOSER_STEPS = [
  PROFIL_STEP,
  {
    label: "Étape 2 / 3 — 💼 Ton expérience",
    fields: [
      { name: "closing_duree", label: "⏳ Depuis combien de temps fais-tu du closing ?", type: "radio", required: true, options: ["Moins de 6 mois", "6 mois - 1 an", "1 - 2 ans", "2 ans+"] },
      { name: "formation", label: "🎓 Chez qui t'es-tu formé en vente ?", type: "text", required: true },
      { name: "offres", label: "💰 Quel type d'offres as-tu déjà vendues ? (prix et niche)", type: "text", required: true, placeholder: "Ex : coaching fitness 2000€, formation business 3000€…" },
      { name: "meilleur_taux", label: "📈 Quel est ton meilleur taux de closing sur une mission, et sur quelle offre ?", type: "text", required: true, placeholder: "Ex : 20% sur du coaching à 2000€" },
      { name: "derniere_reecoute", label: "🎧 C'est quand la dernière fois que tu as réécouté un de tes appels de vente ?", type: "text", required: true, placeholder: "Ta réponse…" },
      { name: "appels_jour", label: "📞 Combien d'appels par jour pourrais-tu prendre ?", type: "radio", required: true, options: ["1-2 / jour", "3-4 / jour", "5+ / jour"] },
      { name: "demarrage", label: "📅 Quand peux-tu démarrer ?", type: "radio", required: true, options: ["⚡ Immédiatement", "1 semaine", "2 semaines", "1 mois+"] },
      { name: "jours", label: "📆 Quels jours es-tu disponible ?", type: "checkbox", required: true, exclusiveOption: "Tous les jours", options: ["Tous les jours", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] },
      { name: "remuneration", label: "💸 Qu'attends-tu de ce poste en termes de rémunération ?", type: "text", required: true },
    ],
  },
  {
    label: "Étape 3 / 3 — 🎯 Montre-nous tes compétences",
    fields: [
      { name: "zone_confort", label: "Selon toi, faut-il faire sortir les prospects de leur zone de confort ?", type: "textarea", required: true, placeholder: "Ta réponse…" },
      { name: "objection_cher", label: "🚫 Que réponds-tu à l'objection « C'est trop cher » ?", type: "textarea", required: true, placeholder: "Ta réponse…" },
      { name: "objection_reflexion", label: "🤔 Que réponds-tu à « Je dois y réfléchir, on peut se rappeler la semaine prochaine » ?", type: "textarea", required: true, placeholder: "Ta réponse…" },
      { name: "pourquoi_toi", label: "🔥 Pourquoi toi et pas un autre closer ? (on a +20 profils)", type: "textarea", required: true },
    ],
  },
];

const STEPS = role === "closer" ? CLOSER_STEPS : SETTER_STEPS;

// ---------- Rendu ----------
function renderField(f) {
  const id = `f_${f.name}`;
  let control = "";
  if (f.type === "textarea") {
    control = `<textarea id="${id}" name="${f.name}" ${f.required ? "required" : ""} placeholder="${f.placeholder || ""}"></textarea>`;
  } else if (f.type === "radio") {
    const opts = f.options
      .map(
        (o) =>
          `<label><input type="radio" name="${f.name}" value="${o}" ${f.required ? "required" : ""}><span>${o}</span></label>`
      )
      .join("");
    control = `<div class="opts">${opts}</div>`;
  } else if (f.type === "checkbox") {
    const opts = f.options
      .map(
        (o) =>
          `<label><input type="checkbox" name="${f.name}" value="${o}"><span>${o}</span></label>`
      )
      .join("");
    control = `<div class="opts" data-group="${f.name}" data-required="${f.required ? 1 : 0}" data-exclusive="${f.exclusiveOption || ""}">${opts}</div>`;
  } else {
    const extra = [f.min != null ? `min="${f.min}"` : "", f.max != null ? `max="${f.max}"` : ""].join(" ");
    control = `<input type="${f.type}" id="${id}" name="${f.name}" ${f.required ? "required" : ""} placeholder="${f.placeholder || ""}" ${extra}>`;
  }
  return `<div class="field"><label for="${id}">${f.label}${f.required ? ' <span class="req">*</span>' : ""}</label>${control}</div>`;
}

const stepsHTML = STEPS.map(
  (s, i) =>
    `<div class="step ${i === 0 ? "active" : ""}" data-step="${i}">
       <div class="step-label">${s.label}</div>
       ${s.fields.map(renderField).join("")}
     </div>`
).join("");

root.innerHTML = `
  <form id="applyForm" class="form-card" novalidate>
    <div class="progress">${STEPS.map((_, i) => `<div class="seg ${i === 0 ? "on" : ""}"></div>`).join("")}</div>
    ${stepsHTML}
    <div class="step-nav">
      <button type="button" class="btn-prev" id="prevBtn" style="display:none">← Retour</button>
      <button type="button" class="btn" id="nextBtn">Continuer →</button>
      <button type="submit" class="btn" id="submitBtn" style="display:none">Envoyer ma candidature</button>
    </div>
  </form>
`;

// ---------- Navigation ----------
const form = document.getElementById("applyForm");
const stepEls = [...form.querySelectorAll(".step")];
const segs = [...form.querySelectorAll(".seg")];
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
let current = 0;
const disqualifiedFields = new Set();

function showStep(i) {
  stepEls.forEach((el, idx) => el.classList.toggle("active", idx === i));
  segs.forEach((s, idx) => s.classList.toggle("on", idx <= i));
  prevBtn.style.display = i === 0 ? "none" : "block";
  nextBtn.style.display = i === stepEls.length - 1 ? "none" : "block";
  submitBtn.style.display = i === stepEls.length - 1 ? "block" : "none";
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function validateStep(i) {
  if (disqualifiedFields.size > 0) return false;
  // champs standards (radios inclus, cases à cocher exclues)
  const fields = stepEls[i].querySelectorAll("input:not([type=checkbox]), textarea, select");
  for (const el of fields) {
    el.setCustomValidity(""); // reset à chaque passage
    // une vraie réponse est exigée : un champ texte rempli uniquement d'espaces est refusé
    const isText =
      el.tagName === "TEXTAREA" ||
      ["text", "email", "tel", "url", "number"].includes(el.type);
    if (el.required && isText && !el.value.trim()) {
      el.setCustomValidity("Cette réponse est obligatoire.");
    }
    if (!el.checkValidity()) {
      el.reportValidity();
      return false;
    }
  }
  // groupes de cases à cocher requis : au moins une cochée
  const groups = stepEls[i].querySelectorAll('.opts[data-required="1"]');
  for (const g of groups) {
    const checked = g.querySelectorAll("input[type=checkbox]:checked").length;
    if (checked === 0) {
      const first = g.querySelector("input[type=checkbox]");
      first.setCustomValidity("Sélectionne au moins une réponse.");
      first.reportValidity();
      return false;
    }
  }
  return true;
}

// efface le message d'erreur dès qu'une case est cochée
document.querySelectorAll('.opts[data-required="1"] input[type=checkbox]').forEach((cb) => {
  cb.addEventListener("change", () => {
    stepEls.forEach((s) =>
      s.querySelectorAll(`input[name="${cb.name}"]`).forEach((x) => x.setCustomValidity(""))
    );
  });
});

// ---------- "Tous les jours" exclusif des jours individuels ----------
form.querySelectorAll(".opts[data-exclusive]").forEach((group) => {
  const exVal = group.dataset.exclusive;
  if (!exVal) return;
  const boxes = [...group.querySelectorAll("input[type=checkbox]")];
  boxes.forEach((box) => {
    box.addEventListener("change", () => {
      if (!box.checked) return;
      if (box.value === exVal) {
        boxes.forEach((b) => { if (b !== box) b.checked = false; }); // "Tous les jours" → décoche le reste
      } else {
        const ex = boxes.find((b) => b.value === exVal);
        if (ex) ex.checked = false; // un jour précis → décoche "Tous les jours"
      }
    });
  });
});

// ---------- Disqualification ----------
const DISQUALIFY = {
  musulman: {
    value: "Non",
    message: "Désolé, nous ne recrutons que des musulman(e)s pour ce poste. Tu ne peux pas continuer ce questionnaire.",
  },
};

function updateNavLock() {
  const locked = disqualifiedFields.size > 0;
  nextBtn.disabled = locked;
  submitBtn.disabled = locked;
}

Object.keys(DISQUALIFY).forEach((name) => {
  const inputs = form.querySelectorAll(`input[name="${name}"]`);
  if (!inputs.length) return;
  const fieldEl = inputs[0].closest(".field");
  const msg = document.createElement("div");
  msg.className = "disqualify-msg";
  msg.style.display = "none";
  msg.textContent = DISQUALIFY[name].message;
  fieldEl.appendChild(msg);
  inputs.forEach((inp) => {
    inp.addEventListener("change", () => {
      const dq = inp.checked && inp.value === DISQUALIFY[name].value;
      if (dq) disqualifiedFields.add(name);
      else disqualifiedFields.delete(name);
      msg.style.display = dq ? "block" : "none";
      updateNavLock();
    });
  });
});

nextBtn.addEventListener("click", () => {
  if (!validateStep(current)) return;
  current = Math.min(current + 1, stepEls.length - 1);
  showStep(current);
});
prevBtn.addEventListener("click", () => {
  current = Math.max(current - 1, 0);
  showStep(current);
});

// ---------- Submit ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateStep(current)) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Envoi en cours…";

  // event pixel dédié au rôle (= ta conversion d'optimisation)
  // event_id partagé navigateur + serveur (CAPI) → déduplication Meta
  const eventId =
    (window.crypto && crypto.randomUUID && crypto.randomUUID()) ||
    "evt_" + Date.now() + "_" + Math.round(Math.random() * 1e9);
  const eventName = role === "closer" ? "Candidature_Closer" : "Candidature_Setter";
  if (window.fbq) fbq("trackCustom", eventName, {}, { eventID: eventId });

  // payload vers Make (les champs multi-valeurs comme les jours sont regroupés)
  const fd = new FormData(form);
  const payload = { poste: R.poste, role: role, source_url: location.href, event_id: eventId };
  for (const key of new Set([...fd.keys()])) {
    const vals = fd.getAll(key);
    payload[key] = vals.length > 1 ? vals.join(", ") : vals[0];
  }

  try {
    await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    showSuccess();
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Envoyer ma candidature";
    alert("Oups, un souci à l'envoi. Réessaie dans un instant.");
  }
});

function showSuccess() {
  root.innerHTML = `
    <div class="form-card form-success">
      <div class="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
      <h3>BarakAllahu fik, <span class="g">candidature reçue.</span></h3>
      <p>On lit chaque dossier à la main. Si ton profil correspond, on te recontacte sur WhatsApp pour un premier entretien.</p>
      <p>Garde un œil sur tes messages WhatsApp.</p>
    </div>`;
  root.scrollIntoView({ behavior: "smooth", block: "start" });
}
