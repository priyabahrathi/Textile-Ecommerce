import React, { useEffect, useState } from "react";
import Tryon from "./Tryon";
import { extractGender, extractPersonColors } from "../../../Store/Slice/colorExtrator";
import type { RGB } from "../../../Store/Slice/colorExtrator";

const TryOnWithSuggestions: React.FC = () => {
  const [modelImageUrl, setModelImageUrl] = useState("");
  const [skinTones, setSkinTones] = useState<RGB[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gender, setGender] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (skinTones.length > 0) {
      const event = new CustomEvent('auto-suggest');
      window.dispatchEvent(event);
    }
  }, [skinTones]);

  const handleSuggestionsClick = async () => {
    if (!modelImageUrl) {
      setError("Please enter a model image URL first.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await extractPersonColors(modelImageUrl);
      console.log("Extracted skin tones:", result.skinTones);
      console.log("Extracted gender:", result.gender);

      if (!result || !result.skinTones || result.skinTones.length === 0) {
        setError("No skin tones extracted. Please try a different image.");
        return;
      }

      setSkinTones(result.skinTones.map(item => item.rgb));
      setGender(result.gender); // ✅ no need to call extractGender separately

    } catch (err) {
      console.error(err);
      setError("Failed to extract colors and gender.");
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

      <Tryon
        clothingImage={""}
        modelImage={modelImageUrl}
        extractedSkinTones={skinTones}
        extractedGender={gender}
      />
    </div>
  );
};

export default TryOnWithSuggestions;
