// Generates PWA icons from public/impetus-logo.png using sharp (already a devDependency).
// Run with: node scripts/make-pwa-icons.mjs
import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const src = path.join(root, 'public', 'impetus-logo.png')
const outDir = path.join(root, 'public', 'icons')

// Cream background matches the app palette (--background: #f7f4ef)
const BACKGROUND = { r: 247, g: 244, b: 239, alpha: 1 }

async function makeIcon(size, logoScale, name) {
  const logoSize = Math.round(size * logoScale)
  const logo = await sharp(src)
    .resize(logoSize, logoSize, { fit: 'inside' })
    .png()
    .toBuffer()

  await sharp({
    create: { width: size, height: size, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(path.join(outDir, name))

  console.log(`created ${name} (${size}x${size})`)
}

await sharp(src).metadata().then((m) => {
  if (!m.hasAlpha) {
    console.warn('warning: source logo has no alpha channel')
  }
})

await makeIcon(192, 0.72, 'icon-192.png')
await makeIcon(512, 0.72, 'icon-512.png')
// Maskable icons: keep content inside the ~80% safe-zone circle
await makeIcon(512, 0.56, 'icon-maskable-512.png')
await makeIcon(180, 0.72, 'apple-touch-icon.png')
