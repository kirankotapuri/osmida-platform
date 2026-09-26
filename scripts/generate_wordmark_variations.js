const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const opentype = require('opentype.js');

const outDir = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Brand Colors
const TEAL_BG = '#0C6266';
const WHITE_TEXT = '#FFFFFF';
const AMBER_ACCENT = '#E68A00';

const CANVAS_SIZE = 1024;
const TARGET_WIDTH = 750; // ~73% of canvas width

// Load Fonts
const nunitoBuffer = fs.readFileSync(path.join(__dirname, 'Nunito-900.ttf'));
const nunitoFont = opentype.parse(nunitoBuffer.buffer);

const balooBuffer = fs.readFileSync(path.join(__dirname, 'Baloo2-800.ttf'));
const balooFont = opentype.parse(balooBuffer.buffer);

/**
 * Build glyph paths for a font and target word
 */
function buildGlyphs(font, text, fontSize) {
  let curX = 0;
  const glyphs = [];
  const scale = fontSize / font.unitsPerEm;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const g = font.charToGlyph(char);
    glyphs.push({
      char,
      glyph: g,
      x: curX,
      width: g.advanceWidth * scale,
    });
    // Check kerning
    let kerning = 0;
    if (i < text.length - 1) {
      const nextG = font.charToGlyph(text[i + 1]);
      kerning = font.getKerningValue(g, nextG) * scale;
    }
    curX += g.advanceWidth * scale + kerning;
  }
  return { glyphs, totalWidth: curX };
}

/**
 * Generate SVG for Variation A (Pure White Nunito 900)
 */
function generateVariationA() {
  const sampleSize = 100;
  const sample = buildGlyphs(nunitoFont, 'Osmida', sampleSize);
  const scaleFactor = TARGET_WIDTH / sample.totalWidth;
  const fontSize = sampleSize * scaleFactor;

  const { glyphs, totalWidth } = buildGlyphs(nunitoFont, 'Osmida', fontSize);
  const startX = (CANVAS_SIZE - totalWidth) / 2;
  const baseY = CANVAS_SIZE * 0.59; // optical vertical center

  let pathsSvg = '';
  for (const item of glyphs) {
    const p = item.glyph.getPath(startX + item.x, baseY, fontSize);
    pathsSvg += `<path d="${p.toPathData()}" fill="${WHITE_TEXT}" />\n`;
  }

  return `<svg width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}" xmlns="http://www.w3.org/2000/svg">
  <!-- Full-bleed Flat Teal Background (No Gradient) -->
  <rect width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" fill="${TEAL_BG}" />
  <!-- Variation A: Bold Rounded Geometric Wordmark (Pure White) -->
  <g id="wordmark">
    ${pathsSvg}
  </g>
</svg>`;
}

/**
 * Generate SVG for Variation B (Nunito 900 with Electric Amber Dot on 'i')
 */
