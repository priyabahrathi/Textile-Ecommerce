import React from "react";

import './Footer.css';

// const Footer: React.FC = () => {
// import './Footer.css';

const Footer: React.FC=()=>{
  return (
    <>
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div className="Top">
            <h6 className="Footer-a">About</h6>
            <p className="text-justify">Style Sync is your go-to destination for the latest trends in fashion, accessories, and lifestyle essentials. As a forward-thinking e-commerce platform, we bring together quality, affordability, and styledelivering a seamless shopping experience that syncs with your lifestyle.</p>
          </div>
          <div className="table">
             <table className="table2"> 
              {/* <th className="col-xs-6 col-md-3"><h6> </h6> </th> */}
              <td><ul className="footer-links">
                <th className="footer-links2"><h6> </h6> </th>
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
                  <li><a href="https://www.google.com/search?q=outfits+dress+collections+for+men+and+women&sca_esv=41514daaec8f90aa&sxsrf=AE3TifOSRdhs73cJR_3V-MRfSYc6_wVd1w%3A1749020152198&ei=-O0_aPfnC5Gf4-EPtInVkQE&ved=0ahUKEwj3w4Hnl9eNAxWRzzgGHbRENRIQ4dUDCBA&uact=5&oq=outfits+dress+collections+for+men+and+women&gs_lp=Egxnd3Mtd2l6LXNlcnAiK291dGZpdHMgZHJlc3MgY29sbGVjdGlvbnMgZm9yIG1lbiBhbmQgd29tZW5ImmFQ2T5Y6l5wAngBkAEAmAH3AqABmRmqAQgwLjE3LjEuMbgBA8gBAPgBAZgCCqAC9wzCAgoQABiwAxjWBBhHwgIGEAAYFhgewgILEAAYgAQYhgMYigXCAggQABiABBiiBMICBRAAGO8FwgIHECEYoAEYCsICBBAhGBWYAwDiAwUSATEgQIgGAZAGBZIHBzIuNi4xLjGgB6Q6sgcHMC42LjEuMbgH3gzCBwcwLjIuNS4zyAdE&sclient=gws-wiz-serp">By Outfit</a></li>
                  <li><a href="https://www.google.com/search?q=by+fabric+dress+collections+for+men+and+women&sca_esv=41514daaec8f90aa&sxsrf=AE3TifP_Nlle7RdCFM5WzZwyhc49g8OSyg%3A1749020193106&ei=Ie4_aMSiBuOO4-EP_aPVyAg&ved=0ahUKEwiEt8L6l9eNAxVjxzgGHf1RFYkQ4dUDCBA&uact=5&oq=by+fabric+dress+collections+for+men+and+women&gs_lp=Egxnd3Mtd2l6LXNlcnAiLWJ5IGZhYnJpYyBkcmVzcyBjb2xsZWN0aW9ucyBmb3IgbWVuIGFuZCB3b21lbkj9N1AAWKE1cAB4AZABAJgBzQGgAbMdqgEGMS4yNi4xuAEDyAEA-AEBmAIBoAK6AcICCBAAGAUYDRgewgILEAAYgAQYhgMYigXCAggQABiABBiiBMICBRAAGO8FmAMAkgcDMC4xoAeAMrIHAzAuMbgHugHCBwM0LTHIBxU&sclient=gws-wiz-serp">By Fabric Type</a></li>
                  <li><a href="https://www.myntra.com/men-occasion-wear">By Occasion (Category)</a></li>
                  <li><a href="https://www.google.com/search?q=natural+fabrics+collections+for+men+and+women&sca_esv=41514daaec8f90aa&sxsrf=AE3TifPlnBDNaD0tTH4vMhyIZqvEoI0qZw%3A1749020265104&ei=ae4_aKqTBuuZ4-EP4q-RwAk&ved=0ahUKEwjq6-ycmNeNAxXrzDgGHeJXBJgQ4dUDCBA&uact=5&oq=natural+fabrics+collections+for+men+and+women&gs_lp=Egxnd3Mtd2l6LXNlcnAiLW5hdHVyYWwgZmFicmljcyBjb2xsZWN0aW9ucyBmb3IgbWVuIGFuZCB3b21lbkicHFAAWNQZcAB4AZABAJgBpwWgAeUkqgELMC40LjMuMS4xLjS4AQPIAQD4AQGYAgCgAgCYAwDiAwUSATEgQJIHAKAHuRCyBwC4BwDCBwDIBwA&sclient=gws-wiz-serp">Natural Fabrics</a></li>   
                  <li><a href="https://www.google.com/search?q=Blended+%26+Synthetic+Fabricscollections+for+men+and+women&sca_esv=41514daaec8f90aa&sxsrf=AE3TifO2l8jlsNF_jkr1g8kNhqg-d3UM1w%3A1749020295609&ei=h-4_aJT8JOio4-EPhvCn8A4&ved=0ahUKEwjU27KrmNeNAxVo1DgGHQb4Ce4Q4dUDCBA&uact=5&oq=Blended+%26+Synthetic+Fabricscollections+for+men+and+women&gs_lp=Egxnd3Mtd2l6LXNlcnAiOEJsZW5kZWQgJiBTeW50aGV0aWMgRmFicmljc2NvbGxlY3Rpb25zIGZvciBtZW4gYW5kIHdvbWVuSIsCUABYAHAAeAGQAQCYAaIBoAGiAaoBAzAuMbgBA8gBAPgBAvgBAZgCAKACAJgDAJIHAKAH-AGyBwC4BwDCBwDIBwA&sclient=gws-wiz-serp">Blended & Synthetic Fabrics</a></li>
                  <li><a href="https://www.google.com/search?q=Denim+%26+Casual+Materials+collections+for+men+and+women&sca_esv=41514daaec8f90aa&sxsrf=AE3TifNLjtzcUZ-fhnTtUx_IJFOVMgNVAg%3A1749020316191&ei=nO4_aI25C-Kt4-EPlY-40A0&ved=0ahUKEwiN95q1mNeNAxXi1jgGHZUHDtoQ4dUDCBA&uact=5&oq=Denim+%26+Casual+Materials+collections+for+men+and+women&gs_lp=Egxnd3Mtd2l6LXNlcnAiNkRlbmltICYgQ2FzdWFsIE1hdGVyaWFscyBjb2xsZWN0aW9ucyBmb3IgbWVuIGFuZCB3b21lbkiKHlDtCViiGXABeAGQAQKYAc4JoAHiHaoBCzMtMS4xLjEuMC4yuAEDyAEA-AEB-AECmAIBoAIPwgIKEAAYsAMY1gQYR5gDAOIDBRIBMSBAiAYBkAYIkgcBMaAHmRSyBwC4BwDCBwMzLTHIBww&sclient=gws-wiz-serp">Denim & Casual Materials</a></li>
                </ul> </td>
                    {/* </div>
                   <div className="col-xs-6 col-md-3"> */}
                <th><h6 className="c">Quick Links ➜ </h6> </th>
                <td><ul className="footer-links">
                  <li><a href="https://dribbble.com/shots/21628387-Sync-Landing-page-design-for-the-CRM-platform">About Us</a></li>
                  <li><a href="https://dribbble.com/shots/21628387-Sync-Landing-page-design-for-the-CRM-platform">Contact Us</a></li>
                  <li><a href="https://dribbble.com/shots/21628387-Sync-Landing-page-design-for-the-CRM-platform">Contribute</a></li>
                  <li><a href="https://dribbble.com/shots/21628387-Sync-Landing-page-design-for-the-CRM-platform">Privacy Policy</a></li>
                  <li><a href="https://www.google.com/maps?ll=11.671784,78.088238&z=14&t=m&hl=en&gl=IN&mapclient=embed&cid=17485699696713349481">Sitemap</a></li>
                </ul> </td>
                </ul>
                </td>
             </table> 
          </div>
        </div>
        <div className="container2">
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
              <p className="copyright-text">Copyright &copy; 2025 All Rights Reserved by <a href="#">StyleSync</a>. </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}
export default Footer;

// .table {
//   width: 100%;
//   overflow-x: auto;
//   padding: 1rem;
//   box-sizing: border-box;
//   display: flex;
//   justify-content: center;
// }

// .table table {
//   width: 100%;
//   border-collapse: collapse;
// }

// .table th,
// .table td {
//   vertical-align: top;
//   padding: 1rem;
//   text-align: left;
// }

// .footer-links {
//   list-style: none;
//   padding: 0;
//   margin: 0;
// }

// .footer-links li {
//   margin-bottom: 0.5rem;
// }

// .footer-links a {
//   text-decoration: none;
//   color: white;
// }

// .footer-links a:hover {
//   color: black;
// }

// .Footer-Map {
//   width: 100%;
//   height: 100px;
//   border-radius: 8px;
//   margin-top: 0.5rem;
  
// }
// .footer-links{
//   margin-left: -1%;
// }

// /* Responsive: Stack rows vertically on small screens */
// @media (max-width: 768px) {
//   .table table,
//   .table tbody,
//   .table tr,
//   .table th,
//   .table td {
//     display: block;
//     width: 100%;
//   }

//   .table th,
//   .table td {
//     padding: 0.5rem 0;
//   }

//   .footer-links {
//     margin-top: 0.5rem;
//   }

//   .Footer-Map {
//     height: 120px;
//   }
// }