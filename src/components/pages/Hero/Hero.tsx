import React, { useEffect, useState } from "react"; // Import useState and useEffect
import { useDispatch, useSelector } from "react-redux";
import { setPage, setProducts } from "../../../Store/Slice/pageSlice";
import { RootState } from "../../../Store/store";
import { database } from "../../../Store/Slice/firebase"; // Import database instance
import { ref, get, child } from "firebase/database"; // Import Firebase Realtime Database functions

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper modules
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay"; // If you're using autoplay module

import "./Hero.css"; // Ensure this CSS file is correctly linked
import { IonIcon } from "@ionic/react";
import { pricetags, chevronForward } from 'ionicons/icons';
import { FaTags } from "react-icons/fa";
import Header from "../Header/Header";

// Utility to get the logged-in user's ID
function getCurrentUserId() {
    return localStorage.getItem('adminUserId');
}

const Hero: React.FC = () => {
    const dispatch = useDispatch();
    const products = useSelector((state: RootState) => state.page.products);

    // State to store fetched background images
    const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
    const [loadingImages, setLoadingImages] = useState(true);

    useEffect(() => {
        const userId = getCurrentUserId();
        if (!userId) {
            setLoadingImages(false);
            return;
        }

        const dbRef = ref(database);
        get(child(dbRef, `users/${userId}/heroBackgrounds`)).then(snapshot => {
            if (snapshot.exists()) {
                const images = snapshot.val();
                if (Array.isArray(images)) {
                    // Filter out any empty strings or null values to only show actual images
                    setBackgroundImages(images.filter(img => img && typeof img === 'string'));
                }
            }
            setLoadingImages(false);
        }).catch(error => {
            console.error("Error fetching hero background images:", error);
            setLoadingImages(false);
        });
    }, []);

    return (
        <>
            <div className="hero-section">
                {/* Conditional rendering of Swiper background */}
                {!loadingImages && backgroundImages.length > 0 ? (
                    <Swiper
                        className="hero-swiper-container" // Add a class for styling
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true} // Loop through slides
                        autoplay={{
                            delay: 5000, // 5 seconds delay
                            disableOnInteraction: false, // Continue autoplay after user interaction
                        }}
                        modules={[Autoplay]}
                    >
                        {backgroundImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                <img src={image} alt={`Hero Background ${index + 1}`} className="hero-swiper-image" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    // Fallback background image if no images are uploaded or while loading
                    <div className="hero-static-background"></div>
                )}

                <section className="ion-padding">
                    <Header />
                    <div className="hero">
                        <div className="hero-content">
                            <h2>Fashion <span className="year">2025</span></h2>
                            <p>One good outfit can make your confident level high, Have a good day with good deals</p>
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