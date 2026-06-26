import { useState, useEffect, useRef, useCallback } from "react";

// ─── Palette Ex Home — Émeraude · Or · Crème ───────────────────────────────
const C = {
  bg:           "#0F2820",  // émeraude très profond
  bgMid:        "#163428",  // émeraude foncé
  surface:      "#1B4D3E",  // émeraude — couleur principale
  surfaceHover: "#225E4C",  // émeraude hover
  primary:      "#C9A84C",  // or vif
  primaryDim:   "#A08030",  // or atténué
  primaryXLight:"#1A3028",  // fond badge or
  accent:       "#E8D08A",  // or clair
  accentLight:  "#1A2A20",  // fond accent
  gold:         "#C9A84C",  // or
  goldLight:    "#E8D08A",  // or clair
  goldXLight:   "#F5EDD0",  // or très clair / crème dorée
  cream:        "#F5F0E8",  // crème chaude
  creamMid:     "#E0D8C8",  // crème moyenne
  text:         "#F5F0E8",  // crème — texte principal
  textMid:      "#C8D8A0",  // vert sauge clair — texte secondaire
  textLight:    "#5A8A68",  // vert moyen — texte discret
  border:       "#1E4A38",  // bordure émeraude
  borderLight:  "#2A6048",  // bordure éclairée
  success:      "#6FCF97",  // succès
  successLight: "#0A2518",  // fond succès
  warning:      "#E8C050",  // or orangé
  warningLight: "#1E1C08",  // fond warning
  danger:       "#E07060",  // rouge doux
  dangerLight:  "#2A1010",  // fond danger
};


// ─── Catégories ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "posture",     label: "Posture & alignement",    icon: "🧍", color: "#7EC8A0" },
  { id: "mobilite",   label: "Mobilité & souplesse",     icon: "🌀", color: "#A0C8E8" },
  { id: "force",      label: "Force & ancrage",          icon: "💪", color: "#E8A97A" },
  { id: "respiration",label: "Respiration & relaxation", icon: "🌬️", color: "#C8A0E8" },
  { id: "menager",    label: "Tâches ménagères",         icon: "🏠", color: "#C9A84C" },
];

const COACHES = ["Aude", "Sylvain"];

const STATUS = {
  nouveau:   { label: "Nouveau",    color: C.textLight, bg: C.primaryXLight },
  "en-cours":{ label: "En cours",   color: C.warning,   bg: C.warningLight },
  valide:    { label: "Validé",     color: C.success,   bg: C.successLight },
  pause:     { label: "En pause",   color: C.accent,    bg: C.accentLight },
};


