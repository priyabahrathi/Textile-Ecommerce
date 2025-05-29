import React, { useEffect, useState } from 'react';
import { database } from '../../../../../Store/Slice/firebase';
import { ref, get, child, set } from 'firebase/database';
import './bannerimg.css'; // Your existing CSS file
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdArrowRoundDown, IoMdArrowRoundUp } from 'react-icons/io';
import { RxCross2 } from "react-icons/rx";
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
    const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | null>(null);

    useEffect(() => {
        const dbRef = ref(database);
        get(child(dbRef, `banners/${ADMIN_ID}`))
            .then(snapshot => {
                if (snapshot.exists()) {
                    setHeroSlides(snapshot.val());
                } else {
                    // Default slides if none exist in Firebase
                    setHeroSlides([
                        { image: '', heading: 'Welcome to Fashion', paragraph: 'Discover your perfect style.' },
                        { image: '', heading: 'Deals Await', paragraph: 'Shop now and save big.' },
                        { image: '', heading: 'New Collections', paragraph: 'Stay ahead of trends.' }
                    ]);
                }
            })
            .catch(error => {
                console.error("Error fetching banner data:", error);
                setSaveMessage("Failed to load banners.");
                setMessageType('error');
            });
    }, []);

    const handleChange = (index: number, field: keyof HeroSlide, value: string) => {
        const updated = [...heroSlides];
        updated[index] = { ...updated[index], [field]: value };
        setHeroSlides(updated);
    };

    const handleAddSlide = () => {
        setHeroSlides([...heroSlides, { image: '', heading: '', paragraph: '' }]);
    };

    const handleRemoveSlide = (index: number) => {
        if (window.confirm("Are you sure you want to remove this banner slide?")) {
            const updated = heroSlides.filter((_, i) => i !== index);
            setHeroSlides(updated);
        }
    };

    const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
        const updatedSlides = [...heroSlides];
        if (direction === 'up' && index > 0) {
            [updatedSlides[index - 1], updatedSlides[index]] = [updatedSlides[index], updatedSlides[index - 1]];
        } else if (direction === 'down' && index < updatedSlides.length - 1) {
            [updatedSlides[index + 1], updatedSlides[index]] = [updatedSlides[index], updatedSlides[index + 1]];
        }
        setHeroSlides(updatedSlides);
    };

    const handleClearImage = (index: number) => {
        handleChange(index, 'image', '');
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage("Saving changes...");
        setMessageType('info');
        try {
            await set(ref(database, `banners/${ADMIN_ID}`), heroSlides);
            setSaveMessage("Banners saved successfully!");
            setMessageType('success');
        } catch (e) {
            console.error("Error saving slides:", e);
            setSaveMessage("Error saving banners. Please try again.");
            setMessageType('error');
        }
        setTimeout(() => {
            setIsSaving(false);
            setSaveMessage(null);
            setMessageType(null);
        }, 3000);
    };

    return (
        <div className="banner-admin-container">
            <h2 className="banner-admin-title">🚀 Manage Hero Banners</h2>
            <p className="banner-admin-description">
                Customize the images, headings, and paragraphs for your website's main hero section.
            </p>

            <div className="banner-grid">
                {heroSlides.map((slide, i) => (
                    <div className="banner-card" key={i}>
                        <div className="banner-card-header">
                            <h3>Slide {i + 1}</h3>
                            <div className="banner-card-actions">
                                {heroSlides.length > 1 && (
                                    <>
                                        <button
                                            className="action-btn move-btn"
                                            onClick={() => handleMoveSlide(i, 'up')}
                                            disabled={i === 0}
                                            title="Move Up"
                                        >
                                            <IoMdArrowRoundUp />
                                        </button>
                                        <button
                                            className="action-btn move-btn"
                                            onClick={() => handleMoveSlide(i, 'down')}
                                            disabled={i === heroSlides.length - 1}
                                            title="Move Down"
                                        >
                                            <IoMdArrowRoundDown />
                                        </button>
                                    </>
                                )}
                                <button
                                    className="action-btn remove-btn"
                                    onClick={() => handleRemoveSlide(i)}
                                    title="Remove Slide"
                                >
                                    <RiDeleteBin6Line />
                                </button>
                            </div>
                        </div>
                        <div className="img-preview-container">
                            {slide.image ? (
                                <img src={slide.image} alt={`Slide ${i + 1} preview`} className="img-preview" />
                            ) : (
                                <div className="img-placeholder">No Image Preview</div>
                            )}
                            {slide.image && (
                                <button
                                    className="clear-image-btn"
                                    onClick={() => handleClearImage(i)}
                                    title="Clear Image"
                                >
                                    <RxCross2 />
                                </button>
                            )}
                        </div>
                        <div className="form-group">
                            <input
                                type="url" // Use type="url" for better validation
                                value={slide.image}
                                onChange={(e) => handleChange(i, 'image', e.target.value)}
                                placeholder="e.g., https://example.com/image.jpg"
                                className="form-input"
                            />
                            <label className="form-label">Image URL</label>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                value={slide.heading}
                                onChange={(e) => handleChange(i, 'heading', e.target.value)}
                                placeholder="Enter a captivating heading"
                                maxLength={50} // Limit heading length
                                className="form-input"
                            />
                            <label className="form-label">Heading <span className="char-count">({slide.heading.length}/50)</span></label>
                        </div>
                        <div className="form-group">
                            <textarea
                                value={slide.paragraph}
                                onChange={(e) => handleChange(i, 'paragraph', e.target.value)}
                                placeholder="Add a descriptive paragraph"
                                rows={3}
                                maxLength={150} // Limit paragraph length
                                className="form-textarea"
                            />
                            <label className="form-label">Paragraph <span className="char-count">({slide.paragraph.length}/150)</span></label>
                        </div>
                    </div>
                ))}
                <div className="add-slide-card" onClick={handleAddSlide}>
                    <span className="add-icon">+</span>
                    <p>Add New Slide</p>
                </div>
            </div>

            <div className="banner-controls">
                <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? " Saving..." : " Save All Changes"}
                </button>
                {saveMessage && (
                    <div className={`save-toast ${messageType}`}>
                        {saveMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BannerImg;