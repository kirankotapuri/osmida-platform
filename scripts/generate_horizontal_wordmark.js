const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const nunitoBuffer = fs.readFileSync(path.join(__dirname, 'Nunito-900.ttf'));
const font = opentype.parse(nunitoBuffer.buffer);

function buildGlyphs(font, text, fontSize) {
  let curX = 0;
  const glyphs = [];
  const scale = fontSize / font.unitsPerEm;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const g = font.charToGlyph(char);
    glyphs.push({ char, glyph: g, x: curX, width: g.advanceWidth * scale });
    let kerning = 0;
    if (i < text.length - 1) {
      const nextG = font.charToGlyph(text[i + 1]);
      kerning = font.getKerningValue(g, nextG) * scale;
    }
    curX += g.advanceWidth * scale + kerning;
  }
  return { glyphs, totalWidth: curX };
}

const fontSize = 120;
const { glyphs } = buildGlyphs(font, 'Osmida', fontSize);

// minX = 5.52, minY = 10.84, maxX = 435, maxY = 101.32
const offsetX = -5.52;
const offsetY = 100; // baseline

function createWordmarkSvg(textColor, dotColor) {
  let pathsSvg = '';
  for (const item of glyphs) {
    if (item.char === 'i') {
      const gPath = item.glyph.getPath(item.x + offsetX, offsetY, fontSize);
      const commands = gPath.commands;
      let moveIndices = [];
      commands.forEach((c, idx) => {
        if (c.type === 'M') moveIndices.push(idx);
      });
      if (moveIndices.length >= 2) {
        const stemPath = new opentype.Path();
        stemPath.commands = commands.slice(moveIndices[0], moveIndices[1]);
        const dotPath = new opentype.Path();
        dotPath.commands = commands.slice(moveIndices[1]);
        pathsSvg += `  <path d="${stemPath.toPathData()}" fill="${textColor}" />\n`;
        pathsSvg += `  <path d="${dotPath.toPathData()}" fill="${dotColor}" />\n`;
      } else {
        pathsSvg += `  <path d="${gPath.toPathData()}" fill="${textColor}" />\n`;
      }
    } else {
      const p = item.glyph.getPath(item.x + offsetX, offsetY, fontSize);
      pathsSvg += `  <path d="${p.toPathData()}" fill="${textColor}" />\n`;
    }
  }

  // Width is ~430, height from 10 to 102 is ~92.
  return `<svg viewBox="-4 8 438 96" xmlns="http://www.w3.org/2000/svg">
${pathsSvg}</svg>`;
}

const logosDir = path.join(__dirname, '..', 'public', 'logos');
if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });

fs.writeFileSync(path.join(logosDir, 'osmida_wordmark_teal.svg'), createWordmarkSvg('#0C6266', '#E68A00'));
fs.writeFileSync(path.join(logosDir, 'osmida_wordmark_white.svg'), createWordmarkSvg('#FFFFFF', '#E68A00'));
console.log('Horizontal wordmark SVGs created successfully in public/logos!');