// ─── Nutrition ─────────────────────────────────────────────────────────────
const MEALS_LIST = ["Petit-déjeuner", "Déjeuner", "Dîner", "Collation"];
const GOAL_KCAL = 1800;
const FOOD_EMOJIS = {
  default:"🍽️",fruit:"🍎",légume:"🥦",viande:"🥩",poisson:"🐟",
  pain:"🍞",riz:"🍚",pâtes:"🍝",salade:"🥗",fromage:"🧀",
  yaourt:"🥛",œuf:"🥚",gâteau:"🍰",chocolat:"🍫",café:"☕",
};
function getFoodEmoji(name) {
  const n = name.toLowerCase();
  for (const [k,v] of Object.entries(FOOD_EMOJIS)) { if (n.includes(k)) return v; }
  return FOOD_EMOJIS.default;
}
function todayStr() { return new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"}); }

// ─── Bibliothèque d'exercices ──────────────────────────────────────────────
const BIBLIOTHEQUE = {
  posture: [
    { titre: "Ancrage debout – pieds parallèles", duree: 5, description: "Se tenir debout, pieds à la largeur des hanches, sentir le poids se répartir sur les 3 points du pied." },
    { titre: "Correction posture assise", duree: 3, description: "Observer et ajuster la position assise : bassin, colonne, épaules, regard horizontal." },
    { titre: "Étirement pectoral au mur", duree: 3, description: "Placer la main sur un mur à hauteur d'épaule, tourner le corps vers l'opposé. Tenir 30s, répéter 3 fois." },
    { titre: "Chin tuck – rétraction cervicale", duree: 3, description: "Assis droit, rentrer le menton vers la gorge (double menton). 10 répétitions lentes." },
    { titre: "Shoulder blade squeeze", duree: 4, description: "Rapprocher les omoplates en gardant les épaules basses. 10 répétitions, 3 séries." },
    { titre: "Gainage latéral", duree: 8, description: "Planche latérale sur avant-bras, aligner tête-hanches-pieds. 30s par côté, 3 séries." },
    { titre: "Renforcement lombaire – bird-dog", duree: 10, description: "À quatre pattes, tendre bras droit + jambe gauche simultanément. 10 rép. chaque côté." },
  ],
  mobilite: [
    { titre: "Rotation cervicale lente", duree: 3, description: "Tourner lentement la tête gauche-droite, 5 fois de chaque côté. Respiration continue." },
    { titre: "Ouverture des hanches – figure 4", duree: 8, description: "Allongé sur le dos, croiser la cheville droite sur la cuisse gauche, tirer vers soi. 45s par côté." },
    { titre: "Rotation thoracique assis", duree: 5, description: "Assis sur un tabouret, croiser les bras sur les épaules, tourner le buste à droite et à gauche. 10 rép." },
    { titre: "Mobilisation chevilles – cercles", duree: 3, description: "Assis, faire des grands cercles avec les pieds dans les deux sens. 10 fois chaque direction." },
    { titre: "Étirement ischios – hamstrings debout", duree: 5, description: "Debout, poser le talon sur une chaise, garder le dos droit et pencher légèrement le buste en avant." },
    { titre: "Ouverture épaules – Eagle arms", duree: 4, description: "Enrouler les bras l'un autour de l'autre à hauteur d'épaule. Lever les coudes. 30s par côté." },
    { titre: "Squat assis-debout lent", duree: 6, description: "S'asseoir et se lever d'une chaise en 4 temps, sans utiliser les mains. 10 répétitions." },
  ],
  force: [
    { titre: "Gainage ventral – 3 séries", duree: 10, description: "Position planche sur avant-bras. Tenir 30s, 3 séries avec 30s de repos." },
    { titre: "Pont fessier", duree: 8, description: "Allongé sur le dos, pieds à plat, soulever le bassin jusqu'à aligner hanches et épaules. 15 rép, 3 séries." },
    { titre: "Squat au poids du corps", duree: 10, description: "Pieds à la largeur des épaules, descendre comme pour s'asseoir. 15 répétitions, 3 séries." },
    { titre: "Pompes sur les genoux", duree: 8, description: "Mains au sol largeur épaules, genoux posés. Fléchir les coudes jusqu'à effleurer le sol. 10 rép, 3 séries." },
    { titre: "Fentes avant alternées", duree: 10, description: "Pas en avant, fléchir les deux genoux à 90°, revenir. 10 rép par jambe, 3 séries." },
    { titre: "Superman dorsal", duree: 6, description: "À plat ventre, lever simultanément les bras et les jambes. Tenir 3s, 10 répétitions." },
    { titre: "Step-up sur marche", duree: 8, description: "Monter et descendre d'une marche en alternant les jambes. 20 répétitions, 3 séries." },
  ],
  respiration: [
    { titre: "Cohérence cardiaque 5-5", duree: 5, description: "Inspirer 5 secondes, expirer 5 secondes. 6 cycles par minute pendant 5 minutes." },
    { titre: "Respiration abdominale profonde", duree: 5, description: "Main sur le ventre, gonfler le ventre à l'inspiration, dégonfler à l'expiration. 10 cycles." },
    { titre: "Respiration 4-7-8 (anti-stress)", duree: 5, description: "Inspirer 4s, retenir 7s, expirer lentement 8s. 4 cycles. Puissant avant le coucher." },
    { titre: "Scan corporel + respiration", duree: 10, description: "Allongé, parcourir chaque partie du corps en la relâchant consciemment avec l'expiration." },
    { titre: "Box breathing (militaire)", duree: 5, description: "Inspirer 4s, retenir 4s, expirer 4s, retenir 4s. 6 cycles. Idéal avant un moment stressant." },
    { titre: "Respiration alternée des narines", duree: 5, description: "Fermer la narine droite, inspirer à gauche. Fermer la gauche, expirer à droite. 5 cycles." },
  ],
  menager: [

    // ══ CUISINE ══════════════════════════════════════════════════════════════
    { titre: "Vaisselle à la main – Relevés de talons", duree: 15, description: "Pendant la vaisselle : relevés de talons alternés toutes les 2 min. Pieds parallèles, genoux déverrouillés. Renforce mollets et périnée." },
    { titre: "Vaisselle à la main – Équilibre unipodal", duree: 15, description: "Tenir sur une jambe 30s en faisant la vaisselle, alterner. Renforce proprioception, cheville et stabilisateurs du genou." },
    { titre: "Vaisselle à la main – Gainage debout", duree: 15, description: "Contracter abdominaux et fessiers en expirant toutes les 2 min. Maintenir 10s. Posture colonne neutre contre l'évier." },
    { titre: "Préparation des repas – Station ergonomique", duree: 20, description: "Pieds parallèles, genoux fléchis 5°, planche à hauteur des coudes. Transfert de poids d'une jambe à l'autre toutes les 30s. Renforce stabilité posturale." },
    { titre: "Préparation des repas – Squats entre étapes", duree: 20, description: "Entre chaque étape de la recette (pendant que ça cuit, bout, etc.) : 10 squats lents au poids du corps. Cuisses, fessiers, dos." },
    { titre: "Remplir / vider le lave-vaisselle – Squat profond", duree: 10, description: "Chaque plat en bas = squat profond dos droit (pas flexion lombaire). Chaque rangement en haut = élévation sur pointes + gainage épaules." },
    { titre: "Remplir / vider le lave-vaisselle – Hinge hip", duree: 10, description: "Pour charger le bas du lave-vaisselle : hinge strict (charnière hanche, dos neutre). Renforce ischios-jambiers et érecteurs du rachis." },
    { titre: "Ranger les courses – Farmer's walk", duree: 15, description: "Porter les sacs comme un farmer's walk : abdos engagés, épaules basses et dans l'axe, pas réguliers. Renforce trapèzes, abdos, avant-bras." },
    { titre: "Ranger les courses – Squats avec charge", duree: 10, description: "Avant de ranger : 5 squats lents avec les packs d'eau ou sacs de courses. Charge fonctionnelle, renforce quadriceps et fessiers." },
    { titre: "Vider les poubelles – Hinge & portage", duree: 5, description: "Saisir le sac en hinge (dos droit, poussée par les talons). Porter en gainage actif jusqu'au bac. Renforce chaîne postérieure et core." },

    // ══ ENTRETIEN SOL ═════════════════════════════════════════════════════════
    { titre: "Passer l'aspirateur – Fentes alternées", duree: 20, description: "Avancer en fente à chaque poussée : jambe avant 90°, jambe arrière tendue, dos droit. Alterner droite/gauche. Renforce quadriceps, fessiers, ischios." },
    { titre: "Passer l'aspirateur – Pivot des hanches", duree: 20, description: "Pivoter sur les pieds (pas tordre la colonne) à chaque changement de direction. Renforce mobilité rotateurs de hanche et stabilité lombaire." },
    { titre: "Balayer / passer la serpillière – Fentes latérales", duree: 20, description: "Chaque passage large = fente latérale : jambe portante fléchie, jambe opposée tendue. Renforce adducteurs, abducteurs, fessiers." },
    { titre: "Balayer / passer la serpillière – Gainage de marche", duree: 20, description: "Serrer les abdominaux et contracter les fessiers à chaque pas. Maintenir la colonne neutre tout le long. Endurance musculaire posturale." },
    { titre: "Laver le sol à genoux / quatre pattes – Cross-body", duree: 20, description: "À quatre pattes : alterner bras droit + jambe gauche tendus (bird-dog) entre chaque mouvement de lavage. Renforce gainage profond et coordination." },
    { titre: "Laver le sol à genoux / quatre pattes – Agenouillement contrôlé", duree: 15, description: "Descendre en fente contrôlée (4 temps), poser genou doucement, remonter en poussant sur le talon. Renforce quadriceps, contrôle excentrique." },
    { titre: "Nettoyer les plinthes – Squat maintenu", duree: 10, description: "Travailler en position squat isométrique (cuisses parallèles au sol) pour nettoyer les plinthes. Renforce quadriceps et stabilité du genou." },

    // ══ LINGE ═════════════════════════════════════════════════════════════════
    { titre: "Étendre le linge – Élévation scapulaire", duree: 15, description: "Pour chaque pièce suspendue : élever les bras en gardant omoplates basses et rapprochées. Pas de compensation cervicale. Renforce dentelé, trapèzes." },
    { titre: "Étendre le linge – Relevés de genoux", duree: 15, description: "Entre chaque pièce : 5 relevés de genoux alternés (marche sur place haute). Renforce psoas, core, coordination cardio légère." },
    { titre: "Plier le linge – Squat maintenu", duree: 15, description: "Plier chaque pièce en position squat isométrique (cuisses à 90°). Descendre, plier, remonter. Renforce quadriceps, fessiers, endurance jambes." },
    { titre: "Trier le linge – Hinge répété", duree: 10, description: "Pour ramasser chaque pièce au sol : hinge strict dos neutre, poussée par talons. Répété 15-20 fois = série de Romanian Deadlift fonctionnel." },
    { titre: "Repasser – Station debout active", duree: 30, description: "Transfert de poids jambe à jambe toutes les 30s. Relevés de talons toutes les 3 min. Gainage actif en repassant. Mobilité cheville et endurance posturale." },
    { titre: "Repasser – Fentes sur place", duree: 30, description: "En repassant de grandes pièces (draps, nappes) : avancer en fente à chaque passage. Renforce quadriceps, fessiers, travail cardiovasculaire léger." },
    { titre: "Ranger le linge dans les armoires – Squat + élévation", duree: 10, description: "Prendre une pile du bas en squat, ranger en haut = élévation bras contrôlée (épaules stables). Enchaîner 10 fois. Circuit fonctionnel complet." },

    // ══ SURFACES & RANGEMENT ══════════════════════════════════════════════════
    { titre: "Dépoussiérer les meubles – Mobilisation épaules", duree: 15, description: "Mouvements circulaires larges avec le chiffon : activer toute l'amplitude de l'épaule, omoplate basse. Renforce coiffe des rotateurs et mobilité thoracique." },
    { titre: "Nettoyer les vitres / miroirs – Élévation bras tendu", duree: 15, description: "Grands cercles et mouvements en 8 avec le bras tendu. Gainage actif pendant les mouvements hauts. Renforce épaule, triceps, core." },
    { titre: "Nettoyer les surfaces hautes – Pointes de pieds", duree: 10, description: "Pour atteindre en hauteur : monter sur pointes de pieds lentement (3 temps), tenir 2s, redescendre (3 temps). 10 fois = renforcement mollets, équilibre." },
    { titre: "Ranger les placards bas – Squat profond répété", duree: 15, description: "Chaque objet rangé en bas = squat profond. Chaque retrait = squat + hinge selon la position. 15-20 répétitions spontanées = séance jambes." },
    { titre: "Ranger les placards hauts – Stabilité épaule", duree: 15, description: "Porter les objets au-dessus de la tête : coude légèrement fléchi, omoplate engagée vers le bas. Renforce stabilisateurs d'épaule, triceps, gainage." },
    { titre: "Déplacer des meubles légers – Poussée engagée", duree: 10, description: "Pousser un meuble : pieds ancrés, genoux fléchis, poussée depuis les jambes (pas le dos). Gainage maximal. Renforce tout le corps en chaîne." },
    { titre: "Faire les lits – Fentes autour du lit", duree: 10, description: "Se déplacer autour du lit en fentes : pas en avant ou latéraux selon le côté à border. 3 tours du lit = 15-20 fentes. Renforce jambes, équilibre." },
    { titre: "Changer les draps – Squat + rotation", duree: 10, description: "Border les coins en squat profond. Saisir et tirer les draps en rotation thoracique contrôlée (pas lombaire). Renforce core en rotation, jambes." },

    // ══ SALLE DE BAIN ═════════════════════════════════════════════════════════
    { titre: "Nettoyer la baignoire / douche – Fente basse", duree: 10, description: "Nettoyer le fond en fente profonde ou à genou : descendre en contrôle, frotter en gainage, remonter en poussant sur le talon. Renforce jambes, stabilité." },
    { titre: "Nettoyer les toilettes – Squat tenu", duree: 5, description: "Rester en squat isométrique pendant le nettoyage du bas des toilettes. Dos droit, abdos engagés. Renforce quadriceps, endurance posturale." },
    { titre: "Nettoyer le lavabo – Stabilité debout penchée", duree: 5, description: "Se pencher en hinge (dos droit) vers le lavabo bas. Jambes légèrement fléchies, abdos engagés. Renforce ischios, lombes, endurance de gainage." },

    // ══ EXTÉRIEUR & DIVERS ════════════════════════════════════════════════════
    { titre: "Jardinage – Désherbage en squat", duree: 30, description: "Désherber accroupi en squat profond (talons au sol si possible) plutôt qu'à genoux courbé. Alterner squat et demi-genou. Renforce jambes, chaîne postérieure." },
    { titre: "Jardinage – Bêchage / ratissage", duree: 30, description: "Bêcher : pousser avec le pied, tirer avec les bras et hanche (pas le dos). Rotation du buste contrôlée. Renforce tout le corps, mobilité thoracique." },
    { titre: "Jardinage – Port de terreau / arrosage", duree: 20, description: "Porter l'arrosoir ou le sac de terreau en farmer's walk. Remplir/vider en hinge. Renforce avant-bras, trapèzes, chaîne postérieure." },
    { titre: "Montée et descente des escaliers – Step-up renforcé", duree: 10, description: "Monter en posant le pied entier (pas juste la pointe), pousser sur le talon, dos droit. Descendre lentement (excentrique). Renforce quadriceps, fessiers, mollets." },
    { titre: "Monter des charges (caves, greniers) – Circuit complet", duree: 15, description: "Porter une caisse : hinge pour soulever, gainage maximal en montant les escaliers, poser en squat. Renforce tout le corps en condition fonctionnelle." },
    { titre: "Nettoyage de la voiture – Mobilisation complète", duree: 20, description: "Alterner : se pencher (hinge) pour le bas, élévation bras pour le toit, rotation tronc pour les côtés. Gainage actif tout le long. Mobilité complète." },
    { titre: "Trier / vider des cartons – Hinge + portage", duree: 20, description: "Chaque carton = hinge pour soulever, farmer's walk pour déplacer, squat pour poser. Répéter consciemment. Renforce dos, jambes, core fonctionnel." },
  ],
};

// ─── Storage ───────────────────────────────────────────────────────────────
const DEMO = {
  clients: [
    {
      id: "c1", nom: "Sophie Martin", email: "sophie.m@email.com", coach: "Aude",
      dateDebut: "2026-05-10", statut: "en-cours",
      objectif: "Douleurs lombaires chroniques, bureau sédentaire. Réduire les tensions et améliorer l'énergie quotidienne.",
      profil: { niveau: "debutant", frequence: "3x/semaine", contraintes: "Lombaires fragiles, éviter les flexions profondes" },
      messages: [
        { id: "m1", auteur: "Aude", role: "coach", date: "2026-06-02", texte: "Bravo Sophie ! Ta progression est vraiment encourageante 💪" },
        { id: "m2", auteur: "Sophie Martin", role: "client", date: "2026-06-03", texte: "Merci ! La respiration m'aide vraiment à décompresser le soir." },
      ],
      seances: [
        { id: "s1", date: "2026-05-15", heure: "10:00", duree: 60, notes: "Bilan initial. Prioriser les lombaires.", coach: "Aude", type: "passee" },
        { id: "s2", date: "2026-07-02", heure: "09:30", duree: 60, notes: "", coach: "Aude", type: "planifiee", rappel: true },
      ],
      programme: [
        { id: "e1", categorie: "posture", titre: "Ancrage debout – pieds parallèles", duree: 5, description: "Se tenir debout, pieds à la largeur des hanches.", clientValide: true, clientDate: "2026-06-01", clientCommentaire: "Fait chaque matin, plus stable !", coachValide: true, coachDate: "2026-06-02", coachNote: "Excellente progression." },
        { id: "e2", categorie: "mobilite", titre: "Rotation cervicale lente", duree: 3, description: "5 rotations de chaque côté.", clientValide: true, clientDate: "2026-06-05", clientCommentaire: "Un peu douloureux au début.", coachValide: false, coachDate: null, coachNote: "" },
        { id: "e3", categorie: "force", titre: "Gainage ventral – 3 séries", duree: 10, description: "Planche avant-bras 30s x3.", clientValide: false, clientDate: null, clientCommentaire: "", coachValide: false, coachDate: null, coachNote: "" },
        { id: "e4", categorie: "respiration", titre: "Cohérence cardiaque 5-5", duree: 5, description: "6 cycles/min pendant 5 min.", clientValide: false, clientDate: null, clientCommentaire: "", coachValide: false, coachDate: null, coachNote: "" },
      ],
    },
    {
      id: "c2", nom: "Marc Lefèvre", email: "marc.lefevre@pro.fr", coach: "Sylvain",
      dateDebut: "2026-06-01", statut: "nouveau",
      objectif: "Optimiser l'environnement de travail, réduire la fatigue en fin de journée.",
      profil: { niveau: "intermediaire", frequence: "2x/semaine", contraintes: "" },
      messages: [], seances: [],
      programme: [
        { id: "e5", categorie: "mobilite", titre: "Ouverture des hanches – figure 4", duree: 8, description: "45s par côté.", clientValide: false, clientDate: null, clientCommentaire: "", coachValide: false, coachDate: null, coachNote: "" },
        { id: "e6", categorie: "posture", titre: "Correction posture assise", duree: 0, description: "Ajuster bassin, colonne, épaules.", clientValide: false, clientDate: null, clientCommentaire: "", coachValide: false, coachDate: null, coachNote: "" },
      ],
    },
  ],
};


// ─── Utils ─────────────────────────────────────────────────────────────────
function genId() { return Math.random().toString(36).slice(2, 9); }
function pct(p) { if (!p?.length) return 0; return Math.round(p.filter(e => e.coachValide).length / p.length * 100); }
function today() { return new Date().toISOString().split("T")[0]; }
function fmt(d) { if (!d) return ""; const [y,m,j] = d.split("-"); return `${j}/${m}/${y}`; }
function daysTo(d) { return Math.round((new Date(d) - new Date(today())) / 86400000); }
function isUpcoming(d) { return d >= today(); }
function isSoon(d) { const n = daysTo(d); return n >= 0 && n <= 7; }

// ─── Export ────────────────────────────────────────────────────────────────
function exportTxt(client) {
  const p = pct(client.programme);
  const L = [`EX HOME – Programme de ${client.nom}`, `Coach : ${client.coach}  |  Depuis le : ${fmt(client.dateDebut)}  |  Statut : ${STATUS[client.statut]?.label}`, `Progression : ${p}%\n`];
  if (client.objectif) L.push("OBJECTIF :\n" + client.objectif + "\n");
  if (client.profil) { const pr = client.profil; L.push(`PROFIL : Niveau ${pr.niveau} · ${pr.frequence}${pr.contraintes ? " · Contraintes : " + pr.contraintes : ""}\n`); }
  L.push("PROGRAMME\n" + "─".repeat(50));
  (client.programme||[]).forEach((e, i) => {
    const cat = CATEGORIES.find(c => c.id === e.categorie);
    L.push(`\n${i+1}. [${cat?.label}] ${e.titre}${e.duree ? ` (${e.duree} min)` : ""}`);
    if (e.description) L.push(`   ${e.description}`);
    L.push(`   Client : ${e.clientValide ? `✓ Validé le ${fmt(e.clientDate)}` : "En attente"}${e.clientCommentaire ? ` – "${e.clientCommentaire}"` : ""}`);
    L.push(`   Coach  : ${e.coachValide ? `✓ Validé le ${fmt(e.coachDate)}` : "En attente"}${e.coachNote ? ` – ${e.coachNote}` : ""}`);
  });
  (client.seances||[]).filter(s=>s.type==="passee").length && L.push("\n\nHISTORIQUE SÉANCES\n" + "─".repeat(50));
  (client.seances||[]).filter(s=>s.type==="passee").forEach(s => { L.push(`\n• ${fmt(s.date)} ${s.heure||""} – ${s.duree}min  (${s.coach})`); if (s.notes) L.push(`  ${s.notes}`); });
  L.push(`\n\nDocument généré le ${fmt(today())} – Ex Home`);
  const blob = new Blob([L.join("\n")], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href=url; a.download=`ExHome_${client.nom.replace(/\s/g,"_")}.txt`; a.click(); URL.revokeObjectURL(url);
}

// ─── Atoms ─────────────────────────────────────────────────────────────────
function Badge({status}) {
  const s = STATUS[status]||STATUS["nouveau"];
  return <span style={{fontSize:11,fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase",padding:"3px 9px",borderRadius:20,color:s.color,background:s.bg}}>{s.label}</span>;
}
function Bar({value}) {
  return <div style={{height:6,borderRadius:3,background:C.border,overflow:"hidden"}}>
    <div style={{height:"100%",width:`${value}%`,background:value===100?C.success:C.primary,borderRadius:3,transition:"width 0.4s ease",boxShadow:`0 0 8px ${value===100?C.success:C.primary}50`}}/>
  </div>;
}
function CatBadge({categorie}) {
  const cat = CATEGORIES.find(c=>c.id===categorie); if(!cat) return null;
  return <span style={{fontSize:11,padding:"2px 8px",borderRadius:12,background:C.primaryXLight,color:C.primary,fontWeight:500}}>{cat.icon} {cat.label}</span>;
}
function Input({label,value,onChange,type="text",placeholder,style={}}) {
  return <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:C.textMid}}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:14,color:C.text,background:C.bgMid,outline:"none",fontFamily:"inherit",...style}}/>
  </div>;
}
function Textarea({label,value,onChange,placeholder,rows=3}) {
  return <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:C.textMid}}>{label}</label>}
    <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:14,color:C.text,background:C.bgMid,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
  </div>;
}
function Sel({label,value,onChange,options}) {
  return <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:C.textMid}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:14,color:C.text,background:C.bgMid,outline:"none",fontFamily:"inherit"}}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>;
}
function Btn({children,onClick,variant="primary",size="md",disabled=false,style={}}) {
  const base={border:"none",borderRadius:8,cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",fontWeight:600,transition:"all 0.15s",opacity:disabled?0.4:1};
  const sizes={sm:{padding:"6px 12px",fontSize:12},md:{padding:"10px 18px",fontSize:14},lg:{padding:"13px 24px",fontSize:15}};
  const variants={primary:{background:C.primary,color:C.bg},accent:{background:C.accent,color:C.bg},ghost:{background:"transparent",color:C.primary,border:`1px solid ${C.border}`},danger:{background:C.dangerLight,color:C.danger},success:{background:C.successLight,color:C.success},gold:{background:C.gold,color:"#1A1A0A"}};
  return <button onClick={disabled?undefined:onClick} style={{...base,...sizes[size],...variants[variant],...style}}>{children}</button>;
}
function Modal({title,onClose,children,width=600}) {
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div style={{background:C.surface,borderRadius:16,width:"100%",maxWidth:width,maxHeight:"90vh",overflow:"auto",boxShadow:"0 24px 80px rgba(0,0,0,0.5)",border:`1px solid ${C.borderLight}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px",borderBottom:`1px solid ${C.border}`}}>
        <span style={{fontWeight:700,fontSize:17,color:C.text}}>{title}</span>
        <button onClick={onClose} style={{border:"none",background:"none",fontSize:20,cursor:"pointer",color:C.textLight}}>✕</button>
      </div>
      <div style={{padding:24}}>{children}</div>
    </div>
  </div>;
}

// ─── Bibliothèque déroulante ───────────────────────────────────────────────
function BibliothequePanel({ programmeActuel, onAjouter, onClose }) {
  const CUSTOM_KEY = "exhome_biblio_custom";

  // Exercices personnalisés sauvegardés en localStorage
  const [customExos, setCustomExos] = useState(() => {
    try { const r = localStorage.getItem(CUSTOM_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
  });

  const [openCat, setOpenCat] = useState(null);
  const [customTitre, setCustomTitre] = useState("");
  const [customCat, setCustomCat] = useState("posture");
  const [customDuree, setCustomDuree] = useState("5");
  const [customDesc, setCustomDesc] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [added, setAdded] = useState([]);
  const [confirmDel, setConfirmDel] = useState(null);

  // Sauvegarde automatique des exercices personnalisés
  useEffect(() => {
    try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(customExos)); } catch {}
  }, [customExos]);

  const dansProgamme = (titre) => programmeActuel.some(e => e.titre === titre);

  function ajouter(exo, categorie) {
    if (dansProgamme(exo.titre)) return;
    onAjouter({ id: genId(), categorie, titre: exo.titre, duree: exo.duree, description: exo.description, clientValide: false, clientDate: null, clientCommentaire: "", coachValide: false, coachDate: null, coachNote: "" });
    setAdded(a => [...a, exo.titre]);
  }

  function ajouterCustom() {
    if (!customTitre.trim()) return;
    const nouvelExo = {
      id: genId(),
      titre: customTitre.trim(),
      duree: Number(customDuree) || 0,
      description: customDesc.trim(),
      categorie: customCat,
      dateCreation: new Date().toLocaleDateString("fr-FR"),
    };
    // Sauvegarder dans la bibliothèque personnalisée
    setCustomExos(prev => [...prev, nouvelExo]);
    // Et ajouter au programme du client
    ajouter(nouvelExo, customCat);
    setCustomTitre(""); setCustomDesc(""); setCustomDuree("5"); setShowCustom(false);
  }

  function supprimerCustom(id) {
    setCustomExos(prev => prev.filter(e => e.id !== id));
    setConfirmDel(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: C.textMid }}>
        Sélectionne des exercices à ajouter au programme du client, ou crée un exercice personnalisé.
      </p>

      {/* ── Bibliothèque personnalisée du coach ── */}
      {customExos.length > 0 && (
        <div style={{ marginBottom: 8, border: `1px solid ${C.gold}60`, borderRadius: 12, overflow: "hidden" }}>
          <button onClick={() => setOpenCat(openCat === "__custom" ? null : "__custom")}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: openCat === "__custom" ? C.surfaceHover : C.surface, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            <span style={{ fontSize: 18 }}>⭐</span>
            <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: C.gold, textAlign: "left" }}>Mes exercices personnalisés</span>
            <span style={{ fontSize: 11, background: C.gold+"30", color: C.gold, padding: "2px 8px", borderRadius: 10 }}>{customExos.length}</span>
            <span style={{ fontSize: 12, color: C.textLight, marginLeft: 4 }}>{openCat === "__custom" ? "▲" : "▼"}</span>
          </button>
          {openCat === "__custom" && (
            <div style={{ background: C.bgMid, borderTop: `1px solid ${C.border}` }}>
              {customExos.map(exo => {
                const already = dansProgamme(exo.titre);
                const isConfirming = confirmDel === exo.id;
                return (
                  <div key={exo.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 16px", borderBottom: `1px solid ${C.border}30` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: already ? C.success : C.text }}>{exo.titre}</span>
                        {exo.duree > 0 && <span style={{ fontSize: 11, color: C.textLight }}>⏱ {exo.duree} min</span>}
                        <span style={{ fontSize: 10, color: C.gold, background: C.gold+"15", padding: "1px 6px", borderRadius: 6 }}>
                          {CATEGORIES.find(c=>c.id===exo.categorie)?.icon} {CATEGORIES.find(c=>c.id===exo.categorie)?.label}
                        </span>
                        {exo.dateCreation && <span style={{ fontSize: 10, color: C.textLight }}>Créé le {exo.dateCreation}</span>}
                      </div>
                      {exo.description && <p style={{ margin: 0, fontSize: 12, color: C.textMid, lineHeight: 1.5 }}>{exo.description}</p>}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => ajouter(exo, exo.categorie)} disabled={already}
                        style={{ border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: already ? "default" : "pointer", background: already ? C.successLight : C.gold+"25", color: already ? C.success : C.gold }}>
                        {already ? "✓" : "+ Ajouter"}
                      </button>
                      {!isConfirming ? (
                        <button onClick={() => setConfirmDel(exo.id)}
                          style={{ border: `1px solid ${C.danger}40`, borderRadius: 8, padding: "6px 8px", fontSize: 12, background: C.dangerLight, color: C.danger, cursor: "pointer", fontFamily: "inherit" }}>
                          🗑
                        </button>
                      ) : (
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => supprimerCustom(exo.id)}
                            style={{ border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 11, background: C.danger, color: BLANC, cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
                            Supprimer
                          </button>
                          <button onClick={() => setConfirmDel(null)}
                            style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 8px", fontSize: 11, background: "transparent", color: C.textLight, cursor: "pointer", fontFamily: "inherit" }}>
                            Annuler
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Bibliothèque standard ── */}
      {CATEGORIES.map(cat => {
        const exos = BIBLIOTHEQUE[cat.id] || [];
        const isOpen = openCat === cat.id;
        const countDansProgr = exos.filter(e => dansProgamme(e.titre)).length;
        const isMenager = cat.id === "menager";
        return (
          <div key={cat.id} style={{ marginBottom: 8, border: `1px solid ${isOpen ? (isMenager ? C.gold+"80" : C.borderLight) : C.border}`, borderRadius: 12, overflow: "hidden" }}>
            <button onClick={() => setOpenCat(isOpen ? null : cat.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: isOpen ? C.surfaceHover : C.surface, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              <span style={{ fontSize: 18 }}>{cat.icon}</span>
              <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: isMenager ? C.gold : C.text, textAlign: "left" }}>{cat.label}</span>
              <span style={{ fontSize: 11, color: C.textLight }}>{countDansProgr}/{exos.length} ajoutés</span>
              <span style={{ fontSize: 12, color: C.textLight, marginLeft: 4 }}>{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && (
              <div style={{ background: C.bgMid, borderTop: `1px solid ${C.border}` }}>
                {exos.map(exo => {
                  const already = dansProgamme(exo.titre);
                  return (
                    <div key={exo.titre} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 16px", borderBottom: `1px solid ${C.border}30` }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: already ? C.success : C.text }}>{exo.titre}</span>
                          {exo.duree > 0 && <span style={{ fontSize: 11, color: C.textLight }}>⏱ {exo.duree} min</span>}
                          {already && <span style={{ fontSize: 11, color: C.success }}>✓</span>}
                        </div>
                        {exo.description && <p style={{ margin: 0, fontSize: 12, color: C.textMid, lineHeight: 1.5 }}>{exo.description}</p>}
                      </div>
                      <button onClick={() => ajouter(exo, cat.id)} disabled={already}
                        style={{ flexShrink: 0, border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: already ? "default" : "pointer", background: already ? C.successLight : isMenager ? C.gold+"25" : C.primaryXLight, color: already ? C.success : isMenager ? C.gold : C.primary }}>
                        {already ? "✓" : "+ Ajouter"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* ── Créer un exercice personnalisé ── */}
      <div style={{ marginTop: 8, border: `1px solid ${showCustom ? C.gold+"60" : C.border}`, borderRadius: 12, overflow: "hidden" }}>
        <button onClick={() => setShowCustom(!showCustom)}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: showCustom ? C.bgMid : C.surface, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          <span style={{ fontSize: 18 }}>✨</span>
          <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: C.gold, textAlign: "left" }}>Créer un exercice personnalisé</span>
          <span style={{ fontSize: 10, color: C.textLight }}>Sauvegardé dans votre bibliothèque</span>
          <span style={{ fontSize: 12, color: C.textLight, marginLeft: 4 }}>{showCustom ? "▲" : "▼"}</span>
        </button>
        {showCustom && (
          <div style={{ background: C.bgMid, borderTop: `1px solid ${C.border}`, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <Input label="Titre *" value={customTitre} onChange={setCustomTitre} placeholder="Ex : Marche consciente 10 min" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Sel label="Catégorie" value={customCat} onChange={setCustomCat} options={CATEGORIES.map(c=>({value:c.id,label:`${c.icon} ${c.label}`}))} />
              <Input label="Durée (min)" value={customDuree} onChange={setCustomDuree} type="number" />
            </div>
            <Textarea label="Description & consignes" value={customDesc} onChange={setCustomDesc} rows={3} />
            <div style={{ background: C.gold+"15", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: C.gold }}>
              ⭐ Cet exercice sera sauvegardé dans <b>Mes exercices personnalisés</b> et réutilisable pour tous vos clients.
            </div>
            <Btn onClick={ajouterCustom} disabled={!customTitre.trim()}>✨ Créer et ajouter au programme</Btn>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Btn variant="ghost" onClick={onClose}>Fermer</Btn>
      </div>
    </div>
  );
}
const BLANC = "#FFFFFF";

// ─── Profil client ─────────────────────────────────────────────────────────
function ProfilClient({ client, onUpdate, readOnly = false }) {
  const [edit, setEdit] = useState(false);
  const [objectif, setObjectif] = useState(client.objectif || "");
  const [niveau, setNiveau] = useState(client.profil?.niveau || "debutant");
  const [frequence, setFrequence] = useState(client.profil?.frequence || "2x/semaine");
  const [contraintes, setContraintes] = useState(client.profil?.contraintes || "");

  function save() {
    onUpdate({ ...client, objectif, profil: { niveau, frequence, contraintes } });
    setEdit(false);
  }

  if (readOnly || !edit) return (
    <div style={{ background: C.bgMid, borderRadius: 12, padding: 16, border: `1px solid ${C.border}`, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase" }}>Profil & Objectif</span>
        {!readOnly && <button onClick={() => setEdit(true)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 12, color: C.primary }}>✏️ Modifier</button>}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
        {[
          { label: "Niveau", value: { debutant: "🌱 Débutant", intermediaire: "🔥 Intermédiaire", avance: "⚡ Avancé" }[client.profil?.niveau || "debutant"] },
          { label: "Fréquence", value: client.profil?.frequence || "—" },
        ].map(item => (
          <div key={item.label} style={{ background: C.surface, borderRadius: 8, padding: "6px 12px", fontSize: 12 }}>
            <span style={{ color: C.textLight }}>{item.label} : </span>
            <span style={{ color: C.text, fontWeight: 600 }}>{item.value}</span>
          </div>
        ))}
        {client.profil?.contraintes && (
          <div style={{ background: C.dangerLight, borderRadius: 8, padding: "6px 12px", fontSize: 12 }}>
            <span style={{ color: C.danger }}>⚠️ {client.profil.contraintes}</span>
          </div>
        )}
      </div>
      {client.objectif && <p style={{ margin: 0, fontSize: 13, color: C.textMid, lineHeight: 1.6, fontStyle: "italic" }}>🎯 {client.objectif}</p>}
    </div>
  );

  return (
    <div style={{ background: C.bgMid, borderRadius: 12, padding: 16, border: `1px solid ${C.borderLight}`, marginBottom: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: C.textMid, marginBottom: 14, textTransform: "uppercase" }}>Modifier le profil</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Sel label="Niveau" value={niveau} onChange={setNiveau} options={[{value:"debutant",label:"🌱 Débutant"},{value:"intermediaire",label:"🔥 Intermédiaire"},{value:"avance",label:"⚡ Avancé"}]} />
          <Sel label="Fréquence" value={frequence} onChange={setFrequence} options={[{value:"1x/semaine",label:"1x / semaine"},{value:"2x/semaine",label:"2x / semaine"},{value:"3x/semaine",label:"3x / semaine"},{value:"quotidien",label:"Quotidien"}]} />
        </div>
        <Input label="Contraintes physiques" value={contraintes} onChange={setContraintes} placeholder="Ex : Lombaires fragiles, éviter flexions..." />
        <Textarea label="Objectif principal" value={objectif} onChange={setObjectif} placeholder="Ce que le client souhaite améliorer..." rows={2} />
        <div style={{ display: "flex", gap: 8 }}>
          <Btn size="sm" onClick={save}>Enregistrer</Btn>
          <Btn size="sm" variant="ghost" onClick={() => setEdit(false)}>Annuler</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Chronomètre ──────────────────────────────────────────────────────────
function Minuteur({ dureeMin }) {
  const [elapsed, setElapsed] = useState(0);
  const [actif, setActif] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (actif) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [actif]);

  function reset() { clearInterval(intervalRef.current); setElapsed(0); setActif(false); }

  const min = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const sec = String(elapsed % 60).padStart(2, "0");
  const h   = Math.floor(elapsed / 3600);
  const display = h > 0 ? `${String(h).padStart(2,"0")}:${min}:${sec}` : `${min}:${sec}`;

  // Arc de progression basé sur la durée indicative de l'exercice
  const total = (dureeMin || 0) * 60;
  const progress = total > 0 ? Math.min((elapsed / total) * 100, 100) : 0;
  const radius = 22; const circ = 2 * Math.PI * radius;
  const depassé = total > 0 && elapsed > total;
  const couleur = depassé ? C.success : actif ? C.primary : C.textLight;

  return (
    <div style={{ marginTop: 10, background: C.bgMid, borderRadius: 10, padding: "10px 14px", border: `1px solid ${depassé ? C.success+"60" : C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
      {/* Cercle SVG */}
      <svg width={50} height={50} style={{ flexShrink: 0 }}>
        <circle cx={25} cy={25} r={radius} fill="none" stroke={C.border} strokeWidth={4}/>
        {progress > 0 && (
          <circle cx={25} cy={25} r={radius} fill="none" stroke={couleur} strokeWidth={4}
            strokeDasharray={circ} strokeDashoffset={circ * (1 - progress / 100)}
            strokeLinecap="round" transform="rotate(-90 25 25)"
            style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}/>
        )}
        <text x={25} y={20} textAnchor="middle" fontSize={9} fill={C.textLight} fontFamily="monospace">chrono</text>
        <text x={25} y={32} textAnchor="middle" fontSize={11} fontWeight={700} fill={couleur} fontFamily="monospace">{display}</text>
      </svg>
      {/* Texte */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: "monospace", letterSpacing: "0.05em" }}>
          {display}
        </div>
        <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>
          {depassé ? `✅ Objectif ${dureeMin} min atteint !` : actif ? `⏱ En cours${dureeMin ? ` – objectif ${dureeMin} min` : ""}` : elapsed === 0 ? "Prêt à démarrer" : "En pause"}
        </div>
      </div>
      {/* Boutons */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button onClick={() => setActif(a => !a)}
          style={{ border: "none", background: actif ? C.warningLight : C.primaryXLight, borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 16, color: actif ? C.warning : C.primary, lineHeight: 1 }}>
          {actif ? "⏸" : "▶"}
        </button>
        <button onClick={reset}
          style={{ border: "none", background: C.dangerLight, borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 14, color: C.danger, lineHeight: 1 }}>↺</button>
      </div>
    </div>
  );
}

// ─── Exercice Card ─────────────────────────────────────────────────────────
function ExoCard({ exo, onEdit, onDelete, onCoachValidate, onUpdateCoachNote, index }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState(exo.coachNote || "");
  const [showTimer, setShowTimer] = useState(false);
  const borderCol = exo.coachValide ? C.success+"80" : exo.clientValide ? C.warning+"80" : C.border;
  const cat = CATEGORIES.find(c => c.id === exo.categorie);

  return (
    <div style={{ border: `1px solid ${borderCol}`, borderRadius: 12, padding: 16, background: C.surface, transition: "border-color 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.textLight, minWidth: 20 }}>#{index+1}</span>
            <span style={{ fontSize: 16 }}>{exo.coachValide ? "✅" : exo.clientValide ? "⏳" : "⬜"}</span>
            <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{exo.titre}</span>
            <CatBadge categorie={exo.categorie} />
            {exo.duree > 0 && <span style={{ fontSize: 11, color: C.textLight }}>⏱ {exo.duree} min</span>}
          </div>
          {exo.description && <p style={{ fontSize: 13, color: C.textMid, margin: 0, lineHeight: 1.5 }}>{exo.description}</p>}
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {onEdit && <Btn size="sm" variant="ghost" onClick={() => onEdit(exo)}>✏️</Btn>}
          {onDelete && <Btn size="sm" variant="danger" onClick={() => onDelete(exo.id)}>🗑</Btn>}
        </div>
      </div>

      {/* Minuteur */}
      {exo.duree > 0 && (
        <div style={{ marginTop: 10 }}>
          <button onClick={() => setShowTimer(t => !t)}
            style={{ border: `1px solid ${showTimer ? C.primary+"60" : C.border}`, borderRadius: 8, padding: "5px 12px", background: showTimer ? C.primaryXLight : "transparent", color: showTimer ? C.primary : C.textLight, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
            ⏱ {showTimer ? "Masquer le minuteur" : "Lancer le minuteur"}
          </button>
          {showTimer && <Minuteur key={exo.id} dureeMin={exo.duree} />}
        </div>
      )}

      {exo.clientValide && (
        <div style={{ marginTop: 12, padding: "10px 12px", background: C.warningLight, borderRadius: 8, fontSize: 13 }}>
          <div style={{ fontWeight: 600, color: C.warning, marginBottom: 3 }}>✔ Client a validé le {fmt(exo.clientDate)}</div>
          {exo.clientCommentaire && <div style={{ color: C.textMid, fontStyle: "italic" }}>« {exo.clientCommentaire} »</div>}
        </div>
      )}
      <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {!exo.coachValide
          ? <Btn size="sm" variant="success" onClick={() => onCoachValidate(exo.id)} disabled={!exo.clientValide}>{exo.clientValide ? "✅ Valider (coach)" : "En attente client"}</Btn>
          : <span style={{ fontSize: 12, color: C.success, fontWeight: 600 }}>✅ Validé coach le {fmt(exo.coachDate)}</span>}
        <Btn size="sm" variant="ghost" onClick={() => setNoteOpen(!noteOpen)}>📝 Note coach</Btn>
      </div>
      {noteOpen && (
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Observation, ajustement..."
            style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", background: C.bgMid, color: C.text }} />
          <Btn size="sm" onClick={() => { onUpdateCoachNote(exo.id, note); setNoteOpen(false); }}>Sauver</Btn>
        </div>
      )}
      {exo.coachNote && !noteOpen && <div style={{ marginTop: 8, fontSize: 12, color: C.textMid, fontStyle: "italic" }}>📝 {exo.coachNote}</div>}
    </div>
  );
}

// ─── Messagerie ────────────────────────────────────────────────────────────
function Messagerie({ client, onUpdate, isCoach }) {
  const [msg, setMsg] = useState("");
  const auteur = isCoach ? (client.coach||"Coach") : client.nom;
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [client.messages]);
  function envoyer() {
    if (!msg.trim()) return;
    onUpdate({ ...client, messages: [...(client.messages||[]), {id:genId(),auteur,role:isCoach?"coach":"client",date:today(),texte:msg.trim()}] });
    setMsg("");
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", height: 400 }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {!(client.messages||[]).length
          ? <div style={{ textAlign: "center", color: C.textLight, padding: "60px 20px" }}><div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>Lancez la conversation !</div>
          : (client.messages||[]).map(m => {
            const isMe = (isCoach&&m.role==="coach")||(!isCoach&&m.role==="client");
            return <div key={m.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "75%" }}>
                <div style={{ fontSize: 11, color: C.textLight, marginBottom: 3, textAlign: isMe ? "right" : "left" }}>{m.auteur} · {fmt(m.date)}</div>
                <div style={{ padding: "10px 14px", borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: isMe ? C.primary : C.surfaceHover, color: isMe ? C.bg : C.text, fontSize: 14, lineHeight: 1.5 }}>{m.texte}</div>
              </div>
            </div>;
          })}
        <div ref={bottomRef}/>
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: "flex", gap: 8 }}>
        <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();envoyer();}}}
          placeholder="Écrire un message… (Entrée pour envoyer)"
          style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:14, fontFamily:"inherit", outline:"none", color:C.text, background:C.bgMid }}/>
        <Btn onClick={envoyer} disabled={!msg.trim()}>Envoyer</Btn>
      </div>
    </div>
  );
}

