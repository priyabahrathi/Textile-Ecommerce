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
  IonItem,
  IonMenu,
  IonSelect,
  IonSelectOption,
  IonCheckbox
} from '@ionic/react';
import { closeOutline, ellipsisVertical, heart } from "ionicons/icons";
import { cart, searchOutline, options, star } from 'ionicons/icons';
import { useState, useEffect, useRef } from 'react';
import './Product.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../Store/store';
import { motion, useAnimation, useInView } from 'framer-motion';
import { RiCameraLensAiLine } from "react-icons/ri";
import { fetchProductsFromFirebase } from '../../../Store/Slice/ProductSlice';
import { AppDispatch } from '../../../Store/store';
import { addToWishlist } from '../../../Store/Slice/wishlistSlice';
import { setSelectedProduct, clearSelectedProduct } from '../../../Store/Slice/selectedProductSlice';
import { setPage } from '../../../Store/Slice/pageSlice';
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
  const [genderFilter, setGenderFilter] = useState<'male' | 'female' | 'both'>('both');

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
  const handleCheckBoxMultiple = (values: string[]) => {
    setSelectedCategory(values);
  };


  const applyFilter = () => {
    const result = Products.filter((product) => {
      const matchGender = genderFilter === 'both' || product.gender === genderFilter; // Include all genders if genderFilter is empty
      const matchSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
      const matchPrice = product.price >= lower && product.price <= upper;
      const matchCategory = selectedCategory.length === 0 || selectedCategory.includes(product.category);
      return matchGender && matchSearch && matchPrice && matchCategory;
    });
    setFilteredItems(result);
  };

  return (
    <>
      <div className="filter-sideMenu">
        <IonMenu side="start" menuId="filterMenu" contentId="main-content"
          onIonDidOpen={() => {
            const scrollBarCompensation = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarCompensation}px`; // Prevent layout shift
          }}

          onIonDidClose={() => {
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0px'; // Reset padding
          }}>

                <IonHeader>
          <IonToolbar color="light">
            <IonTitle>Filters</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem lines="none">
              <IonLabel className="ion-padding-bottom">Category</IonLabel>
            </IonItem>
            {['Formals', 'Casuals', 'Ocassions', 'Sports', 'Wedding'].map((category) => (
              <IonItem key={category}>
                <IonCheckbox
                  slot="start"
                  checked={selectedCategory.includes(category)}
                  onIonChange={(e) => handleCheckBox(category, e.detail.checked)}
                />
                <IonLabel>{category}</IonLabel>
              </IonItem>
            ))}
            <IonItem>
              <IonButton
                expand="block"
                color="medium"
                onClick={() => {
                  // Select all
                  handleCheckBoxMultiple(['Formals', 'Casuals', 'Ocassions', 'Sports', 'Wedding']);
                }}
              >
                Select All
              </IonButton>
            </IonItem>
            <IonItem>
              <IonButton
                expand="block"
                color="medium"
                onClick={() => {
                  // Clear all
                  handleCheckBoxMultiple([]);
                }}
              >
                Clear All
              </IonButton>
            </IonItem>

            <IonItem>
              <div className="card-range">
                {/* <h1 className="range-title">Price Range</h1> */}
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
            </IonItem>
            <IonItem>
              <IonButton expand="block" color="primary">Apply Filters</IonButton>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>


    </div >

      <div id="main-content" className="product-page">
        <Header />
        <div id="product-section" className="page-product">
          <div className="product-header">
            <div className="filter-sideMenu">


              <IonButton
                className="filter-button"
                onClick={() => (document.querySelector('ion-menu[menu-id="filterMenu"]') as HTMLIonMenuElement)?.open()}

                fill="clear"
                slot="start"
                color="dark"
              >
                <IonIcon icon={options} />
              </IonButton>
            </div>

            <div className="gender-selection-btn">
              {[
                { label: 'All', value: 'both', img: '/assets/btn-img/both.png' },
                { label: 'Male', value: 'male', img: '/assets/btn-img/male.png' },
                { label: 'Female', value: 'female', img: '/assets/btn-img/woman.png' },
              ].map((option) => (
                <div
                  key={option.value}
                  className={`gender-button ${genderFilter === option.value ? 'selected' : ''}`}
                  onClick={() => setGenderFilter(option.value as 'male' | 'female' | 'both')}
                >
                  <div className="circle-button">
                    <img src={option.img} alt={option.label} className="gender-icon" />
                  </div>
                  <div className="gender-label">{option.label}</div>
                </div>
              ))}
            </div>
          </div>



          <IonGrid>
            {/* <IonRow>
              <IonCol>
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
              </IonCol>
             

              
            </IonRow> */}
            <IonRow>


              {filteredItems.length > 0 ? (
                filteredItems.map((product) => (
                  <IonCol className="ion-padding" sizeXs="6" sizeSm="6" sizeMd="4" sizeLg='3' sizeXl='3' key={product.id}>
                    <MotionCard>
                      <div
                        className="product-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          dispatch(setSelectedProduct(product));
                          dispatch(setPage("productDetails"));
                        }}
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



              {/* Sidebar */}
              {/* <IonCol className="sidebar" sizeMd="12" size="12" sizeLg="12" sizeXl="4">
            <div className="filter-section">
              
            </div>
          </IonCol> */}
            </IonRow>
          </IonGrid>

          {/* Product Detail Overlay */}
          {selectedProduct && (
            <div className="product-detail-overlay">
              <div className="product-detail-content">
                <button className="close-btn" onClick={() => dispatch(clearSelectedProduct())}>&times;</button>
                <h2>{selectedProduct.name}</h2>
                <img src={selectedProduct.img} alt={selectedProduct.name} style={{ maxWidth: 300 }} />
                <p>Price: &#8377;{selectedProduct.price}</p>
                <p>Category: {selectedProduct.category}</p>
                <p>Outfit Type: {selectedProduct.outfitType || 'Not Defined'}</p>
                {/* Add more details as needed */}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
