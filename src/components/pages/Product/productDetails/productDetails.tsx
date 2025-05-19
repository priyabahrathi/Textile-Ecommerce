import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../Store/store';
import { clearSelectedProduct } from '../../../../Store/Slice/selectedProductSlice';
import './productDetails.css';
import TryOn from '../../Tryon/Tryon';

const ProductDetail: React.FC = () => {
  const selectedProduct = useSelector((state: RootState) => state.selectedProduct.product);
  const dispatch = useDispatch();

  // Use product images if available, else fallback to dummy
  const productImages = selectedProduct?.images && selectedProduct.images.length > 0
    ? selectedProduct.images
    : [selectedProduct?.img].filter(Boolean); // fallback to main image

  const [mainImg, setMainImg] = useState(productImages[0]);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Red');
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'qa'>('desc');
  const [showTryOn, setShowTryOn] = useState(false);

  if (!selectedProduct) return <div>No product selected.</div>;

  return (
    <div className="product-detail-page">
      <button className="back-btn" onClick={() => dispatch(clearSelectedProduct())}>Back</button>
      <div className="gallery-info">
        <div className="image-gallery">
          <img className="main-img" src={mainImg} alt={selectedProduct.name} />
          <div className="thumbnails">
            {productImages.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={mainImg === img ? 'thumb active' : 'thumb'}
                onClick={() => setMainImg(img)}
              />
            ))}
          </div>
        </div>
        <div className="product-info">
          <h2>{selectedProduct.name}</h2>
          <div className="price-rating">
            <span className="price">&#8377;{selectedProduct.price}</span>
            <span className="rating">★★★★☆ (4.2)</span>
            <span className="reviews">23 reviews</span>
          </div>
          <div className="selectors">
            <div>
              <label>Size:</label>
              {['S', 'M', 'L', 'XL'].map(size => (
                <button
                  key={size}
                  className={selectedSize === size ? 'selector active' : 'selector'}
                  onClick={() => setSelectedSize(size)}
                >{size}</button>
              ))}
            </div>
            <div>
              <label>Color:</label>
              {['Red', 'Blue', 'Green'].map(color => (
                <button
                  key={color}
                  className={selectedColor === color ? 'selector active' : 'selector'}
                  onClick={() => setSelectedColor(color)}
                  style={{ background: color.toLowerCase() }}
                ></button>
              ))}
            </div>
          </div>
          <div className="action-buttons">
            <button className="add-cart">Add to Cart</button>
            <button className="wishlist">Wishlist</button>
            <button className="tryon-btn" onClick={() => setShowTryOn(true)}>TryOn</button>
          </div>
        </div>
      </div>
      <div className="tabs">
        <button className={activeTab === 'desc' ? 'tab active' : 'tab'} onClick={() => setActiveTab('desc')}>Description</button>
        <button className={activeTab === 'reviews' ? 'tab active' : 'tab'} onClick={() => setActiveTab('reviews')}>Reviews</button>
        <button className={activeTab === 'qa' ? 'tab active' : 'tab'} onClick={() => setActiveTab('qa')}>Q&A</button>
      </div>
      <div className="tab-content">
        {activeTab === 'desc' && (
          <div>
            <h3>Description</h3>
            <p>{selectedProduct.description || 'No description available.'}</p>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div>
            <h3>Reviews</h3>
            <p>No reviews yet.</p>
          </div>
        )}
        {activeTab === 'qa' && (
          <div>
            <h3>Q&A</h3>
            <p>No questions yet.</p>
          </div>
        )}
      </div>
      {showTryOn && (
        <div className="tryon-modal-overlay">
          <div className="tryon-modal-content">
            <button className="close-btn" onClick={() => setShowTryOn(false)}>&times;</button>
            <TryOn
              clothingImage={mainImg}
              outfitType={selectedProduct.outfitType || 'Not Defined'}
              genderFilter={selectedProduct.gender || ''}
              outfitName={selectedProduct.outfitName}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;