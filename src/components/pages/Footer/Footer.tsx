import { IonApp, IonGrid, IonRow, IonCol } from "@ionic/react";
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';

const Footer: React.FC = () => {
    return (
        <IonApp>
            <IonGrid className="aa">
                <div className="container">
                    <h3 className="section-title text-center mb-100 aos-init aos-animate" data-aos="fade-down">
                        Famous Brands
                    </h3>

                
                    <Swiper
                        spaceBetween={50}
                        slidesPerView={4}
                        navigation
                        pagination={{ clickable: true }}
                    >
                        
                        <SwiperSlide>
                            <img src="../assets/images/logo18.png" alt="Logo 18" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="../assets/images/logo19.png" alt="Logo 19" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="../assets/images/logo9.png" alt="Logo 9" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="../assets/images/logo11.png" alt="Logo 11" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="../assets/images/logo12.png" alt="Logo 12" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="../assets/images/logo13.png" alt="Logo 13" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="../assets/images/logo14.png" alt="Logo 14" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="../assets/images/logo15.png" alt="Logo 15" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="../assets/images/logo16.png" alt="Logo 16" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="../assets/images/logo17.png" alt="Logo 17" />
                        </SwiperSlide>
                    </Swiper>
                </div>

                
                <div className="footer-wrapper bg-gradient-body">
                    <div className="footer-widget-area bg-transparent">
                        <div className="container">
                            <IonRow>
                                <IonCol size="12" >
                                    <div className="widget">
                                        <h6 className="widget-title">About Us</h6>
                                        <p>Quisque sit amet velit ipsum. Ut eget pretiun. Vivamus finibus dui sit amet tortor eleifend bibendum. Sed ut diam sollicitudin.</p>
                                        <p className="mb-0">Suspendisse aliquam, tellus eget bibendum vehicula, massa magna consequat sem.</p>
                                    </div>
                                </IonCol>

                                <IonCol size="12" >
                                    <div className="widget">
                                        <h6 className="widget-title">Links List</h6>
                                        <div className="row">
                                            <div className="col-6">
                                                <ul className="list-unstyled list-icon list-arrow list-primary list-has-link menu-list mb-0 tablet-lg-top">
                                                    <li className="mb-10"><a href="#x">Home</a></li>
                                                    <li className="mb-10"><a href="#x">About</a></li>
                                                    <li className="mb-10"><a href="#x">Services</a></li>
                                                    <li className="mb-0"><a href="#x">Apps</a></li>
                                                </ul>
                                            </div>

                                            <div className="col-6">
                                                <ul className="list-unstyled list-icon list-arrow list-primary list-has-link menu-list mb-0">
                                                    <li className="mb-10"><a href="#x">Shop</a></li>
                                                    <li className="mb-10"><a href="#x">Team</a></li>
                                                    <li className="mb-10"><a href="#x">Blog</a></li>
                                                    <li className="mb-0"><a href="#x">Contact</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </IonCol>

                                <IonCol size="12">
                                    <div className="widget">
                                        <h6 className="widget-title">Newsletter</h6>
                                        <p className="mb-20">Quisque aliquet lorem nec dui posuere des et, scelerisque ultrices metus aliquam mattisiu:</p>
                                        <div className="input-group input-w-overlap-btn mb-0">
                                            <input type="text" className="form-control rounded-sm" placeholder="Email" />
                                            <span className="input-group-btn">
                                                <button className="btn btn-sm btn-primary lh-0 overlapping-btn big-btn rounded-sm" type="button"><i className="fas fa-paper-plane mr-5"></i> Subscribe</button>
                                            </span>
                                        </div>
                                    </div>
                                </IonCol>
                            </IonRow>
                        </div>
                    </div>
                    <footer className="bg-no-gradient">
                        <div className="container">
                            <IonRow className="v-center mobile-center">
                                <IonCol size="12"  className="footer-left-area tablet-top">
                                    <p>© 2021 Glass UI by <a href="https://kingstudio.ro" target="_blank" rel="noopener noreferrer">KingStudio</a></p>
                                </IonCol>
                                <IonCol size="12"  className="footer-right-area">
                                    <p className="footer-social">
                                        <a href="#x" className="btn btn-xs btn-icon btn-circle btn-primary mr-10"><i className="fab fa-facebook-f"></i></a>
                                        <a href="#x" className="btn btn-xs btn-icon btn-circle btn-primary mr-10"><i className="fab fa-twitter"></i></a>
                                        <a href="#x" className="btn btn-xs btn-icon btn-circle btn-primary"><i className="fab fa-instagram"></i></a>
                                    </p>
                                </IonCol>
                            </IonRow>
                        </div>
                    </footer>
                </div>
            </IonGrid>
        </IonApp>
    );
};

export default Footer;
