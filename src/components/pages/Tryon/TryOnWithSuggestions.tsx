import React, { useState } from "react";
import TryOn from "./Tryon";
import { extractPersonColors } from "../../../Store/Slice/colorExtrator";
import type { RGB } from "../../../Store/Slice/colorExtrator";

const TryOnWithSuggestions: React.FC = () => {
  const [modelImageUrl, setModelImageUrl] = useState("");
  const [colors, setColors] = useState<{ skinTones: RGB[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSuggestionsClick = async () => {
    if (!modelImageUrl) {
      setError("Please enter a model image URL first.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await extractPersonColors(modelImageUrl);
      console.log("Extracted color result:", result);
       if (!result || !result.skinTones || result.skinTones.length === 0) {
        setError("No skin tones extracted. Please try a different image.");
        return;
      }
      
      setColors({ skinTones: result.skinTones });
    } catch (err) {
      console.error(err);
      setError("Failed to extract colors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">Model Image URL</label>
        <input
          type="text"
          value={modelImageUrl}
          onChange={(e) => setModelImageUrl(e.target.value)}
          placeholder="Paste model image URL"
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <button
          onClick={handleSuggestionsClick}
          disabled={loading}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Extracting..." : "Provide Me Suggestions"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <TryOn garmentImageFromProduct={modelImageUrl} />

      {colors && colors.skinTones.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Extracted Skin Tones</h2>
          <div className="flex gap-4">
            {colors.skinTones.map((skin, idx) => (
              <div
                key={idx}
                className="w-16 h-16 rounded-full shadow border"
                style={{
                  backgroundColor: `rgb(${skin.r}, ${skin.g}, ${skin.b})`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TryOnWithSuggestions;