// ─── Séances ───────────────────────────────────────────────────────────────
function Seances({ client, onUpdate, isCoach }) {
  const [showAdd, setShowAdd] = useState(false);
  const [date, setDate] = useState(today()); const [heure, setHeure] = useState("10:00");
  const [duree, setDuree] = useState("60"); const [notes, setNotes] = useState("");
  const [type, setType] = useState("planifiee"); const [rappel, setRappel] = useState(true);

  const seances = (client.seances||[]).sort((a,b)=>b.date.localeCompare(a.date));

  function ajouter() {
    const s = {id:genId(),date,heure,duree:Number(duree),notes,coach:client.coach,type,rappel:type==="planifiee"?rappel:false};
    onUpdate({...client,seances:[...(client.seances||[]),s]}); setShowAdd(false);
    setDate(today()); setHeure("10:00"); setDuree("60"); setNotes(""); setType("planifiee"); setRappel(true);
  }
  function del(id) { onUpdate({...client,seances:(client.seances||[]).filter(s=>s.id!==id)}); }

  const avenir = seances.filter(s=>s.type==="planifiee");
  const passes = seances.filter(s=>s.type==="passee");

  return <div>
    {isCoach && <div style={{marginBottom:16}}>
      {!showAdd ? <Btn size="sm" onClick={()=>setShowAdd(true)}>+ Ajouter une séance</Btn>
        : <div style={{background:C.bgMid,borderRadius:12,padding:16,display:"flex",flexDirection:"column",gap:12,border:`1px solid ${C.border}`}}>
            <Sel label="Type" value={type} onChange={setType} options={[{value:"planifiee",label:"📅 À planifier"},{value:"passee",label:"✅ Passée"}]}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              <Input label="Date" value={date} onChange={setDate} type="date"/>
              <Input label="Heure" value={heure} onChange={setHeure} type="time"/>
              <Input label="Durée (min)" value={duree} onChange={setDuree} type="number"/>
            </div>
            <Textarea label="Notes" value={notes} onChange={setNotes} rows={2}/>
            {type==="planifiee" && <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:C.textMid}}>
              <input type="checkbox" checked={rappel} onChange={e=>setRappel(e.target.checked)} style={{accentColor:C.primary}}/>🔔 Activer le rappel
            </label>}
            <div style={{display:"flex",gap:8}}>
              <Btn size="sm" onClick={ajouter} disabled={!date}>Enregistrer</Btn>
              <Btn size="sm" variant="ghost" onClick={()=>setShowAdd(false)}>Annuler</Btn>
            </div>
          </div>}
    </div>}

    {avenir.length > 0 && <>
      <div style={{fontSize:12,fontWeight:700,color:C.primary,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8}}>À venir</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
        {avenir.map(s=>{
          const diff=daysTo(s.date); const soon=diff>=0&&diff<=7;
          return <div key={s.id} style={{background:C.surface,border:`1px solid ${soon?C.warning+"50":C.border}`,borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{minWidth:44,textAlign:"center",background:soon?C.warningLight:C.primaryXLight,borderRadius:8,padding:"5px 6px"}}>
              <div style={{fontSize:16,fontWeight:800,color:soon?C.warning:C.primary}}>{diff<=0?"🟢":diff}</div>
              {diff>0&&<div style={{fontSize:9,color:C.textLight}}>jours</div>}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:C.text}}>📅 {fmt(s.date)}{s.heure?` à ${s.heure}`:""}</div>
              <div style={{fontSize:12,color:C.textMid}}>⏱ {s.duree} min{s.rappel?" · 🔔":""}</div>
              {s.notes&&<div style={{fontSize:12,color:C.textMid,marginTop:2}}>{s.notes}</div>}
            </div>
            {isCoach&&<button onClick={()=>del(s.id)} style={{border:"none",background:C.dangerLight,borderRadius:8,padding:"6px 8px",cursor:"pointer",fontSize:13,color:C.danger}}>🗑</button>}
          </div>;
        })}
      </div>
    </>}

    {passes.length > 0 && <>
      <div style={{fontSize:12,fontWeight:700,color:C.textLight,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8}}>Historique</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {passes.map(s=><div key={s.id} style={{background:C.bgMid,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:C.textMid}}>✅ {fmt(s.date)}{s.heure?` à ${s.heure}`:""} · {s.duree} min</div>
            {s.notes&&<p style={{margin:"4px 0 0",fontSize:12,color:C.textLight,lineHeight:1.5}}>{s.notes}</p>}
          </div>
          {isCoach&&<button onClick={()=>del(s.id)} style={{border:"none",background:"none",cursor:"pointer",color:C.textLight,fontSize:13}}>🗑</button>}
        </div>)}
      </div>
    </>}

    {!avenir.length && !passes.length && <div style={{textAlign:"center",color:C.textLight,padding:"40px 20px",background:C.bgMid,borderRadius:10,border:`1px dashed ${C.border}`,fontSize:13}}>
      <div style={{fontSize:28,marginBottom:8}}>📅</div>Aucune séance.
    </div>}
  </div>;
}

