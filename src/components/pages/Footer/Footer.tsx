import React from "react";
import { IonFooter, IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonInput } from "@ionic/react";
import { logoFacebook, logoTwitter, logoInstagram, paperPlaneOutline } from "ionicons/icons";
import "./footer.css"
const Footer: React.FC = () => {
  return (
    <IonFooter >
      <div id="zz">
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
                  <IonInput type="email" placeholder="Email" className="form-control" />
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
              <p className="qq">© 2021 Glass UI by <a id="oo" href="aa">KingStudio</a> <a href="https://kingstudio.ro" target="_blank" rel="noopener noreferrer"></a></p>
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