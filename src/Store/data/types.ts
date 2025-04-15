export interface TryOnResponse {
    file_path: string;
  }
  
  export interface TryOnRequest {
    model_image_url: string;
    garment_image_url: string;
    steps: number;
    customized_model: boolean;
  }
  
  export interface SampleImage {
    url: string;
    title: string;
    description?: string;
  }
  
  export interface GalleryProps {
    images: SampleImage[];
    onSelect: (url: string) => void;
    selectedUrl: string;
  }
  
  export interface ImageUploadResponse {
    data: {
      url: string;
    };
    success: boolean;
    status: number;
  }