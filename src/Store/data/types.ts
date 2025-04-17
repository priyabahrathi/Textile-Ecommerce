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