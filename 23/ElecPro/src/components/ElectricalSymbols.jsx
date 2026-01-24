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
  'spot-encastre': SymbolPointLumineux,
  'detecteur-presence': SymbolDetecteurPresence,
  'hublot': SymbolPointLumineux,

  // Prises
  'prise-2p-t': SymbolPrise2PT,
  'prise-commandee': SymbolPriseCommandee,
  'prise-20a': SymbolPrise2PT,
  'prise-32a': SymbolPrise2PT,
  'prise-rj45': SymbolPriseRJ45,
  'prise-tv': SymbolPriseTV,

  // Commandes
  'interrupteur-simple': SymbolInterrupteurSimple,
  'interrupteur-double': SymbolInterrupteurDouble,
  'va-et-vient': SymbolVaEtVient,
  'bouton-poussoir': SymbolBoutonPoussoir,
  'interrupteur-vmc': SymbolInterrupteurSimple,
  'interrupteur-volet': SymbolInterrupteurDouble,
  'variateur': SymbolVariateur,

  // Appareillage
  'telerupteur': SymbolTelerupteur,
  'minuterie': SymbolMinuterie,
  'contacteur': SymbolContacteur,
  'contacteur-jour-nuit': SymbolContacteurJourNuit,
  'horloge': SymbolMinuterie,
  'delesteur': SymbolContacteur,

  // Câblage
  'terre': SymbolTerre,
  'liaison-equipotentielle': SymbolLiaisonEquipotentielle,
  'boite-derivation': SymbolBoiteDerivation,
  'conducteur-phase': SymbolTerre,
  'conducteur-neutre': SymbolTerre,
  'conducteur-terre': SymbolTerre,
  'cable-encastre': SymbolBoiteDerivation,
  'cable-apparent': SymbolBoiteDerivation
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
