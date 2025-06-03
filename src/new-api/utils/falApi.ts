import { fal } from "@fal-ai/client";
export const tryOnWithFal = async (
  modelImage: string,
  garmentImage: string,
  outfitType: string
): Promise<{ imageUrl: string; requestId: string }> => {
  fal.config({
    credentials: "b0d7d925-d312-4ff5-ad4b-9dc8b25fe128:7df8a92dc61990d442b9f946b0a1e921",
  });

  const mapOutfitToCategory = (outfitType: string): "tops" | "bottoms" | "one-pieces" => {
    const lowerCaseType = outfitType.toLowerCase();
    if (lowerCaseType.includes("top")) return "tops";
    if (lowerCaseType.includes("bottom")) return "bottoms";
    if (lowerCaseType.includes("one-piece")) return "one-pieces";
    console.warn("Unrecognized outfitType:", outfitType);
    return "tops"; // Default to "tops"
  };

  try {
    const result = await fal.subscribe("fal-ai/fashn/tryon/v1.5", {
      input: {
        model_image: modelImage,
        garment_image: garmentImage,
        category: mapOutfitToCategory(outfitType),
        nsfw_filter: true,
        guidance_scale: 2,
        timesteps: 50,
        seed: 42,
        num_samples: 1,
      },
    });

    console.log("FAL API Response:", result);

    if (
      result &&
      result.data &&
      Array.isArray(result.data.images) &&
      result.data.images[0] &&
      result.data.images[0].url
    ) {
      return {
        imageUrl: result.data.images[0].url,
        requestId: result.requestId,
      };
    } else {
      throw new Error("No image returned from FAL API");
    }
  } catch (error) {
    console.error("Try-On failed", error);
    throw error;
  }
};
