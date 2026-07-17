import sharp from 'sharp'
import { readdirSync, statSync, unlinkSync, renameSync } from 'fs'
import { join } from 'path'

const publicDir = 'C:\\Users\\hp\\IMPETUSS\\impetus\\public'
const files = readdirSync(publicDir).filter(f => f.endsWith('.jpg'))

for (const file of files) {
  const filepath = join(publicDir, file)
  const stats = statSync(filepath)
  const sizeMB = stats.size / (1024 * 1024)

  if (sizeMB > 1.5) {
    console.log(`Optimizing ${file} (${sizeMB.toFixed(1)}MB)...`)
    const tempPath = filepath + '.tmp'
    await sharp(filepath)
      .resize(1920, null, { withoutEnlargement: true, fit: 'inside' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(tempPath)
    
    const optimizedStats = statSync(tempPath)
    const optimizedMB = optimizedStats.size / (1024 * 1024)
    console.log(`  -> ${optimizedMB.toFixed(1)}MB (${((1 - optimizedMB/sizeMB)*100).toFixed(0)}% reduction)`)
    
    // Replace original
    unlinkSync(filepath)
    renameSync(tempPath, filepath)
    console.log(`  -> Replaced original`)
  }
}

console.log('Done!')