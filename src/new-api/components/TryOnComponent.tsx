import React, { useState } from "react";
import { IonButton, IonSpinner, IonImg, IonText } from "@ionic/react";
import { tryOnWithFal } from "../utils/falApi";

const TryOnComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleTryOn = async () => {
    setLoading(true);
    try {
      const response = await tryOnWithFal();
      setImageUrl(response.imageUrl);
      
        
    } catch (error) {
      console.error("Try-On failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tryon-container">
      <IonButton onClick={handleTryOn} expand="block">
        Try On Outfit
      </IonButton>

      {loading && <IonSpinner name="dots" />}

      {imageUrl && (
        <>
          <IonText color="primary">Try-On Result:</IonText>
          <IonImg src={imageUrl} alt="Try-On Output" />
        </>
      )}
    </div>
  );
};

export default TryOnComponent;
