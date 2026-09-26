const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const logosDir = path.join(__dirname, '..', 'public', 'logos');

async function createComposite() {
  const width = 1200;
  const height = 1100;

  // Render composite canvas with dark/neutral background for professional design review
  const canvasSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#0A0F1D" />
      
      <!-- Title Header -->
      <text x="600" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">
        OSMIDA WORDMARK REDESIGN — 3 VARIATIONS
      </text>
      <text x="600" y="85" font-family="Arial, sans-serif" font-weight="500" font-size="14" fill="#94A3B8" text-anchor="middle">
        Full-Bleed Flat Deep Heritage Teal (#0C6266) • Title Case "Osmida" • High-Contrast Bold Construction
      </text>
      
      <!-- Column Headers -->
      <text x="210" y="145" font-family="Arial, sans-serif" font-weight="700" font-size="16" fill="#38B2AC" text-anchor="middle">
        VARIATION A
      </text>
      <text x="210" y="168" font-family="Arial, sans-serif" font-weight="500" font-size="12" fill="#CBD5E1" text-anchor="middle">
        Pure White Ultra-Bold (Nunito 900)
      </text>

      <text x="600" y="145" font-family="Arial, sans-serif" font-weight="700" font-size="16" fill="#E68A00" text-anchor="middle">
        VARIATION B (RECOMMENDED)
      </text>
      <text x="600" y="168" font-family="Arial, sans-serif" font-weight="500" font-size="12" fill="#CBD5E1" text-anchor="middle">
        White Bold + Electric Amber Dot on 'i'
      </text>

      <text x="990" y="145" font-family="Arial, sans-serif" font-weight="700" font-size="16" fill="#60A5FA" text-anchor="middle">
        VARIATION C
      </text>
      <text x="990" y="168" font-family="Arial, sans-serif" font-weight="500" font-size="12" fill="#CBD5E1" text-anchor="middle">
        Baloo 2 ExtraBold Soft Display
      </text>

      <!-- Section Dividers -->
      <line x1="50" y1="520" x2="1150" y2="520" stroke="#1E293B" stroke-width="2" />
      
      <text x="600" y="560" font-family="Arial, sans-serif" font-weight="800" font-size="18" fill="#F8FAFC" text-anchor="middle">
        REAL-WORLD APP-ICON RESOLUTION TEST
      </text>
      <text x="600" y="582" font-family="Arial, sans-serif" font-weight="500" font-size="12" fill="#94A3B8" text-anchor="middle">
        Tested at true phone home screen scale (48x48) &amp; browser tab scale (32x32, 16x16)
      </text>

      <!-- Scale Labels -->
      <text x="100" y="660" font-family="Arial, sans-serif" font-weight="700" font-size="13" fill="#E2E8F0">48x48 Phone Grid:</text>
      <text x="100" y="770" font-family="Arial, sans-serif" font-weight="700" font-size="13" fill="#E2E8F0">48x48 (Zoomed 3x):</text>
      <text x="100" y="930" font-family="Arial, sans-serif" font-weight="700" font-size="13" fill="#E2E8F0">32x32 Tab Scale:</text>
      <text x="100" y="1020" font-family="Arial, sans-serif" font-weight="700" font-size="13" fill="#E2E8F0">16x16 Favicon:</text>
    </svg>
  `;

  // Read large preview buffers (size 320x320 for composite layout)
  const [a320, b320, c320] = await Promise.all([
    sharp(path.join(logosDir, 'variation_a_512.png')).resize(320, 320).toBuffer(),
    sharp(path.join(logosDir, 'variation_b_512.png')).resize(320, 320).toBuffer(),
    sharp(path.join(logosDir, 'variation_c_512.png')).resize(320, 320).toBuffer(),
  ]);

  // Read small test buffers
  const [a48, b48, c48] = await Promise.all([
    sharp(path.join(logosDir, 'variation_a_48.png')).toBuffer(),
    sharp(path.join(logosDir, 'variation_b_48.png')).toBuffer(),
    sharp(path.join(logosDir, 'variation_c_48.png')).toBuffer(),
  ]);

  // Read zoomed 48x48 buffers (144x144) to inspect pixel grid
  const [a48zoom, b48zoom, c48zoom] = await Promise.all([
    sharp(path.join(logosDir, 'variation_a_48.png')).resize(120, 120, { kernel: sharp.kernel.nearest }).toBuffer(),
    sharp(path.join(logosDir, 'variation_b_48.png')).resize(120, 120, { kernel: sharp.kernel.nearest }).toBuffer(),
    sharp(path.join(logosDir, 'variation_c_48.png')).resize(120, 120, { kernel: sharp.kernel.nearest }).toBuffer(),
  ]);

  const [a32, b32, c32] = await Promise.all([
    sharp(path.join(logosDir, 'variation_a_32.png')).toBuffer(),
    sharp(path.join(logosDir, 'variation_b_32.png')).toBuffer(),
    sharp(path.join(logosDir, 'variation_c_32.png')).toBuffer(),
  ]);

  const [a16, b16, c16] = await Promise.all([
    sharp(path.join(logosDir, 'variation_a_16.png')).toBuffer(),
    sharp(path.join(logosDir, 'variation_b_16.png')).toBuffer(),
    sharp(path.join(logosDir, 'variation_c_16.png')).toBuffer(),
  ]);

  const composite = await sharp(Buffer.from(canvasSvg))
    .composite([
      // Large 320x320 cards (x = 50, 440, 830)
      { input: a320, top: 180, left: 50 },
      { input: b320, top: 180, left: 440 },
      { input: c320, top: 180, left: 830 },

      // 48x48 True size
      { input: a48, top: 635, left: 440 },
      { input: b48, top: 635, left: 660 },
      { input: c48, top: 635, left: 880 },

      // 48x48 Zoomed 3x (120x120)
      { input: a48zoom, top: 720, left: 400 },
      { input: b48zoom, top: 720, left: 620 },
      { input: c48zoom, top: 720, left: 840 },

      // 32x32 True size
      { input: a32, top: 910, left: 440 },
      { input: b32, top: 910, left: 660 },
      { input: c32, top: 910, left: 880 },

      // 16x16 True size
      { input: a16, top: 1005, left: 440 },
      { input: b16, top: 1005, left: 660 },
      { input: c16, top: 1005, left: 880 },
    ])
    .png()
    .toFile(path.join(logosDir, 'comparison_sheet.png'));

  console.log('Comparison sheet created successfully: public/logos/comparison_sheet.png');
}

createComposite().catch(console.error);
