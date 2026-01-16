const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 128];

// Créer le dossier icons s'il n'existe pas
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

async function generateIcon(size) {
  // Créer un SVG avec le design de l'icône
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10b981"/>
          <stop offset="100%" style="stop-color:#059669"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="url(#grad)"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size * 0.3}"
              fill="none" stroke="rgba(255,255,255,0.7)"
              stroke-width="${Math.max(2, size * 0.06)}"
              stroke-dasharray="${size * 0.12} ${size * 0.06}"/>
      <text x="${size/2}" y="${size/2 + size * 0.15}"
            font-family="Arial, sans-serif"
            font-size="${size * 0.4}"
            font-weight="bold"
            fill="white"
            text-anchor="middle">€</text>
    </svg>
  `;

  const outputPath = path.join(iconsDir, `icon${size}.png`);

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);

  console.log(`✓ Créé: icon${size}.png`);
}

async function main() {
  console.log('Génération des icônes SecondMain...\n');

  for (const size of sizes) {
    await generateIcon(size);
  }

  console.log('\n✅ Toutes les icônes ont été générées dans le dossier icons/');
}

main().catch(console.error);
