import React, { useState, useRef, useEffect } from 'react';
import { IonGrid, IonRow, IonCol, IonButton, IonIcon, IonCardContent, IonCard } from '@ionic/react';
import { ImageUpload } from './Tryon-set/imageuplode';
import { TryOnDiffusionClient } from '../../../Store/data/sampleimage';
import { extractPersonColors } from '../../../Store/Slice/colorExtrator';
import type { RGB } from '../../../Store/Slice/colorExtrator';
import { fetchSuggestedProducts } from '../../../Store/Slice/suggestions';

import "./tryon.css";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../Store/store';
import { cart, star } from 'ionicons/icons';
import { Dice1 } from 'lucide-react';

interface TryOnProps {
  clothingImage: string;
  avatarImage?: string;
  extractedSkinTones?: RGB[];

}

const Tryon: React.FC<TryOnProps> = ({ clothingImage, avatarImage, extractedSkinTones }) => {


  const dispatch = useDispatch<AppDispatch>();

  const { suggestions, loading: suggestionsLoading } = useSelector((state: RootState) => state.suggestions);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSuggestClick = () => {
    dispatch(fetchSuggestedProducts());
    setShowSuggestions(true);
  };


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
              setSkinTones(result.skinTones.map(item => item.rgb));
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
          {/* {skinTones.length > 0 && (
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
          )} */}


          {/* {skinTones.length > 0 && (
  <div
    className="skin-tone-palette"
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '20px',
    }}
  >
    {skinTones.map((color, index) => (
      <motion.button
        key={index}
        onClick={() => handleSkinToneClick(color)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        style={{
          backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '2px solid #fff',
          boxShadow: '0 0 5px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          padding: 0,
          outline: 'none',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      />
    ))}
  </div>
)} */}

          {Object.entries(groupedSkinTones).map(([category, tones]) => (
            <div key={category} style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px' }}>{category}</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {tones.map((color, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSkinToneClick(color)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    style={{
                      backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: '2px solid #fff',
                      boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                      cursor: 'pointer',
                      padding: 0,
                      outline: 'none',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            </div>
          ))}







          <IonRow className="suggestion-row ion-padding">
            {showSuggestions && suggestions.length > 0 && (
              <IonCol size="12">
                <h3 className="suggestion-heading">Suggested Products</h3>
                <IonGrid>
                  <IonRow>
                    {suggestions.map(product => (
                      <IonCol size="12" sizeMd="12" sizeLg="6" key={product.id}>
                        <IonCard className="product-card">
                          <img src={product.img} className="product-image" alt={product.name} />
                          <IonCardContent>
                            <div className='product-data'>
                              <div className="product-title">{product.name}</div>
                              <div className="product-price">{product.price}</div>
                            </div>

                            <div className="rate-buy">
                              <div className="ratings">
                                {[...Array(5)].map((_, i) => (
                                  <IonIcon key={i} icon={star} className="star-icon" />
                                ))}
                              </div>
                              <button className="btn-buy">
                                <IonIcon icon={cart} slot="start" />
                                Buy Now
                              </button>
                            </div>
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              </IonCol>
            )}
          </IonRow>









          <div className='suggest-container'>
            <button className='btn-suggest' onClick={handleSuggestClick}>
              {suggestionsLoading ? 'Loading...' : 'Provide Me Suggestions'}
            </button>
          </div>


        </IonGrid>
      </div>
    </div>
  );
};

export default Tryon;
