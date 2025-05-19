import {
  IonGrid,
  IonRow,
  IonCol,
  IonCardContent,
  IonImg,
  IonButton,
  IonIcon,
  IonLabel,
  IonInput,
  IonRange,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonList,
  IonItem
} from '@ionic/react';
import { closeOutline, ellipsisVertical, heart } from "ionicons/icons";
import { cart, searchOutline, options, star } from 'ionicons/icons';
import { useState, useEffect, useRef } from 'react';
import './Product.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../Store/store';
import { motion, useAnimation, useInView } from 'framer-motion';
import TryOn from '../Tryon/Tryon';
import { RiCameraLensAiLine } from "react-icons/ri";
import { fetchProductsFromFirebase } from '../../../Store/Slice/ProductSlice';
import { AppDispatch } from '../../../Store/store';
import { addToWishlist } from '../../../Store/Slice/wishlistSlice';
import { setSelectedProduct, clearSelectedProduct } from '../../../Store/Slice/selectedProductSlice';
import Header from '../Header/Header';

const MotionCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [inView]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={controls} transition={{ duration: 1, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
};

const Product: React.FC = () => {
  const Products = useSelector((state: RootState) => state.product.Products);
  const [genderFilter, setGenderFilter] = useState('');

  const [searchText, setSearchText] = useState('');
  const [lower, setLower] = useState(500);
  const [upper, setUpper] = useState(5000);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState(Products);
  const selectedProduct = useSelector((state: RootState) => (state.selectedProduct as { product: any }).product);
  const [presentingEl, setPresentingEl] = useState<HTMLElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProductsFromFirebase());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      const el = document.getElementById('product-section');
      if (el) setPresentingEl(el);
    }, 0);
  }, []);

  useEffect(() => {
    applyFilter();
  }, [searchText, lower, upper, selectedCategory, genderFilter, Products]);
  useEffect(() => {
    if (selectedProduct) {
      console.log("🧥 Selected Product:", selectedProduct); // Log the entire product object
      console.log("🧥 Selected Product Outfit Type:", selectedProduct.outfitType);
    }
  }, [selectedProduct]);

  const handleRangeChange = (e: any) => {
    setLower(e.detail.value.lower);
    setUpper(e.detail.value.upper);
  };

  const handleCheckBox = (category: string, checked: boolean) => {
    setSelectedCategory((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  };

  const applyFilter = () => {
    const result = Products.filter((product) => {
      const matchGender = genderFilter === '' || product.gender === genderFilter; // Include all genders if genderFilter is empty
      const matchSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
      const matchPrice = product.price >= lower && product.price <= upper;
      const matchCategory = selectedCategory.length === 0 || selectedCategory.includes(product.category);
      return matchGender && matchSearch && matchPrice && matchCategory;
    });
    setFilteredItems(result);
  };

  return (
    <div id="product-section" className="page-product">
      <Header />
      <div className='product-head'>
        <span>Find Your Match</span>
        <div className="gender-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={genderFilter === 'female'}
              onChange={() =>
                setGenderFilter((prev) =>
                  prev === '' ? 'male' : prev === 'male' ? 'female' : 'male'
                )
              }
            />
            <span className="slider"></span>
          </label>
          <span className="gender-label">
            {genderFilter === '' ? 'Both' : genderFilter === 'male' ? 'Male' : 'Female'}
          </span>
        </div>
      </div>
      <IonGrid>
        <IonRow>
          <IonCol className='col-card' sizeMd="12" sizeLg="12" sizeXl="8">
            <IonRow>
              {filteredItems.length > 0 ? (
                filteredItems.map((product) => (
                  <IonCol className="ion-padding" size="12" sizeMd="6" key={product.id}>
                    <MotionCard>
                      <div
                        className="product-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => dispatch(setSelectedProduct(product))}
                      >
                        
                        <img className="product-image" src={product.img} />
                        <IonCardContent className="data">
                          <div className="product-data">
                            <div className="product-title">{product.name}</div>
                            <div className="product-price">&#8377;{product.price}</div>
                          </div>
                          <p className="product-category">{product.category}</p>
                          <div className="rate-buy">
                            <div className="ratings">
                              {[...Array(5)].map((_, i) => (
                                <IonIcon key={i} icon={star} className="buy-button" />
                              ))}
                            </div>
                            <button
                              className={`add-to-wishlist`}
                              onClick={() => dispatch(addToWishlist(product))}
                            >
                              <IonIcon icon={heart} />
                            </button>
                            
                          </div>
                        </IonCardContent>
                      </div>
                    </MotionCard>
                  </IonCol>
                ))
              ) : (
                <IonCol size="12"><p>No products found.</p></IonCol>
              )}
            </IonRow>
          </IonCol>

          {/* Sidebar */}
          <IonCol className="sidebar" sizeMd="12" size="12" sizeLg="12" sizeXl="4">
            <div className="card-search">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="card-range">
              <h1 className="range-title">Price Range</h1>
              <IonRange
                dualKnobs={true}
                min={500}
                max={5000}
                value={{ lower, upper }}
                onIonChange={handleRangeChange}
                style={{
                  '--bar-background': '#F5CBA7',
                  '--bar-background-active': '#E59866',
                  '--knob-background': '#E59866',
                  '--pin-background': '#F5CBA7'
                }}
              />
              <div className="range-values">
                <IonLabel className='range-value'>Min Price: {lower}</IonLabel>
                <IonLabel>Max Price: {upper}</IonLabel>
              </div>
            </div>

            <div className="filter-section">
              <div className="card-filter">
                <div className="filter-title">Categories</div>
                <ul className='category-list'>
                  {['Formals', 'Casuals', 'Ocassions'].map((cat) => (
                    <li className='category-item' key={cat}>
                      <input
                        className='cat-input'
                        type="checkbox"
                        checked={selectedCategory.includes(cat)}
                        onChange={(e) => handleCheckBox(cat, e.target.checked)}
                      />
                      <IonLabel className='cat-label'>{cat}</IonLabel>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </IonCol>

          {/* Modal section */}
        

        </IonRow>
      </IonGrid>

      {/* Product Detail Overlay */}
     
    </div>
  );
};

export default Product;
