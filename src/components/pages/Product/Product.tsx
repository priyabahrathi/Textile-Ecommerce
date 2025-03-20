import { IonCard, IonHeader, IonIcon } from "@ionic/react";
import React from "react";
import { cart, cartOutline, logoIonic, star } from 'ionicons/icons';
// import "./Product.css";
import "../../../bootstrap-5.0.2-dist/css/bootstrap.min.css";
const Product: React.FC = () => {
    return (
        <div className="pagecontainer">
            <h1>Product Page</h1>

            <div className="cardcontainer">
            <div className="card" data-aos="fade-up">
                                    <div className="card-body p-y-30">
                                        <img src="../assets/images/square2.png" alt="" className="mb-30 rounded" />
                                        <p className="card-title product-title fs-20"> <a href="#x" className="title-link primary-hover fs-20">Black Tee</a> <span className="price-inline title-color">$29.99</span></p>
                                        <p><a href="#x" className="card-text mt-5 title-link">Men's</a></p>
                                        <p className="ratings mb-0"><i className="fas fa-star"></i> <i className="fas fa-star"></i> <i className="fas fa-star"></i> <i className="fas fa-star"></i> <i className="fas fa-star"></i></p>
                                        <div className="product-card-footer">
                                            <a href="#x" className="btn btn-xs btn-primary btn-inline mt-10"><i className="fas fa-shopping-cart mr-5"></i> <span>Buy Now</span></a>
                                        </div>
                                        
                                    </div>
                                    
                                </div>
            </div>


        </div>
    )
}
export default Product;