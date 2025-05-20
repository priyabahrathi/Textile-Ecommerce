import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../Store/store';
import { clearSelectedProduct } from '../../../../Store/Slice/selectedProductSlice';
import { setPage } from '../../../../Store/Slice/pageSlice';
import './productDetails.css';
import TryOn from '../../Tryon/Tryon';
import Header from '../../Header/Header';
import { addToBuy } from '../../../../Store/Slice/checkout';

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

  // --- Add Review Feature State ---
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState<{ author: string, rating: number, text: string }[]>([
    { author: "Priya", rating: 5, text: "Great quality and fits perfectly!" },
    { author: "Amit", rating: 4, text: "Nice fabric, color is vibrant." }
  ]);
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, text: '' });

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewForm.author && reviewForm.text) {
      setReviews([
        ...reviews,
        { author: reviewForm.author, rating: Number(reviewForm.rating), text: reviewForm.text }
      ]);
      setReviewForm({ author: '', rating: 5, text: '' });
      setShowReviewModal(false);
    }
  };

  if (!selectedProduct) return <div>No product selected.</div>;

  return (<>
    <Header />
    <div className="product-detail-page">
      <button
        className="back-btn"
        onClick={() => {
          dispatch(clearSelectedProduct());
          dispatch(setPage("products"));
        }}
      >
        ← Back
      </button>
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
            <span className="reviews">{reviews.length} reviews</span>
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

          </div>
          <div className="action-buttons">
            <button className="add-cart">Add to Cart</button>
            <button
              className="add-cart"
              onClick={() => {
                if (selectedProduct) {
                  dispatch(addToBuy({
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    price: selectedProduct.price,
                    img: selectedProduct.img,
                    quantity: 1
                  }));
                  dispatch(setPage('buy')); 
                }
              }}
            >
              Buy
            </button>

            <button className="tryon-btn" onClick={() => setShowTryOn(true)}>TryOn</button>
          </div>
          <div className="product-highlights">
            <div>
              <span className="highlight-title">Fabric:</span> {selectedProduct.fabric || "Cotton Blend"}
            </div>
            <div>
              <span className="highlight-title">Fit:</span> {selectedProduct.fit || "Regular"}
            </div>
            <div>
              <span className="highlight-title">Delivery:</span> Free, 3-5 days
            </div>
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
            <div className="review-list">
              {reviews.length === 0 && <p>No reviews yet.</p>}
              {reviews.map((rev, idx) => (
                <div className="review-item" key={idx}>
                  <span className="review-author">{rev.author}</span>
                  <span className="review-rating">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                  <div className="review-text">{rev.text}</div>
                </div>
              ))}
            </div>
            <button className="add-review-btn" onClick={() => setShowReviewModal(true)}>Add Review</button>
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
      {showReviewModal && (
        <div className="tryon-modal-overlay">
          <div className="review-modal-content">
            <button className="close-btn" onClick={() => setShowReviewModal(false)}>&times;</button>
            <h3>Add Your Review</h3>
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="author"
                  value={reviewForm.author}
                  onChange={handleReviewChange}
                  required
                  placeholder="Your name"
                />
              </label>
              <label>
                Rating:
                <select
                  name="rating"
                  value={reviewForm.rating}
                  onChange={handleReviewChange}
                >
                  {[5, 4, 3, 2, 1].map(r => (
                    <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </label>
              <label>
                Review:
                <textarea
                  name="text"
                  value={reviewForm.text}
                  onChange={handleReviewChange}
                  required
                  placeholder="Write your review here..."
                />
              </label>
              <button type="submit">Submit Review</button>
            </form>
          </div>
        </div>
      )}
    </div>
  </>);
};

export default ProductDetail;