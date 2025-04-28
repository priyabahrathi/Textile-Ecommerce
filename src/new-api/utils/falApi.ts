import { fal } from "@fal-ai/client";

export const tryOnWithFal = async (
  modelImage: string,
  garmentImage: string,
  outfitType: string
): Promise<{ imageUrl: string; requestId: string }> => {
  fal.config({
    credentials: import.meta.env.VITE_FAL_KEY || "",
  });

  const mapOutfitToCategory = (outfitType: string): "tops" | "bottoms" | "one-pieces" => {
    const lowerCaseType = outfitType.toLowerCase();
    if (lowerCaseType.includes("top")) return "tops";
    if (lowerCaseType.includes("bottom")) return "bottoms";
    if (lowerCaseType.includes("one-piece")) return "one-pieces";
    return "tops";
  };

  const result = await fal.subscribe("fashn/tryon", {
    input: {
      model_image: modelImage,
      garment_image: garmentImage,
      category: mapOutfitToCategory(outfitType),
    },
  });

  return {
    imageUrl: result.data.images[0].url, // <-- correct plural
    requestId: result.requestId,         // <-- correct camelCase
  };
};