// ─── Planning global ───────────────────────────────────────────────────────
function Planning({ clients, onUpdateClient }) {
  const all = [];
  clients.forEach(c => { (c.seances||[]).filter(s=>s.type==="planifiee").forEach(s=>all.push({...s,clientNom:c.nom,clientId:c.id})); });
  all.sort((a,b)=>(a.date+(a.heure||"")).localeCompare(b.date+(b.heure||"")));
  const avenir = all.filter(s=>isUpcoming(s.date));
  const bientot = avenir.filter(s=>isSoon(s.date));

  function toggleRappel(clientId, seanceId) {
    const c = clients.find(x=>x.id===clientId); if(!c) return;
    onUpdateClient({...c,seances:c.seances.map(s=>s.id===seanceId?{...s,rappel:!s.rappel}:s)});
  }
  function del(clientId, seanceId) {
    const c = clients.find(x=>x.id===clientId); if(!c) return;
    onUpdateClient({...c,seances:c.seances.filter(s=>s.id!==seanceId)});
  }

  return <div style={{maxWidth:900,margin:"0 auto"}}>
    {bientot.length>0 && <div style={{background:C.warningLight,border:`1px solid ${C.warning}40`,borderRadius:12,padding:"14px 18px",marginBottom:24}}>
      <div style={{fontWeight:700,color:C.warning,marginBottom:10,fontSize:14}}>🔔 Dans les 7 prochains jours</div>
      {bientot.map(s=>{const diff=daysTo(s.date); return <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:6,flexWrap:"wrap"}}>
        <span style={{fontSize:12,fontWeight:700,color:C.warning,minWidth:60}}>{diff===0?"Aujourd'hui":diff===1?"Demain":`J-${diff}`}</span>
        <span style={{fontSize:13,color:C.text,fontWeight:600}}>{s.clientNom}</span>
        <span style={{fontSize:12,color:C.textMid}}>{fmt(s.date)}{s.heure?` à ${s.heure}`:""} · {s.duree} min</span>
      </div>;})}
    </div>}

    <h3 style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:16}}>📅 Toutes les séances planifiées</h3>
    {avenir.length===0
      ? <div style={{textAlign:"center",padding:"60px 20px",color:C.textLight,background:C.surface,borderRadius:12,border:`1px dashed ${C.border}`}}>
          <div style={{fontSize:32,marginBottom:8}}>📅</div>Aucune séance planifiée.
        </div>
      : <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {avenir.map(s=>{const diff=daysTo(s.date); const urg=diff<=3;
            return <div key={s.id} style={{background:C.surface,border:`1px solid ${urg?C.warning+"60":C.border}`,borderRadius:12,padding:"14px 18px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
              <div style={{minWidth:52,textAlign:"center",background:urg?C.warningLight:C.primaryXLight,borderRadius:10,padding:"6px 8px"}}>
                <div style={{fontSize:18,fontWeight:800,color:urg?C.warning:C.primary}}>{diff===0?"🔴":diff}</div>
                <div style={{fontSize:9,color:C.textLight,textTransform:"uppercase"}}>{diff===0?"auj.":"jours"}</div>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                  <span style={{fontWeight:700,fontSize:14,color:C.text}}>{s.clientNom}</span>
                  <span style={{fontSize:12,color:C.textMid}}>{fmt(s.date)}{s.heure?` à ${s.heure}`:""}</span>
                  <span style={{fontSize:12,color:C.textMid}}>⏱ {s.duree} min</span>
                  <span style={{fontSize:12,color:C.textLight}}>Coach : {s.coach}</span>
                </div>
                {s.notes&&<div style={{fontSize:12,color:C.textMid}}>{s.notes}</div>}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>toggleRappel(s.clientId,s.id)} style={{border:"none",background:s.rappel?C.warningLight:C.primaryXLight,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:16,color:s.rappel?C.warning:C.textLight}}>🔔</button>
                <button onClick={()=>del(s.clientId,s.id)} style={{border:"none",background:C.dangerLight,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:14,color:C.danger}}>🗑</button>
              </div>
            </div>;
          })}
        </div>}
  </div>;
}

