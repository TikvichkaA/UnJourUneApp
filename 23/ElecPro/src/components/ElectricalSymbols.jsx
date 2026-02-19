// Composants SVG des symboles électriques NF C 15-100
// Chaque symbole est un composant React réutilisable

// === APPAREILS DE PROTECTION ===

export function SymbolDisjoncteur({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 100 60" width={size} height={size * 0.6} className={className}>
      {/* Boîtier */}
      <rect x="25" y="10" width="50" height="40" fill="none" stroke="currentColor" strokeWidth="3" rx="2"/>
      {/* Trait de sectionnement */}
      <line x1="25" y1="50" x2="75" y2="10" stroke="currentColor" strokeWidth="3"/>
      {/* Bornes */}
      <line x1="0" y1="30" x2="25" y2="30" stroke="currentColor" strokeWidth="3"/>
      <line x1="75" y1="30" x2="100" y2="30" stroke="currentColor" strokeWidth="3"/>
      <circle cx="5" cy="30" r="4" fill="currentColor"/>
      <circle cx="95" cy="30" r="4" fill="currentColor"/>
    </svg>
  )
}

export function SymbolDisjoncteurDifferentiel({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 100 70" width={size} height={size * 0.7} className={className}>
      {/* Boîtier */}
      <rect x="25" y="10" width="50" height="40" fill="none" stroke="currentColor" strokeWidth="3" rx="2"/>
      {/* Trait de sectionnement */}
      <line x1="25" y1="50" x2="75" y2="10" stroke="currentColor" strokeWidth="3"/>
      {/* Triangle différentiel */}
      <path d="M40 55 L50 65 L60 55 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Bornes */}
      <line x1="0" y1="30" x2="25" y2="30" stroke="currentColor" strokeWidth="3"/>
      <line x1="75" y1="30" x2="100" y2="30" stroke="currentColor" strokeWidth="3"/>
      <circle cx="5" cy="30" r="4" fill="currentColor"/>
      <circle cx="95" cy="30" r="4" fill="currentColor"/>
    </svg>
  )
}

export function SymbolInterrupteurDifferentiel({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 100 70" width={size} height={size * 0.7} className={className}>
      {/* Boîtier */}
      <rect x="25" y="10" width="50" height="40" fill="none" stroke="currentColor" strokeWidth="3" rx="2"/>
      {/* Triangle différentiel */}
      <path d="M40 55 L50 65 L60 55 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Bornes */}
      <line x1="0" y1="30" x2="25" y2="30" stroke="currentColor" strokeWidth="3"/>
      <line x1="75" y1="30" x2="100" y2="30" stroke="currentColor" strokeWidth="3"/>
      <circle cx="5" cy="30" r="4" fill="currentColor"/>
      <circle cx="95" cy="30" r="4" fill="currentColor"/>
    </svg>
  )
}

export function SymbolFusible({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 100 40" width={size} height={size * 0.4} className={className}>
      {/* Boîtier fusible */}
      <rect x="30" y="10" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="3"/>
      {/* Élément fusible */}
      <line x1="40" y1="20" x2="60" y2="20" stroke="currentColor" strokeWidth="2"/>
      {/* Bornes */}
      <line x1="0" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="3"/>
      <line x1="70" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="3"/>
      <circle cx="5" cy="20" r="4" fill="currentColor"/>
      <circle cx="95" cy="20" r="4" fill="currentColor"/>
    </svg>
  )
}

export function SymbolParafoudre({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 100 60" width={size} height={size * 0.6} className={className}>
      {/* Boîtier */}
      <rect x="30" y="15" width="40" height="30" fill="none" stroke="currentColor" strokeWidth="3"/>
      {/* Éclair */}
      <path d="M45 20 L55 28 L48 28 L55 40 L42 30 L50 30 Z" fill="currentColor"/>
      {/* Bornes */}
      <line x1="0" y1="30" x2="30" y2="30" stroke="currentColor" strokeWidth="3"/>
      <line x1="70" y1="30" x2="100" y2="30" stroke="currentColor" strokeWidth="3"/>
      <circle cx="5" cy="30" r="4" fill="currentColor"/>
      <circle cx="95" cy="30" r="4" fill="currentColor"/>
    </svg>
  )
}

// === ÉCLAIRAGE ===

