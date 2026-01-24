// Script pour générer les icônes PWA
// Utilise canvas pour créer les PNG à partir du SVG

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, '..', 'public', 'icons');

// Crée le dossier si nécessaire
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Fonction pour dessiner l'icône ElecPro
function drawIcon(ctx, size) {
  const scale = size / 100;

  // Fond bleu
  ctx.fillStyle = '#1e40af';
  ctx.beginPath();
  ctx.arc(50 * scale, 50 * scale, 45 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Éclair jaune
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(50 * scale, 20 * scale);
  ctx.lineTo(70 * scale, 45 * scale);
  ctx.lineTo(50 * scale, 70 * scale);
  ctx.lineTo(30 * scale, 45 * scale);
  ctx.closePath();
  ctx.fill();

  // Cercle central bleu
  ctx.fillStyle = '#1e40af';
  ctx.beginPath();
  ctx.arc(50 * scale, 45 * scale, 8 * scale, 0, Math.PI * 2);
  ctx.fill();
}

async function generateIcons() {
  console.log('Génération des icônes PWA...');

  for (const size of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Fond transparent
    ctx.clearRect(0, 0, size, size);

    // Dessine l'icône
    drawIcon(ctx, size);

    // Sauvegarde en PNG
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(iconDir, `icon-${size}x${size}.png`);
    fs.writeFileSync(filename, buffer);
    console.log(`Créé: icon-${size}x${size}.png`);
  }

  console.log('Toutes les icônes ont été générées!');
}

generateIcons().catch(console.error);
