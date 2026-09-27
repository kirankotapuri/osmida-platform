const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicIconsDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(publicIconsDir)) {
  fs.mkdirSync(publicIconsDir, { recursive: true });
}

// Worker/Partner App Icon SVG:
// ONLY background changed to Night Slate (#0E131F) matching worker app dark theme
// The symbol (white ring + orange roof triangle) is 100% UNCHANGED
function getPartnerSvg(size, isMaskable = false) {
  const r = isMaskable ? 0 : size * 0.22;
  // If maskable, safe zone is inner 80%, so scale symbol slightly
  const scale = isMaskable ? 0.8 : 1.0;
  const cx = size * 0.5;
  const cy = size * 0.53;
  const radius = size * 0.26 * scale;
  const strokeWidth = size * 0.08 * scale;

  const topY = cy - radius - (size * 0.16 * scale);
  const leftX = cx - (size * 0.26 * scale);
  const rightX = cx + (size * 0.26 * scale);
  const bottomY = cy - radius + (size * 0.06 * scale);

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Night Slate (#0E131F) Background -->
  <rect width="${size}" height="${size}" rx="${r}" fill="#0E131F" />
  <!-- Identical White Ring 'O' -->
  <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#FFFFFF" stroke-width="${strokeWidth}" />
  <!-- Identical Amber/Orange Roof Triangle -->
  <polygon points="${cx},${topY} ${leftX},${bottomY} ${rightX},${bottomY}" fill="#E68A00" />
</svg>`;
}

async function run() {
  console.log("Generating Night Slate (#0E131F) Worker/Partner App Icons...");

  const sizes = [
    { name: 'partner-icon-512x512.png', size: 512, maskable: false },
    { name: 'partner-icon-192x192.png', size: 192, maskable: false },
    { name: 'partner-apple-touch-icon.png', size: 180, maskable: false },
    { name: 'partner-icon-32x32.png', size: 32, maskable: false },
    { name: 'partner-icon-16x16.png', size: 16, maskable: false },
    { name: 'partner-icon-maskable-512x512.png', size: 512, maskable: true },
    { name: 'partner-icon-maskable-192x192.png', size: 192, maskable: true },
  ];

  // Save SVG version
  const svg512 = getPartnerSvg(512, false);
  fs.writeFileSync(path.join(publicIconsDir, 'partner-icon.svg'), svg512);

  // Generate all PNG sizes
  for (const item of sizes) {
    const svg = getPartnerSvg(item.size, item.maskable);
    const destPath = path.join(publicIconsDir, item.name);
    await sharp(Buffer.from(svg)).png().toFile(destPath);
    console.log(`✓ Created: ${item.name} (${item.size}x${item.size})`);
  }

  // Generate 60x60 test render for verification
  const testSvg = getPartnerSvg(60, false);
  await sharp(Buffer.from(testSvg)).png().toFile(path.join(publicIconsDir, 'partner-test-60x60.png'));
  console.log(`✓ Created 60x60 test render for verification`);

  console.log("\nWorker/Partner icons successfully updated to Night Slate (#0E131F)!");
  console.log("Customer app icons were completely untouched.");
}

run().catch((err) => {
  console.error("Error generating partner icons:", err);
  process.exit(1);
});
