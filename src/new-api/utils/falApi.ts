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

export const tryOnWithFal = async (): Promise<{ imageUrl: string; requestId: string }> => {
  fal.config({
    credentials: import.meta.env.VITE_FAL_KEY || "",
  });

  const result = await fal.subscribe("fashn/tryon", {
    input: {
      model_image: "https://utfs.io/f/wXFHUNfTHmLj4prvqbRMQ6JXFyUr3IT0avK2HSOmZWiAsxg9",
      garment_image: "https://utfs.io/f/wXFHUNfTHmLjtkhepmqOUnkr8XxZbNIFmRWldShDLu320TeC",
      category: "tops",
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs?.map((log) => log.message).forEach(console.log);
      }
    },
  });

  const data = result.data as TryonOutput;

  if (!data.images || data.images.length === 0 || !data.images[0].url) {
    throw new Error("No image URL found in try-on response");
  }

  return {
    imageUrl: data.images[0].url,
    requestId: result.requestId,
  };
};
