const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicIconsDir = path.join(__dirname, '..', 'public', 'icons');
const publicDir = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'app');

if (!fs.existsSync(publicIconsDir)) {
  fs.mkdirSync(publicIconsDir, { recursive: true });
}

// 1. Customer / Official Osmida Brand Icon SVG (Teal gradient, white 'O', amber roof flourish)
function getCustomerSvg(size) {
  const r = size * 0.22;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
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
</svg>`;
}

// 2. Partner Icon SVG (Dark dispatch gradient with Teal shield & star)
function getPartnerSvg(size) {
  const r = size * 0.22;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
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
</svg>`;
}

// Helper to create a valid .ico file containing a PNG
function makeIco(pngBuffer, width = 32, height = 32) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(1, 4); // 1 image

  const dir = Buffer.alloc(16);
  dir.writeUInt8(width === 256 ? 0 : width, 0); // width
  dir.writeUInt8(height === 256 ? 0 : height, 1); // height
  dir.writeUInt8(0, 2); // colors
  dir.writeUInt8(0, 3); // reserved
  dir.writeUInt16LE(1, 4); // planes
  dir.writeUInt16LE(32, 6); // bpp
  dir.writeUInt32LE(pngBuffer.length, 8); // size
  dir.writeUInt32LE(22, 12); // offset (6 + 16)

  return Buffer.concat([header, dir, pngBuffer]);
}

async function generate() {
  console.log("Generating complete Osmida Brand Icons & Favicons across public/ and app/...");

  const svg512 = getCustomerSvg(512);
  const svg192 = getCustomerSvg(192);
  const svg180 = getCustomerSvg(180);
  const svg96 = getCustomerSvg(96);
  const svg48 = getCustomerSvg(48);
  const svg32 = getCustomerSvg(32);

  // Write SVG files
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svg512);
  fs.writeFileSync(path.join(publicDir, 'apple-icon.svg'), svg180);
  fs.writeFileSync(path.join(appDir, 'icon.svg'), svg512);
  fs.writeFileSync(path.join(appDir, 'apple-icon.svg'), svg180);

  // Generate PNG buffers
  const png512 = await sharp(Buffer.from(svg512)).png().toBuffer();
  const png192 = await sharp(Buffer.from(svg192)).png().toBuffer();
  const png180 = await sharp(Buffer.from(svg180)).png().toBuffer();
  const png96 = await sharp(Buffer.from(svg96)).png().toBuffer();
  const png48 = await sharp(Buffer.from(svg48)).png().toBuffer();
  const png32 = await sharp(Buffer.from(svg32)).png().toBuffer();

  // Public PWA icons
  fs.writeFileSync(path.join(publicIconsDir, 'icon-192x192.png'), png192);
  fs.writeFileSync(path.join(publicIconsDir, 'icon-512x512.png'), png512);
  fs.writeFileSync(path.join(publicIconsDir, 'apple-touch-icon.png'), png180);

  // Partner icons
  const partnerSvg192 = getPartnerSvg(192);
  const partnerSvg512 = getPartnerSvg(512);
  await sharp(Buffer.from(partnerSvg192)).png().toFile(path.join(publicIconsDir, 'partner-icon-192x192.png'));
  await sharp(Buffer.from(partnerSvg512)).png().toFile(path.join(publicIconsDir, 'partner-icon-512x512.png'));

  // Public Favicons & Icons
  fs.writeFileSync(path.join(publicDir, 'icon.png'), png512);
  fs.writeFileSync(path.join(publicDir, 'apple-icon.png'), png180);
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), png48);
  fs.writeFileSync(path.join(publicDir, 'favicon-96x96.png'), png96);
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), png48);

  // App directory icons (Next.js automatically uses these for metadata & tabs)
  fs.writeFileSync(path.join(appDir, 'icon.png'), png512);
  fs.writeFileSync(path.join(appDir, 'apple-icon.png'), png180);

  // ICO Favicon (32x32)
  const icoBuffer = makeIco(png32, 32, 32);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);

  console.log("All brand icons and favicons generated successfully!");
}

generate().catch(err => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
