export interface TryOnDiffusionAPIResponse {
  statusCode: number;
  image?: Blob;
  responseData?: ArrayBuffer;
  errorDetails?: string;
  seed?: number;
}

export interface TryOnDiffusionRequestParams {
  clothingImage?: File;
  clothingPrompt?: string;
  avatarImage?: File;
  avatarPrompt?: string;
  avatarSex?: string;
  backgroundImage?: File;
  backgroundPrompt?: string;
  seed?: number;
  rawResponse?: boolean;
  clothingBase64?: string;  // <-- Add this property
  avatarBase64?: string; 
}
export const imageResizeConfig = {
  quality: 0.9, // Adjust quality (0 to 1)
  maxWidth: 768,
  maxHeight: 1024,
  autoRotate: true,
  debug: false,
};