export function SymbolPointLumineux({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      {/* Cercle */}
      <circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" strokeWidth="3"/>
      {/* Croix */}
      <line x1="30" y1="10" x2="30" y2="50" stroke="currentColor" strokeWidth="3"/>
      <line x1="10" y1="30" x2="50" y2="30" stroke="currentColor" strokeWidth="3"/>
    </svg>
  )
}

export function SymbolDCL({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 70" width={size} height={size * 1.17} className={className}>
      {/* Cercle */}
      <circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" strokeWidth="3"/>
      {/* Croix */}
      <line x1="30" y1="10" x2="30" y2="50" stroke="currentColor" strokeWidth="3"/>
      <line x1="10" y1="30" x2="50" y2="30" stroke="currentColor" strokeWidth="3"/>
      {/* DCL rectangle */}
      <rect x="20" y="55" width="20" height="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <text x="30" y="63" textAnchor="middle" fontSize="6" fill="currentColor">DCL</text>
    </svg>
  )
}

export function SymbolApplique({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 70 60" width={size} height={size * 0.86} className={className}>
      {/* Mur */}
      <line x1="10" y1="5" x2="10" y2="55" stroke="currentColor" strokeWidth="4"/>
      {/* Cercle lampe */}
      <circle cx="40" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="3"/>
      {/* Croix */}
      <line x1="40" y1="15" x2="40" y2="45" stroke="currentColor" strokeWidth="2"/>
      <line x1="25" y1="30" x2="55" y2="30" stroke="currentColor" strokeWidth="2"/>
      {/* Liaison au mur */}
      <line x1="10" y1="30" x2="20" y2="30" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

export function SymbolDetecteurPresence({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 60" width={size} height={size * 0.75} className={className}>
      {/* Boîtier détecteur */}
      <rect x="10" y="15" width="25" height="30" fill="none" stroke="currentColor" strokeWidth="3" rx="3"/>
      {/* Zone de détection */}
      <path d="M35 30 Q55 15 70 10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4"/>
      <path d="M35 30 Q55 30 70 30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4"/>
      <path d="M35 30 Q55 45 70 50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4"/>
    </svg>
  )
}

// === PRISES ===

export function SymbolPrise2PT({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      {/* Demi-cercle */}
      <path d="M10 50 A25 25 0 0 1 50 50" fill="none" stroke="currentColor" strokeWidth="3"/>
      {/* Ligne de base */}
      <line x1="10" y1="50" x2="50" y2="50" stroke="currentColor" strokeWidth="3"/>
      {/* 2 pôles */}
      <line x1="20" y1="35" x2="20" y2="50" stroke="currentColor" strokeWidth="3"/>
      <line x1="40" y1="35" x2="40" y2="50" stroke="currentColor" strokeWidth="3"/>
      {/* Terre */}
      <line x1="30" y1="15" x2="30" y2="35" stroke="currentColor" strokeWidth="3"/>
    </svg>
  )
}

export function SymbolPriseCommandee({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 60" width={size} height={size * 0.75} className={className}>
      {/* Demi-cercle */}
      <path d="M10 50 A25 25 0 0 1 50 50" fill="none" stroke="currentColor" strokeWidth="3"/>
      <line x1="10" y1="50" x2="50" y2="50" stroke="currentColor" strokeWidth="3"/>
      {/* 2 pôles + terre */}
      <line x1="20" y1="35" x2="20" y2="50" stroke="currentColor" strokeWidth="3"/>
      <line x1="40" y1="35" x2="40" y2="50" stroke="currentColor" strokeWidth="3"/>
      <line x1="30" y1="15" x2="30" y2="35" stroke="currentColor" strokeWidth="3"/>
      {/* Symbole commande */}
      <circle cx="65" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="65" y1="20" x2="65" y2="40" stroke="currentColor" strokeWidth="2"/>
      <line x1="50" y1="30" x2="55" y2="30" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

export function SymbolPriseRJ45({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 50" width={size} height={size * 0.83} className={className}>
      {/* Boîtier */}
      <rect x="10" y="10" width="40" height="30" fill="none" stroke="currentColor" strokeWidth="3" rx="3"/>
      {/* Symbole RJ45 */}
      <rect x="18" y="18" width="24" height="14" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Contacts */}
      <line x1="22" y1="22" x2="22" y2="28" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="26" y1="22" x2="26" y2="28" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="30" y1="22" x2="30" y2="28" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="34" y1="22" x2="34" y2="28" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="38" y1="22" x2="38" y2="28" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

export function SymbolPriseTV({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 50" width={size} height={size * 0.83} className={className}>
      {/* Boîtier */}
      <rect x="10" y="10" width="40" height="30" fill="none" stroke="currentColor" strokeWidth="3" rx="3"/>
      {/* Connecteur coaxial */}
      <circle cx="30" cy="25" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="30" cy="25" r="3" fill="currentColor"/>
    </svg>
  )
}

// === COMMANDES ===

export function SymbolInterrupteurSimple({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      {/* Point central */}
      <circle cx="30" cy="45" r="5" fill="currentColor"/>
      {/* Levier */}
      <line x1="30" y1="45" x2="50" y2="15" stroke="currentColor" strokeWidth="3"/>
      {/* Borne haute */}
      <circle cx="50" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

export function SymbolInterrupteurDouble({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 60" width={size} height={size * 0.75} className={className}>
      {/* Point central */}
      <circle cx="30" cy="45" r="5" fill="currentColor"/>
      {/* Levier 1 */}
      <line x1="30" y1="45" x2="45" y2="15" stroke="currentColor" strokeWidth="3"/>
      <circle cx="45" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Levier 2 */}
      <line x1="30" y1="45" x2="60" y2="20" stroke="currentColor" strokeWidth="3"/>
      <circle cx="60" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

export function SymbolVaEtVient({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 100 60" width={size} height={size * 0.6} className={className}>
      {/* Interrupteur 1 */}
      <circle cx="20" cy="45" r="4" fill="currentColor"/>
      <line x1="20" y1="45" x2="35" y2="20" stroke="currentColor" strokeWidth="3"/>
      <circle cx="35" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="35" cy="35" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Navettes */}
      <line x1="35" y1="20" x2="65" y2="20" stroke="currentColor" strokeWidth="2" strokeDasharray="5"/>
      <line x1="35" y1="35" x2="65" y2="35" stroke="currentColor" strokeWidth="2" strokeDasharray="5"/>
      {/* Interrupteur 2 */}
      <circle cx="80" cy="45" r="4" fill="currentColor"/>
      <line x1="80" y1="45" x2="65" y2="20" stroke="currentColor" strokeWidth="3"/>
      <circle cx="65" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="65" cy="35" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

export function SymbolBoutonPoussoir({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      {/* Point central */}
      <circle cx="30" cy="45" r="5" fill="currentColor"/>
      {/* Levier avec rappel */}
      <line x1="30" y1="45" x2="50" y2="15" stroke="currentColor" strokeWidth="3"/>
      <circle cx="50" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Flèche de rappel */}
      <path d="M40 25 L45 20 L43 28 Z" fill="currentColor"/>
    </svg>
  )
}

export function SymbolVariateur({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      {/* Cercle */}
      <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="3"/>
      {/* Flèche de variation */}
      <path d="M15 40 L30 15 L45 40" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="30" y1="15" x2="30" y2="45" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

// === APPAREILLAGE MODULAIRE ===

export function SymbolTelerupteur({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 70" width={size} height={size * 0.875} className={className}>
      {/* Bobine */}
      <rect x="25" y="10" width="30" height="35" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M30 15 Q40 20 30 25 Q40 30 30 35 Q40 40 30 40" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Contact bistable */}
      <circle cx="15" cy="55" r="4" fill="currentColor"/>
      <line x1="15" y1="55" x2="35" y2="50" stroke="currentColor" strokeWidth="3"/>
      <circle cx="35" cy="50" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Bornes A1 A2 */}
      <text x="60" y="18" fontSize="8" fill="currentColor">A1</text>
      <text x="60" y="42" fontSize="8" fill="currentColor">A2</text>
      {/* Bornes 1 2 */}
      <text x="5" y="68" fontSize="8" fill="currentColor">1</text>
      <text x="35" y="68" fontSize="8" fill="currentColor">2</text>
    </svg>
  )
}

export function SymbolMinuterie({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 70" width={size} height={size * 0.875} className={className}>
      {/* Boîtier avec horloge */}
      <rect x="20" y="10" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" rx="3"/>
      {/* Horloge */}
      <circle cx="40" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="40" y1="30" x2="40" y2="22" stroke="currentColor" strokeWidth="2"/>
      <line x1="40" y1="30" x2="47" y2="33" stroke="currentColor" strokeWidth="2"/>
      {/* Contact */}
      <circle cx="25" cy="60" r="4" fill="currentColor"/>
      <line x1="25" y1="60" x2="45" y2="55" stroke="currentColor" strokeWidth="3"/>
      <circle cx="45" cy="55" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

export function SymbolContacteur({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 60" width={size} height={size * 0.75} className={className}>
      {/* Bobine */}
      <rect x="25" y="5" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M30 10 Q40 15 30 20 Q40 25 30 30" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Contact de puissance */}
      <circle cx="15" cy="50" r="4" fill="currentColor"/>
      <line x1="15" y1="50" x2="40" y2="40" stroke="currentColor" strokeWidth="3"/>
      <circle cx="40" cy="40" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="40" y1="40" x2="65" y2="40" stroke="currentColor" strokeWidth="3"/>
      <circle cx="65" cy="40" r="4" fill="currentColor"/>
    </svg>
  )
}

export function SymbolContacteurJourNuit({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 100 70" width={size} height={size * 0.7} className={className}>
      {/* Bobine */}
      <rect x="35" y="5" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M40 10 Q50 15 40 20 Q50 25 40 30" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Symbole HC */}
      <text x="70" y="25" fontSize="10" fill="currentColor">HC</text>
      {/* Contact */}
      <circle cx="25" cy="55" r="4" fill="currentColor"/>
      <line x1="25" y1="55" x2="50" y2="45" stroke="currentColor" strokeWidth="3"/>
      <circle cx="50" cy="45" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="50" y1="45" x2="75" y2="45" stroke="currentColor" strokeWidth="3"/>
      <circle cx="75" cy="55" r="4" fill="currentColor"/>
      {/* Compteur */}
      <rect x="5" y="10" width="15" height="20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3"/>
    </svg>
  )
}

// === CÂBLAGE ===

export function SymbolTerre({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      {/* Trait vertical */}
      <line x1="30" y1="5" x2="30" y2="25" stroke="currentColor" strokeWidth="3"/>
      {/* 3 traits horizontaux */}
      <line x1="10" y1="25" x2="50" y2="25" stroke="currentColor" strokeWidth="3"/>
      <line x1="15" y1="35" x2="45" y2="35" stroke="currentColor" strokeWidth="3"/>
      <line x1="22" y1="45" x2="38" y2="45" stroke="currentColor" strokeWidth="3"/>
    </svg>
  )
}

export function SymbolLiaisonEquipotentielle({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 50" width={size} height={size * 0.625} className={className}>
      {/* Barre */}
      <line x1="10" y1="25" x2="70" y2="25" stroke="currentColor" strokeWidth="4"/>
      {/* Connexions */}
      <line x1="20" y1="10" x2="20" y2="25" stroke="currentColor" strokeWidth="2"/>
      <line x1="40" y1="10" x2="40" y2="25" stroke="currentColor" strokeWidth="2"/>
      <line x1="60" y1="10" x2="60" y2="25" stroke="currentColor" strokeWidth="2"/>
      {/* Terre */}
      <line x1="40" y1="25" x2="40" y2="35" stroke="currentColor" strokeWidth="2"/>
      <line x1="30" y1="35" x2="50" y2="35" stroke="currentColor" strokeWidth="2"/>
      <line x1="33" y1="40" x2="47" y2="40" stroke="currentColor" strokeWidth="2"/>
      <line x1="36" y1="45" x2="44" y2="45" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

export function SymbolBoiteDerivation({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      {/* Boîte */}
      <rect x="15" y="15" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="3"/>
      {/* Point central */}
      <circle cx="30" cy="30" r="5" fill="currentColor"/>
      {/* Entrées/sorties */}
      <line x1="0" y1="30" x2="15" y2="30" stroke="currentColor" strokeWidth="2"/>
      <line x1="45" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="2"/>
      <line x1="30" y1="0" x2="30" y2="15" stroke="currentColor" strokeWidth="2"/>
      <line x1="30" y1="45" x2="30" y2="60" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

// Map des symboles par ID
export const symbolsMap = {
  // Protection
  'disjoncteur': SymbolDisjoncteur,
  'disjoncteur-differentiel': SymbolDisjoncteurDifferentiel,
  'interrupteur-differentiel': SymbolInterrupteurDifferentiel,
  'fusible': SymbolFusible,
  'parafoudre': SymbolParafoudre,
  'disjoncteur-branchement': SymbolDisjoncteur,

  // Éclairage
  'point-lumineux': SymbolPointLumineux,
  'dcl': SymbolDCL,
  'applique': SymbolApplique,
  'spot-encastre': SymbolSpotEncastre,
  'detecteur-presence': SymbolDetecteurPresence,
  'sonnerie': SymbolSonnerie,
  'voyant': SymbolVoyant,
  'chauffage-electrique': SymbolChauffageElectrique,
  'hublot': SymbolHublot,

  // Prises
  'prise-2p-t': SymbolPrise2PT,
  'prise-commandee': SymbolPriseCommandee,
  'prise-20a': SymbolPrise2PT,
  'prise-32a': SymbolPrise2PT,
  'bloc-3-prises': SymbolBloc3Prises,
  'bloc-4-prises': SymbolBloc4Prises,
  'prise-rj45': SymbolPriseRJ45,
  'prise-tv': SymbolPriseTV,

  // Commandes
  'interrupteur-simple': SymbolInterrupteurSimple,
  'interrupteur-double': SymbolInterrupteurDouble,
  'va-et-vient': SymbolVaEtVient,
  'bouton-poussoir': SymbolBoutonPoussoir,
  'interrupteur-voyant': SymbolInterrupteurVoyant,
  'bouton-poussoir-lumineux': SymbolBoutonPoussoirLumineux,
  'interrupteur-bipolaire': SymbolInterrupteurBipolaire,
  'interrupteur-vmc': SymbolInterrupteurSimple,
  'interrupteur-volet': SymbolInterrupteurDouble,
  'variateur': SymbolVariateur,

  // Appareillage
  'telerupteur': SymbolTelerupteur,
  'minuterie': SymbolMinuterie,
  'contacteur': SymbolContacteur,
  'contacteur-jour-nuit': SymbolContacteurJourNuit,
  'horloge': SymbolHorloge,
  'delesteur': SymbolDelesteur,
  'thermostat': SymbolThermostat,
  'transformateur': SymbolTransformateur,

  // Câblage
  'arrivee-reseau': SymbolArriveeReseau,
  'terre': SymbolTerre,
  'liaison-equipotentielle': SymbolLiaisonEquipotentielle,
  'boite-derivation': SymbolBoiteDerivation,
  'conducteur-phase': SymbolConducteurPhase,
  'conducteur-neutre': SymbolConducteurNeutre,
  'conducteur-terre': SymbolConducteurTerre,
  'cable-encastre': SymbolCableEncastre,
  'cable-apparent': SymbolCableApparent
}

// Composant générique pour afficher un symbole par son ID
export function ElectricalSymbol({ symbolId, size = 80, className = "" }) {
  const SymbolComponent = symbolsMap[symbolId]

  if (!SymbolComponent) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <span className="text-gray-400 text-xs">?</span>
      </div>
    )
  }

  return <SymbolComponent size={size} className={className} />
}

// Symbole conducteur de phase (fil rouge/marron/noir)
export function SymbolConducteurPhase({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 30" width={size} height={size * 0.375} className={className}>
      <line x1="5" y1="15" x2="75" y2="15" stroke="currentColor" strokeWidth="4"/>
      <text x="40" y="28" textAnchor="middle" fontSize="8" fill="currentColor">L</text>
    </svg>
  )
}

// Symbole conducteur de neutre (fil bleu)
export function SymbolConducteurNeutre({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 30" width={size} height={size * 0.375} className={className}>
      <line x1="5" y1="15" x2="75" y2="15" stroke="currentColor" strokeWidth="4"/>
      <text x="40" y="28" textAnchor="middle" fontSize="8" fill="currentColor">N</text>
    </svg>
  )
}

// Symbole conducteur de protection (fil vert/jaune)
export function SymbolConducteurTerre({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 30" width={size} height={size * 0.375} className={className}>
      <line x1="5" y1="15" x2="75" y2="15" stroke="currentColor" strokeWidth="4" strokeDasharray="8 4"/>
      <text x="40" y="28" textAnchor="middle" fontSize="8" fill="currentColor">PE</text>
    </svg>
  )
}

// Symbole câble encastré (trait continu)
export function SymbolCableEncastre({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 40" width={size} height={size * 0.5} className={className}>
      <line x1="5" y1="20" x2="75" y2="20" stroke="currentColor" strokeWidth="3"/>
      <text x="40" y="35" textAnchor="middle" fontSize="7" fill="currentColor">encastré</text>
    </svg>
  )
}

// Symbole câble apparent (trait pointillé)
export function SymbolCableApparent({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 40" width={size} height={size * 0.5} className={className}>
      <line x1="5" y1="20" x2="75" y2="20" stroke="currentColor" strokeWidth="3" strokeDasharray="8 4"/>
      <text x="40" y="35" textAnchor="middle" fontSize="7" fill="currentColor">apparent</text>
    </svg>
  )
}

// Symbole spot encastré
export function SymbolSpotEncastre({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 70" width={size} height={size * 1.17} className={className}>
      <rect x="10" y="5" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="30" cy="40" r="18" fill="none" stroke="currentColor" strokeWidth="3"/>
      <line x1="30" y1="27" x2="30" y2="53" stroke="currentColor" strokeWidth="2"/>
      <line x1="17" y1="40" x2="43" y2="40" stroke="currentColor" strokeWidth="2"/>
      <line x1="30" y1="22" x2="30" y2="25" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

// Symbole hublot (étanche)
export function SymbolHublot({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      <circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="3"/>
      <line x1="30" y1="15" x2="30" y2="45" stroke="currentColor" strokeWidth="2"/>
      <line x1="15" y1="30" x2="45" y2="30" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

// === NOUVEAUX SYMBOLES (PDF "Tableau des symboles électriques") ===

// Interrupteur simple allumage avec voyant
export function SymbolInterrupteurVoyant({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      {/* Point central */}
      <circle cx="30" cy="45" r="5" fill="currentColor"/>
      {/* Levier */}
      <line x1="30" y1="45" x2="50" y2="15" stroke="currentColor" strokeWidth="3"/>
      {/* Borne haute */}
      <circle cx="50" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Voyant */}
      <circle cx="15" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="15" cy="20" r="2" fill="currentColor"/>
    </svg>
  )
}

// Bouton poussoir lumineux
export function SymbolBoutonPoussoirLumineux({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      {/* Point central */}
      <circle cx="30" cy="45" r="5" fill="currentColor"/>
      {/* Levier avec rappel */}
      <line x1="30" y1="45" x2="50" y2="15" stroke="currentColor" strokeWidth="3"/>
      <circle cx="50" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Flèche de rappel */}
      <path d="M40 25 L45 20 L43 28 Z" fill="currentColor"/>
      {/* Voyant */}
      <circle cx="15" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="15" cy="20" r="2" fill="currentColor"/>
    </svg>
  )
}

// Interrupteur bipolaire
export function SymbolInterrupteurBipolaire({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 60" width={size} height={size * 0.75} className={className}>
      {/* Pôle 1 */}
      <circle cx="20" cy="50" r="4" fill="currentColor"/>
      <line x1="20" y1="50" x2="35" y2="15" stroke="currentColor" strokeWidth="3"/>
      <circle cx="35" cy="15" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Pôle 2 */}
      <circle cx="45" cy="50" r="4" fill="currentColor"/>
      <line x1="45" y1="50" x2="60" y2="15" stroke="currentColor" strokeWidth="3"/>
      <circle cx="60" cy="15" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Barre de liaison */}
      <line x1="28" y1="32" x2="53" y2="32" stroke="currentColor" strokeWidth="2" strokeDasharray="3"/>
    </svg>
  )
}

// Bloc de 3 prises 16A
export function SymbolBloc3Prises({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 100 60" width={size} height={size * 0.6} className={className}>
      {/* Prise 1 */}
      <path d="M5 50 A15 15 0 0 1 35 50" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <line x1="5" y1="50" x2="35" y2="50" stroke="currentColor" strokeWidth="2.5"/>
      <line x1="14" y1="40" x2="14" y2="50" stroke="currentColor" strokeWidth="2"/>
      <line x1="26" y1="40" x2="26" y2="50" stroke="currentColor" strokeWidth="2"/>
      <line x1="20" y1="28" x2="20" y2="40" stroke="currentColor" strokeWidth="2"/>
      {/* Prise 2 */}
      <path d="M35 50 A15 15 0 0 1 65 50" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <line x1="35" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="2.5"/>
      <line x1="44" y1="40" x2="44" y2="50" stroke="currentColor" strokeWidth="2"/>
      <line x1="56" y1="40" x2="56" y2="50" stroke="currentColor" strokeWidth="2"/>
      <line x1="50" y1="28" x2="50" y2="40" stroke="currentColor" strokeWidth="2"/>
      {/* Prise 3 */}
      <path d="M65 50 A15 15 0 0 1 95 50" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <line x1="65" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2.5"/>
      <line x1="74" y1="40" x2="74" y2="50" stroke="currentColor" strokeWidth="2"/>
      <line x1="86" y1="40" x2="86" y2="50" stroke="currentColor" strokeWidth="2"/>
      <line x1="80" y1="28" x2="80" y2="40" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

// Bloc de 4 prises 16A
export function SymbolBloc4Prises({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 120 60" width={size} height={size * 0.5} className={className}>
      {/* Prise 1 */}
      <path d="M3 50 A13 13 0 0 1 27 50" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="50" x2="27" y2="50" stroke="currentColor" strokeWidth="2"/>
      <line x1="10" y1="42" x2="10" y2="50" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="20" y1="42" x2="20" y2="50" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="15" y1="30" x2="15" y2="42" stroke="currentColor" strokeWidth="1.5"/>
      {/* Prise 2 */}
      <path d="M33 50 A13 13 0 0 1 57 50" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="33" y1="50" x2="57" y2="50" stroke="currentColor" strokeWidth="2"/>
      <line x1="40" y1="42" x2="40" y2="50" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="50" y1="42" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="45" y1="30" x2="45" y2="42" stroke="currentColor" strokeWidth="1.5"/>
      {/* Prise 3 */}
      <path d="M63 50 A13 13 0 0 1 87 50" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="63" y1="50" x2="87" y2="50" stroke="currentColor" strokeWidth="2"/>
      <line x1="70" y1="42" x2="70" y2="50" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="80" y1="42" x2="80" y2="50" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="75" y1="30" x2="75" y2="42" stroke="currentColor" strokeWidth="1.5"/>
      {/* Prise 4 */}
      <path d="M93 50 A13 13 0 0 1 117 50" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="93" y1="50" x2="117" y2="50" stroke="currentColor" strokeWidth="2"/>
      <line x1="100" y1="42" x2="100" y2="50" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="110" y1="42" x2="110" y2="50" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="105" y1="30" x2="105" y2="42" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

// Chauffage électrique
export function SymbolChauffageElectrique({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 60" width={size} height={size * 0.75} className={className}>
      {/* Cadre rectangulaire */}
      <rect x="10" y="10" width="60" height="40" fill="none" stroke="currentColor" strokeWidth="3" rx="2"/>
      {/* Zigzag résistance */}
      <path d="M20 30 L28 18 L36 42 L44 18 L52 42 L60 30" fill="none" stroke="currentColor" strokeWidth="2.5"/>
    </svg>
  )
}

// Transformateur
export function SymbolTransformateur({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 60" width={size} height={size * 0.75} className={className}>
      {/* Bobine primaire */}
      <path d="M15 10 Q25 10 25 17 Q25 24 15 24 Q25 24 25 31 Q25 38 15 38 Q25 38 25 45 Q25 52 15 52" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      {/* Bobine secondaire */}
      <path d="M55 10 Q45 10 45 17 Q45 24 55 24 Q45 24 45 31 Q45 38 55 38 Q45 38 45 45 Q45 52 55 52" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      {/* Noyau (2 traits verticaux) */}
      <line x1="32" y1="8" x2="32" y2="54" stroke="currentColor" strokeWidth="2"/>
      <line x1="38" y1="8" x2="38" y2="54" stroke="currentColor" strokeWidth="2"/>
      {/* Bornes */}
      <line x1="0" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
      <line x1="0" y1="47" x2="15" y2="47" stroke="currentColor" strokeWidth="2"/>
      <line x1="55" y1="15" x2="70" y2="15" stroke="currentColor" strokeWidth="2"/>
      <line x1="55" y1="47" x2="70" y2="47" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

// Sonnerie
export function SymbolSonnerie({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      {/* Cloche - demi-cercle */}
      <path d="M15 35 Q15 10 30 10 Q45 10 45 35" fill="none" stroke="currentColor" strokeWidth="3"/>
      {/* Base de la cloche */}
      <line x1="12" y1="35" x2="48" y2="35" stroke="currentColor" strokeWidth="3"/>
      {/* Battant */}
      <line x1="30" y1="35" x2="30" y2="45" stroke="currentColor" strokeWidth="2"/>
      <circle cx="30" cy="47" r="3" fill="currentColor"/>
      {/* Ondes sonores */}
      <path d="M48 20 Q55 25 48 30" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M52 16 Q62 25 52 34" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

// Voyant lumineux
export function SymbolVoyant({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      {/* Cercle */}
      <circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="3"/>
      {/* Croix intérieure */}
      <line x1="30" y1="16" x2="30" y2="44" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="2"/>
      {/* Flèches de rayonnement */}
      <line x1="48" y1="12" x2="55" y2="5" stroke="currentColor" strokeWidth="2"/>
      <path d="M52 5 L55 5 L55 8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="48" y1="20" x2="56" y2="16" stroke="currentColor" strokeWidth="2"/>
      <path d="M53 14 L56 16 L54 19" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

// Arrivée du réseau électrique
export function SymbolArriveeReseau({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 60" width={size} height={size * 0.75} className={className}>
      {/* 3 traits obliques Ph, N, PE */}
      <line x1="15" y1="10" x2="15" y2="55" stroke="currentColor" strokeWidth="3"/>
      <line x1="30" y1="10" x2="30" y2="55" stroke="currentColor" strokeWidth="3"/>
      <line x1="45" y1="10" x2="45" y2="55" stroke="currentColor" strokeWidth="3"/>
      {/* Traits obliques (arrivée) */}
      <line x1="10" y1="20" x2="20" y2="15" stroke="currentColor" strokeWidth="2"/>
      <line x1="25" y1="20" x2="35" y2="15" stroke="currentColor" strokeWidth="2"/>
      <line x1="40" y1="20" x2="50" y2="15" stroke="currentColor" strokeWidth="2"/>
      {/* Labels */}
      <text x="15" y="8" textAnchor="middle" fontSize="7" fill="currentColor">Ph</text>
      <text x="30" y="8" textAnchor="middle" fontSize="7" fill="currentColor">N</text>
      <text x="45" y="8" textAnchor="middle" fontSize="7" fill="currentColor">PE</text>
    </svg>
  )
}

// Thermostat
export function SymbolThermostat({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      {/* Boîtier */}
      <rect x="10" y="10" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" rx="3"/>
      {/* Symbole theta θ */}
      <circle cx="30" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <line x1="20" y1="30" x2="40" y2="30" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

// Symbole délesteur
export function SymbolDelesteur({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 80 60" width={size} height={size * 0.75} className={className}>
      <rect x="20" y="10" width="40" height="30" fill="none" stroke="currentColor" strokeWidth="2" rx="3"/>
      <text x="40" y="22" textAnchor="middle" fontSize="8" fill="currentColor">P1</text>
      <text x="40" y="35" textAnchor="middle" fontSize="8" fill="currentColor">P2</text>
      <line x1="60" y1="18" x2="75" y2="18" stroke="currentColor" strokeWidth="2"/>
      <line x1="60" y1="32" x2="75" y2="32" stroke="currentColor" strokeWidth="2"/>
      <line x1="5" y1="25" x2="20" y2="25" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

// Symbole horloge programmable
export function SymbolHorloge({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className}>
      <rect x="10" y="10" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" rx="3"/>
      <circle cx="30" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="30" y1="30" x2="30" y2="20" stroke="currentColor" strokeWidth="2"/>
      <line x1="30" y1="30" x2="38" y2="35" stroke="currentColor" strokeWidth="2"/>
      <circle cx="30" cy="30" r="2" fill="currentColor"/>
    </svg>
  )
}
