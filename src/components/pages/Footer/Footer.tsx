// import React, { useEffect, useRef } from "react";
// import { IonFooter, IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonInput } from "@ionic/react";
// import { logoFacebook, logoTwitter, logoInstagram, paperPlaneOutline } from "ionicons/icons";
// import "./footer.css"
// const Footer: React.FC = () => {
//   const footerRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && footerRef.current) {
//           footerRef.current.classList.add("visible");
//         }
//       },
//       { threshold: 0.20 }
//     );
//     if (footerRef.current) {
//       observer.observe(footerRef.current);
//     }
//     return () => {
//       if (footerRef.current) {
//         observer.unobserve(footerRef.current);
//       }
//     };
//   }, []);
//   return (
//     <IonFooter >
//       <div id="zz" ref={footerRef}>
//         <IonGrid id="ab">
//           <IonRow>
//             <IonCol size="12" sizeMd="4">
//               <div className="widget">
//                 <h6 className="widget-title">About Us</h6>
//                 <p className="ss">At StyleSync, we're redefining the future of fashion shopping through cutting-edge AI and Augmented Reality. Our Virtual Try-On technology helps users visualize how clothes will look and fit—without stepping into a dressing room.</p>
//                 {/* <p className="s">By blending deep learning, computer vision, and AR, we make online shopping more immersive, accurate, and personalized. Whether you're at home or on the go, try on styles in real-time and make confident buying decisions.</p> */}
//               </div>
//             </IonCol>
//             <IonCol size="12" sizeMd="4">
//               <div className="widget">
//                 <h6 className="widget-title" id="ii">Links List</h6>
//                 <IonRow id="dd">
//                   <IonCol size="6">
//                     <ul className="menu-list">
//                       <li><a id="a" href="#">Home</a></li>
//                       <li><a id="b" href="#">About</a></li>
//                       <li><a id="c" href="#">Services</a></li>
//                       <li><a id="d" href="#">Apps</a></li>
//                     </ul>
//                   </IonCol>
//                   <IonCol size="5">
//                     <ul className="menu-list">
//                       <li><a id="e" href="#">Shop</a></li>
//                       <li><a id="f" href="#">Team</a></li>
//                       <li><a id="g" href="#">Blog</a></li>
//                       <li><a id="h" href="#">Contact</a></li>
//                     </ul>
//                   </IonCol>
//                 </IonRow>
//               </div>
//             </IonCol>
//             <IonCol size="12" sizeMd="4">
//               <div className="widget">
//                 <h6 className="widget-title">Newsletter</h6>
//                 <p className="sss">Stay updated on the latest styles, AI fashion trends, and exclusive try-on features.<br></br>
//                    Sign up for our newsletter and be the first to know about new arrivals, virtual try-on updates, and special offers tailored just for you.</p>
//                 <div className="newsletter-input">
//                   <IonInput type="email" placeholder="E-Mail" className="form-control" />
//                   <IonButton className="subscribe-button" >
//                     <IonIcon icon={paperPlaneOutline} />
//                     Subscribe
//                   </IonButton>
//                 </div>
//               </div>
//             </IonCol>
//           </IonRow>
//         </IonGrid>
//         <IonToolbar className="bg-no-gradient">
//           <IonGrid id="cc">
//             <IonRow className="v-center mobile-center">
//               <IonCol size="10" sizeMd="6" className="footer-left-area">
//                 <p className="qq">© 2025 Ecommerce website by <a id="oo" href="aa">StyleSync</a> <a href="https://StyleSync.com" target="_blank" rel="noopener noreferrer"></a></p>
//               </IonCol>
//               <IonCol size="12" sizeMd="12" className="footer-right-area" >
//                 <p className="footer-social">
//                   <IonButton className="social-btn" href="#" fill="clear">
//                     <IonIcon id="z" icon={logoFacebook} />
//                   </IonButton>
//                   <IonButton className="social-btn" href="#" fill="clear">
//                     <IonIcon icon={logoTwitter} />
//                   </IonButton>
//                   <IonButton className="social-btn" href="#" fill="clear">
//                     <IonIcon icon={logoInstagram} />
//                   </IonButton>
//                 </p>
//               </IonCol>
//             </IonRow>
//           </IonGrid>
//         </IonToolbar>
//       </div>
//     </IonFooter>
//   );
// };
// export default Footer;


// 


// import React from "react";

