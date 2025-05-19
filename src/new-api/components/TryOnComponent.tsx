import React, { useState, useRef } from "react";
import { IonButton, IonSpinner, IonImg, IonText, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from "@ionic/react";
import { tryOnWithFal } from "../utils/falApi";

const TryOnComponent: React.FC = () => {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const modelInputRef = useRef<HTMLInputElement>(null);
  const garmentInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTryOn = async () => {
    if (!modelImage || !garmentImage) {
      alert("Please upload both images.");
      return;
    }

    setLoading(true);
    setResultImage(null);

    try {
      const response = await tryOnWithFal(modelImage, garmentImage);
      setResultImage(response.imageUrl);
    } catch (error) {
      console.error("Try-On failed", error);
      alert("Failed to process Try-On.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tryon-container" style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
      {/* Model Image Card */}
      <IonCard style={{ width: 300 }}>
        <IonCardHeader>
          <IonCardTitle>Upload Model Image</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <input
            type="file"
            accept="image/*"
            ref={modelInputRef}
            onChange={(e) => handleImageUpload(e, setModelImage)}
          />
          {modelImage && <IonImg src={modelImage} alt="Model Preview" />}
        </IonCardContent>
      </IonCard>

      {/* Garment Image Card */}
      <IonCard style={{ width: 300 }}>
        <IonCardHeader>
          <IonCardTitle>Upload Garment Image</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <input
            type="file"
            accept="image/*"
            ref={garmentInputRef}
            onChange={(e) => handleImageUpload(e, setGarmentImage)}
          />
          {garmentImage && <IonImg src={garmentImage} alt="Garment Preview" />}
        </IonCardContent>
      </IonCard>

      {/* Result Card */}
      <IonCard style={{ width: 300 }}>
        <IonCardHeader>
          <IonCardTitle>Result</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {loading && <IonSpinner name="dots" />}
          {resultImage && (
            <>
              <IonText color="primary">Try-On Result:</IonText>
              <IonImg src={resultImage} alt="Try-On Output" />
            </>
          )}
        </IonCardContent>
      </IonCard>

      {/* Try On Button */}
      <IonButton onClick={handleTryOn} expand="block" disabled={loading}>
        {loading ? "Processing..." : "Try On"}
      </IonButton>
    </div>
  );
};

export default TryOnComponent;
