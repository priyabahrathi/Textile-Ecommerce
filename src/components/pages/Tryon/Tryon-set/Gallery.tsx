import React from 'react';
import type { SampleImage } from '../../../../Store/data/types';

interface GalleryProps {
  images: SampleImage[];
  onSelect: (url: string) => void;
  selectedUrl: string;
  title: string;
}

export function Gallery({ images, onSelect, selectedUrl, title }: GalleryProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onSelect(image.url)}
            className={`relative aspect-[3/4] rounded-lg overflow-hidden group ${
              selectedUrl === image.url
                ? 'ring-4 ring-purple-500'
                : 'hover:ring-2 hover:ring-purple-300'
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200" />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-sm truncate">{image.title}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}