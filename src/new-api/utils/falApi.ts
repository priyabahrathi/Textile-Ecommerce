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
    console.warn("Unrecognized outfitType:", outfitType);
    return "tops"; // Default to "tops"
  };

  const result = await fal.subscribe("fashn/tryon", {
    input: {
      model_image: modelImage,
      garment_image: garmentImage,
      category: mapOutfitToCategory(outfitType),
      nsfw_filter: true, // Enable NSFW filtering
      guidance_scale: 2, // Adjust guidance scale
      timesteps: 50, // Number of timesteps
      seed: 42, // Seed for reproducibility
      num_samples: 1, // Number of samples to generate
    },
  });

  console.log("FAL API Response:", result);
  console.log("Category sent to FAL API:", mapOutfitToCategory(outfitType));
  

  return {
    imageUrl: result.data.images[0].url, // <-- correct plural
    requestId: result.requestId,         // <-- correct camelCase
  };
};
