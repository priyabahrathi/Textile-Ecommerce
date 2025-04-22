import React, { useState, useRef, useEffect } from 'react';
import { IonGrid, IonRow, IonCol, IonButton, IonIcon, IonCardContent, IonCard } from '@ionic/react';
import { ImageUpload } from './Tryon-set/imageuplode';
import { TryOnDiffusionClient } from '../../../Store/data/sampleimage';
import {
  extractPersonColors,
  getSkinToneCategory,
  type RGB,
  type SkinToneCategory,
} from '../../../Store/Slice/colorExtrator';
import './tryon.css';

interface TryOnProps {
  clothingImage: string;
}

const getSimpleSkinToneName = (rgb: RGB): string => {
  const brightness = (rgb.r + rgb.g + rgb.b) / 3;
  if (brightness < 85) return 'Dark';
  if (brightness <= 170) return 'Medium';
  return 'Fair';
};

const Tryon: React.FC<TryOnProps> = ({ clothingImage }) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skinTones, setSkinTones] = useState<{ rgb: RGB; category: SkinToneCategory | null }[]>([]);
  const [selectedSkinTone, setSelectedSkinTone] = useState<SkinToneCategory | { name: string; description: string } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  // useEffect(() => {
  //   if (clothingImage) {
  //     setPreviews((prev) => ({
  //       ...prev,
  //       clothing: clothingImage,
  //     }));
  //   }
  // }, [clothingImage]);

  useEffect(() => {
    if (clothingImage) {
      setPreviews((prev) => ({ ...prev, clothing: clothingImage }));
    }
    if (avatarImage) {
      setPreviews((prev) => ({ ...prev, avatar: avatarImage }));
    }
  }, [clothingImage, avatarImage]);

  useEffect(() => {
    if (extractedSkinTones && extractedSkinTones.length > 0) {
      setSkinTones(extractedSkinTones);
    }
  }, [extractedSkinTones]);

  const handleSkinToneClick = (color: RGB) => {
    console.log('Selected skin tone:', color);
    // Example: you could update some state here or use it for filtering
  };

  const SKIN_TONE_LABELS = {
    FAIR: 'Fair Skin',
    OLIVE: 'Olive',
    LIGHT_BROWN: 'Light Brown Skin',
    BROWN: 'Brown Skin',
    DARK_BROWN: 'Dark Brown Skin',
  };

  const classifySkinTone = (rgb: RGB): string => {
    const { r, g, b } = rgb;
    const brightness = (r + g + b) / 3;

    if (brightness > 200) return SKIN_TONE_LABELS.FAIR;
    if (brightness > 160 && r > g && g > b) return SKIN_TONE_LABELS.OLIVE;
    if (brightness > 130) return SKIN_TONE_LABELS.LIGHT_BROWN;
    if (brightness > 90) return SKIN_TONE_LABELS.BROWN;
    return SKIN_TONE_LABELS.DARK_BROWN;
  };

  const groupedSkinTones: { [category: string]: RGB[] } = {};

  skinTones.forEach((color) => {
    const category = classifySkinTone(color);
    if (!groupedSkinTones[category]) {
      groupedSkinTones[category] = [];
    }
    groupedSkinTones[category].push(color);
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageDataUrl = reader.result as string;
        setPreviews((prev) => ({
          ...prev,
          [type]: imageDataUrl,
        }));

        if (type === 'avatar') {
          try {
            const result = await extractPersonColors(imageDataUrl);
            if (result && result.skinTones) {
              const enrichedSkinTones = result.skinTones.map((item) => ({
                rgb: item.rgb,
                category: getSkinToneCategory(item.rgb) ?? null,
              }));
              setSkinTones(enrichedSkinTones);
            }
          } catch (err) {
            console.error('Skin tone extraction failed:', err);
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
        clothingBase64: previews.clothing,
      });

      if (response.statusCode === 200 && response.image) {
        const imageUrl = URL.createObjectURL(response.image);
        setResult(imageUrl);
      } else {
        setError(response.errorDetails || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setError('Try-on process failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tryon-page-wrapper">
      <div className="tryon-container">
        <IonGrid className="tryon-grid">
          <IonRow className="tryon-row">
            <IonCol size="4" className="tryon-col">
              <div className="tryon-card">
                <h2 className="tryon-card-title">Clothing</h2>
                <ImageUpload
                  type="clothing"
                  inputRef={undefined}
                  preview={previews.clothing || null}
                  onFileChange={() => { }}
                  onPromptChange={handlePromptChange}
                  disabled={true}
                />
              </div>
            </IonCol>

            <IonCol size="4" className="tryon-col">
              <div className="tryon-card">
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

            <IonCol size="4" className="tryon-col">
              <div className="tryon-card">
                <h2 className="tryon-card-title">Result</h2>
                {result && (
                  <div className="result-section">
                    <div className="result-image-wrapper">
                      <img src={result} alt="Result" className="result-image" />
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
                className="try-button"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Try On'}
              </IonButton>
            </IonCol>
          </IonRow>

          {skinTones.length > 0 && (
            <>
              <IonRow className="ion-justify-content-center ion-padding-top">
                {skinTones.map((tone, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedSkinTone(
                        tone.category ?? {
                          name: getSimpleSkinToneName(tone.rgb),
                          description: 'Custom detected skin tone based on brightness.',
                        }
                      );
                      setSelectedIndex(index);
                    }}
                    style={{
                      backgroundColor: `rgb(${tone.rgb.r}, ${tone.rgb.g}, ${tone.rgb.b})`,
                      width: '40px',
                      height: '40px',
                      margin: '0 10px',
                      borderRadius: '50%',
                      border: selectedIndex === index ? '3px solid #000' : '2px solid #fff',
                      boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease-in-out',
                    }}
                    title={tone.category?.name || 'Unknown'}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                  />
                ))}
              </IonRow>

              {selectedSkinTone && (
                <IonRow className="ion-padding-top">
                  <IonCol className="ion-text-center">
                    <div className="skin-tone-info">
                      <h5 className="text-xl font-semibold">{selectedSkinTone.name}</h5>
                      <p className="text-sm text-gray-600">{selectedSkinTone.description}</p>
                    </div>
                  </IonCol>
                </IonRow>
              )}
            </>
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
    </div>
  );
};

export default Tryon;
