import React, { useState, useRef, useEffect } from 'react';
import { IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import { ImageUpload } from './Tryon-set/imageuplode';
import { TryOnDiffusionClient } from '../../../Store/data/sampleimage';
import { extractPersonColors } from '../../../Store/Slice/colorExtrator';
import type { RGB } from '../../../Store/Slice/colorExtrator'; // ✅ better typing
import "./tryon.css";

interface TryOnProps {
  clothingImage: string;
}

const Tryon: React.FC<TryOnProps> = ({ clothingImage }) => {
  const [skinTones, setSkinTones] = useState<RGB[]>([]);

  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{ clothing: string; avatar: string }>({
    clothing: '',
    avatar: '',
  });
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageDataUrl = reader.result as string;

        setPreviews((prev) => ({
          ...prev,
          [type]: imageDataUrl,
        }));

        // Extract skin tones if it's an avatar
        if (type === 'avatar') {
          try {
            const result = await extractPersonColors(imageDataUrl);
            console.log('Extracted Skin Colors:', result.skinTones);
            if (result && result.skinTones) {
              setSkinTones(result.skinTones.map(item => item.rgb)); // ✅ FIX HERE
            }
          } catch (error) {
            console.error('Failed to extract skin tones:', error);
          }
        }
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
        clothingImage: undefined,
        clothingPrompt: prompts.clothing || undefined,
        avatarImage: avatarFile,
        avatarPrompt: prompts.avatar || undefined,
        clothingBase64: previews.clothing, // ✅ Fixed here
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
                  onFileChange={handleFileChange}
                  onPromptChange={handlePromptChange}
                  disabled={true}
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
          {skinTones.length > 0 && (
            <div className="skin-tone-palette" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
              {skinTones.map((color, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '2px solid #fff',
                    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                  }}
                />
              ))}
            </div>
          )}

        </IonGrid>
      </div>
    </div>
  );
};

export default Tryon;