function generateVariationB() {
  const sampleSize = 100;
  const sample = buildGlyphs(nunitoFont, 'Osmida', sampleSize);
  const scaleFactor = TARGET_WIDTH / sample.totalWidth;
  const fontSize = sampleSize * scaleFactor;

  const { glyphs, totalWidth } = buildGlyphs(nunitoFont, 'Osmida', fontSize);
  const startX = (CANVAS_SIZE - totalWidth) / 2;
  const baseY = CANVAS_SIZE * 0.59;

  let pathsSvg = '';
  for (const item of glyphs) {
    if (item.char === 'i') {
      // Separate stem and dot
      const gPath = item.glyph.getPath(startX + item.x, baseY, fontSize);
      // Split into two subpaths by 'M' commands
      const commands = gPath.commands;
      let moveIndices = [];
      commands.forEach((c, idx) => {
        if (c.type === 'M') moveIndices.push(idx);
      });

      if (moveIndices.length >= 2) {
        // Contour 1 = stem, Contour 2 = dot
        const stemCmds = commands.slice(moveIndices[0], moveIndices[1]);
        const dotCmds = commands.slice(moveIndices[1]);

        const stemPath = new opentype.Path();
        stemPath.commands = stemCmds;
        const dotPath = new opentype.Path();
        dotPath.commands = dotCmds;

        pathsSvg += `<path d="${stemPath.toPathData()}" fill="${WHITE_TEXT}" />\n`;
        pathsSvg += `<path d="${dotPath.toPathData()}" fill="${AMBER_ACCENT}" />\n`;
      } else {
        pathsSvg += `<path d="${gPath.toPathData()}" fill="${WHITE_TEXT}" />\n`;
      }
    } else {
      const p = item.glyph.getPath(startX + item.x, baseY, fontSize);
      pathsSvg += `<path d="${p.toPathData()}" fill="${WHITE_TEXT}" />\n`;
    }
  }

  return `<svg width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}" xmlns="http://www.w3.org/2000/svg">
  <!-- Full-bleed Flat Teal Background (No Gradient) -->
  <rect width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" fill="${TEAL_BG}" />
  <!-- Variation B: Bold Rounded Wordmark with Electric Amber Dot on 'i' -->
  <g id="wordmark">
    ${pathsSvg}
  </g>
</svg>`;
}

/**
 * Generate SVG for Variation C (Baloo 2 ExtraBold 800)
 */
function generateVariationC() {
  const sampleSize = 100;
  const sample = buildGlyphs(balooFont, 'Osmida', sampleSize);
  const scaleFactor = TARGET_WIDTH / sample.totalWidth;
  const fontSize = sampleSize * scaleFactor;

  const { glyphs, totalWidth } = buildGlyphs(balooFont, 'Osmida', fontSize);
  const startX = (CANVAS_SIZE - totalWidth) / 2;
  const baseY = CANVAS_SIZE * 0.62; // Baloo baseline adjustment

  let pathsSvg = '';
  for (const item of glyphs) {
    const p = item.glyph.getPath(startX + item.x, baseY, fontSize);
    pathsSvg += `<path d="${p.toPathData()}" fill="${WHITE_TEXT}" />\n`;
  }

  return `<svg width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}" xmlns="http://www.w3.org/2000/svg">
  <!-- Full-bleed Flat Teal Background (No Gradient) -->
  <rect width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" fill="${TEAL_BG}" />
  <!-- Variation C: Baloo 2 ExtraBold Soft Chunky Display -->
  <g id="wordmark">
    ${pathsSvg}
  </g>
</svg>`;
}

async function renderAndExportAll() {
  console.log('Generating Osmida App-Icon Wordmark Variations...');

  const variations = [
    { id: 'variation_a', name: 'Variation A (Pure White Rounded Bold)', svg: generateVariationA() },
    { id: 'variation_b', name: 'Variation B (White Rounded Bold + Electric Amber Dot)', svg: generateVariationB() },
    { id: 'variation_c', name: 'Variation C (Baloo 2 ExtraBold Soft Chunky)', svg: generateVariationC() },
  ];

  const testSizes = [1024, 512, 192, 48, 32, 16];

  for (const v of variations) {
    console.log(`\nRendering ${v.name}...`);
    // Save SVG
    fs.writeFileSync(path.join(outDir, `${v.id}.svg`), v.svg);

    const masterBuf = Buffer.from(v.svg);

    // Export each size
    for (const size of testSizes) {
      const outPath = path.join(outDir, `${v.id}_${size}.png`);
      await sharp(masterBuf)
        .resize(size, size, { kernel: sharp.kernel.lanczos3 })
        .png()
        .toFile(outPath);
      console.log(`  -> ${size}x${size} exported to ${v.id}_${size}.png`);
    }
  }

  console.log('\nAll variations and test scales generated successfully in public/logos/!');
}

renderAndExportAll().catch(console.error);
