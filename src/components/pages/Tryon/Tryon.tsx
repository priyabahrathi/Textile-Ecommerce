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

  const [previews, setPreviews] = useState<{ [key: string]: string }>({
    clothing: clothingImage,
    avatar: '',
  });

  const [prompts, setPrompts] = useState<{ [key: string]: string }>({
    clothing: '',
    avatar: '',
  });

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

  const handleRemove = (type: string) => {
    setPreviews((prev) => ({
      ...prev,
      [type]: '',
    }));
    if (type === 'avatar' && avatarInputRef.current) {
      avatarInputRef.current.value = ''; // clear input value
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const avatarFile = avatarInputRef.current?.files?.[0];

      const response = await client.tryOnFile({
        clothingImage: undefined,
        clothingPrompt: prompts.clothing || undefined,
        avatarImage: avatarFile,
        avatarPrompt: prompts.avatar || undefined,
        clothingBase64: previews.clothing,
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

            {/* Clothing Image (Preloaded) */}
            <IonCol size="4" className="tryon-col" >
              <div className="tryon-card">
              <div className="tryon-content">
                <h2 className="tryon-card-title">Clothing</h2>
                <ImageUpload
                  type="clothing"
                  inputRef={undefined}
                  preview={previews.clothing || null}
                  onFileChange={() => {}}
                  onPromptChange={handlePromptChange}
                  disabled={true}
                />
              </div>
              </div>
            </IonCol>

            {/* Avatar Upload */}
            <IonCol size="4" className="tryon-col">
            <div className="tryon-card">
              <div className="tryon-content">
                <h2 className="tryon-card-title">Model</h2>
                <ImageUpload
                  type="avatar"
                  inputRef={avatarInputRef}
                  preview={previews.avatar || null}
                  onFileChange={handleFileChange}
                  onPromptChange={handlePromptChange}
                  onRemove={handleRemove} // ✅ Added
                />
              </div>
              </div>
            </IonCol>

            {/* Output Result */}
            <IonCol size="4" className="tryon-col">
            <div className="tryon-card">
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
              </div>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol className="tryon-col">
              <button
                onClick={handleSubmit}
                className="try-button"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Try now'}
              </button>
            </IonCol>
          </IonRow>

          {error && (
            <IonRow>
              <IonCol className="ion-text-center">
                <div className="error-message">{error}</div>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </div>
    </div>
  );
};

export default Tryon;
