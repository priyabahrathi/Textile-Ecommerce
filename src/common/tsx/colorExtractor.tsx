import React, { useEffect, useState } from 'react';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

interface SkinToneAnalyzerProps {
  avatarImage: string;
}

export default function ColorExtractor({ avatarImage }: SkinToneAnalyzerProps) {
  const [skinTone, setSkinTone] = useState('');
  const [error, setError] = useState('');

  // ✔️ Updated skin tone level function without "Cool" detection
  function getSkinToneLevel(rgb: { r: number; g: number; b: number }): string {
    const brightness = (rgb.r + rgb.g + rgb.b) / 3;
    if (brightness < 85) {
      return 'Dark Skin Tone';
    } else if (brightness >= 85 && brightness <= 170) {
      return 'Medium Skin Tone';
    } else {
      return 'Fair Skin Tone';
    }
  }

  useEffect(() => {
    if (!avatarImage) return;

    setSkinTone('');
    setError('');

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Canvas not supported.');
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const { data } = ctx.getImageData(img.width / 2, img.height / 3, 1, 1);
      const [r, g, b] = data;
      const skinResult = getSkinToneLevel({ r, g, b });
      setSkinTone(skinResult);
    };

    img.onerror = () => {
      setError('Failed to load image.');
    };

    img.src = avatarImage;
  }, [avatarImage]);

  if (!avatarImage) return null;

  return (
    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
      <p className="text-lg font-semibold">Detected Skin Tone:</p>
      {skinTone ? (
        <p className="text-2xl text-yellow-800">{skinTone}</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className="text-gray-500">Analyzing...</p>
      )}
    </div>
  );
}