// ─── DossierView Coach ─────────────────────────────────────────────────────
function DossierView({ client, onUpdate, onBack }) {
  const [tab, setTab] = useState("programme");
  const [showBiblio, setShowBiblio] = useState(false);
  const [editingExo, setEditingExo] = useState(null);
  const [editInfo, setEditInfo] = useState(false);
  const [editNom, setEditNom] = useState(client.nom);
  const [editEmail, setEditEmail] = useState(client.email||"");
  const [editCoach, setEditCoach] = useState(client.coach);
  const [editStatut, setEditStatut] = useState(client.statut);
  const [filterCat, setFilterCat] = useState("all");
  const [showAddMenager, setShowAddMenager] = useState(false);
  const [menagerTitre, setMenagerTitre] = useState("");
  const [menagerDuree, setMenagerDuree] = useState("");
  const [menagerDesc, setMenagerDesc] = useState("");

  const p = pct(client.programme);
  const pending = (client.programme||[]).filter(e=>e.clientValide&&!e.coachValide).length;
  const planifCount = (client.seances||[]).filter(s=>s.type==="planifiee").length;
  const msgs = (client.messages||[]).filter(m=>m.role==="client").length;

  function addExo(exo) { onUpdate({...client,programme:[...(client.programme||[]),exo]}); }
  function saveExo(exo) {
    const prog = (client.programme||[]).map(e=>e.id===exo.id?exo:e);
    onUpdate({...client,programme:prog}); setEditingExo(null);
  }
  function delExo(id) { onUpdate({...client,programme:(client.programme||[]).filter(e=>e.id!==id)}); }
  function coachValidate(id) { onUpdate({...client,programme:(client.programme||[]).map(e=>e.id===id?{...e,coachValide:true,coachDate:today()}:e)}); }
  function updateNote(id,note) { onUpdate({...client,programme:(client.programme||[]).map(e=>e.id===id?{...e,coachNote:note}:e)}); }
  function saveInfo() { onUpdate({...client,nom:editNom,email:editEmail,coach:editCoach,statut:editStatut}); setEditInfo(false); }

  const filtered = filterCat==="all" ? (client.programme||[]) : (client.programme||[]).filter(e=>e.categorie===filterCat);

  const TABS = [
    {id:"programme", label:`Programme${pending>0?` (${pending}⏳)`:""}` },
    {id:"messages",  label:`Messages${msgs>0?` (${msgs}💬)`:""}` },
    {id:"seances",   label:`Séances${planifCount>0?` (${planifCount}📅)`:""}` },
    {id:"sante",     label:"❤️ Santé" },
    {id:"nutrition", label:"🍽️ Nutrition"},
    {id:"ergo",      label:"🏠 Compteur"},
  ];

  return <div style={{maxWidth:840,margin:"0 auto",width:"100%",overflowX:"hidden",boxSizing:"border-box"}}>
    {/* Header */}
    <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:16}}>
      <Btn variant="ghost" size="sm" onClick={onBack}>← Retour</Btn>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <h2 style={{margin:0,fontSize:18,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{client.nom}</h2>
          <Badge status={client.statut}/>
        </div>
        <div style={{fontSize:11,color:C.textLight,marginTop:3}}>Coach : {client.coach} · {fmt(client.dateDebut)}</div>
      </div>
      <div style={{display:"flex",gap:6,flexShrink:0}}>
        <Btn size="sm" variant="ghost" onClick={()=>setEditInfo(true)}>✏️</Btn>
        <Btn size="sm" variant="ghost" onClick={()=>exportTxt(client)}>⬇️</Btn>
      </div>
    </div>

    {/* Stats — 2x2 sur mobile */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
      {[
        {v:p+"%", l:"Progression", c:p===100?C.success:C.primary},
        {v:(client.programme||[]).length, l:"Exercices", c:C.text},
        {v:(client.programme||[]).filter(e=>e.coachValide).length, l:"Validés", c:C.success},
        {v:planifCount, l:"Séances à venir", c:C.accent},
      ].map(s=><div key={s.l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
        <div style={{fontSize:18,fontWeight:700,color:s.c}}>{s.v}</div>
        <div style={{fontSize:10,color:C.textLight}}>{s.l}</div>
      </div>)}
    </div>
    <Bar value={p}/>
    <div style={{marginBottom:14,marginTop:4,textAlign:"right",fontSize:11,color:C.textLight}}>{p}% complété</div>

    {/* Profil */}
    <ProfilClient client={client} onUpdate={onUpdate}/>

    {/* Onglets — scroll horizontal sur mobile */}
    <div style={{overflowX:"auto",overflowY:"visible",marginBottom:16,WebkitOverflowScrolling:"touch"}}>
      <div style={{display:"flex",gap:0,borderBottom:`1px solid ${C.border}`,minWidth:"max-content"}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 14px",border:"none",background:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap",color:tab===t.id?C.primary:C.textLight,borderBottom:tab===t.id?`2px solid ${C.primary}`:"2px solid transparent",marginBottom:-1,transition:"all 0.15s"}}>{t.label}</button>)}
      </div>
    </div>

    {/* Programme */}
    {tab==="programme" && <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px",fontSize:12,color:C.text,background:C.bgMid,fontFamily:"inherit"}}>
          <option value="all">Toutes catégories</option>
          {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
        <div style={{display:"flex",gap:8}}>
          <Btn size="sm" variant="gold" onClick={()=>setShowBiblio(true)}>📚 Bibliothèque</Btn>
          <Btn size="sm" variant="ghost" onClick={()=>setShowAddMenager(s=>!s)}>🏠 + Tâche manuelle</Btn>
        </div>
      </div>

      {/* ── Saisie rapide tâche ménagère ── */}
      {showAddMenager && (
        <div style={{background:C.bgMid,border:`1px solid ${C.gold}50`,borderRadius:12,padding:16,marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:13,color:C.gold,marginBottom:12}}>🏠 Ajouter une tâche ménagère personnalisée</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <Input label="Nom de la tâche *" value={menagerTitre} onChange={setMenagerTitre} placeholder="Ex : Repasser le linge en gainage…"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Input label="Durée (min)" value={menagerDuree} onChange={setMenagerDuree} type="number" placeholder="15"/>
              <div/>
            </div>
            <Textarea label="Description & consignes" value={menagerDesc} onChange={setMenagerDesc} placeholder="Détails du geste, points d'attention posturaux, bénéfices…" rows={3}/>
            <div style={{display:"flex",gap:8}}>
              <Btn size="sm" variant="gold" onClick={()=>{
                if(!menagerTitre.trim()) return;
                addExo({id:genId(),categorie:"menager",titre:menagerTitre.trim(),duree:Number(menagerDuree)||0,description:menagerDesc,clientValide:false,clientDate:null,clientCommentaire:"",coachValide:false,coachDate:null,coachNote:""});
                setMenagerTitre(""); setMenagerDuree(""); setMenagerDesc(""); setShowAddMenager(false);
              }} disabled={!menagerTitre.trim()}>Ajouter au programme</Btn>
              <Btn size="sm" variant="ghost" onClick={()=>setShowAddMenager(false)}>Annuler</Btn>
            </div>
          </div>
        </div>
      )}

      {filtered.length===0
        ? <div style={{textAlign:"center",padding:"40px 20px",color:C.textLight,background:C.surface,borderRadius:12,border:`1px dashed ${C.border}`}}>
            <div style={{fontSize:28,marginBottom:10}}>📋</div>
            Aucun exercice dans le programme.<br/>
            <Btn size="sm" variant="gold" style={{marginTop:12}} onClick={()=>setShowBiblio(true)}>📚 Ouvrir la bibliothèque</Btn>
          </div>
        : <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {filtered.map((exo,i)=><ExoCard key={exo.id} exo={exo} index={i}
              onEdit={e=>setEditingExo(e)} onDelete={delExo} onCoachValidate={coachValidate} onUpdateCoachNote={updateNote}/>)}
          </div>}
    </>}
    {tab==="messages" && <Messagerie client={client} onUpdate={onUpdate} isCoach={true}/>}
    {tab==="seances"  && <Seances client={client} onUpdate={onUpdate} isCoach={true}/>}
    {tab==="sante"    && <SanteTab client={client} onUpdate={onUpdate} isCoach={true}/>}
    {tab==="nutrition" && <NutritionView clientId={client.id}/>}
    {tab==="ergo"      && <ErgoCompteur clientId={client.id}/>}

    {/* Modal bibliothèque */}
    {showBiblio && <Modal title="📚 Bibliothèque d'exercices" onClose={()=>setShowBiblio(false)} width={680}>
      <BibliothequePanel programmeActuel={client.programme||[]} onAjouter={exo=>{addExo(exo);}} onClose={()=>setShowBiblio(false)}/>
    </Modal>}

    {/* Modal édition exercice */}
    {editingExo && <Modal title="Modifier l'exercice" onClose={()=>setEditingExo(null)} width={520}>
      <ExoEditForm exo={editingExo} onSave={saveExo} onClose={()=>setEditingExo(null)}/>
    </Modal>}

    {/* Modal infos client */}
    {editInfo && <Modal title="Modifier le dossier" onClose={()=>setEditInfo(false)}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Input label="Nom" value={editNom} onChange={setEditNom}/>
        <Input label="Email" value={editEmail} onChange={setEditEmail} type="email"/>
        <Sel label="Coach" value={editCoach} onChange={setEditCoach} options={COACHES.map(c=>({value:c,label:c}))}/>
        <Sel label="Statut" value={editStatut} onChange={setEditStatut} options={Object.entries(STATUS).map(([k,v])=>({value:k,label:v.label}))}/>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn variant="ghost" onClick={()=>setEditInfo(false)}>Annuler</Btn>
          <Btn onClick={saveInfo}>Enregistrer</Btn>
        </div>
      </div>
    </Modal>}
  </div>;
}

function ExoEditForm({ exo, onSave, onClose }) {
  const [titre,setTitre]=useState(exo.titre||"");
  const [cat,setCat]=useState(exo.categorie||"posture");
  const [duree,setDuree]=useState(exo.duree??5);
  const [desc,setDesc]=useState(exo.description||"");
  return <div style={{display:"flex",flexDirection:"column",gap:16}}>
    <Input label="Titre *" value={titre} onChange={setTitre}/>
    <Sel label="Catégorie" value={cat} onChange={setCat} options={CATEGORIES.map(c=>({value:c.id,label:`${c.icon} ${c.label}`}))}/>
    <Input label="Durée (min)" value={duree} onChange={setDuree} type="number"/>
    <Textarea label="Description" value={desc} onChange={setDesc} rows={4}/>
    <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
      <Btn variant="ghost" onClick={onClose}>Annuler</Btn>
      <Btn onClick={()=>onSave({...exo,titre,categorie:cat,duree:Number(duree),description:desc})} disabled={!titre.trim()}>Enregistrer</Btn>
    </div>
  </div>;
}

// ─── Module Santé ──────────────────────────────────────────────────────────
// Liens deep-link vers apps iOS
const APPS_SANTE = [
  { id: "sante", label: "Apple Santé", icon: "❤️", couleur: "#FF6B6B", description: "Calories, activité, fréquence cardiaque", url: "x-apple-health://", urlStore: "https://support.apple.com/fr-fr/guide/iphone/iph0d34ae28b/ios", badge: "Natif iOS" },
  { id: "myfitnesspal", label: "MyFitnessPal", icon: "🥗", couleur: "#4AA5E0", description: "Suivi calories & macronutriments", url: "myfitnesspal://", urlStore: "https://apps.apple.com/fr/app/myfitnesspal/id341232718", badge: "App Store" },
  { id: "withings", label: "Withings Health Mate", icon: "⚖️", couleur: "#00A896", description: "Balance connectée, IMC, masse grasse", url: "healthmate://", urlStore: "https://apps.apple.com/fr/app/withings-health-mate/id542701020", badge: "App Store" },
  { id: "tanita", label: "Tanita MyFitnessPal", icon: "📊", couleur: "#7B68EE", description: "Impédancemétrie, composition corporelle", url: "tanita://", urlStore: "https://apps.apple.com/fr/app/tanita-health-planet/id1490046944", badge: "App Store" },
];

// ─── QuickErgo — Widget ultra-rapide sur le dashboard client ──────────────
function QuickErgo({ clientId }) {
  const KEY = "exhome_ergo_" + (clientId || "global");
  const todayKey = new Date().toISOString().split("T")[0];

  const getToday = () => {
    try {
      const r = localStorage.getItem(KEY);
      const d = r ? JSON.parse(r) : {};
      return d[todayKey] || { squat: 0, hinge: 0, fente: 0, log: [] };
    } catch { return { squat: 0, hinge: 0, fente: 0, log: [] }; }
  };

  const [today, setToday] = useState(getToday);
  const [flash, setFlash] = useState(null);

  function tap(geste) {
    const now = new Date();
    const heure = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const next = {
      ...today,
      [geste]: (today[geste] || 0) + 1,
      log: [...(today.log || []), { geste, heure, ts: Date.now() }],
    };
    setToday(next);
    setFlash(geste);
    setTimeout(() => setFlash(null), 500);
    // Persiste
    try {
      const r = localStorage.getItem(KEY);
      const d = r ? JSON.parse(r) : {};
      d[todayKey] = next;
      localStorage.setItem(KEY, JSON.stringify(d));
    } catch {}
  }

  const total = (today.squat || 0) + (today.hinge || 0) + (today.fente || 0);

  const BTN = [
    { id: "squat", emoji: "🦵", label: "Squat",  col: "#C9A84C" },
    { id: "hinge", emoji: "🔄", label: "Hinge",  col: "#6FCF97" },
    { id: "fente", emoji: "🏃", label: "Fente",  col: "#7EC8A0" },
  ];

  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.surface}, ${C.bgMid})`,
      border: `1px solid ${C.gold}40`,
      borderRadius: 14,
      padding: "14px 14px 12px",
      marginBottom: 14,
    }}>
      {/* Titre + total */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.gold, letterSpacing: "0.04em" }}>
            🏠 Ramassage d'objets
          </div>
          <div style={{ fontSize: 10, color: C.textLight, marginTop: 1 }}>
            Tap sur le bon geste — directement !
          </div>
        </div>
        <div style={{ textAlign: "center", background: C.bg, borderRadius: 10, padding: "4px 12px", border: `1px solid ${C.gold}40` }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: C.gold, lineHeight: 1.1 }}>{total}</div>
          <div style={{ fontSize: 9, color: C.textLight }}>aujourd'hui</div>
        </div>
      </div>

      {/* 3 gros boutons côte à côte */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {BTN.map(b => (
          <button key={b.id} onClick={() => tap(b.id)}
            style={{
              border: `2px solid ${flash === b.id ? b.col : C.border}`,
              borderRadius: 12,
              padding: "10px 6px 8px",
              background: flash === b.id
                ? `${b.col}25`
                : C.bg,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              transition: "all 0.15s",
              transform: flash === b.id ? "scale(0.94)" : "scale(1)",
              boxShadow: flash === b.id ? `0 0 12px ${b.col}50` : "none",
              WebkitTapHighlightColor: "transparent",
            }}>
            {/* Emoji grand */}
            <span style={{ fontSize: 26, lineHeight: 1 }}>{b.emoji}</span>
            {/* Compteur */}
            <span style={{ fontSize: 20, fontWeight: 900, color: b.col, lineHeight: 1 }}>
              {today[b.id] || 0}
            </span>
            {/* Label */}
            <span style={{ fontSize: 11, fontWeight: 700, color: b.col, letterSpacing: "0.03em" }}>
              {b.label}
            </span>
          </button>
        ))}
      </div>

      {/* Dernière action */}
      {(today.log || []).length > 0 && (() => {
        const last = today.log[today.log.length - 1];
        const g = BTN.find(x => x.id === last.geste);
        return (
          <div style={{ marginTop: 8, fontSize: 10, color: C.textLight, textAlign: "center" }}>
            Dernier : {g?.emoji} <b style={{ color: g?.col }}>{g?.label}</b> à {last.heure}
          </div>
        );
      })()}
    </div>
  );
}

// ─── ErgoCompteur ──────────────────────────────────────────────────────────
// Compteur de ramassages ergonomiques du quotidien

const GESTES = [
  { id: "squat",  label: "Squat",  emoji: "🦵", desc: "Genoux fléchis, dos droit, poussée par les talons",       couleur: "#C9A84C" },
  { id: "hinge",  label: "Hinge",  emoji: "🔄", desc: "Charnière hanche, dos neutre, ischios actifs",             couleur: "#6FCF97" },
  { id: "fente",  label: "Fente",  emoji: "🏃", desc: "Un genou en avant, l'autre vers le sol, buste droit",      couleur: "#7EC8A0" },
];

function ErgoCompteur({ clientId }) {
  const KEY = "exhome_ergo_" + (clientId || "global");
  const todayKey = new Date().toISOString().split("T")[0];

  const initData = () => {
    try {
      const r = localStorage.getItem(KEY);
      return r ? JSON.parse(r) : {};
    } catch { return {}; }
  };

  const [data, setData] = useState(initData);
  const [anim, setAnim] = useState(null); // id geste animé
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }, [data, KEY]);

  const today = data[todayKey] || { squat: 0, hinge: 0, fente: 0, log: [] };
  const totalJour = (today.squat || 0) + (today.hinge || 0) + (today.fente || 0);

  function enregistrer(geste) {
    const now = new Date();
    const heure = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const newToday = {
      ...today,
      [geste]: (today[geste] || 0) + 1,
      log: [...(today.log || []), { geste, heure, ts: Date.now() }],
    };
    setData(prev => ({ ...prev, [todayKey]: newToday }));
    setAnim(geste);
    setTimeout(() => setAnim(null), 600);
  }

  function resetJour() {
    if (!confirm("Remettre le compteur d'aujourd'hui à zéro ?")) return;
    setData(prev => ({ ...prev, [todayKey]: { squat: 0, hinge: 0, fente: 0, log: [] } }));
  }

  // Calcul semaine
  const semaine = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = d.toISOString().split("T")[0];
    const jour = data[k] || {};
    return {
      label: d.toLocaleDateString("fr-FR", { weekday: "short" }),
      total: (jour.squat || 0) + (jour.hinge || 0) + (jour.fente || 0),
      squat: jour.squat || 0, hinge: jour.hinge || 0, fente: jour.fente || 0,
    };
  }).reverse();

  const maxSem = Math.max(...semaine.map(j => j.total), 1);

  return (
    <div style={{ width: "100%", maxWidth: "100%", overflowX: "hidden", boxSizing: "border-box" }}>

      {/* ── En-tête ── */}
      <div style={{ background: `linear-gradient(135deg, ${C.surface} 0%, ${C.bgMid} 100%)`, borderRadius: 14, padding: "16px", marginBottom: 16, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.gold, letterSpacing: "0.05em" }}>🏠 Compteur Ergoptimisation</div>
            <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>Chaque ramassage compte !</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: C.gold, lineHeight: 1 }}>{totalJour}</div>
            <div style={{ fontSize: 10, color: C.textLight }}>aujourd'hui</div>
          </div>
        </div>

        {/* Barre de progression */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textLight, marginBottom: 4 }}>
            <span>Objectif : 30 ramassages/jour</span>
            <span style={{ color: totalJour >= 30 ? C.success : C.gold, fontWeight: 700 }}>{Math.min(100, Math.round(totalJour / 30 * 100))}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: C.border, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, totalJour / 30 * 100)}%`, background: totalJour >= 30 ? C.success : C.gold, borderRadius: 3, transition: "width 0.4s ease", boxShadow: `0 0 8px ${C.gold}60` }} />
          </div>
        </div>

        {/* Détail par geste */}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {GESTES.map(g => (
            <div key={g.id} style={{ flex: 1, textAlign: "center", background: C.bg, borderRadius: 8, padding: "6px 4px", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 14 }}>{g.emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: g.couleur }}>{today[g.id] || 0}</div>
              <div style={{ fontSize: 9, color: C.textLight }}>{g.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3 boutons d'action ── */}
      <div style={{ fontSize: 11, fontWeight: 700, color: C.textMid, marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        Enregistrer un ramassage
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {GESTES.map(g => (
          <button key={g.id} onClick={() => enregistrer(g.id)}
            style={{
              width: "100%", border: `1.5px solid ${anim === g.id ? g.couleur : C.border}`,
              borderRadius: 12, padding: "14px 16px", background: anim === g.id ? C.surface : C.bgMid,
              cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 14,
              transition: "all 0.2s", transform: anim === g.id ? "scale(0.97)" : "scale(1)",
              boxShadow: anim === g.id ? `0 0 16px ${g.couleur}40` : "none",
            }}>
            {/* Compteur circulaire */}
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.bg, border: `2.5px solid ${g.couleur}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: g.couleur }}>{today[g.id] || 0}</span>
            </div>
            {/* Info geste */}
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 18 }}>{g.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: g.couleur }}>{g.label}</span>
              </div>
              <div style={{ fontSize: 11, color: C.textLight, lineHeight: 1.4 }}>{g.desc}</div>
            </div>
            {/* Bouton + */}
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: g.couleur, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 24, color: C.bg, fontWeight: 900 }}>
              +
            </div>
          </button>
        ))}
      </div>

      {/* ── Graphique semaine ── */}
      <div style={{ background: C.bgMid, borderRadius: 12, padding: 14, marginBottom: 14, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.textMid, marginBottom: 12, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          📈 Cette semaine
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}>
          {semaine.map((j, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              {/* Barres empilées */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: 48, gap: 1 }}>
                {[
                  { val: j.squat,  col: "#C9A84C" },
                  { val: j.hinge,  col: "#6FCF97" },
                  { val: j.fente,  col: "#7EC8A0" },
                ].map((bar, bi) => bar.val > 0 && (
                  <div key={bi} style={{
                    width: "100%",
                    height: `${(bar.val / maxSem) * 44}px`,
                    minHeight: 3,
                    background: bar.col,
                    borderRadius: bi === 0 ? "2px 2px 0 0" : 0,
                    opacity: i === 6 ? 1 : 0.6,
                  }} />
                ))}
                {j.total === 0 && <div style={{ width: "100%", height: 3, background: C.border, borderRadius: 2 }} />}
              </div>
              <div style={{ fontSize: 9, color: i === 6 ? C.gold : C.textLight, fontWeight: i === 6 ? 700 : 400 }}>{j.label}</div>
              {j.total > 0 && <div style={{ fontSize: 9, color: i === 6 ? C.gold : C.textLight, fontWeight: 700 }}>{j.total}</div>}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
          {GESTES.map(g => (
            <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: g.couleur }} />
              <span style={{ fontSize: 10, color: C.textLight }}>{g.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Journal du jour ── */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMid, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            📋 Journal du jour ({(today.log || []).length} actions)
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowDetail(s => !s)}
              style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "4px 10px", background: "transparent", color: C.textLight, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
              {showDetail ? "Masquer" : "Voir tout"}
            </button>
            <button onClick={resetJour}
              style={{ border: `1px solid ${C.dangerLight}`, borderRadius: 8, padding: "4px 10px", background: C.dangerLight, color: C.danger, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
              Reset
            </button>
          </div>
        </div>

        {(today.log || []).length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: C.textLight, fontSize: 12, background: C.bgMid, borderRadius: 10, border: `1px dashed ${C.border}` }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>🏠</div>
            Aucun ramassage enregistré aujourd'hui.<br />
            <span style={{ fontSize: 11 }}>Appuie sur un bouton dès le prochain objet !</span>
          </div>
        ) : (
          <div>
            {/* 5 dernières actions toujours visibles */}
            {(showDetail ? today.log : [...(today.log || [])].slice(-5)).map((entry, i, arr) => {
              const g = GESTES.find(x => x.id === entry.geste);
              return (
                <div key={entry.ts || i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 12px", background: C.bgMid, borderRadius: 8, marginBottom: 4, border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 16 }}>{g?.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: g?.couleur }}>{g?.label}</span>
                  </div>
                  <span style={{ fontSize: 11, color: C.textLight }}>{entry.heure}</span>
                </div>
              );
            })}
            {!showDetail && (today.log || []).length > 5 && (
              <div style={{ textAlign: "center", fontSize: 11, color: C.textLight, padding: "4px" }}>
                + {(today.log || []).length - 5} actions antérieures — appuie sur "Voir tout"
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Bilan ── */}
      {totalJour >= 10 && (
        <div style={{ background: C.successLight, border: `1px solid ${C.success}40`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: C.success, textAlign: "center" }}>
          {totalJour >= 30 ? "🎉 Objectif atteint ! Tu as ergoptimisé 30+ ramassages aujourd'hui !" :
           totalJour >= 20 ? `💪 Excellent ! ${30 - totalJour} ramassages pour atteindre l'objectif.` :
           `✅ Bien ! ${30 - totalJour} ramassages restants pour l'objectif du jour.`}
        </div>
      )}
    </div>
  );
}

function SanteTab({ client, onUpdate, isCoach }) {
  const sante = client.sante || {};
  const mesures = sante.mesures || [];
  const [showAdd, setShowAdd] = useState(false);

  // Form saisie manuelle
  const [date, setDate] = useState(today());
  const [poids, setPoids] = useState("");
  const [calories, setCalories] = useState("");
  const [basale, setBasale] = useState("");
  const [masseGrasse, setMasseGrasse] = useState("");
  const [masseMusc, setMasseMusc] = useState("");
  const [eauCorp, setEauCorp] = useState("");
  const [source, setSource] = useState("manuel");
  const [notes, setNotes] = useState("");

  function ajouterMesure() {
    const m = { id: genId(), date, poids: poids||null, calories: calories||null, basale: basale||null, masseGrasse: masseGrasse||null, masseMusc: masseMusc||null, eauCorp: eauCorp||null, source, notes };
    const newMesures = [...mesures, m].sort((a,b)=>b.date.localeCompare(a.date));
    onUpdate({ ...client, sante: { ...sante, mesures: newMesures } });
    setShowAdd(false); setPoids(""); setCalories(""); setBasale(""); setMasseGrasse(""); setMasseMusc(""); setEauCorp(""); setNotes(""); setDate(today());
  }
  function delMesure(id) { onUpdate({ ...client, sante: { ...sante, mesures: mesures.filter(m=>m.id!==id) } }); }

  // Dernière mesure pour les stats rapides
  const last = mesures[0];
  const avant = mesures[1];
  function delta(key) {
    if (!last?.[key] || !avant?.[key]) return null;
    return (parseFloat(last[key]) - parseFloat(avant[key])).toFixed(1);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ─ Liens apps ── */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>📱 Applications santé connectées</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {APPS_SANTE.map(app => (
            <a key={app.id} href={app.url} target="_blank" rel="noopener noreferrer"
              style={{ textDecoration: "none", display: "block", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = app.couleur + "80"; e.currentTarget.style.background = C.surfaceHover; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{ fontSize: 24 }}>{app.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 700, background: app.couleur + "25", color: app.couleur, padding: "2px 7px", borderRadius: 8 }}>{app.badge}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 3 }}>{app.label}</div>
              <div style={{ fontSize: 11, color: C.textLight, lineHeight: 1.4 }}>{app.description}</div>
              <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                <span style={{ fontSize: 11, color: app.couleur, fontWeight: 600 }}>Ouvrir l'app →</span>
                <a href={app.urlStore} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
                  style={{ fontSize: 11, color: C.textLight, textDecoration: "none" }}>App Store ↗</a>
              </div>
            </a>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: C.textLight, fontStyle: "italic" }}>
          💡 Sur iPhone : appuie sur "Ouvrir l'app" pour basculer directement vers l'application.
        </div>
      </div>

      {/* ─ Stats rapides dernière mesure ── */}
      {last && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>📊 Dernière mesure – {fmt(last.date)}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8 }}>
            {[
              { key: "poids", label: "Poids", unit: "kg", icon: "⚖️", color: C.primary },
              { key: "calories", label: "Calories", unit: "kcal", icon: "🔥", color: C.warning },
              { key: "basale", label: "Métabolisme basal", unit: "kcal", icon: "💤", color: C.accent },
              { key: "masseGrasse", label: "Masse grasse", unit: "%", icon: "📉", color: C.danger },
              { key: "masseMusc", label: "Masse muscu.", unit: "%", icon: "💪", color: C.success },
              { key: "eauCorp", label: "Eau corporelle", unit: "%", icon: "💧", color: "#60C8E8" },
            ].filter(f => last[f.key]).map(f => {
              const d = delta(f.key);
              const dNum = d ? parseFloat(d) : null;
              return (
                <div key={f.key} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, marginBottom: 3 }}>{f.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: f.color }}>{last[f.key]}<span style={{ fontSize: 10, fontWeight: 400 }}>{f.unit}</span></div>
                  <div style={{ fontSize: 10, color: C.textLight }}>{f.label}</div>
                  {dNum !== null && <div style={{ fontSize: 11, fontWeight: 600, marginTop: 3, color: dNum > 0 ? C.danger : C.success }}>{dNum > 0 ? "▲" : "▼"} {Math.abs(dNum)}{f.unit}</div>}
                </div>
              );
            })}
          </div>
          {last.source && <div style={{ marginTop: 6, fontSize: 11, color: C.textLight }}>Source : {last.source === "manuel" ? "✍️ Saisie manuelle" : last.source === "apple" ? "❤️ Apple Santé" : last.source === "withings" ? "⚖️ Withings" : last.source === "tanita" ? "📊 Tanita" : last.source}</div>}
        </div>
      )}

      {/* ─ Balance à impédance (future) ── */}
      <div style={{ background: C.bgMid, border: `1px dashed ${C.gold}50`, borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>⚖️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.gold }}>Balance à impédance – Intégration future</div>
            <div style={{ fontSize: 11, color: C.textLight }}>Withings Body+ · Tanita BC-601 · ou autre</div>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, background: C.gold + "25", color: C.gold, padding: "3px 8px", borderRadius: 8 }}>BIENTÔT</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
          {[
            { icon: "⚖️", label: "Poids total", unit: "kg" },
            { icon: "🫀", label: "Masse grasse", unit: "%" },
            { icon: "💪", label: "Masse musculaire", unit: "%" },
            { icon: "💧", label: "Eau corporelle", unit: "%" },
            { icon: "🦴", label: "Masse osseuse", unit: "kg" },
            { icon: "🔥", label: "Métabolisme basal", unit: "kcal" },
          ].map(m => (
            <div key={m.label} style={{ background: C.surface, borderRadius: 8, padding: "8px 10px", opacity: 0.6 }}>
              <div style={{ fontSize: 14, marginBottom: 2 }}>{m.icon}</div>
              <div style={{ fontSize: 11, color: C.textMid, fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: C.textLight }}>{m.unit}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href="https://apps.apple.com/fr/app/withings-health-mate/id542701020" target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: "none", fontSize: 12, fontWeight: 600, color: "#00A896", background: "#00A89620", padding: "6px 12px", borderRadius: 8 }}>⚖️ Withings App Store →</a>
          <a href="https://apps.apple.com/fr/app/tanita-health-planet/id1490046944" target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: "none", fontSize: 12, fontWeight: 600, color: "#7B68EE", background: "#7B68EE20", padding: "6px 12px", borderRadius: 8 }}>📊 Tanita App Store →</a>
        </div>
      </div>

      {/* ─ Saisie manuelle ── */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMid, letterSpacing: "0.06em", textTransform: "uppercase" }}>✍️ Saisie manuelle des mesures</div>
          {isCoach && <Btn size="sm" onClick={() => setShowAdd(!showAdd)}>{showAdd ? "Annuler" : "+ Nouvelle mesure"}</Btn>}
        </div>

        {showAdd && (
          <div style={{ background: C.bgMid, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Date" value={date} onChange={setDate} type="date" />
              <Sel label="Source" value={source} onChange={setSource} options={[
                { value: "manuel", label: "✍️ Saisie manuelle" },
                { value: "apple", label: "❤️ Apple Santé" },
                { value: "withings", label: "⚖️ Withings" },
                { value: "tanita", label: "📊 Tanita" },
                { value: "myfitnesspal", label: "🥗 MyFitnessPal" },
              ]} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.textMid, marginTop: 4 }}>Mesures corporelles</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              <Input label="⚖️ Poids (kg)" value={poids} onChange={setPoids} type="number" placeholder="70.5" />
              <Input label="🫀 Masse grasse (%)" value={masseGrasse} onChange={setMasseGrasse} type="number" placeholder="22" />
              <Input label="💪 Masse muscu. (%)" value={masseMusc} onChange={setMasseMusc} type="number" placeholder="38" />
              <Input label="💧 Eau corporelle (%)" value={eauCorp} onChange={setEauCorp} type="number" placeholder="55" />
              <Input label="🔥 Calories (kcal)" value={calories} onChange={setCalories} type="number" placeholder="1800" />
              <Input label="💤 Métab. basal (kcal)" value={basale} onChange={setBasale} type="number" placeholder="1500" />
            </div>
            <Textarea label="Notes" value={notes} onChange={setNotes} placeholder="Observations, conditions de mesure…" rows={2} />
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={ajouterMesure} disabled={!date}>Enregistrer la mesure</Btn>
              <Btn variant="ghost" onClick={() => setShowAdd(false)}>Annuler</Btn>
            </div>
          </div>
        )}

        {/* Client : peut aussi saisir ses propres mesures */}
        {!isCoach && !showAdd && (
          <Btn size="sm" onClick={() => setShowAdd(true)} style={{ marginBottom: 12 }}>+ Ajouter une mesure</Btn>
        )}

        {/* Historique mesures */}
        {mesures.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 20px", color: C.textLight, background: C.surface, borderRadius: 10, border: `1px dashed ${C.border}`, fontSize: 13 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📊</div>
            Aucune mesure enregistrée.<br />Ajoute la première pour commencer le suivi.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {mesures.map(m => (
              <div key={m.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>📅 {fmt(m.date)}</span>
                      <span style={{ fontSize: 11, color: C.textLight, background: C.bgMid, padding: "2px 8px", borderRadius: 8 }}>
                        {m.source === "manuel" ? "✍️ Manuel" : m.source === "apple" ? "❤️ Apple" : m.source === "withings" ? "⚖️ Withings" : m.source === "tanita" ? "📊 Tanita" : m.source === "myfitnesspal" ? "🥗 MFP" : m.source}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {m.poids && <span style={{ fontSize: 12, color: C.primary, fontWeight: 600 }}>⚖️ {m.poids} kg</span>}
                      {m.calories && <span style={{ fontSize: 12, color: C.warning, fontWeight: 600 }}>🔥 {m.calories} kcal</span>}
                      {m.basale && <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>💤 {m.basale} kcal base</span>}
                      {m.masseGrasse && <span style={{ fontSize: 12, color: C.danger, fontWeight: 600 }}>🫀 {m.masseGrasse}% graisse</span>}
                      {m.masseMusc && <span style={{ fontSize: 12, color: C.success, fontWeight: 600 }}>💪 {m.masseMusc}% muscu</span>}
                      {m.eauCorp && <span style={{ fontSize: 12, color: "#60C8E8", fontWeight: 600 }}>💧 {m.eauCorp}% eau</span>}
                    </div>
                    {m.notes && <div style={{ marginTop: 5, fontSize: 12, color: C.textLight, fontStyle: "italic" }}>{m.notes}</div>}
                  </div>
                  <button onClick={() => delMesure(m.id)} style={{ border: "none", background: "none", cursor: "pointer", color: C.textLight, fontSize: 14 }}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Vue Client ─────────────────────────────────────────────────────────────
function VueClient({ client, onUpdate, onBack }) {
  const [tab, setTab] = useState("programme");
  const [comment, setComment] = useState({});
  const [openCom, setOpenCom] = useState(null);
  const p = pct(client.programme);
  const prochaine = (client.seances||[]).filter(s=>s.type==="planifiee"&&isUpcoming(s.date)).sort((a,b)=>a.date.localeCompare(b.date))[0];

  function valider(id) {
    onUpdate({...client,programme:(client.programme||[]).map(e=>e.id===id?{...e,clientValide:true,clientDate:today(),clientCommentaire:comment[id]||""}:e)});
    setOpenCom(null);
  }

  return <div style={{maxWidth:680,margin:"0 auto",width:"100%",overflowX:"hidden",boxSizing:"border-box"}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
      <Btn variant="ghost" size="sm" onClick={onBack}>← Retour</Btn>
      <div style={{minWidth:0}}>
        <h2 style={{margin:0,fontSize:18,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{client.nom}</h2>
        <span style={{fontSize:11,color:C.textLight}}>Coach : {client.coach}</span>
      </div>
    </div>

    {prochaine && <div style={{background:C.primaryXLight,border:`1px solid ${C.primary}40`,borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:20}}>📅</span>
      <div>
        <div style={{fontWeight:700,fontSize:12,color:C.primary}}>Prochaine séance</div>
        <div style={{fontSize:12,color:C.textMid}}>{fmt(prochaine.date)}{prochaine.heure?` à ${prochaine.heure}`:""} · {prochaine.duree} min{prochaine.rappel?" · 🔔":""}</div>
      </div>
    </div>}

    <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:14,border:`1px solid ${C.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{fontSize:13,fontWeight:600,color:C.text}}>Ma progression</span>
        <span style={{fontWeight:700,color:p===100?C.success:C.primary}}>{p}%</span>
      </div>
      <Bar value={p}/>
      {p===100 && <div style={{marginTop:8,fontSize:12,color:C.success,fontWeight:600,textAlign:"center"}}>🎉 Programme complété !</div>}
    </div>

    <ProfilClient client={client} onUpdate={()=>{}} readOnly={true}/>

    {/* ── Widget Ramassage ultra-rapide ── */}
    <QuickErgo clientId={client.id}/>

    {/* Onglets scrollables horizontalement */}
    <div style={{overflowX:"auto",overflowY:"visible",marginBottom:16,WebkitOverflowScrolling:"touch"}}>
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,minWidth:"max-content"}}>
        {[{id:"programme",label:"Programme"},{id:"messages",label:"Messages"},{id:"seances",label:"Séances"},{id:"sante",label:"❤️ Santé"},{id:"nutrition",label:"🍽️ Nutrition"},{id:"ergo",label:"🏠 Compteur"}].map(t=>
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 14px",border:"none",background:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",whiteSpace:"nowrap",color:tab===t.id?C.primary:C.textLight,borderBottom:tab===t.id?`2px solid ${C.primary}`:"2px solid transparent",marginBottom:-1}}>{t.label}</button>
        )}
      </div>
    </div>

    {tab==="programme" && <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Bandeau informatif */}
      <div style={{background:C.primaryXLight,border:`1px solid ${C.primary}30`,borderRadius:10,padding:"10px 14px",fontSize:12,color:C.textMid,display:"flex",gap:8,alignItems:"center"}}>
        <span style={{fontSize:16}}>🎯</span>
        <span>Ton coach a sélectionné ces exercices pour toi. <b style={{color:C.primary}}>Valide chaque exercice</b> une fois réalisé et laisse un ressenti si tu le souhaites.</span>
      </div>

      {!(client.programme||[]).length
        ? <div style={{textAlign:"center",padding:"40px 20px",color:C.textLight,background:C.surface,borderRadius:12,border:`1px dashed ${C.border}`}}>
            <div style={{fontSize:28,marginBottom:8}}>⏳</div>
            Ton coach prépare ton programme personnalisé…
          </div>
        : (client.programme||[]).map((exo,i)=><div key={exo.id} style={{border:`1px solid ${exo.clientValide?C.success+"60":C.border}`,borderRadius:12,padding:16,background:C.surface}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:13,fontWeight:700,color:C.textLight}}>#{i+1}</span>
                  <span style={{fontWeight:600,fontSize:14,color:C.text}}>{exo.titre}</span>
                  <CatBadge categorie={exo.categorie}/>
                  {exo.duree>0&&<span style={{fontSize:11,color:C.textLight}}>⏱ {exo.duree} min</span>}
                  {exo.coachValide&&<span style={{fontSize:11,color:C.success}}>✓ Coach</span>}
                </div>
                {exo.description&&<p style={{fontSize:13,color:C.textMid,margin:0,lineHeight:1.6}}>{exo.description}</p>}
                {/* Chrono côté client */}
                {exo.duree > 0 && !exo.clientValide && (
                  <div style={{marginTop:8}}>
                    <Minuteur key={exo.id+"-client"} dureeMin={exo.duree}/>
                  </div>
                )}
              </div>
              {/* Validation uniquement — pas de suppression */}
              <div style={{flexShrink:0}}>
                {exo.clientValide
                  ? <div style={{textAlign:"center"}}>
                      <div style={{fontSize:22}}>✅</div>
                      <div style={{fontSize:10,color:C.success}}>{fmt(exo.clientDate)}</div>
                    </div>
                  : <Btn size="sm" variant="success" onClick={()=>setOpenCom(openCom===exo.id?null:exo.id)}>Marquer fait ✓</Btn>}
              </div>
            </div>
            {exo.clientValide&&exo.clientCommentaire&&<div style={{marginTop:10,fontSize:13,color:C.textMid,background:C.successLight,padding:"8px 12px",borderRadius:8,fontStyle:"italic"}}>« {exo.clientCommentaire} »</div>}
            {exo.coachNote&&<div style={{marginTop:8,fontSize:12,color:C.primary,background:C.primaryXLight,padding:"8px 12px",borderRadius:8}}>💬 Note de ton coach : {exo.coachNote}</div>}
            {openCom===exo.id&&<div style={{marginTop:12,display:"flex",flexDirection:"column",gap:8}}>
              <textarea value={comment[exo.id]||""} onChange={e=>setComment({...comment,[exo.id]:e.target.value})} placeholder="Optionnel : ton ressenti sur cet exercice…" rows={2}
                style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",fontSize:13,fontFamily:"inherit",outline:"none",resize:"none",background:C.bgMid,color:C.text}}/>
              <div style={{display:"flex",gap:8}}>
                <Btn size="sm" onClick={()=>valider(exo.id)}>✅ Confirmer</Btn>
                <Btn size="sm" variant="ghost" onClick={()=>setOpenCom(null)}>Annuler</Btn>
              </div>
            </div>}
          </div>)
      }
    </div>}
    {tab==="messages"&&<Messagerie client={client} onUpdate={onUpdate} isCoach={false}/>}
    {tab==="seances" &&<Seances client={client} onUpdate={onUpdate} isCoach={false}/>}
    {tab==="sante"   &&<SanteTab client={client} onUpdate={onUpdate} isCoach={false}/>}
    {tab==="nutrition" &&<NutritionView clientId={client.id}/>}
    {tab==="ergo"    &&<ErgoCompteur clientId={client.id}/>}
  </div>;
}

// ─── App ───────────────────────────────────────────────────────────────────
// Supabase config
const SUPA_URL = "https://tsvsoormwryatcouztrb.supabase.co";
const SUPA_KEY = "sb_publishable_2R9upMmavIi5fQyGgEEmYA_jLKDNrHk";

async function supaLoad() {
  try {
    const r = await fetch(`${SUPA_URL}/rest/v1/exhome_data?id=eq.1&select=payload`, {
      headers: { "apikey": SUPA_KEY, "Authorization": `Bearer ${SUPA_KEY}` }
    });
    const rows = await r.json();
    if (rows && rows[0]) return JSON.parse(rows[0].payload);
  } catch(e) { console.warn("Supabase load error:", e); }
  return null;
}

async function supaSave(payload) {
  try {
    await fetch(`${SUPA_URL}/rest/v1/exhome_data?id=eq.1`, {
      method: "PATCH",
      headers: {
        "apikey": SUPA_KEY,
        "Authorization": `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ payload: JSON.stringify(payload), updated_at: new Date().toISOString() })
    });
  } catch(e) { console.warn("Supabase save error:", e); }
}

// ─── Codes d'accès ─────────────────────────────────────────────────────────
const USERS = {
  "aude":    { password: "exhome2026",  role: "coach",  nom: "Aude",    couleur: "#C9A84C" },
  "sylvain": { password: "exhome2026",  role: "coach",  nom: "Sylvain", couleur: "#6FCF97" },
  "client":  { password: "client2026",  role: "client", nom: "Client",  couleur: "#7EC8A0" },
};

function LoginScreen({ onLogin }) {
  const [identifiant, setIdentifiant] = useState("");
  const [mdp, setMdp] = useState("");
  const [erreur, setErreur] = useState("");
  const [shake, setShake] = useState(false);

  function valider() {
    const id = identifiant.trim().toLowerCase();
    const user = USERS[id];
    if (user && mdp === user.password) {
      onLogin({ ...user, identifiant: id });
    } else {
      setErreur("Identifiant ou mot de passe incorrect");
      setShake(true);
      setTimeout(() => { setShake(false); setErreur(""); }, 2000);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F2820 0%, #1B4D3E 60%, #0F2820 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: 20,
    }}>
      <style>{`
        @keyframes shakeanim {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-10px)}
          40%{transform:translateX(10px)}
          60%{transform:translateX(-8px)}
          80%{transform:translateX(8px)}
        }
        @keyframes fadein {
          from{opacity:0;transform:translateY(24px)}
          to{opacity:1;transform:translateY(0)}
        }
        .login-input:focus {
          border-color: #C9A84C !important;
          outline: none;
        }
        .login-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .login-btn:active { transform: translateY(0); }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 380, textAlign: "center",
        animation: shake ? "shakeanim 0.4s ease-in-out" : "fadein 0.7s ease",
      }}>

        {/* Logo */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            fontSize: 50, fontWeight: 900, color: "#C9A84C",
            letterSpacing: "0.1em", lineHeight: 1,
          }}>EX HOME</div>
          <div style={{
            fontSize: 11, color: "#5A8A68",
            letterSpacing: "0.28em", textTransform: "uppercase", marginTop: 8,
          }}>ERGO · OPTIMISATION · MOUVEMENT</div>
        </div>

        {/* Carte */}
        <div style={{
          background: "rgba(11, 30, 20, 0.85)",
          backdropFilter: "blur(12px)",
          borderRadius: 24, padding: "36px 32px 32px",
          border: `1.5px solid ${erreur ? "#E07060" : "#2A6048"}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          transition: "border-color 0.3s",
        }}>

          <div style={{ fontSize: 18, fontWeight: 700, color: "#F5F0E8", marginBottom: 6 }}>
            Connexion
          </div>
          <div style={{ fontSize: 12, color: "#5A8A68", marginBottom: 28 }}>
            Accès réservé aux membres Ex Home
          </div>

          {/* Identifiant */}
          <div style={{ textAlign: "left", marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 7 }}>
              Identifiant
            </label>
            <input
              className="login-input"
              type="text"
              value={identifiant}
              onChange={e => setIdentifiant(e.target.value)}
              onKeyDown={e => e.key === "Enter" && valider()}
              placeholder="Votre identifiant"
              autoFocus
              autoCapitalize="none"
              style={{
                width: "100%", padding: "13px 16px",
                background: "rgba(15,40,32,0.8)",
                border: "1.5px solid #2A6048",
                borderRadius: 12, fontSize: 15,
                color: "#F5F0E8", fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          {/* Mot de passe */}
          <div style={{ textAlign: "left", marginBottom: 24 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 7 }}>
              Mot de passe
            </label>
            <input
              className="login-input"
              type="password"
              value={mdp}
              onChange={e => setMdp(e.target.value)}
              onKeyDown={e => e.key === "Enter" && valider()}
              placeholder="Votre mot de passe"
              style={{
                width: "100%", padding: "13px 16px",
                background: "rgba(15,40,32,0.8)",
                border: "1.5px solid #2A6048",
                borderRadius: 12, fontSize: 15,
                color: "#F5F0E8", fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          {/* Message erreur */}
          {erreur && (
            <div style={{
              fontSize: 12, color: "#E07060", marginBottom: 16,
              background: "rgba(224,112,96,0.12)", borderRadius: 8,
              padding: "8px 12px", border: "1px solid rgba(224,112,96,0.3)",
            }}>
              ⚠️ {erreur}
            </div>
          )}

          {/* Bouton Se connecter */}
          <button
            className="login-btn"
            onClick={valider}
            style={{
              width: "100%", padding: "15px",
              background: "linear-gradient(135deg, #C9A84C 0%, #E8D08A 50%, #C9A84C 100%)",
              border: "none", borderRadius: 12,
              fontSize: 14, fontWeight: 800,
              color: "#0F2820", cursor: "pointer",
              fontFamily: "inherit", letterSpacing: "0.08em",
              textTransform: "uppercase",
              boxShadow: "0 4px 20px rgba(201,168,76,0.35)",
              transition: "opacity 0.2s, transform 0.15s",
            }}
          >
            Se connecter →
          </button>
        </div>

        {/* Pied */}
        <div style={{ marginTop: 24, fontSize: 11, color: "#2A6048" }}>
          Application privée · Ex Home 2026 · Confidentiel
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('exhome_session')) || null; } catch { return null; }
  });

  function login(s) {
    sessionStorage.setItem('exhome_session', JSON.stringify(s));
    setSession(s);
  }

  if (!session) return <LoginScreen onLogin={login} />;

  function logout() {
    sessionStorage.removeItem('exhome_session');
    setSession(null);
  }
  return <AppMain session={session} onLogout={logout} />;
}

function AppMain({ session, onLogout }) {
  const [data, setData] = useState(() => {
    try { const r = localStorage.getItem('exhome_v5'); return r ? JSON.parse(r) : DEMO; } catch { return DEMO; }
  });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState("");
  const [fCoach, setFCoach] = useState("all");
  const [fStatut, setFStatut] = useState("all");
  const [activeTab, setActiveTab] = useState("coach");
  const saveTimer = useRef(null);

  // Chargement initial depuis Supabase
  useEffect(() => {
    supaLoad().then(remote => {
      if (remote) {
        setData(remote);
        localStorage.setItem('exhome_v5', JSON.stringify(remote));
      }
      setLoading(false);
    });
  }, []);

  // Sauvegarde avec debounce 1.5s — localStorage + Supabase
  useEffect(() => {
    if (loading) return;
    try { localStorage.setItem('exhome_v5', JSON.stringify(data)); } catch {}
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { supaSave(data); }, 1500);
    return () => clearTimeout(saveTimer.current);
  }, [data, loading]);

  // Sync temps réel via polling toutes les 15s
  useEffect(() => {
    const interval = setInterval(() => {
      supaLoad().then(remote => {
        if (!remote) return;
        const localStr = JSON.stringify(data);
        const remoteStr = JSON.stringify(remote);
        if (localStr !== remoteStr) {
          setData(remote);
          localStorage.setItem('exhome_v5', JSON.stringify(remote));
        }
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [data]);

  function upd(updated) { setData(d=>({...d,clients:d.clients.map(c=>c.id===updated.id?updated:c)})); }
  function add(c) { setData(d=>({...d,clients:[...d.clients,c]})); setShowNew(false); }
  function del(id) { if(!confirm("Supprimer ce dossier ?")) return; setData(d=>({...d,clients:d.clients.filter(c=>c.id!==id)})); }

  // Écran de chargement pendant la sync Supabase
  if (loading) return (
    <div style={{minHeight:"100vh",background:"#0F2820",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <div style={{fontSize:36,fontWeight:900,color:"#C9A84C",letterSpacing:"0.1em"}}>EX HOME</div>
      <div style={{fontSize:11,color:"#5A8A68",letterSpacing:"0.2em",textTransform:"uppercase"}}>Synchronisation en cours…</div>
      <div style={{width:200,height:4,background:"#1B4D3E",borderRadius:2,overflow:"hidden"}}>
        <div style={{height:"100%",background:"#C9A84C",borderRadius:2,animation:"spin 1.5s ease-in-out infinite",width:"60%"}}/>
      </div>
    </div>
  );

  const sel = data.clients.find(c=>c.id===selectedId);

  const rappels = [];
  data.clients.forEach(c=>{ (c.seances||[]).filter(s=>s.type==="planifiee"&&s.rappel&&isSoon(s.date)&&isUpcoming(s.date)).forEach(s=>rappels.push({...s,clientNom:c.nom})); });

  const filtered = data.clients.filter(c=>{
    const q=search.toLowerCase();
    return (!q||c.nom.toLowerCase().includes(q)||c.email?.toLowerCase().includes(q))&&(fCoach==="all"||c.coach===fCoach)&&(fStatut==="all"||c.statut===fStatut);
  });

  const stats = {
    total: data.clients.length,
    enCours: data.clients.filter(c=>c.statut==="en-cours").length,
    valides: data.clients.filter(c=>c.statut==="valide").length,
    attente: data.clients.reduce((a,c)=>a+(c.programme||[]).filter(e=>e.clientValide&&!e.coachValide).length,0),
    planif: data.clients.reduce((a,c)=>a+(c.seances||[]).filter(s=>s.type==="planifiee"&&isUpcoming(s.date)).length,0),
  };

  if (view==="dossier"&&sel) return (
    <div style={{minHeight:"100vh",background:C.bg,padding:"24px 16px"}}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} view={view} setView={setView} rappels={rappels} session={session} onLogout={onLogout}/>
      {activeTab==="coach"
        ? <DossierView client={sel} onUpdate={upd} onBack={()=>setView("dashboard")}/>
        : <VueClient client={sel} onUpdate={upd} onBack={()=>setView("dashboard")}/>}
    </div>
  );

  if (view==="planning") return (
    <div style={{minHeight:"100vh",background:C.bg,padding:"24px 16px"}}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} view={view} setView={setView} rappels={rappels} session={session} onLogout={onLogout}/>
      <Planning clients={data.clients} onUpdateClient={upd}/>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg,padding:"24px 16px"}}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} view={view} setView={setView} rappels={rappels} session={session} onLogout={onLogout}/>
      <div style={{maxWidth:900,margin:"0 auto"}}>

        {rappels.length>0 && <div style={{background:C.warningLight,border:`1px solid ${C.warning}50`,borderRadius:12,padding:"12px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <span style={{fontSize:20}}>🔔</span>
          <div style={{flex:1}}><span style={{fontWeight:700,color:C.warning,fontSize:13}}>Rappels : </span>
            <span style={{fontSize:13,color:C.textMid}}>{rappels.map(r=>`${r.clientNom} – ${fmt(r.date)}${r.heure?` à ${r.heure}`:""}`).join(" · ")}</span>
          </div>
          <Btn size="sm" variant="ghost" onClick={()=>setView("planning")}>Voir le planning</Btn>
        </div>}

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:24}}>
          {[
            {label:"Dossiers",value:stats.total,icon:"📁",color:C.primary},
            {label:"En cours",value:stats.enCours,icon:"🔄",color:C.warning},
            {label:"Terminés",value:stats.valides,icon:"🏁",color:C.success},
            {label:"À valider",value:stats.attente,icon:"⏳",color:C.accent},
            {label:"Séances planif.",value:stats.planif,icon:"📅",color:C.gold},
          ].map(s=><div key={s.label} style={{background:C.surface,borderRadius:12,padding:"14px 16px",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:20,marginBottom:4}}>{s.icon}</div>
            <div style={{fontSize:24,fontWeight:700,color:s.color}}>{s.value}</div>
            <div style={{fontSize:11,color:C.textLight}}>{s.label}</div>
          </div>)}
        </div>

        {/* Filtres */}
        <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher un client…"
            style={{flex:1,minWidth:200,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 14px",fontSize:14,color:C.text,background:C.surface,outline:"none",fontFamily:"inherit"}}/>
          <select value={fCoach} onChange={e=>setFCoach(e.target.value)} style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,color:C.text,background:C.surface,fontFamily:"inherit"}}>
            <option value="all">Tous les coachs</option>
            {COACHES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <select value={fStatut} onChange={e=>setFStatut(e.target.value)} style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,color:C.text,background:C.surface,fontFamily:"inherit"}}>
            <option value="all">Tous les statuts</option>
            {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
          </select>
          <Btn onClick={()=>setShowNew(true)}>+ Nouveau client</Btn>
        </div>

        {/* Liste */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.length===0
            ? <div style={{textAlign:"center",padding:"60px 20px",color:C.textLight,background:C.surface,borderRadius:14,border:`1px dashed ${C.border}`}}>
                <div style={{fontSize:36,marginBottom:12}}>📂</div>Aucun dossier trouvé.<br/>
                <Btn style={{marginTop:14}} onClick={()=>setShowNew(true)}>Créer un dossier client</Btn>
              </div>
            : filtered.map(client=>{
                const p2=pct(client.programme||[]);
                const pending=(client.programme||[]).filter(e=>e.clientValide&&!e.coachValide).length;
                const msgs2=(client.messages||[]).filter(m=>m.role==="client").length;
                const planif2=(client.seances||[]).filter(s=>s.type==="planifiee"&&isUpcoming(s.date));
                return <div key={client.id} style={{background:C.surface,borderRadius:12,padding:"16px 20px",border:`1px solid ${C.border}`,cursor:"pointer",transition:"all 0.15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.primary+"60";e.currentTarget.style.background=C.surfaceHover;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}
                  onClick={()=>{setSelectedId(client.id);setView("dossier");}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                        <span style={{fontWeight:700,fontSize:15,color:C.text}}>{client.nom}</span>
                        <Badge status={client.statut}/>
                        {pending>0&&<span style={{fontSize:11,fontWeight:600,background:C.accentLight,color:C.accent,padding:"2px 8px",borderRadius:10}}>⏳ {pending} à valider</span>}
                        {msgs2>0&&<span style={{fontSize:11,fontWeight:600,background:C.primaryXLight,color:C.primary,padding:"2px 8px",borderRadius:10}}>💬 {msgs2}</span>}
                        {planif2.length>0&&<span style={{fontSize:11,fontWeight:600,background:C.warningLight,color:C.warning,padding:"2px 8px",borderRadius:10}}>📅 {planif2.length}</span>}
                      </div>
                      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                        <span style={{fontSize:12,color:C.textLight}}>Coach : {client.coach}</span>
                        <span style={{fontSize:12,color:C.textLight}}>{(client.programme||[]).length} exercice{(client.programme||[]).length>1?"s":""}</span>
                        <span style={{fontSize:12,color:C.textLight}}>Depuis le {fmt(client.dateDebut)}</span>
                        {planif2[0]&&<span style={{fontSize:12,color:C.warning}}>Prochaine : {fmt(planif2[0].date)}{planif2[0].heure?` à ${planif2[0].heure}`:""}</span>}
                      </div>
                      <div style={{marginTop:10,display:"flex",alignItems:"center",gap:10}}>
                        <div style={{flex:1,maxWidth:220}}><Bar value={p2}/></div>
                        <span style={{fontSize:12,fontWeight:600,color:p2===100?C.success:C.primary}}>{p2}%</span>
                      </div>
                    </div>
                    <button onClick={e=>{e.stopPropagation();del(client.id);}} style={{border:"none",background:"none",cursor:"pointer",fontSize:16,color:C.textLight,padding:4}}>🗑</button>
                  </div>
                </div>;
              })}
        </div>
      </div>

      {showNew && <Modal title="Nouveau client" onClose={()=>setShowNew(false)}>
        <NouveauClient onSave={add} onClose={()=>setShowNew(false)}/>
      </Modal>}
    </div>
  );
}

function NouveauClient({onSave,onClose}) {
  const [nom,setNom]=useState(""); const [email,setEmail]=useState(""); const [coach,setCoach]=useState("Aude");
  const [objectif,setObjectif]=useState(""); const [niveau,setNiveau]=useState("debutant");
  const [frequence,setFrequence]=useState("2x/semaine"); const [contraintes,setContraintes]=useState("");
  function save() {
    if(!nom.trim()) return;
    onSave({id:genId(),nom,email,coach,dateDebut:today(),statut:"nouveau",objectif,profil:{niveau,frequence,contraintes},programme:[],messages:[],seances:[]});
  }
  return <div style={{display:"flex",flexDirection:"column",gap:16}}>
    <Input label="Nom complet *" value={nom} onChange={setNom} placeholder="Prénom Nom"/>
    <Input label="Email" value={email} onChange={setEmail} type="email"/>
    <Sel label="Coach référent" value={coach} onChange={setCoach} options={COACHES.map(c=>({value:c,label:c}))}/>
    <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14}}>
      <div style={{fontSize:12,fontWeight:700,color:C.textMid,marginBottom:12,textTransform:"uppercase"}}>Profil client</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <Sel label="Niveau" value={niveau} onChange={setNiveau} options={[{value:"debutant",label:"🌱 Débutant"},{value:"intermediaire",label:"🔥 Intermédiaire"},{value:"avance",label:"⚡ Avancé"}]}/>
        <Sel label="Fréquence" value={frequence} onChange={setFrequence} options={[{value:"1x/semaine",label:"1x / semaine"},{value:"2x/semaine",label:"2x / semaine"},{value:"3x/semaine",label:"3x / semaine"},{value:"quotidien",label:"Quotidien"}]}/>
      </div>
      <Input label="Contraintes physiques" value={contraintes} onChange={setContraintes} placeholder="Ex : Lombaires fragiles…"/>
    </div>
    <Textarea label="Objectif principal" value={objectif} onChange={setObjectif} placeholder="Ce que le client souhaite améliorer…" rows={2}/>
    <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
      <Btn variant="ghost" onClick={onClose}>Annuler</Btn>
      <Btn onClick={save} disabled={!nom.trim()}>Créer le dossier</Btn>
    </div>
  </div>;
}


// ─── Module Nutrition ──────────────────────────────────────────────────────

function NutritionView({ clientId }) {
  const storageKey = "exhome_nutrition_" + (clientId || "global");
  const initJournal = () => {
    try { const r = localStorage.getItem(storageKey); return r ? JSON.parse(r) : { "Petit-déjeuner":[], "Déjeuner":[], "Dîner":[], "Collation":[] }; } catch { return { "Petit-déjeuner":[], "Déjeuner":[], "Dîner":[], "Collation":[] }; }
  };
  const [subTab, setSubTab] = useState("journal");
  const [modal, setModal] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState("Déjeuner");
  const [journal, setJournal] = useState(initJournal);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(journal)); } catch {}
  }, [journal, storageKey]);

  const allFoods = Object.values(journal).flat();
  const totalKcal = allFoods.reduce((s,f)=>s+f.kcal,0);
  const totalP = allFoods.reduce((s,f)=>s+(f.p||0),0);
  const totalG = allFoods.reduce((s,f)=>s+(f.g||0),0);
  const totalL = allFoods.reduce((s,f)=>s+(f.l||0),0);
  const pctGoal = Math.min(100, Math.round((totalKcal/GOAL_KCAL)*100));

  function addFood(meal, food) {
    setJournal(prev => ({...prev,[meal]:[...prev[meal],{...food,id:genId()}]}));
    setModal(null);
  }
  function removeFood(meal, id) {
    setJournal(prev => ({...prev,[meal]:prev[meal].filter(f=>f.id!==id)}));
  }

  const subBtn = (active) => ({
    padding:"7px 10px", border:"none", borderRadius:8, cursor:"pointer",
    fontSize:11, fontWeight:600, fontFamily:"inherit",
    background: active ? C.gold : "transparent",
    color: active ? C.bg : C.textMid, transition:"all 0.15s", flex:1,
    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
  });

  return (
    <div style={{width:"100%", maxWidth:"100%", overflowX:"hidden", boxSizing:"border-box"}}>
      {/* Sub tabs */}
      <div style={{display:"flex",gap:3,background:C.bgMid,borderRadius:10,padding:3,marginBottom:14,width:"100%"}}>
        {[["journal","📋 Journal"],["ajouter","＋ Ajouter"],["historique","📈 Historique"]].map(([k,lbl])=>
          <button key={k} style={subBtn(subTab===k)} onClick={()=>setSubTab(k)}>{lbl}</button>
        )}
      </div>

      {subTab==="journal" && <>
        {/* Stats — 2x2 sur mobile pour éviter débordement */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14}}>
          {[[totalKcal,"kcal",C.gold],[Math.round(totalP)+"g","Protéines",C.primary],[Math.round(totalG)+"g","Glucides",C.warning],[Math.round(totalL)+"g","Lipides",C.accent]].map(([v,l,col])=>
            <div key={l} style={{background:C.bgMid,borderRadius:10,padding:"10px 8px",textAlign:"center",border:`1px solid ${C.border}`}}>
              <div style={{fontSize:18,fontWeight:800,color:col}}>{v}</div>
              <div style={{fontSize:9,color:C.textLight,letterSpacing:"0.06em",textTransform:"uppercase",marginTop:2}}>{l}</div>
            </div>
          )}
        </div>

        {/* Progress */}
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,flexWrap:"wrap",gap:4}}>
            <span style={{fontSize:11,fontWeight:600,color:C.text}}>Objectif journalier</span>
            <span style={{fontSize:11,color:C.gold,fontWeight:600}}>{pctGoal}% — {GOAL_KCAL-totalKcal>0?`${GOAL_KCAL-totalKcal} kcal restantes`:"✓ Atteint"}</span>
          </div>
          <Bar value={pctGoal}/>
        </div>

        {/* Meals */}
        {MEALS_LIST.map(meal => (
          <div key={meal} style={{marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:C.gold,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>
              {meal} — {journal[meal].reduce((s,f)=>s+f.kcal,0)} kcal
            </div>
            {journal[meal].length===0
              ? <div style={{background:C.bgMid,borderRadius:8,padding:"8px 12px",textAlign:"center",fontSize:11,color:C.textLight}}>Aucun aliment</div>
              : journal[meal].map(f=>(
                <div key={f.id} style={{background:C.surface,borderRadius:8,padding:"8px 10px",marginBottom:4,display:"flex",alignItems:"center",gap:8,border:`1px solid ${C.border}`,minWidth:0}}>
                  <span style={{fontSize:18,flexShrink:0}}>{f.emoji||getFoodEmoji(f.name)}</span>
                  <div style={{flex:1,minWidth:0,overflow:"hidden"}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{f.name}</div>
                    <div style={{fontSize:10,color:C.textLight}}>{f.qty}</div>
                  </div>
                  <div style={{fontSize:13,fontWeight:800,color:C.primary,flexShrink:0}}>{f.kcal}<span style={{fontSize:9,color:C.textLight,fontWeight:400}}> kcal</span></div>
                  <button onClick={()=>removeFood(meal,f.id)} style={{border:"none",background:"none",cursor:"pointer",color:C.textLight,fontSize:14,flexShrink:0,padding:"2px"}}>✕</button>
                </div>
              ))
            }
          </div>
        ))}
      </>}

      {subTab==="ajouter" && <>
        <Sel label="Repas" value={selectedMeal} onChange={setSelectedMeal} options={MEALS_LIST.map(m=>({value:m,label:m}))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
          {[["📸","Photo IA","photo"],["📦","Code-barre","scan"],["✏️","Manuel","manual"]].map(([icon,lbl,id])=>
            <button key={id} onClick={()=>setModal(id)}
              style={{padding:"12px 6px",border:`1.5px solid ${C.border}`,borderRadius:10,background:C.surface,color:C.text,fontFamily:"inherit",fontSize:10,fontWeight:600,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
              <span style={{fontSize:22}}>{icon}</span>
              <span style={{textTransform:"uppercase",letterSpacing:"0.04em",textAlign:"center"}}>{lbl}</span>
            </button>
          )}
        </div>
        <div style={{background:C.bgMid,borderRadius:10,padding:12,fontSize:11,color:C.textMid,lineHeight:1.7}}>
          <b style={{color:C.text}}>📸 Photo IA</b> — Photo de votre assiette, l'IA calcule les calories.<br/>
          <b style={{color:C.text}}>📦 Code-barre</b> — Code produit → données nutritionnelles.<br/>
          <b style={{color:C.text}}>✏️ Manuel</b> — Saisie directe nom et valeurs.
        </div>
      </>}

      {subTab==="historique" && <>
        <div style={{background:C.bgMid,borderRadius:10,padding:"10px 14px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",border:`1px solid ${C.border}`}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:C.text}}>Aujourd'hui</div>
            <div style={{fontSize:10,color:C.textLight}}>{allFoods.length} aliments</div>
          </div>
          <div style={{fontSize:18,fontWeight:800,color:C.gold}}>{totalKcal} <span style={{fontSize:10,color:C.textLight,fontWeight:400}}>kcal</span></div>
        </div>
        <div style={{textAlign:"center",padding:"24px 16px",color:C.textLight,fontSize:12}}>
          <div style={{fontSize:24,marginBottom:6}}>📈</div>
          Historique disponible prochainement.
        </div>
      </>}

      {/* Modals nutrition */}
      {modal==="photo"  && <NutriPhotoModal  meal={selectedMeal} onAdd={f=>addFood(selectedMeal,f)} onClose={()=>setModal(null)}/>}
      {modal==="scan"   && <NutriScanModal   meal={selectedMeal} onAdd={f=>addFood(selectedMeal,f)} onClose={()=>setModal(null)}/>}
      {modal==="manual" && <NutriManualModal meal={selectedMeal} onAdd={f=>addFood(selectedMeal,f)} onClose={()=>setModal(null)}/>}
    </div>
  );
}

function NutriModal({title, onClose, children}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:2000,display:"flex",alignItems:"flex-end"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:C.bgMid,width:"100%",borderRadius:"20px 20px 0 0",padding:"24px 20px 40px",maxHeight:"85vh",overflowY:"auto",border:`1px solid ${C.borderLight}`}}>
        <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 20px"}}/>
        <div style={{fontWeight:700,fontSize:18,color:C.text,textAlign:"center",marginBottom:18}}>{title}</div>
        {children}
      </div>
    </div>
  );
}

