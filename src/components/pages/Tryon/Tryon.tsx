import React, { useState, useRef, useEffect } from 'react';
import { IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import { ImageUpload } from './Tryon-set/imageuplode';
import { TryOnDiffusionClient } from '../../../Store/data/sampleimage';
import ColorExtractor from '../../../common/tsx/colorExtractor'; // Import the skin tone analyzer
import './tryon.css';

interface TryOnProps {
  clothingImage: string;
}

const Tryon: React.FC<TryOnProps> = ({ clothingImage }) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skinTones, setSkinTones] = useState<string[]>([]);
  const [dominantTone, setDominantTone] = useState<string | null>(null);

  const [previews, setPreviews] = useState<{ [key: string]: string }>({
    clothing: clothingImage,
    avatar: '',
  });

  const [prompts, setPrompts] = useState<{ [key: string]: string }>({
    clothing: '',
    avatar: '',
  });

  const [isProcessed, setIsProcessed] = useState(false);
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
      avatarInputRef.current.value = '';
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
      setIsProcessed(true);
    }
  };

  const scrollToSkinToneSection = () => {
    const skinToneSection = document.getElementById('skin-tone-section');
    if (skinToneSection) {
      skinToneSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSkinTonesExtracted = (tones: string[]) => {
    setSkinTones(tones);
    setDominantTone(tones[1] || tones[0]); // Use the 2nd closest if available, else fallback to the 1st
  };

  return (
    <div className="tryon-page-wrapper">
      <div className="tryon-container">
        <IonGrid className="tryon-grid">
          <IonRow className="tryon-row">
            {/* Clothing Image (Before) */}
            <IonCol size="4" className="tryon-col">
              <div className="tryon-card">
                <div className="tryon-content">
                  <h2 className="tryon-card-title">Before (Clothing)</h2>
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
                    onRemove={handleRemove}
                  />
                </div>
              </div>
            </IonCol>

            {/* Output Result (After) */}
            <IonCol size="4" className="tryon-col">
              <div className="tryon-card">
                <div className="tryon-content">
                  <h2 className="tryon-card-title">After (Generated Result)</h2>
                  {result && (
                    <div
                      className="result-section"
                      style={{
                        backgroundColor: dominantTone || '#fff',
                        padding: '10px',
                        borderRadius: '12px',
                      }}
                    >
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

          {isProcessed && (
            <IonRow>
              <IonCol className="ion-text-center">
                <IonButton onClick={scrollToSkinToneSection} className="down-arrow-button">
                  ↓ Scroll Down
                </IonButton>
              </IonCol>
            </IonRow>
          )}

          {error && (
            <IonRow>
              <IonCol className="ion-text-center">
                <div className="error-message">{error}</div>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </div>

      {/* Skin Tone Section */}
      <div id="skin-tone-section">
        <h3>Skin Tone Analysis</h3>
        {previews.avatar && (
          <ColorExtractor
            avatarImage={previews.avatar}
            // onTonesExtracted={handleSkinTonesExtracted}
          />
        )}
        {dominantTone && (
          <p style={{ marginTop: '10px' }}>
            <strong>Applied Skin Tone:</strong> {dominantTone}
          </p>
        )}
      </div>
    </div>
  );
};

export default Tryon;
