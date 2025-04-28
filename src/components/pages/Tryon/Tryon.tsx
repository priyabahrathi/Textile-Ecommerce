import React, { useState, useRef, useEffect } from 'react';
import { IonGrid, IonRow, IonCol, IonButton, IonCardContent, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonSpinner, IonImg, IonText } from '@ionic/react';
import { ImageUpload } from './Tryon-set/imageuplode';
import { TryOnDiffusionClient } from '../../../Store/data/sampleimage';
import { fetchSuggestedProducts } from '../../../Store/Slice/suggestions';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../Store/store';
import {
  extractGender,
  extractPersonColors,
  getSkinToneCategory,
  type RGB,
  type SkinToneCategory,
} from '../../../Store/Slice/colorExtrator';
import './tryon.css';
import { cart, star } from 'ionicons/icons';
import { tryOnWithFal } from '../../../new-api/utils/falApi';

interface TryOnProps {
  clothingImage: string;
  outfitType: string;
}

const getSimpleSkinToneName = (rgb: RGB): string => {
  const brightness = (rgb.r + rgb.g + rgb.b) / 3;
  if (brightness < 85) return 'Dark';
  if (brightness <= 170) return 'Medium';
  return 'Fair';
};

const Tryon: React.FC<TryOnProps> = ({ clothingImage, outfitType }) => {
  // Your existing code...


    const [modelImage, setModelImage] = useState<string | null>(null);
    const [garmentImage, setGarmentImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const modelInputRef = useRef<HTMLInputElement>(null);
    const garmentInputRef = useRef<HTMLInputElement>(null);



  
  const [error, setError] = useState<string | null>(null);
  const [skinTones, setSkinTones] = useState<{ rgb: RGB; category: SkinToneCategory | null }[]>([]);
  const [selectedSkinTone, setSelectedSkinTone] = useState<SkinToneCategory | { name: string; description: string } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
  const [gender, setGender] = useState<string | null>(null);



  const [previews, setPreviews] = useState<{ [key: string]: string }>({
    clothing: clothingImage,
    avatar: '',
  });

  const [prompts, setPrompts] = useState<{ [key: string]: string }>({
    clothing: '',
    avatar: '',
  });

  useEffect(() => {
    if (clothingImage) {
      setGarmentImage(clothingImage); 
    }
  }, [clothingImage]);
  

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

  // const handleImageUpload = async (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   type: string
  // ) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = async () => {
  //       const imageDataUrl = reader.result as string;
  //       setPreviews((prev) => ({
  //         ...prev,
  //         [type]: imageDataUrl,
  //       }));

  //       if (type === 'avatar') {
  //         try {
  //           const result = await extractPersonColors(imageDataUrl);
  //           if (result?.skinTones) {
  //             const enrichedSkinTones = result.skinTones.map((item) => ({
  //               rgb: item.rgb,
  //               category: getSkinToneCategory(item.rgb) ?? null,
  //             }));
  //             setSkinTones(enrichedSkinTones);
  //           }


  //           const genderDetected = await extractGender(imageDataUrl);
  //           if (genderDetected) {
  //             setGender(genderDetected);
  //           }
  //         } catch (err) {
  //           console.error('Skin tone or gender extraction failed:', err);
  //         }
  //       }

  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const convertImageToBase64 = async (imagePath: string): Promise<string> => {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
 
  


  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImage(base64); // <-- this sets base64 into garmentImage or modelImage
      console.log('Base64 string:', base64); // optional: check what it looks like
    };
    reader.readAsDataURL(file); // <-- This converts the image to Base64
  };
  

  const handlePromptChange = (value: string, type: string) => {
    setPrompts((prev) => ({
      ...prev,
      [type]: value,
    }));
  };




  const handleTryOn = async () => {
    if (!modelImage || !garmentImage) {
      alert("Please upload both images.");
      return;
    }
  
    setLoading(true);
    setResultImage(null);
  
    try {
      const base64Garment = await convertImageToBase64(garmentImage); // Convert path to base64
  
      const response = await tryOnWithFal(modelImage, base64Garment,outfitType); // modelImage is already base64
      setResultImage(response.imageUrl);
    } catch (error) {
      console.error("Try-On failed", error);
      alert("Failed to process Try-On.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="tryon-page-wrapper">
      <div className="tryon-container">
        <IonGrid className="tryon-grid">
          <div className="tryon-container" style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* Model Image Card */}
                <IonRow>
              <IonCol>
              <div className='card-model' style={{ width: 300 }}>
                  <IonCardHeader>
                    <IonCardTitle className='card-name'>Your Picture</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {!modelImage && (
                      <input
                      type="file"
                      accept="image/*"
                      ref={modelInputRef}
                      onChange={(e) => handleImageUpload(e, setModelImage)}
                    />
                    )}
                    {modelImage && <><IonImg src={modelImage} alt="Model Preview" />
                    <button style={{
                          position: 'absolute',
                          top: 5,
                          right: 20,
                          backgroundColor: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#333',
                          boxShadow: '0 0 4px rgba(0,0,0,0.3)'
                        }} onClick={()=>setModelImage('')}>X</button>
                    </>
                    }
                    
                  </IonCardContent>
                </div>
              </IonCol>
          
                {/* Garment Image Card */}
                <IonCol>
                <div className='card-garment' style={{ width: 300 }}>
                  <IonCardHeader>
                    <IonCardTitle className='card-name'>Your Garments</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {!garmentImage && (
                      <input
                      type="file"
                      accept="image/*"
                      ref={garmentInputRef}
                      onChange={(e) => handleImageUpload(e, setGarmentImage)}
                    />
                    )}
                    {garmentImage && <IonImg src={garmentImage} alt="Garment Preview" />}
                  </IonCardContent>
                </div>
                </IonCol>
          
                {/* Result Card */}
                <IonCol>
                <div className='card-result' style={{ width: 300 }}>
                  <IonCardHeader>
                    <IonCardTitle className='card-name'>Your Look</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {loading && <IonSpinner name="dots" />}
                    {resultImage && (
                      <>
                        <IonText color="primary">Try-On Result:</IonText>
                        <img src={resultImage} alt="Try-On Output" />
                      </>
                    )}
                  </IonCardContent>
                </div>
                </IonCol>
                </IonRow>
          
                {/* Try On Button */}
                <button className='try-button' onClick={handleTryOn} disabled={loading}>
                  {loading ? "Processing..." : "Try It"}
                </button>
              </div>

          {/* <IonRow>
            <IonCol className="ion-text-center">
              <IonButton
                onClick={handleTryOn}
                className="try-button"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Try It'}
              </IonButton>
            </IonCol>
          </IonRow> */}
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

          {gender && gender !== 'unknown' && (
            <IonRow className="ion-padding-top">
              <IonCol className="ion-text-center">
                <div className="gender-info">
                  <h5 className="text-xl font-semibold">
                    Detected Gender: {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </h5>
                </div>
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