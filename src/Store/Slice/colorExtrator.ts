export type RGB = { r: number; g: number; b: number };

function isSkinLike(color: RGB): boolean {
  const { r, g, b } = color;
  return (
    r > 95 &&
    g > 40 &&
    b > 20 &&
    r > g &&
    r > b &&
    Math.abs(r - g) > 15 &&
    !(r > 220 && g > 210 && b > 170)
  );
}

function getDominantColors(pixels: RGB[], count: number): RGB[] {
  const colorMap = new Map<string, { color: RGB; count: number }>();

  for (const pixel of pixels) {
    const key = `${Math.round(pixel.r / 10) * 10}_${Math.round(pixel.g / 10) * 10}_${Math.round(pixel.b / 10) * 10}`;
    if (!colorMap.has(key)) {
      colorMap.set(key, { color: pixel, count: 0 });
    }
    colorMap.get(key)!.count += 1;
  }

  return [...colorMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, count)
    .map((entry) => entry.color);
}

export async function extractPersonColors(imageUrl: string) {
  return new Promise<{ skinTones: RGB[]; clothingColors: RGB[] }>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No canvas context");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels: RGB[] = [];

      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        if (a === 0) continue;

        const color = { r, g, b };
        if (isSkinLike(color)) {
          pixels.push(color);
        }
      }

      const skinTones = getDominantColors(pixels, 3); // top 3 skin tones
      resolve({ skinTones, clothingColors: [] }); // clothingColors optional for now
    };

    img.onerror = (e) => {
      reject("Failed to load image");
    };
  });
}
