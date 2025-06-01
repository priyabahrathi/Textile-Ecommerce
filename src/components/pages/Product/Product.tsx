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
  outfitName?: string;
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
  const outfitNameOptions = Array.from(
    new Set(
      Products.map(p => p.outfitName).filter((name): name is string => Boolean(name))
    )
  );
  const categoryOptions = Array.from(
    new Set(
      Products.map(p => p.category).filter((c): c is string => Boolean(c))
    )
  );





  const [genderFilter, setGenderFilter] = useState<'male' | 'female' | 'both'>('both');
  const [searchText, setSearchText] = useState('');
  const [lower, setLower] = useState(500);
  const [upper, setUpper] = useState(5000);
  const [selectedFabricType, setSelectedFabricType] = useState<string[]>([]);
  const [selectedOutfitNames, setSelectedOutfitNames] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('default');
  const [drawerOpen, setDrawerOpen] = useState(false);


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
    selectedCategories,
    genderFilter,
    selectedFabricType,
    selectedOutfitNames,
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
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  };


  const handleToggleFilter = (
    filterType: 'fabricType' | 'outfitName' | 'category' | 'colors',
    value: string,
    checked: boolean
  ) => {
    if (filterType === 'fabricType') {
      setSelectedFabricType((prev) => checked ? [...prev, value] : prev.filter((item) => item !== value));
    } else if (filterType === 'outfitName') {
      setSelectedOutfitNames((prev) => checked ? [...prev, value] : prev.filter((item) => item !== value));
    } else if (filterType === 'category') {
      setSelectedCategories((prev) =>
        checked ? [...prev, value] : prev.filter((item) => item !== value)
      );
    }
    else if (filterType === 'colors') {
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


    // NEW FILTERS for dresses
    // Apply Fabric Type filter
    if (selectedFabricType.length > 0) {
      result = result.filter((product) =>
        product.fabricType && selectedFabricType.includes(product.fabricType)
      );
    }
    // Apply Outfit Name filter
    if (selectedOutfitNames.length > 0) {
      result = result.filter((product) =>
        product.outfitName && selectedOutfitNames.includes(product.outfitName)
      );
    }


    // Apply category filter (main categories like 'Dresses', 'Skirts', etc.)

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
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
    if (sortBy === 'price-asc') 
    {
      result.sort((a, b) => a.price - b.price);
    } 
    else if (sortBy === 'price-desc') 
    {
      result.sort((a, b) => b.price - a.price);
    } 
    else if (sortBy === 'name-asc') 
    {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } 
    else if (sortBy === 'name-desc') 
    {
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
      <IonButton fill="clear" className="filter-toggle-btn" onClick={() => setDrawerOpen(true)}>
        <IonIcon icon={options} slot="icon-only" />
      </IonButton>
      <div id="main-content" className="main-content-wrapper">
        <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
          <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="mobile-drawer-content">
            <h3 className="filter-group-title">Filter Options</h3>
            <h4 className="filter-group-title">By Fabric Type</h4>
            <h4 className="filter-group-title">By Outfit Name</h4>
            <ul className="filter-option-list">
              {outfitNameOptions.map((outfit) => (
                <li key={outfit} className="filter-option-item">
                  <IonCheckbox
                    slot="start"
                    checked={selectedOutfitNames.includes(outfit)}
                    onIonChange={(e) => handleToggleFilter('outfitName', outfit, e.detail.checked)}
                  />
                  <IonLabel>{outfit}</IonLabel>
                </li>
              ))}
            </ul>
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
          </div>
        </div>
        <div      className="page-product">
          {/* Fixed Sidebar for Desktop */}
          <IonCol className="sidebar-col">
            <div  className="sidebar-filters">
              <h3 className="filter-group-title">Filter Options</h3>
              {/* By Outfit Name */}
              <h4 className="filter-group-title">By Outfit Name</h4>
              <ul className="filter-option-list">
                {outfitNameOptions.map((outfit) => (
                  <li key={outfit} className="filter-option-item">
                    <IonCheckbox
                      slot="start"
                      checked={selectedOutfitNames.includes(outfit)}
                      onIonChange={(e) => handleToggleFilter('outfitName', outfit, e.detail.checked)}
                      className="filter-checkbox"
                    />
                    <IonLabel>{outfit}</IonLabel>
                  </li>
                ))}
              </ul>
              {/* By Fabric Type */}
              <h4 className="filter-group-title">By Fabric Type</h4>
              <ul className="filter-option-list">
                {['Cotton', 'Silk', 'Linen'].map((type) => (
                  <li key={type} className="filter-option-item">
                    <IonCheckbox
                      slot="start"
                      checked={selectedFabricType.includes(type)}
                      onIonChange={(e) => handleToggleFilter('fabricType', type, e.detail.checked)}
                      className="filter-checkbox"
                    />
                    <IonLabel>{type}</IonLabel>
                  </li>
                ))}
              </ul>
              {/* By Occasion */}
              <h4 className="filter-group-title">By Occasion (Category)</h4>
              <ul className="filter-option-list">
                {categoryOptions.map((cat) => (
                  <li key={cat} className="filter-option-item">
                    <IonCheckbox
                      slot="start"
                      checked={selectedCategories.includes(cat)}
                      onIonChange={(e) => handleToggleFilter('category', cat, e.detail.checked)}
                      className="filter-checkbox"
                    />
                    <IonLabel>{cat}</IonLabel>
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


              {/* By Color */}
              <h4 className="filter-group-title">By Color</h4>
              <div className="color-swatch-container">
                {['Pink', 'White', 'Yellow', 'Red', 'mixed'].map((color) => (
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


            </div>
          </IonCol>

          {/* Main Content Area */}
          <IonCol className="main-content-col">
            {/* Horizontal Filter Bar */}
            <div className="horizontal-filters">
              <div className="horizontal-card card-search">
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
                  { label: 'All', value: 'both', imgPath: "/assets/btn-img/both.png" },
                  { label: 'Male', value: 'male', imgPath: "/assets/btn-img/male.png" },
                  { label: 'Female', value: 'female', imgPath: "/assets/btn-img/woman.png" },
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
                        className="gender-icon"
                      />
                    </div>
                    <div className="gender-label">{option.label}</div>
                  </div>
                ))}
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
                  <IonCol sizeXs="6" sizeSm="6" sizeMd="4" sizeLg="3" sizeXl="3" key={product.id}>
                    <MotionCard>
                      <div
                        className="product-card"
                        onClick={() => {
                          dispatch(setSelectedProduct(product));
                          dispatch(setPage("productDetails"));
                        }}
                      >

                        <div className="product-page-img">
                          <div className="product-bg-style">
                            <img className="card-img" src={product.img} alt={product.name} />
                          </div>
                        </div>


                        <IonCardContent className="product-content">
                          <div className="product-price">
                            <span>&#8377;{product.price}</span>
                          </div>
                          <div className="card-header">
                            <h3 className="product-name" title={product.name}>
                              {product.name.split(' ').slice(0, 2).join(' ')}
                              {product.name.split(' ').length > 2 && '...'}
                            </h3>
                            <button
                              className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(toggleWishlist(product));
                              }}
                            >
                              <IonIcon icon={heart} />
                            </button>
                          </div>
                          <div className="product-details">
                          <p className="product-category">{product.category}</p>
                          <div className="p-stars">
                              {getStarRating(product.rating)}
                            </div>                            
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