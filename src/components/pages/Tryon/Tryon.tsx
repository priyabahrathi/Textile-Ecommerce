import React, { useState, useRef, useEffect } from 'react';
import { IonGrid, IonRow, IonCol, IonButton, IonCardContent, IonIcon, IonCard } from '@ionic/react';
import { ImageUpload } from './Tryon-set/imageuplode';
import { TryOnDiffusionClient } from '../../../Store/data/sampleimage';
import { fetchSuggestedProducts } from '../../../Store/Slice/suggestions';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../Store/store';
import {
  extractPersonColors,
  getSkinToneCategory,
  type RGB,
  type SkinToneCategory,
} from '../../../Store/Slice/colorExtrator';
import './tryon.css';
import { cart, star } from 'ionicons/icons';
import suggestions from '../../../Store/Slice/suggestions';

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
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);


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

  const dispatch = useDispatch<AppDispatch>();

  const { suggestions, loading: suggestionsLoading } = useSelector((state: RootState) => state.suggestions);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSuggestClick = () => {
    if (!selectedSkinTone || !('name' in selectedSkinTone)) {
      alert('Please upload a model image and select a skin tone first.');
      return;
    }
  
    dispatch(fetchSuggestedProducts()).then((res) => {
      setTimeout(() => {
        const allSuggestions = (res as any)?.payload || [];
  
        const matched = allSuggestions.filter((product: any) => {
          return (
            product.skinTone &&
            product.skinTone.toLowerCase() === selectedSkinTone.name.toLowerCase()
          );
        });
  
        setShowSuggestions(true);
        setFilteredSuggestions(matched);
      }, 300);
    });
  };
  



  useEffect(() => {
    if (clothingImage) {
      setPreviews((prev) => ({
        ...prev,
        clothing: clothingImage,
      }));
    }
  }, [clothingImage]);

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
      const avatarFile = new File([Uint8Array.from(atob(previews.avatar.split(',')[1]), c => c.charCodeAt(0))], 'avatar.png', { type: 'image/png' });
      const clothing = await fetch(clothingImage); // e.g., /assets/Product/shirt1.png
      const clothingImageblob = await clothing.blob();
    
      const clothingFile = new File([clothingImageblob], `clothingImage.png`, { type: clothingImageblob.type });
      const response = await client.tryOnFile({
        clothingImage: clothingFile,
        avatarImage: avatarFile,
        
      });
console.log(clothingFile,avatarFile);

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
            <IonCol className="tryon-col" sizeXl='4' sizeLg='6' sizeMd='6' sizeXs='12'>
              <div className="tryon-card">
                <h2 className="tryon-card-title">Your Outfit</h2>
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

            <IonCol className="tryon-col"  sizeXl='4' sizeLg='6' sizeMd='6' sizeXs='12'>
              <div className="tryon-card">
                <h2 className="tryon-card-title">Your Picture</h2>
                <ImageUpload
                  type="avatar"
                  inputRef={avatarInputRef}
                  preview={previews.avatar || null}
                  onFileChange={handleFileChange}
                  onPromptChange={handlePromptChange}
                />
              </div>
            </IonCol>

            <IonCol className="tryon-col"  sizeXl='4' sizeLg='12' sizeMd='12' sizeXs='12'>
              <div className="tryon-card">
                <h2 className="tryon-card-title">Your Look</h2>
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
                {loading ? 'Processing...' : 'Try It'}
              </IonButton>
            </IonCol>
          </IonRow>
          {skinTones.length > 0 && (
            <>
            
              <IonRow className="ion-justify-content-center ion-padding-top skintone-container">
              <div className='tone-selection'>Select Your Exact Skintone</div>
                {skinTones.map((tone, index) => (
                  <div
                  className='color-circle'
                    key={index}
                    onClick={() => {
                      setSelectedSkinTone(
                        tone.category ?? {
                          name: getSimpleSkinToneName(tone.rgb),
                          description: 'Custom detected skin tone based on brightness.',
                          
                        }
                      );
                      setSelectedIndex(index);
                    } }
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
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')} />

                ))}
              </IonRow>

              {selectedSkinTone && (
                <IonRow className="ion-padding-top">
                  <IonCol className="ion-text-center">
                    <div className="skin-tone-info">

                      {/* <h5 className="text-xl font-semibold">{selectedSkinTone.name}</h5>
                      <p className="text-sm text-gray-600">{selectedSkinTone.description}</p> */}
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


          {showSuggestions && filteredSuggestions.length > 0 && (
            <IonRow>
              <IonCol size="12">
                <h3 className="suggestion-heading">Here, Some Suggestions for You</h3>
                <IonGrid>
                  <IonRow>
                    {filteredSuggestions.map(product => (
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
            </IonRow>
          )}


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