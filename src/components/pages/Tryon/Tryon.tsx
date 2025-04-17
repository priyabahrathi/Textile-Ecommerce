import React, { useState, useRef, useEffect } from 'react';
import { IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import { ImageUpload } from './Tryon-set/imageuplode';
import { TryOnDiffusionClient } from '../../../Store/data/sampleimage';
import "./tryon.css";

interface TryOnProps {
  clothingImage: string;
}

const Tryon: React.FC<TryOnProps> = ({ clothingImage }) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const [prompts, setPrompts] = useState<{ [key: string]: string }>({
    clothing: '',
    avatar: '',
  });

  const clothingInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const client = new TryOnDiffusionClient();

  useEffect(() => {
    if (clothingImage) {
      setPreviews((prev) => ({
        ...prev,
        clothing: clothingImage,
      }));
    }
  }, [clothingImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          [type]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePromptChange = (value: string, type: string) => {
    setPrompts((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const avatarFile = avatarInputRef.current?.files?.[0];

      const response = await client.tryOnFile({
        clothingImage: undefined, // We'll handle the base64 image directly on server, if needed
        clothingPrompt: prompts.clothing || undefined,
        avatarImage: avatarFile,
        avatarPrompt: prompts.avatar || undefined,
        clothingBase64: clothingImage, // Send image as base64 if your API accepts it
      });

      if (response.statusCode === 200 && response.image) {
        const imageUrl = URL.createObjectURL(response.image);
        setResult(imageUrl);
      } else {
        setError(response.errorDetails || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to process the request');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tryon-page-wrapper">
      <div className="tryon-container">
        <IonGrid className="tryon-grid">
          <IonRow className="tryon-row">
            {/* Clothing Card */}
            <IonCol size="4" className="tryon-card">
              <div className="tryon-content">
                <h2 className="tryon-card-title">Clothing</h2>
                <ImageUpload
                  type="clothing"
                  inputRef={clothingInputRef}
                  preview={previews.clothing || null}
                  // prompt={prompts.clothing}
                  onFileChange={handleFileChange}
                  onPromptChange={handlePromptChange}
                  disabled={true} // Disabling clothing input since it's pre-loaded
                />
              </div>
            </IonCol>

            {/* Model Card */}
            <IonCol size="4" className="tryon-card">
              <div className="tryon-content">
                <h2 className="tryon-card-title">Model</h2>
                <ImageUpload
                  type="avatar"
                  inputRef={avatarInputRef}
                  preview={previews.avatar || null}
                  // prompt={prompts.avatar}
                  onFileChange={handleFileChange}
                  onPromptChange={handlePromptChange}
                />
              </div>
            </IonCol>

            {/* Output Card */}
            <IonCol size="4" className="tryon-card">
              <div className="tryon-content">
                <h2 className="tryon-card-title">Generated Result</h2>
                {result && (
                  <div className="result-section">
                    <div className="result-image-wrapper">
                      <img src={result} alt="Try-on result" className="result-image" />
                    </div>
                  </div>
                )}
              </div>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton
                onClick={handleSubmit}
                expand="block"
                className="try-button"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Generate Try-On'}
              </IonButton>
            </IonCol>
          </IonRow>

          {error && (
            <IonRow>
              <IonCol className="ion-text-center">
                <div className="error-message">
                  {error}
                </div>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </div>
    </div>
  );
};

export default Tryon;
