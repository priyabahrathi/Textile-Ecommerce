import { fal } from "@fal-ai/client";

export interface TryonImage {
  url: string;
  content_type: string;
  file_name: string;
  file_size: number;
  width: number;
  height: number;
}

export interface TryonOutput {
  images: TryonImage[];
  [key: string]: any;
}

/**
 * @param modelImage - URL of the model image
 * @param garmentImage - URL of the garment image
 * @param category - (Optional) garment category (e.g., "tops", "dresses", etc.)
 * @returns Object containing output image URL and request ID
 */
export const tryOnWithFal = async (
  modelImage: string,
  garmentImage: string,
  category: string = "tops"
): Promise<{ imageUrl: string; requestId: string }> => {
  fal.config({
    credentials: import.meta.env.VITE_FAL_KEY || "",
  });

  const result = await fal.subscribe("fashn/tryon", {
    input: {
      model_image: modelImage,
      garment_image: garmentImage,
      category: category as "tops" | "bottoms" | "one-pieces",
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs?.forEach((log) => console.log(`[FAL LOG]: ${log.message}`));
      }
    },
  });

  const data = result.data as TryonOutput;

  if (!data.images?.length || !data.images[0].url) {
    console.error("Full response for debugging:", result);
    throw new Error("No image URL found in try-on response");
  }

  return {
    imageUrl: data.images[0].url,
    requestId: result.requestId,
  };
};
