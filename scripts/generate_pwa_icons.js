const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Customer Icon SVG
function getCustomerSvg(size) {
  const r = size * 0.22;
  const fontSize = Math.round(size * 0.45);
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0E757A" />
          <stop offset="100%" stop-color="#0C6266" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${r}" fill="url(#tealGrad)" />
      <!-- Letter O with home roof flourish -->
      <circle cx="${size * 0.5}" cy="${size * 0.53}" r="${size * 0.26}" fill="none" stroke="#FFFFFF" stroke-width="${size * 0.08}" />
      <polygon points="${size * 0.5},${size * 0.16} ${size * 0.24},${size * 0.38} ${size * 0.76},${size * 0.38}" fill="#E68A00" />
    </svg>
  `;
}

// 2. Partner Icon SVG
function getPartnerSvg(size) {
  const r = size * 0.22;
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="darkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#141B2D" />
          <stop offset="100%" stop-color="#0E131F" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${r}" fill="url(#darkGrad)" />
      <!-- Shield badge with Teal accent and amber star -->
      <path d="M ${size * 0.5} ${size * 0.18} L ${size * 0.78} ${size * 0.28} L ${size * 0.78} ${size * 0.56} C ${size * 0.78} ${size * 0.76} ${size * 0.5} ${size * 0.88} ${size * 0.5} ${size * 0.88} C ${size * 0.5} ${size * 0.88} ${size * 0.22} ${size * 0.76} ${size * 0.22} ${size * 0.56} L ${size * 0.22} ${size * 0.28} Z" fill="#0C6266" stroke="#E68A00" stroke-width="${size * 0.03}" />
      <!-- Pro star -->
      <polygon points="${size * 0.5},${size * 0.36} ${size * 0.54},${size * 0.48} ${size * 0.66},${size * 0.48} ${size * 0.56},${size * 0.55} ${size * 0.6},${size * 0.67} ${size * 0.5},${size * 0.6} ${size * 0.4},${size * 0.67} ${size * 0.44},${size * 0.55} ${size * 0.34},${size * 0.48} ${size * 0.46},${size * 0.48}" fill="#E68A00" />
    </svg>
  `;
}

async function generate() {
  console.log("Generating PWA Icons...");

  // Customer 192 & 512
  await sharp(Buffer.from(getCustomerSvg(192)))
    .png()
    .toFile(path.join(outDir, 'icon-192x192.png'));

  await sharp(Buffer.from(getCustomerSvg(512)))
    .png()
    .toFile(path.join(outDir, 'icon-512x512.png'));

  // Apple touch icon
  await sharp(Buffer.from(getCustomerSvg(180)))
    .png()
    .toFile(path.join(outDir, 'apple-touch-icon.png'));

  // Partner 192 & 512
  await sharp(Buffer.from(getPartnerSvg(192)))
    .png()
    .toFile(path.join(outDir, 'partner-icon-192x192.png'));

  await sharp(Buffer.from(getPartnerSvg(512)))
    .png()
    .toFile(path.join(outDir, 'partner-icon-512x512.png'));

  console.log("PWA Icons generated successfully in public/icons/");
}

generate().catch(err => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
