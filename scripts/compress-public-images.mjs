import sharp from 'sharp'
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs'
import { join, extname, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const MIN_SIZE = 150 * 1024
const MAX_WIDTH = 1920

function walk(dir) {
  const entries = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) entries.push(...walk(full))
    else entries.push(full)
  }
  return entries
}

const files = walk(publicDir).filter((f) => {
  const ext = extname(f).toLowerCase()
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && statSync(f).size > MIN_SIZE
})

let beforeTotal = 0
let afterTotal = 0

for (const file of files) {
  const before = statSync(file).size
  const ext = extname(file).toLowerCase()
  const rel = relative(publicDir, file)

  try {
    const input = readFileSync(file)
    let pipeline = sharp(input).rotate()
    const meta = await pipeline.metadata()
    if (meta.width && meta.width > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })
    }

    let out
    if (ext === '.png') {
      out = await pipeline.png({ compressionLevel: 9, palette: true, quality: 85 }).toBuffer()
    } else if (ext === '.webp') {
      out = await pipeline.webp({ quality: 80 }).toBuffer()
    } else {
      out = await pipeline.jpeg({ quality: 78, mozjpeg: true }).toBuffer()
    }

    if (out.length < before) {
      writeFileSync(file, out)
      const after = out.length
      beforeTotal += before
      afterTotal += after
      console.log(
        `${rel}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (-${((1 - after / before) * 100).toFixed(0)}%)`
      )
    } else {
      console.log(`${rel}: skipped (already optimized)`)
    }
  } catch (err) {
    console.error(`${rel}: FAILED - ${err.message}`)
  }
}

console.log('---')
console.log(
  `Total: ${(beforeTotal / 1024 / 1024).toFixed(1)}MB -> ${(afterTotal / 1024 / 1024).toFixed(1)}MB (-${((1 - afterTotal / beforeTotal) * 100).toFixed(0)}%)`
)
