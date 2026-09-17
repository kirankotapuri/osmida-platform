import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const artifactDir = "C:\\Users\\YASH\\.gemini\\antigravity-ide\\brain\\1753a7d7-5d31-44a4-aba8-65c1635d6e0e";
    const publicImagesDir = path.join(process.cwd(), "public", "images");

    if (!fs.existsSync(publicImagesDir)) {
      fs.mkdirSync(publicImagesDir, { recursive: true });
    }

    const files = fs.readdirSync(artifactDir);
    const copied: string[] = [];

    // Map patterns to public destinations
    const mappings = [
      { pattern: "osmida_hero_tech", target: "hero-tech.jpg" },
      { pattern: "osmida_pest_tech", target: "service-pest.jpg" },
      { pattern: "osmida_ac_tech", target: "service-ac.jpg" },
      { pattern: "osmida_clean_tech", target: "service-cleaning.jpg" },
    ];

    for (const map of mappings) {
      const match = files.find((f) => f.startsWith(map.pattern) && f.endsWith(".jpg"));
      if (match) {
        const srcPath = path.join(artifactDir, match);
        const destPath = path.join(publicImagesDir, map.target);
        fs.copyFileSync(srcPath, destPath);
        
        // Also copy to v2 filename to guarantee fresh cache busting
        const ext = path.extname(map.target);
        const base = path.basename(map.target, ext);
        const v2DestPath = path.join(publicImagesDir, `${base}-v2${ext}`);
        fs.copyFileSync(srcPath, v2DestPath);

        copied.push(`${match} -> ${map.target} and ${base}-v2${ext}`);
      }
    }

    // Clear Next.js image cache
    const cacheDir = path.join(process.cwd(), ".next", "cache", "images");
    if (fs.existsSync(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      copied.push("Cleared .next/cache/images");
    }

    return NextResponse.json({ success: true, copied });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
