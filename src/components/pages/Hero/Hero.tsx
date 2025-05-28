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

import "./Hero.css";
import { IonIcon } from "@ionic/react";
import { chevronForward } from 'ionicons/icons';
import { FaTags } from "react-icons/fa";

interface HeroSlide {
    image: string;
    heading: string;
    paragraph: string;
}

const Hero: React.FC = () => {
    const dispatch = useDispatch();
    const products = useSelector((state: RootState) => state.page.products);

    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [loadingSlides, setLoadingSlides] = useState(true);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        const dbRef = ref(database);

        // Shared admin_banner node
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
                        .filter((slide: HeroSlide) => slide.image);

                    setHeroSlides(validSlides.length > 0 ? validSlides : [
                        { image: '', heading: 'Welcome to Fashion', paragraph: 'Discover your perfect style.' },
                        { image: '', heading: 'Great Deals Await', paragraph: 'Shop now and save big.' },
                        { image: '', heading: 'New Collections', paragraph: 'Stay ahead of the trend.' }
                    ]);
                }
            } else {
                setHeroSlides([
                    { image: '', heading: 'Welcome to Fashion', paragraph: 'Discover your perfect style.' },
                    { image: '', heading: 'Great Deals Await', paragraph: 'Shop now and save big.' },
                    { image: '', heading: 'New Collections', paragraph: 'Stay ahead of the trend.' }
                ]);
            }
            setLoadingSlides(false);
        }).catch(error => {
            console.error("Error fetching hero slides:", error);
            setLoadingSlides(false);
        });
    }, []);

    const currentSlide = heroSlides[currentSlideIndex];

    return (
        <>
            <h3 className="welcome-message">Welcome, Have a nice day</h3>
            <div className="header-container">
                <div className="features">
                    <h3>7 Days Easy Return</h3>
                    <h3 className="side-border">Cash on Delivery</h3>
                    <h3>Lowest Prices</h3>
                </div>
            </div>

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
                                <img src={slide.image} alt={`Hero Background ${index + 1}`} className="hero-swiper-image" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="hero-static-background"></div>
                )}

                <section className="ion-padding">
                    <div className="hero">
                        <div className="hero-content">
                            {loadingSlides ? (
                                <p>Loading content...</p>
                            ) : currentSlide ? (
                                <>
                                    <h2>
                                        {currentSlide.heading.includes(" ") ? (
                                            <>
                                                {currentSlide.heading.split(' ').slice(0, -1).join(' ')}{" "}
                                                <span className="year">{currentSlide.heading.split(' ').slice(-1)[0]}</span>
                                            </>
                                        ) : (
                                            currentSlide.heading
                                        )}
                                    </h2>
                                    <p>{currentSlide.paragraph}</p>
                                </>
                            ) : (
                                <>
                                    <h2>Welcome <span className="year">2025</span></h2>
                                    <p>Discover your perfect style, one good outfit can make your confidence level high!</p>
                                </>
                            )}

                            <div className="hero-buttons">
                                <button className="icon-btn"><FaTags /></button>
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
