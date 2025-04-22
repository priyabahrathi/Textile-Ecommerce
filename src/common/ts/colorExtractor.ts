export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface SkinToneCategory {
  name: string;
  description: string;
  minRGB: RGB;
  maxRGB: RGB;
}

export const SKIN_TONE_CATEGORIES: SkinToneCategory[] = [
  {
    name: "Type I",
    description: "Very fair, always burns, never tans",
    minRGB: { r: 255, g: 218, b: 185 },
    maxRGB: { r: 255, g: 236, b: 204 }
  },
  {
    name: "Type II",
    description: "Fair, burns easily, tans minimally",
    minRGB: { r: 241, g: 194, b: 125 },
    maxRGB: { r: 255, g: 218, b: 185 }
  },
  {
    name: "Type III",
    description: "Medium, burns moderately, tans gradually",
    minRGB: { r: 224, g: 172, b: 105 },
    maxRGB: { r: 241, g: 194, b: 125 }
  },
  {
    name: "Type IV",
    description: "Olive, burns minimally, tans well",
    minRGB: { r: 198, g: 134, b: 66 },
    maxRGB: { r: 224, g: 172, b: 105 }
  },
  {
    name: "Type V",
    description: "Brown, rarely burns, tans profusely",
    minRGB: { r: 141, g: 85, b: 36 },
    maxRGB: { r: 198, g: 134, b: 66 }
  },
  {
    name: "Type VI",
    description: "Dark brown to black, never burns",
    minRGB: { r: 70, g: 39, b: 23 },
    maxRGB: { r: 141, g: 85, b: 36 }
  }
];

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getSkinToneCategory(color: RGB): SkinToneCategory | undefined {
  return SKIN_TONE_CATEGORIES.find(category =>
    color.r >= category.minRGB.r && color.r <= category.maxRGB.r &&
    color.g >= category.minRGB.g && color.g <= category.maxRGB.g &&
    color.b >= category.minRGB.b && color.b <= category.maxRGB.b
  );
}

// 👇 Additional - Simple brightness-based tone
export function getSimpleSkinToneLevel(rgb: RGB): "Dark" | "Medium" | "Fair" {
  const brightness = (rgb.r + rgb.g + rgb.b) / 3;
  if (brightness < 85) return "Dark";
  if (brightness <= 170) return "Medium";
  return "Fair";
}

export function isSkinTone(r: number, g: number, b: number): boolean {
  const sum = r + g + b;
  const rRatio = r / sum;
  const gRatio = g / sum;
  const bRatio = b / sum;

  return (
    rRatio > 0.3 && rRatio < 0.5 &&
    gRatio > 0.28 && gRatio < 0.35 &&
    bRatio > 0.2 && bRatio < 0.3 &&
    r > g && g > b &&
    r > 60 && r < 250 &&
    g > 45 && g < 200 &&
    b > 30 && b < 170
  );
}

export function isClothingColor(r: number, g: number, b: number): boolean {
  const brightness = (r + g + b) / 3;
  const saturation = Math.max(r, g, b) - Math.min(r, g, b);
  return brightness > 20 && brightness < 235 && saturation > 10;
}

export async function extractPersonColors(imageUrl: string): Promise<{
  skinTones: Array<{ rgb: RGB; category?: SkinToneCategory }>;
  clothingColors: RGB[];
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context not found'));

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const centerX = Math.floor(canvas.width * 0.2);
      const centerWidth = Math.floor(canvas.width * 0.6);
      const centerY = Math.floor(canvas.height * 0.1);
      const centerHeight = Math.floor(canvas.height * 0.8);

      const imageData = ctx.getImageData(centerX, centerY, centerWidth, centerHeight);
      const pixels = imageData.data;

      const skinTones = new Map<string, { rgb: RGB; count: number }>();
      const clothingColors = new Map<string, { rgb: RGB; count: number }>();

      for (let i = 0; i < pixels.length; i += 16) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        if (a < 128) continue;
        const key = `${r},${g},${b}`;

        if (isSkinTone(r, g, b)) {
          const existing = skinTones.get(key);
          existing ? existing.count++ : skinTones.set(key, { rgb: { r, g, b }, count: 1 });
        } else if (isClothingColor(r, g, b)) {
          const existing = clothingColors.get(key);
          existing ? existing.count++ : clothingColors.set(key, { rgb: { r, g, b }, count: 1 });
        }
      }

      const topSkinTones = Array.from(skinTones.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 2)
        .map(item => ({
          rgb: item.rgb,
          category: getSkinToneCategory(item.rgb),
        }));

      const topClothingColors = Array.from(clothingColors.values())
        .sort((a, b) => b.count - a.count)
        .map(item => item.rgb)
        .slice(0, 3);

      resolve({
        skinTones: topSkinTones,
        clothingColors: topClothingColors,
      });
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}
