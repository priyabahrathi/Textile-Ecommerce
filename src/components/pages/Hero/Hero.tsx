import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPage, setProducts } from "../../../Store/Slice/pageSlice";
import { RootState } from "../../../Store/store";
import { database } from "../../../Store/Slice/firebase";
import { ref, get, child } from "firebase/database";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper modules
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";

import "./Hero.css";
import { IonIcon } from "@ionic/react";
import { pricetags, chevronForward } from 'ionicons/icons';
import { FaTags } from "react-icons/fa";
import Header from "../Header/Header";

// Define the structure for each hero slide
interface HeroSlide {
    image: string;
    heading: string;
    paragraph: string;
}

// Utility to get the logged-in user's ID
function getCurrentUserId() {
    return localStorage.getItem('adminUserId');
}

const Hero: React.FC = () => {
    const dispatch = useDispatch();
    const products = useSelector((state: RootState) => state.page.products);

    // State to store fetched hero slides (images + text)
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [loadingSlides, setLoadingSlides] = useState(true);
    // State to keep track of the currently active slide index
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        const userId = getCurrentUserId();
        if (!userId) {
            setLoadingSlides(false);
            return;
        }

        const dbRef = ref(database);

        // Fetch hero slides
        get(child(dbRef, `users/${userId}/heroSlides`)).then(snapshot => {
            if (snapshot.exists()) {
                const slidesData = snapshot.val();
                if (Array.isArray(slidesData)) {
                    // Filter out any invalid slides and ensure structure
                    const validSlides: HeroSlide[] = slidesData.map((slide: any) => ({
                        image: typeof slide.image === 'string' ? slide.image : '',
                        heading: typeof slide.heading === 'string' ? slide.heading : 'Default Heading',
                        paragraph: typeof slide.paragraph === 'string' ? slide.paragraph : 'Default Paragraph'
                    })).filter((slide: HeroSlide) => slide.image); // Only keep slides with an image

                    // If no valid slides, use some default ones
                    if (validSlides.length === 0) {
                        setHeroSlides([
                            { image: '', heading: 'Welcome to Fashion', paragraph: 'Discover your perfect style.' },
                            { image: '', heading: 'Great Deals Await', paragraph: 'Shop now and save big.' },
                            { image: '', heading: 'New Collections', paragraph: 'Stay ahead of the trend.' },
                        ]);
                    } else {
                        setHeroSlides(validSlides);
                    }
                }
            } else {
                // If no data in Firebase, set some initial placeholder slides
                 setHeroSlides([
                    { image: '', heading: 'Welcome to Fashion', paragraph: 'Discover your perfect style.' },
                    { image: '', heading: 'Great Deals Await', paragraph: 'Shop now and save big.' },
                    { image: '', heading: 'New Collections', paragraph: 'Stay ahead of the trend.' },
                ]);
            }
            setLoadingSlides(false);
        }).catch(error => {
            console.error("Error fetching hero slides:", error);
            setLoadingSlides(false);
        });
    }, []);

    // Get the current slide data based on currentSlideIndex
    const currentSlide = heroSlides[currentSlideIndex];

    return (
        <>
         <h3 className="welcome-message">Welcome, Have a nice day</h3>
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
                            // Swiper's realIndex accounts for loop clones
                            setCurrentSlideIndex(swiper.realIndex);
                        }}
                    >
                        {heroSlides.map((slide, index) => (
                            <SwiperSlide key={index}>
                                <img src={slide.image} alt={`Hero Background ${index + 1}`} className="hero-swiper-image" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    // Fallback static background if no images are uploaded or while loading
                    <div className="hero-static-background"></div>
                )}

                <section className="ion-padding">
                    
                    <div className="hero">
                        
                        <div className="hero-content">
                            {loadingSlides ? (
                                <p>Loading content...</p>
                            ) : currentSlide ? (
                                <>
                                    <h2>{currentSlide.heading.includes(" ") ? (
                                        // Split the heading to apply 'year' class to the last word
                                        <>
                                            {currentSlide.heading.split(' ').slice(0, -1).join(' ')}{" "}
                                            <span className="year">{currentSlide.heading.split(' ').slice(-1)[0]}</span>
                                        </>
                                    ) : (
                                        // If no space, just display the heading
                                        currentSlide.heading
                                    )}</h2>
                                    <p>{currentSlide.paragraph}</p>
                                </>
                            ) : (
                                // Fallback text if no slides or currentSlide is undefined
                                <>
                                    <h2>Welcome <span className="year">2025</span></h2>
                                    <p>Discover your perfect style, one good outfit can make your confident level high!</p>
                                </>
                            )}
                            <div className="hero-buttons">
                                <button className="icon-btn" ><FaTags /></button>
                                <div className="arr-btn">
                                    <button className="arrival-btn" onClick={() => dispatch(setPage("arrival"))}>
                                        New Arrival<IonIcon icon={chevronForward}></IonIcon>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Hero;