import { useState, useEffect } from "react";
import {
  Upload,
  Shirt,
  User,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import type { TryOnRequest, TryOnResponse } from "../../../Store/data/types";
import { IonGrid, IonRow, IonCol } from "@ionic/react";
import { Gallery } from "./Tryon-set/Gallery";
import { modelImages, garmentImages } from "../../../Store/data/sampleimage";
import "./tryon.css"
import { extractPersonColors, RGB } from "../../../Store/Slice/colorExtrator";
interface TryOnProps {
  garmentImageFromProduct?: string;
}

function TryOn({ garmentImageFromProduct }: TryOnProps) {
  const [modelImage, setModelImage] = useState("");
  const [garmentImage, setGarmentImage] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGallery, setShowGallery] = useState(true);
  const [skinTones, setSkinTones] = useState<RGB[]>([]);


  useEffect(() => {
    if (garmentImageFromProduct) {
      setGarmentImage(garmentImageFromProduct);
    }
  }, [garmentImageFromProduct]);
  const handleSuggestionsClick = async () => {
    if (!modelImage) {
      setError("Please enter a model image URL first.");
      return;
    }

    try {
      const result = await extractPersonColors(modelImage);
      setSkinTones(result.skinTones || []);
      console.log("Skin tones extracted:", result.skinTones);
    } catch (err) {
      console.error("Extraction failed:", err);
      setError("Could not extract skin tones.");
    }
  };


  const handleTryOn = async () => {
    if (!modelImage || !garmentImage) {
      setError("Please provide both model and garment images");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const tryOnRequest: TryOnRequest = {
        model_image_url: modelImage,
        garment_image_url: garmentImage,
        steps: 30,
        customized_model: true,
      };

      const response = await fetch("https://clothes-tryon-6-0.onrender.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tryOnRequest),
      });

      if (!response.ok) {
        throw new Error("Failed to process images");
      }

      const data: TryOnResponse = await response.json();
      const resultUrl = `https://clothes-tryon-6-0.onrender.com/download_image?file_path=${data.file_path}`;

      setResultImage(resultUrl);
    } catch (err) {
      setError("Failed to process the try-on request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tryon-page-wrapper">
      <div className="tryon-container">
        <IonGrid>
          <IonRow className="ion-justify-content-center">

            {/* Model Image Card */}
            <IonCol size="4" sizeSm="4" sizeMd="4" sizeLg="4" sizeXl="4" className="try-col">
              <div className="tryon-card">
                <div className="try-cardhead">
                  <User className="try-logo" />
                  <h2 className="text-xl font-semibold">Model</h2>
                </div>
                <div className="try-input">
                  <input
                    type="url"
                    placeholder="Enter model image URL"
                    className="tryon-input"
                    value={modelImage}
                    onChange={(e) => setModelImage(e.target.value)}
                  />
                  <div className="img-container">
                    {modelImage ? (
                      <img src={modelImage} alt="Model" className="try-img" onError={() => setError("Invalid model image URL")} />
                    ) : (
                      <div className="after-logo"><User className="w-16 h-16" /></div>
                    )}
                  </div>
                </div>
              </div>
            </IonCol>

            {/* Garment Image Card */}
            <IonCol size="4" sizeSm="4" sizeMd="4" sizeLg="4" sizeXl="4" className="try-col">
              <div className="tryon-card">
                <div className="try-cardhead">
                  <Shirt className="try-logo" />
                  <h2 className="text-xl font-semibold">Garment</h2>
                </div>
                <div className="try-input">
                  <input
                    type="url"
                    placeholder="Enter garment image URL"
                    className="tryon-input"
                    value={garmentImage}
                    onChange={(e) => setGarmentImage(e.target.value)}
                  />
                  <div className="img-container">
                    {garmentImage ? (
                      <img src={garmentImage} alt="Garment" className="try-img" onError={() => setError("Invalid garment image URL")} />
                    ) : (
                      <div className="after-logo"><Shirt className="w-16 h-16" /></div>
                    )}
                  </div>
                </div>
              </div>
            </IonCol>

            {/* Result Card */}
            <IonCol size="4" sizeSm="4" sizeMd="4" sizeLg="4" sizeXl="4" className="try-col">
              <div className="tryon-card result-output bg-white p-6 rounded-xl shadow-md">
                <div className="try-cardhead">
                  <ImageIcon className="try-logo" />
                  <h2 className="text-xl font-semibold">Result</h2>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={handleTryOn}
                    disabled={loading || !modelImage || !garmentImage}
                    className="try-button"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="tryon-btnl animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="tryon-btnt" />
                        Try On
                      </>
                    )}
                  </button>
                  {error && <p className="text-sm">{error}</p>}
                  <div className="img-container">
                    {resultImage ? (
                      <img src={resultImage} alt="Result" className="try-img" />
                    ) : (
                      <div className="after-logo"><ImageIcon className="w-16 h-16" /></div>
                    )}
                  </div>
                </div>
              </div>
            </IonCol>

          </IonRow>
          <button className='btn-suggest' onClick={handleSuggestionsClick}>
            Provide Me Suggestions
          </button>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {skinTones.map((tone, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <div
                  className="w-10 h-10 rounded-full border"
                  style={{ backgroundColor: `rgb(${tone.r}, ${tone.g}, ${tone.b})` }}
                />
                <h3 className="text-sm font-medium">
                  rgb({tone.r}, {tone.g}, {tone.b})
                </h3>
                
              </div>
            ))}
          </div>



        </IonGrid>
      </div>
    </div>
  );
}

export default TryOn;
