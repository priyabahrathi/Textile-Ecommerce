import React from 'react';
import { Upload, X } from 'lucide-react';
import { readAndCompressImage } from 'browser-image-resizer';
import { imageResizeConfig } from "../../../../Store/data/types"; // Make sure this config exists
import "./imageuplode.css";

interface ImageUploadProps {
  type: 'clothing' | 'avatar' | 'background';
  inputRef?: React.RefObject<HTMLInputElement | null>;

  preview: string | null;
  required?: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  onPromptChange: (value: string, type: string) => void;
  onRemove?: (type: string) => void; 
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  type,
  inputRef,
  preview,
  required = true,
  onFileChange,
  onPromptChange,
  onRemove, 
  disabled = false,
}) => {

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
  
      img.onload = async () => {
        let resizedFile = file;
  
        // Resize the image if it's smaller than required dimensions
        if (img.width < 256 || img.height < 256 || img.width < 768 || img.height < 1024) {
          const resizedBlob = await readAndCompressImage(file, imageResizeConfig);
          resizedFile = new File([resizedBlob], file.name, { type: file.type, lastModified: Date.now() });
        }
  
        onFileChange(event, type);
      };
  
      img.src = objectUrl;
    }
  };

  const handleRemove = () => {
    if (inputRef?.current) inputRef.current.value = '';
    onRemove?.(type);
  };

  return (
    <div className="image-upload-container">
      <label className="image-upload-label">
        <div className="upload-wrapper">
          <div className="upload-box">
            <div className="upload-content">
              {preview ? (
                <div className="preview-wrapper">
                  <img 
                    src={preview} 
                    alt={`${type} preview`} 
                    className="preview-image"
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={handleRemove}
                  >
                    <X size={18} />
                  </button>
                </div>
                
              ) : (
                <Upload className="upload-icon" />
                
              )}
              <div className="upload-input-wrapper">
                {!preview && (
                  <input
                    ref={inputRef}
                    type="file"
                    className="custom-file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={disabled}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};
