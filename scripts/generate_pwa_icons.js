const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const publicIconsDir = path.join(rootDir, 'public', 'icons');
const publicDir = path.join(rootDir, 'public');
const appDir = path.join(rootDir, 'app');

if (!fs.existsSync(publicIconsDir)) {
  fs.mkdirSync(publicIconsDir, { recursive: true });
}

// Variation B SVG Path (Official Approved Wordmark with Electric Amber dot on 'i')
const svgVariationBPath = path.join(publicDir, 'logos', 'variation_b.svg');
const svgVariationBContent = fs.readFileSync(svgVariationBPath, 'utf8');

// Partner Specific Icon: Variation B wordmark with a subtle high-contrast "PARTNER" badge
function getPartnerWordmarkSvg() {
  return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Full-bleed Flat Dark Teal Background for Partner Dispatch -->
  <rect width="1024" height="1024" fill="#0C6266" />
  
  <!-- Approved Variation B Wordmark Paths -->
  <g id="wordmark" transform="translate(0, -50)">
    <path d="M219.47 458Q197.63 458 181.09 467.29Q164.56 476.57 155.47 493.31Q146.39 510.05 146.39 532.30Q146.39 549.04 151.60 562.72Q156.80 576.40 166.50 586.20Q176.19 595.99 189.67 601.20Q203.14 606.41 219.47 606.41Q241.31 606.41 257.75 597.22Q274.18 588.03 283.37 571.40Q292.55 554.76 292.55 532.30Q292.55 515.56 287.35 501.89Q282.14 488.21 272.45 478.31Q262.75 468.41 249.28 463.20Q235.80 458 219.47 458M219.47 489.43Q230.29 489.43 237.84 494.54Q245.40 499.64 249.48 509.24Q253.56 518.83 253.56 532.30Q253.56 552.51 244.58 563.74Q235.60 574.97 219.47 574.97Q208.86 574.97 201.20 569.97Q193.55 564.97 189.46 555.47Q185.38 545.98 185.38 532.30Q185.38 512.09 194.36 500.76Q203.34 489.43 219.47 489.43" fill="#FFFFFF" />
    <path d="M352.36 501.48Q343.38 501.48 334.09 502.81Q324.81 504.13 317.25 507.60Q312.15 509.64 310.01 513.11Q307.86 516.59 307.96 520.46Q308.07 524.34 310.21 527.51Q312.35 530.67 315.93 532Q319.50 533.32 323.99 531.69Q332.56 528.63 339.40 527.30Q346.24 525.98 352.57 525.98Q360.12 525.98 363.39 528.12Q366.65 530.26 366.65 533.73Q366.65 536.79 364.51 538.43Q362.37 540.06 358.49 540.67L335.83 544.35Q323.17 546.59 316.23 553.64Q309.29 560.68 309.29 572.11Q309.29 582.73 315.31 590.38Q321.34 598.04 331.85 602.22Q342.36 606.41 356.04 606.41Q365.23 606.41 372.78 605.08Q380.33 603.75 387.48 600.28Q391.97 598.44 393.80 594.97Q395.64 591.50 395.23 587.73Q394.83 583.95 392.68 580.79Q390.54 577.62 386.86 576.50Q383.19 575.38 378.29 577.01Q371.55 579.66 366.35 580.89Q361.14 582.11 356.65 582.11Q348.28 582.11 344.81 579.87Q341.34 577.62 341.34 574.15Q341.34 571.50 343.18 569.76Q345.02 568.03 348.89 567.42L371.55 563.54Q384.62 561.50 391.66 554.66Q398.70 547.82 398.70 536.18Q398.70 519.65 386.05 510.56Q373.39 501.48 352.36 501.48" fill="#FFFFFF" />
    <path d="M431.98 501.48Q423.40 501.48 418.71 506.17Q414.01 510.87 414.01 519.85L414.01 587.42Q414.01 596.20 418.61 600.89Q423.20 605.59 431.77 605.59Q440.35 605.59 444.84 600.89Q449.33 596.20 449.33 587.42L449.33 576.19L447.08 586.20Q451.37 595.18 459.84 600.59Q468.31 606 479.95 606Q490.97 606 498.83 600.69Q506.69 595.38 510.16 584.56L507.30 584.56Q512 594.57 521.39 600.28Q530.78 606 542.21 606Q554.05 606 561.61 601.40Q569.16 596.81 572.93 587.11Q576.71 577.42 576.71 562.72L576.71 519.85Q576.71 510.87 571.91 506.17Q567.12 501.48 558.34 501.48Q549.77 501.48 545.07 506.17Q540.38 510.87 540.38 519.85L540.38 561.70Q540.38 570.48 537.72 574.36Q535.07 578.23 528.94 578.23Q521.39 578.23 517.41 572.93Q513.43 567.62 513.43 557.82L513.43 519.85Q513.43 510.87 508.73 506.17Q504.04 501.48 495.26 501.48Q486.48 501.48 481.79 506.17Q477.09 510.87 477.09 519.85L477.09 561.70Q477.09 570.48 474.44 574.36Q471.78 578.23 465.66 578.23Q458.31 578.23 454.33 572.93Q450.35 567.62 450.35 557.82L450.35 519.85Q450.35 501.48 431.98 501.48" fill="#FFFFFF" />
    <path d="M615.70 501.89Q607.13 501.89 602.43 506.99Q597.74 512.09 597.74 521.69L597.74 586.20Q597.74 595.79 602.43 600.89Q607.13 606 615.70 606Q624.48 606 629.28 600.89Q634.07 595.79 634.07 586.20L634.07 521.69Q634.07 512.09 629.38 506.99Q624.68 501.89 615.70 501.89" fill="#FFFFFF" />
    <path d="M615.70 452.49Q606.11 452.49 600.90 456.98Q595.70 461.47 595.70 470.04Q595.70 478.41 600.90 482.90Q606.11 487.39 615.70 487.39Q625.70 487.39 630.81 482.90Q635.91 478.41 635.91 470.04Q635.91 461.47 630.81 456.98Q625.70 452.49 615.70 452.49" fill="#E68A00" />
    <path d="M694.29 458.41Q681.43 458.41 671.53 464.73Q661.63 471.06 656.02 482.90Q650.41 494.74 650.41 510.87Q650.41 527.40 656.02 539.04Q661.63 550.68 671.53 557Q681.43 563.33 694.29 563.33Q705.52 563.33 714.50 558.02Q723.49 552.72 726.55 544.35L724.30 544.35L724.30 588.03Q724.30 597.02 729 601.71Q733.69 606.41 742.47 606.41Q751.04 606.41 755.84 601.71Q760.64 597.02 760.64 588.03L760.64 477.19Q760.64 468.20 756.05 463.51Q751.45 458.81 742.68 458.81Q734.10 458.81 729.41 463.51Q724.71 468.20 724.71 477.19L724.71 488.82L726.96 478.82Q724.10 469.63 715.01 464.02Q705.93 458.41 694.29 458.41M705.93 485.15Q711.44 485.15 715.73 487.90Q720.02 490.66 722.36 496.27Q724.71 501.89 724.71 510.87Q724.71 524.55 719.40 530.57Q714.10 536.59 705.93 536.59Q700.42 536.59 696.13 533.94Q691.84 531.28 689.40 525.67Q686.95 520.06 686.95 510.87Q686.95 497.40 692.25 491.27Q697.56 485.15 705.93 485.15" fill="#FFFFFF" />
    <path d="M816.57 501.48Q804.94 501.48 796.06 505.77Q787.18 510.05 782.18 517.50Q777.17 524.95 777.17 534.55Q777.17 545.57 782.89 551.90Q788.61 558.23 801.26 560.98Q813.92 563.74 834.95 563.74L846.17 563.74L846.17 546.59L834.95 546.59Q826.98 546.59 821.78 545.47Q816.57 544.35 814.12 542Q811.67 539.65 811.67 535.98Q811.67 531.28 815.04 528.22Q818.41 525.16 824.74 525.16Q829.84 525.16 833.82 527.40Q837.80 529.65 840.25 533.63Q842.70 537.61 842.70 542.92L842.70 566.60Q842.70 573.95 838.93 577.01Q835.15 580.07 825.96 580.07Q821.06 580.07 814.94 578.95Q808.82 577.83 801.26 574.97Q795.75 572.93 791.87 574.36Q787.99 575.78 785.85 579.26Q783.71 582.73 783.81 586.81Q783.91 590.89 786.46 594.57Q789.01 598.24 794.32 600.28Q804.12 603.96 812.39 605.18Q820.66 606.41 827.60 606.41Q844.34 606.41 855.26 601.61Q866.18 596.81 871.59 586.91Q877 577.01 877 561.50L877 520.26Q877 511.28 872.71 506.58Q868.42 501.89 860.26 501.89Q851.89 501.89 847.50 506.58Q843.11 511.28 843.11 520.26L843.11 525.57L844.34 522.71Q843.31 516.18 839.64 511.48Q835.97 506.79 830.05 504.13Q824.13 501.48 816.57 501.48" fill="#FFFFFF" />
  </g>

  <!-- Partner Badge Pill -->
  <rect x="362" y="650" width="300" height="70" rx="35" fill="#E68A00" />
  <text x="512" y="698" font-family="Arial, sans-serif" font-weight="900" font-size="34" fill="#0C6266" text-anchor="middle" letter-spacing="4">
    PARTNER
  </text>
</svg>`;
}

// Valid ICO builder with 48x48, 32x32, 16x16
function makeMultiIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(count, 4); // number of images

  let offset = 6 + count * 16;
  const dirBuffers = [];
  const imgBuffers = [];

  for (const img of images) {
    const dir = Buffer.alloc(16);
    dir.writeUInt8(img.width === 256 ? 0 : img.width, 0);
    dir.writeUInt8(img.height === 256 ? 0 : img.height, 1);
    dir.writeUInt8(0, 2); // palette
    dir.writeUInt8(0, 3); // reserved
    dir.writeUInt16LE(1, 4); // planes
    dir.writeUInt16LE(32, 6); // bpp
    dir.writeUInt32LE(img.buffer.length, 8); // size
    dir.writeUInt32LE(offset, 12); // offset

    offset += img.buffer.length;
    dirBuffers.push(dir);
    imgBuffers.push(img.buffer);
  }

  return Buffer.concat([header, ...dirBuffers, ...imgBuffers]);
}

async function generateAll() {
  console.log("Generating complete production icons using approved Variation B wordmark...");

  const masterSvg = svgVariationBContent;

  // Render PNG sizes from master SVG
  const [png1024, png512, png192, png180, png152, png96, png48, png32, png16] = await Promise.all([
    sharp(Buffer.from(masterSvg)).resize(1024, 1024, { kernel: sharp.kernel.lanczos3 }).png().toBuffer(),
    sharp(Buffer.from(masterSvg)).resize(512, 512, { kernel: sharp.kernel.lanczos3 }).png().toBuffer(),
    sharp(Buffer.from(masterSvg)).resize(192, 192, { kernel: sharp.kernel.lanczos3 }).png().toBuffer(),
    sharp(Buffer.from(masterSvg)).resize(180, 180, { kernel: sharp.kernel.lanczos3 }).png().toBuffer(),
    sharp(Buffer.from(masterSvg)).resize(152, 152, { kernel: sharp.kernel.lanczos3 }).png().toBuffer(),
    sharp(Buffer.from(masterSvg)).resize(96, 96, { kernel: sharp.kernel.lanczos3 }).png().toBuffer(),
    sharp(Buffer.from(masterSvg)).resize(48, 48, { kernel: sharp.kernel.lanczos3 }).png().toBuffer(),
    sharp(Buffer.from(masterSvg)).resize(32, 32, { kernel: sharp.kernel.lanczos3 }).png().toBuffer(),
    sharp(Buffer.from(masterSvg)).resize(16, 16, { kernel: sharp.kernel.lanczos3 }).png().toBuffer(),
  ]);

  // Write SVGs
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), masterSvg);
  fs.writeFileSync(path.join(publicDir, 'apple-icon.svg'), masterSvg);
  fs.writeFileSync(path.join(appDir, 'icon.svg'), masterSvg);
  fs.writeFileSync(path.join(appDir, 'apple-icon.svg'), masterSvg);

  // Write PNGs to public/
  fs.writeFileSync(path.join(publicDir, 'icon.png'), png512);
  fs.writeFileSync(path.join(publicDir, 'apple-icon.png'), png180);
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), png48);
  fs.writeFileSync(path.join(publicDir, 'favicon-96x96.png'), png96);
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), png48);

  // Write PNGs to app/ (Next.js App router)
  fs.writeFileSync(path.join(appDir, 'icon.png'), png512);
  fs.writeFileSync(path.join(appDir, 'apple-icon.png'), png180);

  // Write PWA Icons to public/icons/
  fs.writeFileSync(path.join(publicIconsDir, 'icon-512x512.png'), png512);
  fs.writeFileSync(path.join(publicIconsDir, 'icon-192x192.png'), png192);
  fs.writeFileSync(path.join(publicIconsDir, 'apple-touch-icon.png'), png180);

  // Partner Icons
  const partnerSvg = getPartnerWordmarkSvg();
  const partnerPng192 = await sharp(Buffer.from(partnerSvg)).resize(192, 192).png().toBuffer();
  const partnerPng512 = await sharp(Buffer.from(partnerSvg)).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(publicIconsDir, 'partner-icon-192x192.png'), partnerPng192);
  fs.writeFileSync(path.join(publicIconsDir, 'partner-icon-512x512.png'), partnerPng512);

  // Build multi-res Favicon.ico (48, 32, 16)
  const multiIco = makeMultiIco([
    { width: 48, height: 48, buffer: png48 },
    { width: 32, height: 32, buffer: png32 },
    { width: 16, height: 16, buffer: png16 },
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), multiIco);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), multiIco);

  console.log("All production assets updated successfully with Variation B!");
}

generateAll().catch(console.error);

