import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../../../Store/Slice/pageSlice";
import { RootState } from "../../../Store/store";
import { database } from "../../../Store/Slice/firebase";
import { ref, get, child } from "firebase/database";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";

import "./Hero.css"; // Import the new CSS file
import { IonIcon } from "@ionic/react";
// Import social media icons and navigation icon
import {
    chevronForward,
    logoInstagram,
    logoFacebook,
    logoTwitter,
    logoLinkedin,
    logoPinterest // Added Pinterest as it's common for e-commerce
} from 'ionicons/icons';
import { FaTags } from "react-icons/fa";

interface HeroSlide {
    image: string;
    heading: string;
    paragraph: string;
}

const Hero: React.FC = () => {
    const dispatch = useDispatch();
    // const products = useSelector((state: RootState) => state.page.products); // products not used in this component

    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [loadingSlides, setLoadingSlides] = useState(true);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        const dbRef = ref(database);

        // Fetch hero banner data from Firebase
        get(child(dbRef, `banners/admin_banner`)).then(snapshot => {
            if (snapshot.exists()) {
                const slidesData = snapshot.val();
                if (Array.isArray(slidesData)) {
                    const validSlides = slidesData
                        .map((slide: any) => ({
                            image: typeof slide.image === 'string' ? slide.image : '',
                            heading: typeof slide.heading === 'string' ? slide.heading : 'Default Heading',
                            paragraph: typeof slide.paragraph === 'string' ? slide.paragraph : 'Default Paragraph'
                        }))
                        .filter((slide: HeroSlide) => slide.image); // Only include slides with an image

                    // If no valid slides from Firebase, use default placeholders
                    setHeroSlides(validSlides.length > 0 ? validSlides : [
                        { image: 'https://placehold.co/1920x1080/E59866/ffffff?text=Welcome+to+StyleSync', heading: 'Welcome to StyleSync', paragraph: 'Discover your perfect style.' },
                        { image: 'https://placehold.co/1920x1080/3A3E6C/ffffff?text=Great+Deals+Await', heading: 'Great Deals Await', paragraph: 'Shop now and save big.' },
                        { image: 'https://placehold.co/1920x1080/002642/ffffff?text=New+Collections', heading: 'New Collections', paragraph: 'Stay ahead of the trend.' }
                    ]);
                } else {
                    // Fallback if data is not an array
                    setHeroSlides([
                        { image: 'https://placehold.co/1920x1080/E59866/ffffff?text=Welcome+to+StyleSync', heading: 'Welcome to StyleSync', paragraph: 'Discover your perfect style.' },
                        { image: 'https://placehold.co/1920x1080/3A3E6C/ffffff?text=Great+Deals+Await', heading: 'Great Deals Await', paragraph: 'Shop now and save big.' },
                        { image: 'https://placehold.co/1920x1080/002642/ffffff?text=New+Collections', heading: 'New Collections', paragraph: 'Stay ahead of the trend.' }
                    ]);
                }
            } else {
                // Fallback if no snapshot exists
                setHeroSlides([
                    { image: 'https://placehold.co/1920x1080/E59866/ffffff?text=Welcome+to+StyleSync', heading: 'Welcome to StyleSync', paragraph: 'Discover your perfect style.' },
                    { image: 'https://placehold.co/1920x1080/3A3E6C/ffffff?text=Great+Deals+Await', heading: 'Great Deals Await', paragraph: 'Shop now and save big.' },
                    { image: 'https://placehold.co/1920x1080/002642/ffffff?text=New+Collections', heading: 'New Collections', paragraph: 'Stay ahead of the trend.' }
                ]);
            }
            setLoadingSlides(false);
        }).catch(error => {
            console.error("Error fetching hero slides:", error);
            setLoadingSlides(false);
            // Fallback on error
            setHeroSlides([
                { image: 'https://placehold.co/1920x1080/E59866/ffffff?text=Welcome+to+StyleSync', heading: 'Welcome to StyleSync', paragraph: 'Discover your perfect style.' },
                { image: 'https://placehold.co/1920x1080/3A3E6C/ffffff?text=Great+Deals+Await', heading: 'Great Deals Await', paragraph: 'Shop now and save big.' },
                { image: 'https://placehold.co/1920x1080/002642/ffffff?text=New+Collections', heading: 'New Collections', paragraph: 'Stay ahead of the trend.' }
            ]);
        });
    }, []);

    const currentSlide = heroSlides[currentSlideIndex];

    return (
        <>
            {/* Main Hero Section with Swiper Background */}
            <div className="hero-section">
                
                {/* Swiper background */}
                {!loadingSlides && heroSlides.length > 0 ? (
                    <Swiper
                        className="hero-swiper-container"
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        modules={[Autoplay]}
                        onSlideChange={(swiper) => {
                            setCurrentSlideIndex(swiper.realIndex);
                        }}
                    >
                        {heroSlides.map((slide, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={slide.image}
                                    alt={`Hero Background ${index + 1}`}
                                    className="hero-swiper-image"
                                    onError={(e) => {
                                        // Fallback for broken images if Firebase provides invalid URLs
                                        e.currentTarget.src = 'https://placehold.co/1920x1080/E59866/ffffff?text=Image+Not+Found';
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    // Static background or loading state
                    <div className="hero-static-background">
                        {loadingSlides ? (
                            <div className="hero-loading-spinner"></div> // Simple spinner for loading
                        ) : (
                            <img
                                src="https://placehold.co/1920x1080/E59866/ffffff?text=Welcome+to+StyleSync"
                                alt="Default Hero Background"
                                className="hero-swiper-image"
                            />
                        )}
                    </div>
                )}

                {/* Hero Content Overlay */}
                <section className="hero-content-overlay ion-padding">
                    <div className="hero-content">
                        {loadingSlides ? (
                            <p className="hero-loading-text">Loading amazing styles...</p>
                        ) : currentSlide ? (
                            <>
                                <h2 className="hero-heading">
                                    {currentSlide.heading.includes(" ") ? (
                                        <>
                                            {currentSlide.heading.split(' ').slice(0, -1).join(' ')}{" "}
                                            <span className="hero-heading-highlight">{currentSlide.heading.split(' ').slice(-1)[0]}</span>
                                        </>
                                    ) : (
                                        currentSlide.heading
                                    )}
                                </h2>
                                <p className="hero-paragraph">{currentSlide.paragraph}</p>
                            </>
                        ) : (
                            <>
                                <h2 className="hero-heading">Welcome <span className="hero-heading-highlight">2025</span></h2>
                                <p className="hero-paragraph">Discover your perfect style, one good outfit can make your confidence level high!</p>
                            </>
                        )}

                        <div className="hero-buttons">
                            <button className="hero-icon-btn"><FaTags /></button>
                            <div className="hero-arrival-button-wrapper">
                                <button className="hero-arrival-btn" onClick={() => dispatch(setPage("arrival"))}>
                                    New Arrival
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

           {/* features */}
                        <div className="hero-features ">
                <div className="hero-feature-item">
                    <h3 className="hero-feature-title">Free Shipping</h3>
                    
                </div>
                <div className="hero-feature-item">
                    <h3 className="hero-feature-title">24/7 Customer Support</h3>
                </div>
                <div className="hero-feature-item">
                    <h3 className="hero-feature-title">Secure Payments</h3>
                </div>
            </div>

            {/* Social Media Sidebar (Fixed Overlay) */}
            <div className="social-media-sidebar">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn"><IonIcon icon={logoInstagram}></IonIcon></a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn"><IonIcon icon={logoFacebook}></IonIcon></a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn"><IonIcon icon={logoTwitter}></IonIcon></a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn"><IonIcon icon={logoLinkedin}></IonIcon></a>
                <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn"><IonIcon icon={logoPinterest}></IonIcon></a>
            </div>

         

            {/* You can add other sections of your landing page here */}
            {/* For example: Featured Products, Testimonials, Categories, etc. */}
        </>
    );
};

export default Hero;