// const Footer: React.FC = () => {
//   return (
//     <div className="container my-5">
//       <footer
//         className="text-center text-lg-start text-white"
//         style={{ backgroundColor: "#45526e" }}
//       >
//         <div className="container p-4 pb-0">
//           <section>
//             <div className="row">
//               <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
//                 <h6 className="text-uppercase mb-4 font-weight-bold">Company name</h6>
//                 <p>
//                   Here you can use rows and columns to organize your footer
//                   content. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
//                 </p>
//               </div>

//               <hr className="w-100 clearfix d-md-none" />

//               <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
//                 <h6 className="text-uppercase mb-4 font-weight-bold">Products</h6>
//                 <p><a className="text-white" href="#">MDBootstrap</a></p>
//                 <p><a className="text-white" href="#">MDWordPress</a></p>
//                 <p><a className="text-white" href="#">BrandFlow</a></p>
//                 <p><a className="text-white" href="#">Bootstrap Angular</a></p>
//               </div>

//               <hr className="w-100 clearfix d-md-none" />

//               <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
//                 <h6 className="text-uppercase mb-4 font-weight-bold">Useful links</h6>
//                 <p><a className="text-white" href="#">Your Account</a></p>
//                 <p><a className="text-white" href="#">Become an Affiliate</a></p>
//                 <p><a className="text-white" href="#">Shipping Rates</a></p>
//                 <p><a className="text-white" href="#">Help</a></p>
//               </div>

//               <hr className="w-100 clearfix d-md-none" />

//               <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
//                 <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>
//                 <p><i className="fas fa-home mr-3"></i> New York, NY 10012, US</p>
//                 <p><i className="fas fa-envelope mr-3"></i> info@gmail.com</p>
//                 <p><i className="fas fa-phone mr-3"></i> + 01 234 567 88</p>
//                 <p><i className="fas fa-print mr-3"></i> + 01 234 567 89</p>
//               </div>
//             </div>
//           </section>

//           <hr className="my-3" />

//           <section className="p-3 pt-0">
//             <div className="row d-flex align-items-center">
//               <div className="col-md-7 col-lg-8 text-center text-md-start">
//                 <div className="p-3">
//                   © 2020 Copyright:{" "}
//                   <a className="text-white" href="https://mdbootstrap.com/">MDBootstrap.com</a>
//                 </div>
//               </div>

//               <div className="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
//                 <a
//                   className="btn btn-outline-light btn-floating m-1 text-white"
//                   href="#"
//                   role="button"
//                 >
//                   <i className="fab fa-facebook-f"></i>
//                 </a>
//                 <a
//                   className="btn btn-outline-light btn-floating m-1 text-white"
//                   href="#"
//                   role="button"
//                 >
//                   <i className="fab fa-twitter"></i>
//                 </a>
//                 <a
//                   className="btn btn-outline-light btn-floating m-1 text-white"
//                   href="#"
//                   role="button"
//                 >
//                   <i className="fab fa-google"></i>
//                 </a>
//                 <a
//                   className="btn btn-outline-light btn-floating m-1 text-white"
//                   href="#"
//                   role="button"
//                 >
//                   <i className="fab fa-instagram"></i>
//                 </a>
//               </div>
//             </div>
//           </section>
//         </div>
//       </footer>
//     </div>
//   );
// };
// export default Footer;

// const Footer: React.FC = () => {

//   return (
//     <footer className="site-footer">
//       <div className="container">
//         <div className="row">
//           <div className="col-sm-12 col-md-6">
//             <h6>About</h6>
//             <p className="text-justify">Scanfcode.com <i>CODE WANTS TO BE SIMPLE </i> is an initiative  to help the upcoming programmers with the code. Scanfcode focuses on providing the most efficient code or snippets as the code wants to be simple. We will help programmers build up concepts in different programming languages that include C, C++, Java, HTML, CSS, Bootstrap, JavaScript, PHP, Android, SQL and Algorithm.</p>
//           </div>

