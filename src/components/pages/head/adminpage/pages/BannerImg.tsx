// BannerImg.tsx
import React, { useEffect, useState } from 'react';
import { database } from '../../../../../Store/Slice/firebase';
import { ref, get, child, set } from 'firebase/database';
import './bannerimg.css';

interface HeroSlide {
    image: string;
    heading: string;
    paragraph: string;
}

const ADMIN_ID = 'admin_banner';

const BannerImg: React.FC = () => {
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    useEffect(() => {
        const dbRef = ref(database);
        get(child(dbRef, `banners/${ADMIN_ID}`)).then(snapshot => {
            if (snapshot.exists()) {
                setHeroSlides(snapshot.val());
            } else {
                setHeroSlides([
                    { image: '', heading: 'Welcome to Fashion', paragraph: 'Discover your perfect style.' },
                    { image: '', heading: 'Deals Await', paragraph: 'Shop now and save big.' },
                    { image: '', heading: 'New Collections', paragraph: 'Stay ahead of trends.' }
                ]);
            }
        });
    }, []);

    const handleChange = (index: number, field: keyof HeroSlide, value: string) => {
        const updated = [...heroSlides];
        updated[index] = { ...updated[index], [field]: value };
        setHeroSlides(updated);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage("Saving...");
        try {
            await set(ref(database, `banners/${ADMIN_ID}`), heroSlides);
            setSaveMessage("Saved successfully!");
        } catch (e) {
            setSaveMessage("Error saving slides.");
        }
        setTimeout(() => {
            setIsSaving(false);
            setSaveMessage(null);
        }, 3000);
    };

    return (
        <div className="bannerimg-container">
            <h2>Banner Slides Management</h2>
            <div className="image-upload-cards-container">
                {heroSlides.map((slide, i) => (
                    <div className="image-upload-card" key={i}>
                        <h4>Slide {i + 1}</h4>
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={slide.image}
                            onChange={(e) => handleChange(i, 'image', e.target.value)}
                        />
                        {slide.image && <img src={slide.image} alt={`Slide ${i + 1}`} />}
                        <input
                            type="text"
                            placeholder="Heading"
                            value={slide.heading}
                            onChange={(e) => handleChange(i, 'heading', e.target.value)}
                        />
                        <textarea
                            placeholder="Paragraph"
                            value={slide.paragraph}
                            onChange={(e) => handleChange(i, 'paragraph', e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <button className="save-button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Slides"}
            </button>
            {saveMessage && <p className="save-message">{saveMessage}</p>}
        </div>
    );
};

export default BannerImg;
