import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeProfileImage() {
    const inputPath = path.join(__dirname, '../public/whatsapp_profile.jpeg');
    const outputDir = path.join(__dirname, '../public/images');
    
    // Create different sizes for responsive images
    const sizes = [128, 256]; // 1x and 2x for retina displays
    
    for (const size of sizes) {
        await sharp(inputPath)
            .resize(size, size, {
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 80 }) // Good balance between quality and size
            .toFile(path.join(outputDir, `profile-${size}.webp`));
            
        // Create a fallback JPEG version for browsers that don't support WebP
        await sharp(inputPath)
            .resize(size, size, {
                fit: 'cover',
                position: 'center'
            })
            .jpeg({ quality: 80, mozjpeg: true })
            .toFile(path.join(outputDir, `profile-${size}.jpg`));
    }
}

optimizeProfileImage().catch(console.error);