function NutriPhotoModal({meal, onAdd, onClose}) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [checked, setChecked] = useState({});
  const [error, setError] = useState(null);
  const fileRef = useRef();

  function handleFile(e) {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImage(ev.target.result);
    reader.readAsDataURL(file);
    setResults(null); setError(null);
  }

  async function analyzePhoto() {
    if(!image) return;
    setLoading(true); setError(null);
    await new Promise(r=>setTimeout(r,600));
    setError("⚠️ Analyse IA indisponible en mode fichier local. Utilisez la saisie manuelle ✏️");
    setLoading(false);
  }

  function addSelected() {
    results.filter((_,i)=>checked[i]).forEach(item=>onAdd({...item,emoji:getFoodEmoji(item.name)}));
  }

  const selCount = Object.values(checked).filter(Boolean).length;

  return <NutriModal title="📸 Analyser une photo" onClose={onClose}>
    <div onClick={()=>!image&&fileRef.current.click()} style={{background:C.bg,borderRadius:14,overflow:"hidden",minHeight:200,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",marginBottom:16,border:`1px dashed ${C.border}`}}>
      {image ? <img src={image} alt="repas" style={{width:"100%",borderRadius:14}}/> :
        <div style={{textAlign:"center",color:C.textLight,padding:30}}>
          <div style={{fontSize:48,marginBottom:8}}>📷</div>
          <div style={{fontSize:13}}>Appuyer pour choisir une photo</div>
        </div>}
    </div>
    <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={handleFile}/>
    {image && !results && !loading && <>
      <Btn variant="gold" onClick={analyzePhoto}>Analyser avec l'IA</Btn>
      <Btn variant="ghost" onClick={()=>{setImage(null);fileRef.current.click();}}>Changer de photo</Btn>
    </>}
    {loading && <div style={{textAlign:"center",padding:16}}>
      <div style={{width:32,height:32,border:`3px solid ${C.border}`,borderTopColor:C.gold,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px"}}/>
      <div style={{fontSize:13,color:C.textMid}}>Analyse en cours…</div>
    </div>}
    {error && <div style={{color:C.danger,fontSize:13,textAlign:"center",marginBottom:12}}>{error}</div>}
    {results && <>
      {results.length===0 ? <div style={{color:C.textMid,textAlign:"center",fontSize:13}}>⚠️ Aucun aliment détecté</div> : <>
        <div style={{background:C.bg,borderRadius:12,border:`1px solid ${C.gold}40`,padding:14,marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:C.gold,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.08em"}}>✨ {results.length} aliment{results.length>1?"s":""} détecté{results.length>1?"s":""}</div>
          {results.map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<results.length-1?`1px solid ${C.border}`:"none"}}>
              <div onClick={()=>setChecked(prev=>({...prev,[i]:!prev[i]}))}
                style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${C.gold}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:checked[i]?C.gold:"transparent",color:"white",fontSize:12,flexShrink:0}}>
                {checked[i]?"✓":""}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,color:C.text,fontWeight:600}}>{item.name}</div>
                <div style={{fontSize:11,color:C.textLight}}>{item.qty}</div>
              </div>
              <div style={{fontSize:14,fontWeight:700,color:C.primary}}>{item.kcal} kcal</div>
            </div>
          ))}
        </div>
        <Btn onClick={addSelected} disabled={selCount===0}>Ajouter au {meal} ({selCount} sélectionné{selCount>1?"s":""})</Btn>
      </>}
      <Btn variant="ghost" onClick={()=>{setResults(null);setImage(null);}}>Nouvelle photo</Btn>
    </>}
    {!image && <Btn variant="ghost" onClick={onClose}>Annuler</Btn>}
  </NutriModal>;
}

