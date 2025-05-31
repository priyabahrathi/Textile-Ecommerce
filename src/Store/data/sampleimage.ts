import { TryOnDiffusionRequestParams, TryOnDiffusionAPIResponse } from "../data/types";

export class TryOnDiffusionClient {
  private baseUrl: string;
  private apiKeys: string[];
  private apiKeyIndex: number;
  private rapidApiHost: string | null;

  constructor(
    baseUrl: string = "https://try-on-diffusion.p.rapidapi.com/",
    apiKeys: string[] = [
      "abfb56901bmsh42a01919aabe9e0p1d0a61jsn0879f273aaff",
    ]
  ) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    this.apiKeys = apiKeys;
    this.apiKeyIndex = 0;

    const parsedUrl = new URL(this.baseUrl);
    this.rapidApiHost = parsedUrl.hostname.endsWith(".rapidapi.com")
      ? parsedUrl.hostname
      : "try-on-diffusion.p.rapidapi.com";

    if (this.rapidApiHost) {
      console.info(`Using RapidAPI proxy: ${this.rapidApiHost}`);
    }
  }

  private getNextApiKey(): string {
    const key = this.apiKeys[this.apiKeyIndex];
    this.apiKeyIndex = (this.apiKeyIndex + 1) % this.apiKeys.length;
    return key;
  }

  async tryOnFile({
    clothingImage,
    clothingPrompt,
    avatarImage,
    avatarPrompt,
    avatarSex,
    backgroundImage,
    backgroundPrompt,
    seed = -1,
    rawResponse = false,
  }: TryOnDiffusionRequestParams): Promise<TryOnDiffusionAPIResponse> {
    const url = `${this.baseUrl}/try-on-file`;
    console.log(`API URL: ${url}`);

    const formData = new FormData();
    formData.append("seed", seed.toString());

    if (clothingImage) formData.append("clothing_image", clothingImage);
    if (clothingPrompt) formData.append("clothing_prompt", clothingPrompt);
    if (avatarImage) formData.append("avatar_image", avatarImage);
    if (avatarPrompt) formData.append("avatar_prompt", avatarPrompt);
    if (avatarSex) formData.append("avatar_sex", avatarSex);
    if (backgroundImage) formData.append("background_image", backgroundImage);
    if (backgroundPrompt) formData.append("background_prompt", backgroundPrompt);

    const headers: HeadersInit = {};
    const apiKey = this.getNextApiKey();

    if (this.rapidApiHost) {
      headers["X-RapidAPI-Key"] = apiKey;
      headers["X-RapidAPI-Host"] = this.rapidApiHost;
    } else {
      headers["X-API-Key"] = apiKey;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers,
      });

      const result: TryOnDiffusionAPIResponse = {
        statusCode: response.status,
      };

      if (response.status === 200) {
        if (!rawResponse) {
          result.image = await response.blob();
        } else {
          result.responseData = await response.arrayBuffer();
        }

        const seedHeader = response.headers.get("X-Seed");
        if (seedHeader) result.seed = parseInt(seedHeader, 10);
      } else {
        try {
          const errorData = await response.json();
          if (errorData.detail) result.errorDetails = errorData.detail;
        } catch (e) {
          console.error("Error parsing response JSON:", e);
        }
      }

      return result;
    } catch (e) {
      console.error("API request failed:", e);
      return { statusCode: 0 };
    }
  }
}
