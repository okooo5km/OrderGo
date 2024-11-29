import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

async function generateIcons() {
  const svg = readFileSync(join(process.cwd(), 'app/favicon.svg'));
  
  // 生成 192x192 图标
  await sharp(svg)
    .resize(192, 192)
    .png()
    .toFile(join(process.cwd(), 'public/icon-192x192.png'));

  // 生成 512x512 图标
  await sharp(svg)
    .resize(512, 512)
    .png()
    .toFile(join(process.cwd(), 'public/icon-512x512.png'));
}

generateIcons().catch(console.error); 