function NutriScanModal({meal, onAdd, onClose}) {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  async function fetchProduct(code) {
    if(!code||code.length<8) return;
    setLoading(true); setError(null); setProduct(null);
    await new Promise(r=>setTimeout(r,400));
    // En mode fichier local, le scan code-barre réseau est bloqué par le navigateur
    setError("⚠️ Scan indisponible en mode local. Utilisez la saisie manuelle ✏️ à la place.");
    setLoading(false);
  }

  return <NutriModal title="📦 Scanner un produit" onClose={onClose}>
    <div style={{border:`2px dashed ${C.gold}50`,borderRadius:14,padding:24,textAlign:"center",marginBottom:16}}>
      <div style={{fontSize:36,marginBottom:6}}>|||||||</div>
      <div style={{fontSize:12,color:C.textLight}}>Saisissez le code-barre du produit (8 à 13 chiffres)</div>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <input value={barcode} onChange={e=>setBarcode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fetchProduct(barcode)}
        placeholder="Ex : 3017620422003" type="number"
        style={{flex:1,padding:"10px 14px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:14,color:C.text,background:C.bg,outline:"none",fontFamily:"inherit"}}/>
      <Btn onClick={()=>fetchProduct(barcode)}>🔍</Btn>
    </div>
    {loading && <div style={{textAlign:"center",color:C.textMid,fontSize:13,padding:12}}>Recherche…</div>}
    {error && <div style={{color:C.danger,fontSize:13,textAlign:"center",marginBottom:12}}>{error}</div>}
    {product && <>
      <div style={{background:C.bg,borderRadius:12,border:`1px solid ${C.gold}40`,padding:16,marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:2}}>{product.name}</div>
        {product.brand&&<div style={{fontSize:12,color:C.textLight,marginBottom:12}}>{product.brand}</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,textAlign:"center"}}>
          {[[product.kcal,"kcal",C.gold],[product.p+"g","Prot.",C.primary],[product.g+"g","Gluc.",C.warning],[product.l+"g","Lip.",C.accent]].map(([v,l,col])=>
            <div key={l} style={{background:C.bgMid,borderRadius:8,padding:"8px 4px"}}>
              <div style={{fontSize:16,fontWeight:700,color:col}}>{v}</div>
              <div style={{fontSize:10,color:C.textLight,textTransform:"uppercase"}}>{l}</div>
            </div>
          )}
        </div>
        <div style={{fontSize:11,color:C.textLight,marginTop:10}}>Pour 100g · Source : Open Food Facts</div>
      </div>
      <Btn onClick={()=>onAdd(product)}>Ajouter au {meal}</Btn>
      <Btn variant="ghost" onClick={()=>{setProduct(null);setBarcode("");}}>Scanner un autre</Btn>
    </>}
    <Btn variant="ghost" onClick={onClose}>Fermer</Btn>
  </NutriModal>;
}

function NutriManualModal({meal, onAdd, onClose}) {
  const [form, setForm] = useState({name:"",qty:"",kcal:"",p:"",g:"",l:""});
  function set(k,v){setForm(prev=>({...prev,[k]:v}));}
  function handleAdd(){
    if(!form.name||!form.kcal) return;
    onAdd({name:form.name,qty:form.qty||"1 portion",kcal:parseInt(form.kcal)||0,p:parseFloat(form.p)||0,g:parseFloat(form.g)||0,l:parseFloat(form.l)||0,emoji:getFoodEmoji(form.name)});
  }
  return <NutriModal title="✏️ Saisie manuelle" onClose={onClose}>
    <Input label="Nom de l'aliment *" value={form.name} onChange={v=>set("name",v)} placeholder="Ex : Yaourt nature"/>
    <Input label="Quantité" value={form.qty} onChange={v=>set("qty",v)} placeholder="Ex : 125g, 1 bol…"/>
    <Input label="Calories (kcal) *" value={form.kcal} onChange={v=>set("kcal",v)} type="number" placeholder="Ex : 80"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,margin:"8px 0 16px"}}>
      {[["p","Protéines (g)"],["g","Glucides (g)"],["l","Lipides (g)"]].map(([k,ph])=>
        <input key={k} value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} type="number"
          style={{padding:"9px 10px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.text,background:C.bg,outline:"none",fontFamily:"inherit"}}/>
      )}
    </div>
    <Btn disabled={!form.name||!form.kcal} onClick={handleAdd}>Ajouter au {meal}</Btn>
    <Btn variant="ghost" onClick={onClose}>Annuler</Btn>
  </NutriModal>;
}