//           <div className="col-xs-6 col-md-3">
//             <h6>Categories</h6>
//             <ul className="footer-links">
//               <li><a href="http://scanfcode.com/category/c-language/">C</a></li>
//               <li><a href="http://scanfcode.com/category/front-end-development/">UI Design</a></li>
//               <li><a href="http://scanfcode.com/category/back-end-development/">PHP</a></li>
//               <li><a href="http://scanfcode.com/category/java-programming-language/">Java</a></li>
//               <li><a href="http://scanfcode.com/category/android/">Android</a></li>
//               <li><a href="http://scanfcode.com/category/templates/">Templates</a></li>
//             </ul>
//           </div>
//           <div className="col-xs-6 col-md-3">
//             <h6>Quick Links</h6>
//             <ul className="footer-links">
//               <li><a href="http://scanfcode.com/about/">About Us</a></li>
//               <li><a href="http://scanfcode.com/contact/">Contact Us</a></li>
//               <li><a href="http://scanfcode.com/contribute-at-scanfcode/">Contribute</a></li>
//               <li><a href="http://scanfcode.com/privacy-policy/">Privacy Policy</a></li>
//               <li><a href="http://scanfcode.com/sitemap/">Sitemap</a></li>
//             </ul>
//           </div>
//         </div>
//         <hr>
//       </div>
//       <div className="container">
//         <div className="row">
//           <div className="col-md-8 col-sm-6 col-xs-12">
//             <p className="copyright-text">Copyright &copy; 2017 All Rights Reserved by
//               <a href="#">Scanfcode</a>.
//             </p>
//           </div>
//           <div className="col-md-4 col-sm-6 col-xs-12">
//             <ul className="social-icons">
//               <li><a className="facebook" href="#"><i className="fa fa-facebook"></i></a></li>
//               <li><a className="twitter" href="#"><i className="fa fa-twitter"></i></a></li>
//               <li><a className="dribbble" href="#"><i className="fa fa-dribbble"></i></a></li>
//               <li><a className="linkedin" href="#"><i className="fa fa-linkedin"></i></a></li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }
// export default Footer;
import React from "react";
import './Footer.css';
const Footer: React.FC=()=>{
  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <h6 className="a">About</h6>
              <p className="text-justify">Style Sync is your go-to destination for the latest trends in fashion, accessories, and lifestyle essentials. As a forward-thinking e-commerce platform, we bring together quality, affordability, and styledelivering a seamless shopping experience that syncs with your lifestyle.</p>
            </div>
            <div className="col-xs-6 col-md-3">
              <table>
              <th className="col-xs-6 col-md-3"><h6> </h6> </th>
              <td><ul className="footer-links">
               <li><h6>Map</h6></li> 
              <li><iframe className="Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.3190039294623!2d78.08566317409998!3d11.671789342042917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babfb937a329b6d%3A0xf2a9af3b1fc13969!2sALGOJAXON%20GLOBAL%20SOFT%20PRIVATE%20LIMITED!5e0!3m2!1sen!2sin!4v1748605127364!5m2!1sen!2sin"
                    width="150"
                    height="80"
                    style={{ border: 0}}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe> </li>
                </ul>
              </td>
                <th><h6 className="b">Categories ➜</h6> </th>
                <td><ul className="footer-links">
                  <li><a href="#">By Outfit</a></li>
                  <li><a href="#">By Fabric Type</a></li>
                  <li><a href="#">By Occasion (Category)</a></li>
                  <li><a href="#">Natural Fabrics</a></li>
                  <li><a href="#">Blended & Synthetic Fabrics</a></li>
                  <li><a href="#">Denim & Casual Materials</a></li>
                </ul> </td>
                {/* </div>
            <div className="col-xs-6 col-md-3"> */}
                <th><h6>Quick Links ➜ </h6> </th>
                <td><ul className="footer-links">
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Contact Us</a></li>
                  <li><a href="#">Contribute</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Sitemap</a></li>
                </ul> </td>
              </table>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-sm-6 col-xs-12">
              <ul className="social-icons">
                <li><a className="facebook" href="#"> <img src="../Footer_Images/facebook (1).png" /><i className="fa fa-facebook"></i></a></li>
                <li><a className="twitter" href="#"> <img src="../Footer_Images/twitter (1).png" /> <i className="fa fa-twitter"></i></a></li>
                <li><a className="dribbble" href="#"> <img src="../Footer_Images/social.png" /> <i className="fa fa-dribbble"></i></a></li>
                <li><a className="linkedin" href="#"> <img src="../Footer_Images/linkedin.png" /><i className="fa fa-linkedin"></i></a></li>
              </ul>
            </div>
            <div className="col-md-8 col-sm-6 col-xs-12">
              <p className="copyright-text">Copyright &copy; 2025 All Rights Reserved by <a href="#">Scanfcode</a>. </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
export default Footer;