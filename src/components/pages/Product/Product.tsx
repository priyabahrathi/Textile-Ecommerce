import {
  IonGrid,
  IonRow,
  IonCol,
  IonCardContent,
  IonButton,
  IonIcon,
  IonLabel,
  IonInput,
  IonRange,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
} from '@ionic/react';
import { heart, searchOutline, options, star, personCircle, man, woman } from 'ionicons/icons';
import { useState, useEffect, useRef } from 'react';
import './Product.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../Store/store';
import { motion, useAnimation, useInView } from 'framer-motion';
import { fetchProductsFromFirebase } from '../../../Store/Slice/ProductSlice';
import { AppDispatch } from '../../../Store/store';
import { toggleWishlist } from '../../../Store/Slice/wishlistSlice';
import { setSelectedProduct } from '../../../Store/Slice/selectedProductSlice';
import { setPage } from '../../../Store/Slice/pageSlice';
import Header from '../Header/Header';

// Define a more complete Product interface to match new filter properties
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  img: string;
  gender: 'male' | 'female' | 'both';
  rating?: number;
  isNew?: boolean;
  stock: number;
  fabricType?: string;
  dressStyle?: string;
  occasion?: string;
  colors?: string[];
  // Add any other properties your products might have
}

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
  }, [inView, controls]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={controls} transition={{ duration: 1, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
};

const Product: React.FC = () => {
  const Products = useSelector((state: RootState) => state.product.Products as Product[]);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const [genderFilter, setGenderFilter] = useState<'male' | 'female' | 'both'>('both');
  const [searchText, setSearchText] = useState('');
  const [lower, setLower] = useState(500);
  const [upper, setUpper] = useState(5000);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedFabricType, setSelectedFabricType] = useState<string[]>([]);
  const [selectedDressStyle, setSelectedDressStyle] = useState<string[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('default');

  const [filteredItems, setFilteredItems] = useState<Product[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  // const navigate = useNavigate(); // REMOVED: No longer using useNavigate

  useEffect(() => {
    dispatch(fetchProductsFromFirebase());
  }, [dispatch]);

  useEffect(() => {
    applyFilter();
  }, [
    searchText,
    lower,
    upper,
    selectedCategory,
    genderFilter,
    selectedFabricType,
    selectedDressStyle,
    selectedOccasion,
    selectedColors,
    inStockOnly,
    sortBy,
    Products
  ]);

  const handleRangeChange = (e: any) => {
    setLower(e.detail.value.lower);
    setUpper(e.detail.value.upper);
  };

  const handleCheckBox = (category: string, checked: boolean) => {
    setSelectedCategory((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  };

  const handleToggleFilter = (filterType: 'fabricType' | 'dressStyle' | 'occasion' | 'colors', value: string, checked: boolean) => {
    if (filterType === 'fabricType') {
      setSelectedFabricType((prev) => checked ? [...prev, value] : prev.filter((item) => item !== value));
    } else if (filterType === 'dressStyle') {
      setSelectedDressStyle((prev) => checked ? [...prev, value] : prev.filter((item) => item !== value));
    } else if (filterType === 'occasion') {
      setSelectedOccasion((prev) => checked ? [...prev, value] : prev.filter((item) => item !== value));
    } else if (filterType === 'colors') {
      setSelectedColors((prev) => checked ? [...prev, value] : prev.filter((item) => item !== value));
    }
  };

  const applyFilter = () => {
    let result = Products;

    // Apply gender filter
    if (genderFilter !== 'both') {
      result = result.filter((product) => product.gender === genderFilter);
    }

    // Apply search text filter
    if (searchText) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply price range filter
    result = result.filter((product) => product.price >= lower && product.price <= upper);

    // Apply category filter (main categories like 'Dresses', 'Skirts', etc.)
    if (selectedCategory.length > 0) {
      result = result.filter((product) =>
        selectedCategory.includes(product.category)
      );
    }

    // NEW FILTERS for dresses
    // Apply Fabric Type filter
    if (selectedFabricType.length > 0) {
      result = result.filter((product) =>
        product.fabricType && selectedFabricType.includes(product.fabricType)
      );
    }

    // Apply Dress Style filter
    if (selectedDressStyle.length > 0) {
      result = result.filter((product) =>
        product.dressStyle && selectedDressStyle.includes(product.dressStyle)
      );
    }

    // Apply Occasion filter
    if (selectedOccasion.length > 0) {
      result = result.filter((product) =>
        product.occasion && selectedOccasion.includes(product.occasion)
      );
    }

    // Apply Color filter
    if (selectedColors.length > 0) {
      result = result.filter((product) =>
        product.colors && selectedColors.some(color => product.colors!.includes(color))
      );
    }

    // Apply In Stock filter
    if (inStockOnly) {
      result = result.filter((product) => product.stock > 0);
    }

    // Apply sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredItems(result);
  };

  const getStarRating = (rating: number = 4) => {
    return [...Array(5)].map((_, i) => (
      <IonIcon
        key={i}
        icon={star}
        className="rating-icon"
        style={{ color: i < rating ? "gold" : "#ccc", fontSize: '1.2rem' }}
      />
    ));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <>
      <div id="main-content" className="main-content-wrapper">
        
        <div className="page-product">
          {/* Fixed Sidebar for Desktop */}
          <IonCol className="sidebar-col">
            <div className="sidebar-filters">
              <h3 className="filter-group-title">Filter Options</h3>

              {/* By Fabric Type */}
              <h4 className="filter-group-title">By Fabric Type</h4>
              <ul className="filter-option-list">
                {['Cotton', 'Silk', 'Linen', 'Polyester', 'Velvet', 'Denim'].map((type) => (
                  <li key={type} className="filter-option-item">
                    <IonCheckbox
                      slot="start"
                      checked={selectedFabricType.includes(type)}
                      onIonChange={(e) => handleToggleFilter('fabricType', type, e.detail.checked)}
                    />
                    <IonLabel>{type}</IonLabel>
                  </li>
                ))}
              </ul>

              {/* By Dress Style */}
              <h4 className="filter-group-title">By Dress Style</h4>
              <ul className="filter-option-list">
                {['A-Line', 'Bodycon', 'Maxi', 'Midi', 'Mini', 'Wrap', 'Shift', 'Empire'].map((style) => (
                  <li key={style} className="filter-option-item">
                    <IonCheckbox
                      slot="start"
                      checked={selectedDressStyle.includes(style)}
                      onIonChange={(e) => handleToggleFilter('dressStyle', style, e.detail.checked)}
                    />
                    <IonLabel>{style}</IonLabel>
                  </li>
                ))}
              </ul>

              {/* Price Range */}
              <h4 className="filter-group-title">Price</h4>
              <div className="card-range">
                <IonRange
                  dualKnobs={true}
                  min={0}
                  max={10000}
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
                  <IonLabel className='range-value'>${lower}</IonLabel>
                  <IonLabel>${upper}</IonLabel>
                </div>
              </div>

              {/* By Occasion */}
              <h4 className="filter-group-title">By Occasion</h4>
              <ul className="filter-option-list">
                {['Casual', 'Party', 'Formal', 'Workwear', 'Wedding', 'Cocktail'].map((occasion) => (
                  <li key={occasion} className="filter-option-item">
                    <IonCheckbox
                      slot="start"
                      checked={selectedOccasion.includes(occasion)}
                      onIonChange={(e) => handleToggleFilter('occasion', occasion, e.detail.checked)}
                    />
                    <IonLabel>{occasion}</IonLabel>
                  </li>
                ))}
              </ul>

              {/* By Color */}
              <h4 className="filter-group-title">By Color</h4>
              <div className="color-swatch-container">
                {['Pink', 'White', 'Yellow', 'Red', 'Black', 'Blue', 'Green', 'Mixed'].map((color) => (
                  <div
                    key={color}
                    className={`color-swatch ${selectedColors.includes(color) ? 'selected' : ''}`}
                    style={{ backgroundColor: color.toLowerCase() === 'mixed' ? 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)' : color.toLowerCase() }}
                    onClick={() => handleToggleFilter('colors', color, !selectedColors.includes(color))}
                  >
                    {selectedColors.includes(color) && <IonIcon icon={heart} style={{ color: 'white', fontSize: '1.2em' }} />}
                  </div>
                ))}
              </div>

              {/* Availability */}
              <h4 className="filter-group-title">Availability</h4>
              <ul className="filter-option-list">
                <li className="filter-option-item">
                  <IonCheckbox
                    slot="start"
                    checked={inStockOnly}
                    onIonChange={(e) => setInStockOnly(e.detail.checked)}
                  />
                  <IonLabel>In Stock</IonLabel>
                </li>
              </ul>
            </div>
          </IonCol>

          {/* Main Content Area */}
          <IonCol className="main-content-col">
            {/* Horizontal Filter Bar */}
            <div className="horizontal-filters">
              <div className="horizontal-card card-search">
                <h4 className="filter-title">Filter by Keyword</h4>
                <div className="search-bar">
                  <IonIcon icon={searchOutline} style={{ padding: "0 8px", color: "#E59866" }} />
                  <IonInput
                    type="text"
                    placeholder="Search products..."
                    value={searchText}
                    onIonChange={(e) => setSearchText(e.detail.value!)}
                    className="search-input"
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div className="gender-selection-btn">
                {[
                  { label: 'All', value: 'both', imgPath:"/assets/btn-img/both.png" },
                  { label: 'Male', value: 'male', imgPath:"/assets/btn-img/male.png" },
                  { label: 'Female', value: 'female', imgPath:"/assets/btn-img/woman.png" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`gender-button ${genderFilter === option.value ? 'selected' : ''}`}
                    onClick={() => setGenderFilter(option.value as 'male' | 'female' | 'both')}
                  >
                    <div className="circle-button">
                      <img 
                        src={option.imgPath} 
                        alt={option.label} 
                        
                      />
                    </div>
                    <div className="gender-label">{option.label}</div>
                  </div>
                ))}
              </div>

              {/* Main Category Filter in Horizontal Bar (Simplified) */}
              <div className="horizontal-card card-filter">
                <h4 className="filter-title">Category</h4>
                <div className="category-list">
                  {['Dresses', 'Skirts'].map((cat) => (
                    <div key={cat} className="category-item">
                      <IonCheckbox
                        slot="start"
                        checked={selectedCategory.includes(cat)}
                        onIonChange={(e) => handleCheckBox(cat, e.detail.checked)}
                      />
                      <IonLabel className="cat-label">{cat}</IonLabel>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort By Dropdown */}
              <div className="horizontal-card">
                <h4 className="filter-title">Sort by</h4>
                <IonSelect
                  className="sort-by-select"
                  value={sortBy}
                  onIonChange={(e) => setSortBy(e.detail.value)}
                  interface="popover"
                  placeholder="Default Sorting"
                >
                  <IonSelectOption value="default">Default Sorting</IonSelectOption>
                  <IonSelectOption value="price-asc">Price: Low to High</IonSelectOption>
                  <IonSelectOption value="price-desc">Price: High to Low</IonSelectOption>
                  <IonSelectOption value="name-asc">Name: A-Z</IonSelectOption>
                  <IonSelectOption value="name-desc">Name: Z-A</IonSelectOption>
                </IonSelect>
              </div>
            </div>

            {/* Product Grid */}
            <IonGrid id="product-section">
              <IonRow>
                {filteredItems.map((product) => (
                  <IonCol className="ion-padding" sizeXs="6" sizeSm="6" sizeMd="4" sizeLg="4" sizeXl="3" key={product.id}>
                    <MotionCard>
                      <div
                        className="product-card"
                        style={{ cursor: 'pointer', position: 'relative' }}
                        onClick={() => {
                          dispatch(setSelectedProduct(product));
                          dispatch(setPage("productDetails")); // Navigate via Redux state
                        }}
                      >
                        {product.isNew && <span className="product-badge">NEW</span>}
                        <img className="product-image" src={product.img} alt={product.name} />
                        <IonCardContent className="data">
                          <div className="product-data">
                            <div className="product-title">{product.name}</div>
                            <div className="product-price">&#8377;{product.price}</div>
                          </div>
                          <p className="product-category">{product.category}</p>
                          <div className="rate-buy">
                            <div className="ratings">{getStarRating(product.rating)}</div>
                            <button
                              className={`add-to-wishlist ${isInWishlist(product.id) ? "active" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(toggleWishlist(product));
                              }}
                            >
                              <IonIcon icon={heart} />
                            </button>
                          </div>
                        </IonCardContent>
                      </div>
                    </MotionCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </IonCol>
        </div>
      </div>
    </>
  );
};

export default Product;