import React, { useEffect, useState } from 'react';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

interface SkinToneAnalyzerProps {
  avatarImage: string;
}

const SkinToneAnalyzer: React.FC<SkinToneAnalyzerProps> = ({ avatarImage }) => {
  const [skinTone, setSkinTone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Determine tone by brightness
  const getSkinToneLevel = (rgb: RGB): string => {
    const brightness = (rgb.r + rgb.g + rgb.b) / 3;
    if (brightness < 85) return 'Dark Skin Tone';
    if (brightness <= 170) return 'Medium Skin Tone';
    return 'Fair Skin Tone';
  };

  // ✅ Average pixels in center area
  const getAverageRGB = (ctx: CanvasRenderingContext2D, width: number, height: number): RGB => {
    const sampleSize = 10;
    const startX = width / 2 - sampleSize / 2;
    const startY = height / 3 - sampleSize / 2;
    const imgData = ctx.getImageData(startX, startY, sampleSize, sampleSize);
    const data = imgData.data;

    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    return { r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) };
  };

  useEffect(() => {
    if (!avatarImage) return;
    setLoading(true);
    setError('');
    setSkinTone('');

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported.');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const avgRGB = getAverageRGB(ctx, img.width, img.height);
        const tone = getSkinToneLevel(avgRGB);
        setSkinTone(tone);
      } catch (err: any) {
        setError(err.message || 'Failed to analyze image.');
      } finally {
        setLoading(false);
      }
    };

    img.onerror = () => {
      setError('Failed to load image.');
      setLoading(false);
    };

    img.src = avatarImage;
  }, [avatarImage]);

  if (!avatarImage) return null;

  return (
    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
      <p className="text-lg font-semibold">Detected Skin Tone:</p>
      {loading ? (
        <p className="text-gray-500">Analyzing...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className="text-2xl text-yellow-800">{skinTone}</p>
      )}
    </div>
  );
};

export default SkinToneAnalyzer;
