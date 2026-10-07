/**
 * Client-side Image Compression Utility
 * 
 * - Maximum width: 800px (proportional scale)
 * - Output format: image/jpeg
 * - Target quality: ~0.7 (adjusts downward to reach < 300 KB if possible)
 * - Rejection threshold: > 700 KB
 */

export interface CompressionResult {
  dataUrl: string;
  sizeInKB: number;
  width: number;
  height: number;
  isOverLimit: boolean; // true if > 700 KB
}

/**
 * Calculates approximate size in KB from a base64 Data URL
 */
export function getDataUrlSizeInKB(dataUrl: string): number {
  if (!dataUrl || !dataUrl.includes(',')) return 0;
  const base64Data = dataUrl.split(',')[1] || '';
  const padding = (base64Data.match(/=/g) || []).length;
  const bytes = (base64Data.length * 3) / 4 - padding;
  return Math.round(bytes / 1024);
}

/**
 * Compresses an image File or existing Data URL
 */
export async function compressImage(
  source: File | string,
  maxWidth = 800,
  targetQuality = 0.7
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate proportional dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Impossible de créer le contexte canvas 2D'));
          return;
        }

        // Fill with white background in case of PNG with transparency
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Draw image resized
        ctx.drawImage(img, 0, 0, width, height);

        // First pass at targetQuality (approx 0.7)
        let quality = targetQuality;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let sizeInKB = getDataUrlSizeInKB(dataUrl);

        // If larger than 300 KB, try slightly lower quality to get under 300 KB
        if (sizeInKB > 300 && quality > 0.4) {
          const pass2Quality = Math.max(0.45, quality - 0.2);
          const pass2DataUrl = canvas.toDataURL('image/jpeg', pass2Quality);
          const pass2Size = getDataUrlSizeInKB(pass2DataUrl);
          if (pass2Size < sizeInKB) {
            dataUrl = pass2DataUrl;
            sizeInKB = pass2Size;
          }
        }

        // Clean up object URL if created
        if (typeof source !== 'string' && img.src.startsWith('blob:')) {
          URL.revokeObjectURL(img.src);
        }

        resolve({
          dataUrl,
          sizeInKB,
          width,
          height,
          isOverLimit: sizeInKB > 700,
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error("Impossible de charger l'image pour compression"));
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      img.src = URL.createObjectURL(source);
    }
  });
}
