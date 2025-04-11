import React, {useEffect, useRef} from "react";
import { IonFooter, IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonInput } from "@ionic/react";
import { logoFacebook, logoTwitter, logoInstagram, paperPlaneOutline } from "ionicons/icons";
import "./footer.css"
const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && footerRef.current) {
          footerRef.current.classList.add("visible");
        }
      },
      { threshold: 0.20 }
    );
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);
  return (
    <IonFooter >
      <div id="zz" ref={footerRef}>
        <IonGrid id="ab">
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <div className="widget">
               <h6 className="widget-title">About Us</h6>
                <p className="ss">Quisque sit amet velit ipsum. Ut eget pretium. Vivamus finibus dui sit amet tortor eleifend bibendum.</p>
                <p className="s">Suspendisse aliquam, tellus eget bibendum vehicula, massa magna consequat sem.</p>
              </div>
            </IonCol>
            <IonCol size="12" sizeMd="4">
              <div className="widget">
                <h6 className="widget-title" id="ii">Links List</h6>
                <IonRow id="dd">
                  <IonCol size="6">
                    <ul className="menu-list">
                      <li><a id="a" href="#">Home</a></li>
                      <li><a id="b" href="#">About</a></li>
                      <li><a id="c" href="#">Services</a></li>
                      <li><a id="d" href="#">Apps</a></li>
                    </ul>
                  </IonCol>
                  <IonCol size="5">
                    <ul className="menu-list">
                      <li><a id="e" href="#">Shop</a></li>
                      <li><a id="f" href="#">Team</a></li>
                      <li><a id="g" href="#">Blog</a></li>
                      <li><a id="h" href="#">Contact</a></li>
                    </ul>
                  </IonCol>
                </IonRow>
              </div>
            </IonCol>
            <IonCol size="12" sizeMd="4">
               <div className="widget"> 
                <h6 className="widget-title">Newsletter</h6>
                <p className="sss">Quisque aliquet lorem nec dui posuere des et, scelerisque ultrices metus aliquam mattisiu:</p>
                <div className="newsletter-input">
                  <IonInput type="email" placeholder="E-Mail" className="form-control" />
                  <IonButton  className="subscribe-button" >
                     <IonIcon icon={paperPlaneOutline} /> 
                     Subscribe
                  </IonButton>
                </div>
               </div> 
            </IonCol>
          </IonRow>
        </IonGrid>
      <IonToolbar className="bg-no-gradient">
        <IonGrid id="cc">
           <IonRow className="v-center mobile-center"> 
            <IonCol size="10" sizeMd="6" className="footer-left-area">
              <p className="qq">© 2025 Ecommerce website by <a id="oo" href="aa">Algo-Tex</a> <a href="https://Algo-tex.com" target="_blank" rel="noopener noreferrer"></a></p>
            </IonCol>
            <IonCol size="12" sizeMd="12" className="footer-right-area" >
              <p className="footer-social">
                <IonButton className="social-btn" href="#" fill="clear">
                  <IonIcon id="z" icon={logoFacebook} />
                </IonButton>
                <IonButton className="social-btn" href="#" fill="clear">
                  <IonIcon icon={logoTwitter} />
                </IonButton>
                <IonButton className="social-btn" href="#" fill="clear">
                  <IonIcon icon={logoInstagram} />
                </IonButton>
              </p>
            </IonCol>
          </IonRow> 
        </IonGrid>
      </IonToolbar>
      </div>
    </IonFooter>
  );
};
export default Footer;