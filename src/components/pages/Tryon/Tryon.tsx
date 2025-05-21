import React, { useState, useRef, useEffect } from 'react';
import { IonGrid, IonRow, IonCol, IonCardContent, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonSpinner, IonImg, IonText, IonInput, IonItem, IonList } from '@ionic/react';
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
import { cart, star, cloudUploadOutline } from 'ionicons/icons';
import { tryOnWithFal } from '../../../new-api/utils/falApi';
// import { Upload } from 'lucide-react';

interface TryOnProps {
  clothingImage: string;
  modelImage?: string;
  extractedSkinTones?: RGB[];
  outfitType: string;
  genderFilter: string;
  outfitName: string;
}

const getSimpleSkinToneName = (rgb: RGB): string => {
  const brightness = (rgb.r + rgb.g + rgb.b) / 3;
  if (brightness < 85) return 'Dark';
  if (brightness <= 170) return 'Medium';
  return 'Fair';
};

const Tryon: React.FC<TryOnProps> = ({
  clothingImage, outfitType,
  modelImage: modelImageProp,
  extractedSkinTones,
  genderFilter,
  outfitName,
}) => {

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

  useEffect(() => {
    if (modelImageProp) {
      setModelImage(modelImageProp);
    }
  }, [modelImageProp]);

  useEffect(() => {
    if (filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [filteredSuggestions]);

  useEffect(() => {
    if (extractedSkinTones && extractedSkinTones.length > 0) {
      const enrichedSkinTones = extractedSkinTones.map((rgb) => ({
        rgb,
        category: getSkinToneCategory(rgb) ?? null,
      }));
      setSkinTones(enrichedSkinTones);
      if (enrichedSkinTones.length > 0) {
        setSelectedSkinTone(
          enrichedSkinTones[0].category ?? {
            name: getSimpleSkinToneName(enrichedSkinTones[0].rgb),
            description: 'Auto-selected skin tone',
          }
        );
        setSelectedIndex(0); // to visually highlight the selection
      }
    }
  }, [extractedSkinTones]);

  const dispatch = useDispatch<AppDispatch>();

  const { suggestions, loading: suggestionsLoading } = useSelector((state: RootState) => state.suggestions);

  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setShowSuggestions(false);
  }, [selectedSkinTone]);

  useEffect(() => {
    dispatch(fetchSuggestedProducts());
    console.log("Fetching suggestions...");
  }, [dispatch]);

  const handleSuggestClick = () => {
    console.log("Button clicked");
    console.log("Selected Skin Tone:", selectedSkinTone);
    console.log("All Suggestions:", suggestions);
  
    // Check if skin tone is selected and has a valid name
    if (!selectedSkinTone?.name) {
      console.log("Skin tone not detected or no name available.");
      return;
    }
  
    // Filter products based on skin tone, gender, and outfitName
    const filtered = suggestions.filter(product => {
      const matchesSkinTone = Array.isArray(product.skinTone)
        ? product.skinTone.some((tone) => tone.toLowerCase().includes(selectedSkinTone.name.toLowerCase())) // Handle array case
        : product.skinTone?.toLowerCase().includes(selectedSkinTone.name.toLowerCase()); // Handle string case
  
      const matchesGender = genderFilter === '' || product.gender === genderFilter; // Filter by gender
      const matchesOutfitName = outfitName === '' || product.outfitName === outfitName; // Filter by outfitName
  
      return matchesSkinTone && matchesGender && matchesOutfitName; // Combine all conditions
    });
  
    console.log("Filtered Suggestions:", filtered);
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  };

  const [height, setHeight] = useState<number>();
  const [weight, setWeight] = useState<number>();
  const [chest, setChest] = useState<number>();
  const [shirtSize, setShirtSize] = useState<string>("");

  const handlePredict = () => {
    if (!height || !weight || !chest) {
      setShirtSize("Please fill in all fields.");
      return;
    }

    if (chest < 60) setShirtSize("S");
    else if (chest < 80) setShirtSize("M");
    else if (chest < 110) setShirtSize("L");
    else setShirtSize("XL");
  };

  useEffect(() => {
    if (height && weight && chest) {
      handlePredict();
    }
  }, [height, weight, chest]);

  useEffect(() => {
    if (clothingImage) {
      setPreviews((prev) => ({
        ...prev,
        clothing: clothingImage,
      }));
    }
  }, [clothingImage]);

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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    type?: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImage(base64); // <-- this sets base64 into garmentImage or modelImage
      console.log('Base64 string:', base64); // optional: check what it looks like
      if (type === 'avatar') {
        try {
          const result = await extractPersonColors(base64);
          if (result?.skinTones) {
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
      const base64Garment = garmentImage.startsWith('data:image')
        ? garmentImage
        : await convertImageToBase64(garmentImage);
      // Convert path to base64

      const response = await tryOnWithFal(modelImage, base64Garment, outfitType); // modelImage is already base64
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
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          ref={modelInputRef}
                          style={{ display: 'none' }}
                          onChange={(e) => handleImageUpload(e, setModelImage, 'avatar')}
                          id="model-upload"
                        />
                        <IonIcon
                          icon={cloudUploadOutline}
                          className="card-icon upload-icon"
                          onClick={() => modelInputRef.current?.click()}
                          style={{ fontSize: 64, color: '#d45907', cursor: 'pointer', display: 'block', margin: '40px auto' }}
                        />
                        <div style={{ textAlign: 'center', color: '#d45907', fontWeight: 600, marginTop: 8 }}>Upload Your Photo</div>
                      </>
                    )}
                    {modelImage && (
                      <>
                        <img src={modelImage} className='try-img' alt="Model Preview" />
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
                        }} onClick={() => setModelImage('')}>X</button>
                      </>
                    )}

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
                    {garmentImage && <img src={garmentImage} className='try-img' alt="Garment Preview" />}
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
                        <img src={resultImage} className='try-img' alt="Try-On Output" />
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