import React from "react";
import { IonFooter, IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonInput } from "@ionic/react";
import { logoFacebook, logoTwitter, logoInstagram, paperPlaneOutline } from "ionicons/icons";


const Footer: React.FC = () => {
  return (
    <IonFooter className="footer-wrapper bg-gradient-body">
      <div className="footer-widget-area bg-transparent">
        <IonGrid>
          <IonRow>
            {/* About Us Section */}
            <IonCol size="12" sizeMd="4">
              <div className="widget">
                <h6 className="widget-title">About Us</h6>
                <p>Quisque sit amet velit ipsum. Ut eget pretium. Vivamus finibus dui sit amet tortor eleifend bibendum.</p>
                <p className="mb-0">Suspendisse aliquam, tellus eget bibendum vehicula, massa magna consequat sem.</p>
              </div>
            </IonCol>

            {/* Links List Section */}
            <IonCol size="12" sizeMd="4">
              <div className="widget">
                <h6 className="widget-title">Links List</h6>
                <IonRow>
                  <IonCol size="6">
                    <ul className="menu-list">
                      <li><a href="#">Hom</a></li>
                      <li><a href="#">About</a></li>
                      <li><a href="#">Services</a></li>
                      <li><a href="#">Apps</a></li>
                    </ul>
                  </IonCol>
                  <IonCol size="6">
                    <ul className="menu-list">
                      <li><a href="#">Shop</a></li>
                      <li><a href="#">Team</a></li>
                      <li><a href="#">Blog</a></li>
                      <li><a href="#">Contact</a></li>
                    </ul>
                  </IonCol>
                </IonRow>
              </div>
            </IonCol>

            {/* Newsletter Section */}
            <IonCol size="12" sizeMd="4">
              <div className="widget">
                <h6 className="widget-title">Newsletter</h6>
                <p>Quisque aliquet lorem nec dui posuere des et, scelerisque ultrices metus aliquam mattisiu:</p>
                <div className="newsletter-input">
                  <IonInput type="email" placeholder="Email" className="form-control" />
                  <IonButton className="subscribe-button">
                    <IonIcon icon={paperPlaneOutline} /> Subscribe
                  </IonButton>
                </div>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>

      {/* Footer Bottom */}
      <IonToolbar className="bg-no-gradient">
        <IonGrid>
          <IonRow className="v-center mobile-center">
            <IonCol size="12" sizeMd="4" className="footer-left-area">
              <p>@textileecommerce <a href="https://kingstudio.ro" target="_blank" rel="noopener noreferrer"></a></p>
            </IonCol>
            <IonCol size="12" sizeMd="8" className="footer-right-area">
              <p className="footer-social">
                <IonButton className="social-btn" href="#" fill="clear">
                  <IonIcon icon={logoFacebook} />
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
    </IonFooter>
  );
};

export default Footer;
