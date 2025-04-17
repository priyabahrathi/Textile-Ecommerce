import React from 'react';
import { Upload } from 'lucide-react';
import "./imageuplode.css"

interface ImageUploadProps {
  type: 'clothing' | 'avatar' | 'background';
  inputRef: React.RefObject<HTMLInputElement | null>;
  preview: string | null;
  // prompt: string;
  required?: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  onPromptChange: (value: string, type: string) => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  type,
  inputRef,
  preview,
  // prompt,
  required = true,
  onFileChange,
  onPromptChange
}) => {
  return (
    <div className="image-upload-container">
      <label className="image-upload-label">
        <div className="upload-wrapper">
          <div className="upload-box">
            <div className="upload-content">
              {preview ? (
                <img 
                  src={preview} 
                  alt={`${type} preview`} 
                  className="preview-image"
                />
              ) : (
                <Upload className="upload-icon" />
              )}
              <div className="upload-input-wrapper">
                <input
                  ref={inputRef}
                  type="file"
                  className="upload-input"
                  accept="image/*"
                  onChange={(e) => onFileChange(e, type)}
                />
                <label
                  htmlFor={`${type}-upload`}
                  className="upload-label"
                >
                  <span>Upload a file</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </label>

      {/* <div className="prompt-section">
        <label className="prompt-label">
          Optional Prompt
        </label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value, type)}
          placeholder={`Describe the ${type} (optional)`}
          className="prompt-input"
        />
      </div> */}
    </div>
  );
};