function Header({activeTab,setActiveTab,view,setView,rappels,session,onLogout}) {
  return <div style={{maxWidth:900,margin:"0 auto 24px"}}>
    <div style={{background:"linear-gradient(135deg,#081A10 0%,#0F2820 60%,#163428 100%)",borderRadius:16,padding:"16px 24px",marginBottom:0,border:`1px solid ${C.border}`,boxShadow:"0 4px 24px rgba(0,0,0,0.3)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
      <div>
        <div style={{fontWeight:900,fontSize:22,letterSpacing:"0.08em",textTransform:"uppercase",background:"linear-gradient(90deg,#C9A84C,#E8D08A,#C9A84C)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>EX HOME</div>
        <div style={{fontSize:9,color:C.gold,letterSpacing:"0.22em",textTransform:"uppercase",opacity:0.8,marginTop:2}}>ERGO · OPTIMISATION · MOUVEMENT</div>
        {session && <div style={{fontSize:10,color:session.couleur,letterSpacing:"0.1em",marginTop:3,fontWeight:700}}>
          {session.role==="coach" ? "🎯" : "👤"} {session.nom}
        </div>}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        <button onClick={()=>setView(view==="planning"?"dashboard":"planning")}
          style={{border:`1px solid ${view==="planning"?C.gold:C.border}`,borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",background:view==="planning"?C.gold+"20":"transparent",color:view==="planning"?C.gold:C.textMid,display:"flex",alignItems:"center",gap:6,transition:"all 0.15s"}}>
          📅 Planning{rappels.length>0&&<span style={{background:C.warning,color:C.bg,borderRadius:10,fontSize:10,padding:"1px 6px",fontWeight:700}}>{rappels.length}</span>}
        </button>
        <div style={{display:"flex",background:C.bgMid,border:`1px solid ${C.border}`,borderRadius:10,padding:3,gap:2}}>
          {[["coach","🎯 Coach"],["client","👤 Client"]].map(([k,lbl])=>
            <button key={k} onClick={()=>setActiveTab(k)} style={{padding:"7px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",background:activeTab===k?C.primary:"transparent",color:activeTab===k?C.bg:C.textMid,transition:"all 0.15s"}}>{lbl}</button>
          )}
        </div>
        <button onClick={onLogout}
          style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit",background:"transparent",color:C.textLight,transition:"all 0.15s"}}
          title="Se déconnecter">
          🚪
        </button>
      </div>
    </div>
  </div>;
}
