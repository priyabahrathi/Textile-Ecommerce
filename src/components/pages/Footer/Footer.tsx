import React from "react";
<<<<<<< HEAD
import './Footer.css';
const Footer: React.FC = () => {
=======
// import './Footer.css';
const Footer: React.FC=()=>{
>>>>>>> origin/tryon
  return (
    <>
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <h6 className="Footer-a">About</h6>
            <p className="text-justify">Style Sync is your go-to destination for the latest trends in fashion, accessories, and lifestyle essentials. As a forward-thinking e-commerce platform, we bring together quality, affordability, and styledelivering a seamless shopping experience that syncs with your lifestyle.</p>
          </div>
          <div className="table">
            <table>
              <th className="col-xs-6 col-md-3"><h6> </h6> </th>
              <td><ul className="footer-links">
                <th className="col-xs-6 col-md-3"><h6> </h6> </th>
                <td><ul className="footer-links">
                  <li><h6>Map</h6></li>
                  <li><iframe className="Footer-Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.3190039294623!2d78.08566317409998!3d11.671789342042917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babfb937a329b6d%3A0xf2a9af3b1fc13969!2sALGOJAXON%20GLOBAL%20SOFT%20PRIVATE%20LIMITED!5e0!3m2!1sen!2sin!4v1748605127364!5m2!1sen!2sin"
                    width="150"
                    height="80"
                    style={{ border: 0 }}
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
                <th><h6 className="c">Quick Links ➜ </h6> </th>
                <td><ul className="footer-links">
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Contact Us</a></li>
                  <li><a href="#">Contribute</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Sitemap</a></li>
                </ul> </td>
                </ul>
                </td>
            </table>
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
      </div>
    </footer>
    </>
  )
}
export default Footer;