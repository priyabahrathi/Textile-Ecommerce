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
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonList,
  IonItem,
  IonMenu,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
  // Import menuController
} from '@ionic/react';
import { menuController } from '@ionic/core';
import { closeOutline, heart, searchOutline, options, star } from 'ionicons/icons';
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
  gender: 'male' | 'female' | 'both'; // Could also be 'men' | 'women' | 'kids' for general clothing
  rating?: number;
  isNew?: boolean;
  stock: number;         // Added for 'In Stock' filter
  fabricType?: string;   // Added for 'By Fabric Type' filter
  dressStyle?: string;   // Added for 'By Dress Style' filter (e.g., A-line, Bodycon)
  occasion?: string;     // Kept for 'By Occasion' filter (e.g., Party, Formal, Casual)
  colors?: string[];     // Added for 'By Color' filter (array of strings)
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
  const Products = useSelector((state: RootState) => state.product.Products as Product[]); // Cast to new Product type
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const [genderFilter, setGenderFilter] = useState<'male' | 'female' | 'both'>('both');
  const [searchText, setSearchText] = useState('');
  const [lower, setLower] = useState(500);
  const [upper, setUpper] = useState(5000);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedFabricType, setSelectedFabricType] = useState<string[]>([]); // New filter state for dresses
  const [selectedDressStyle, setSelectedDressStyle] = useState<string[]>([]); // New filter state for dresses
  const [selectedOccasion, setSelectedOccasion] = useState<string[]>([]); // New filter state for dresses
  const [selectedColors, setSelectedColors] = useState<string[]>([]); // New filter state
  const [inStockOnly, setInStockOnly] = useState<boolean>(false); // New filter state
  const [sortBy, setSortBy] = useState<string>('default'); // New sort state

  const [filteredItems, setFilteredItems] = useState<Product[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  // isMobile state is no longer explicitly used for conditional rendering in JSX,
  // but the CSS media queries will handle the visibility based on screen width.
  // Keeping this comment as a reminder.

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

  // Updated to use Ionic's menuController
  const openFilterMenu = () => {
    menuController.open('filterMenu');
  };

  return (
    <>
      {/* Mobile Filter Menu (IonMenu) */}
      <IonMenu side="start" menuId="filterMenu" contentId="main-content">
        <IonHeader>
          <IonToolbar color="light">
            <IonTitle>Filters</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => menuController.close('filterMenu')}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {/* Price Range for mobile menu */}
            <IonItem lines="none">
              <IonLabel className="filter-group-title">Price</IonLabel>
            </IonItem>
            <IonItem>
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
            </IonItem>

            {/* Category Filter for mobile menu */}
            <IonItem lines="none">
              <IonLabel className="filter-group-title">Category</IonLabel>
            </IonItem>
            {['Dresses', 'Skirts', 'Tops', 'Pants', 'Jumpsuits'].map((category) => (
              <IonItem key={category}>
                <IonCheckbox
                  slot="start"
                  checked={selectedCategory.includes(category)}
                  onIonChange={(e) => handleCheckBox(category, e.detail.checked)}
                  style={{'--checkbox-background-checked': '#d45907', '--border-color-checked': '#d45907'}}
                />
                <IonLabel>{category}</IonLabel>
              </IonItem>
            ))}

            {/* Fabric Type Filter for mobile menu */}
            <IonItem lines="none">
              <IonLabel className="filter-group-title">By Fabric Type</IonLabel>
            </IonItem>
            {['Cotton', 'Silk', 'Linen', 'Polyester', 'Velvet', 'Denim'].map((type) => (
              <IonItem key={type}>
                <IonCheckbox
                  slot="start"
                  checked={selectedFabricType.includes(type)}
                  onIonChange={(e) => handleToggleFilter('fabricType', type, e.detail.checked)}
                  style={{'--checkbox-background-checked': '#d45907', '--border-color-checked': '#d45907'}}
                />
                <IonLabel>{type}</IonLabel>
              </IonItem>
            ))}

            {/* Dress Style Filter for mobile menu */}
            <IonItem lines="none">
              <IonLabel className="filter-group-title">By Dress Style</IonLabel>
            </IonItem>
            {['A-Line', 'Bodycon', 'Maxi', 'Midi', 'Mini', 'Wrap'].map((style) => (
              <IonItem key={style}>
                <IonCheckbox
                  slot="start"
                  checked={selectedDressStyle.includes(style)}
                  onIonChange={(e) => handleToggleFilter('dressStyle', style, e.detail.checked)}
                  style={{'--checkbox-background-checked': '#d45907', '--border-color-checked': '#d45907'}}
                />
                <IonLabel>{style}</IonLabel>
              </IonItem>
            ))}

            {/* Occasion Filter for mobile menu */}
            <IonItem lines="none">
              <IonLabel className="filter-group-title">By Occasion</IonLabel>
            </IonItem>
            {['Casual', 'Party', 'Formal', 'Workwear', 'Wedding', 'Cocktail'].map((occasion) => (
              <IonItem key={occasion}>
                <IonCheckbox
                  slot="start"
                  checked={selectedOccasion.includes(occasion)}
                  onIonChange={(e) => handleToggleFilter('occasion', occasion, e.detail.checked)}
                  style={{'--checkbox-background-checked': '#d45907', '--border-color-checked': '#d45907'}}
                />
                <IonLabel>{occasion}</IonLabel>
              </IonItem>
            ))}

            {/* Color Filter for mobile menu */}
            <IonItem lines="none">
              <IonLabel className="filter-group-title">By Color</IonLabel>
            </IonItem>
            <IonItem>
              <div className="color-swatch-container" style={{ margin: 'auto' }}>
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
            </IonItem>

            {/* Availability Filter for mobile menu */}
            <IonItem lines="none">
              <IonLabel className="filter-group-title">Availability</IonLabel>
            </IonItem>
            <IonItem>
              <IonCheckbox
                slot="start"
                checked={inStockOnly}
                onIonChange={(e) => setInStockOnly(e.detail.checked)}
                style={{'--checkbox-background-checked': '#d45907', '--border-color-checked': '#d45907'}}
              />
              <IonLabel>In Stock</IonLabel>
            </IonItem>

            {/* Apply and Reset Buttons for mobile menu */}
            <IonItem>
              <IonButton expand="block" color="primary" onClick={() => { applyFilter(); menuController.close('filterMenu'); }}>Apply Filters</IonButton>
            </IonItem>
            <IonItem>
              <IonButton expand="block" color="medium" onClick={() => {
                setGenderFilter('both');
                setSearchText('');
                setLower(500);
                setUpper(5000);
                setSelectedCategory([]);
                setSelectedFabricType([]);
                setSelectedDressStyle([]);
                setSelectedOccasion([]);
                setSelectedColors([]);
                setInStockOnly(false);
                setSortBy('default');
                menuController.close('filterMenu');
              }}>Reset Filters</IonButton>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <div id="main-content" className="main-content-wrapper">
        <Header />
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
                      style={{'--checkbox-background-checked': '#d45907', '--border-color-checked': '#d45907'}}
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
                      style={{'--checkbox-background-checked': '#d45907', '--border-color-checked': '#d45907'}}
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
                      style={{'--checkbox-background-checked': '#d45907', '--border-color-checked': '#d45907'}}
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
                    style={{ backgroundColor: color.toLowerCase() === 'mixed' ? 'linear-gradient(to right, #FFC0CB, #FFFFFF, #FFFF00, #FF0000, #000000, #0000FF, #008000)' : color.toLowerCase() }}
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
                    style={{'--checkbox-background-checked': '#d45907', '--border-color-checked': '#d45907'}}
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
              {/* Filter button for mobile */}
              <IonButton
                className="filter-button-mobile"
                onClick={openFilterMenu}
                fill="clear"
                slot="start"
                color="dark"
              >
                <IonIcon icon={options} />
              </IonButton>

              <div className="horizontal-card card-search">
                <h4 className="filter-title">Filter by Keyword</h4>
                <div className="search-bar">
                  <IonIcon icon={searchOutline} style={{ padding: "0 8px", color: "#E59866" }} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              {/* Gender Selection */}
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

              {/* Main Category Filter in Horizontal Bar (Simplified) */}
              <div className="horizontal-card card-filter">
                <h4 className="filter-title">Category</h4>
                <div className="category-list">
                  {['Dresses', 'Skirts'].map((cat) => ( // Example, adjust as needed
                    <div key={cat} className="category-item">
                      <IonCheckbox
                        slot="start"
                        checked={selectedCategory.includes(cat)}
                        onIonChange={(e) => handleCheckBox(cat, e.detail.checked)}
                        style={{'--checkbox-background-checked': '#d45907', '--border-color-checked': '#d45907'}}
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
                          dispatch(setPage("productDetails"));
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
                                e.stopPropagation(); // avoid triggering card click
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