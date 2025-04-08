import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonImg,
  IonButton,
  IonIcon,
  IonLabel,
  IonInput,
  IonRange,
} from '@ionic/react';
import { SiGooglelens } from "react-icons/si";

import { cart, search, options, star } from 'ionicons/icons';
import { useState, useEffect, useRef } from 'react';
import './Product.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { motion, useAnimation, useInView } from 'framer-motion';

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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

const Product: React.FC = () => {
  const Products = useSelector((state: RootState) => state.product.Products);

  const [searchText, setSearchText] = useState('');
  const [lower, setLower] = useState(500);
  const [upper, setUpper] = useState(5000);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState(Products);

  useEffect(() => {
    setFilteredItems(Products);
  }, [Products]);

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
      const matchSearch = product.name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchPrice =
        product.price >= lower && product.price <= upper;
      const matchCategory =
        selectedCategory.length === 0 ||
        selectedCategory.includes(product.category);

      return matchSearch && matchPrice && matchCategory;
    });

    setFilteredItems(result);
  };

  return (
    <div className="page-product">
      <IonGrid>
        <IonRow>
          <IonCol className='col-card' sizeMd="12" sizeLg="12" sizeXl="8">
            <IonRow>
              {filteredItems.length > 0 ? (
                filteredItems.map((product) => (
                  <IonCol className="ion-padding" size="12" sizeMd="6" key={product.id}>
                    <MotionCard>
                      <IonCard className="product-card">
                        <div className="card-wrapper">
                          <button
                            className="google-lens-button"
                            onClick={() => console.log(product.img)}
                          >
                            <SiGooglelens className="google-lens-icon" />
                          </button>

                          <IonImg className="product-image" src={product.img} />
                          <IonCardContent>
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
                              <button className="btn-buy">
                                <IonIcon icon={cart} /> Buy Now
                              </button>
                            </div>
                          </IonCardContent>
                        </div>
                      </IonCard>


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
            <IonCard className="card-search">
              <div className="search-bar">
                <IonInput
                  className="search-input"
                  placeholder="Search..."
                  value={searchText}
                  onIonChange={(e) => setSearchText(e.detail.value!)}
                />
                <IonButton className="search-button">
                  <IonIcon icon={search} />
                </IonButton>
              </div>
            </IonCard>

            <IonCard className="card-range">
              <h1 className="range-title">Price Range</h1>
              <IonRange
                dualKnobs={true}
                min={500}
                max={5000}
                value={{ lower, upper }}
                onIonChange={handleRangeChange}
              />
              <div className="range-values">
                <IonLabel>Min Price: {lower}</IonLabel>
                <IonLabel>Max Price: {upper}</IonLabel>
              </div>
            </IonCard>

            <div className="filter-section">
              <div className="card-filter">
                <div className="filter-title">Categories</div>
                <div className="filter-checkbox">
                  <ul className="left-align">
                    {['Formals Men', 'Formals Women', 'Ocassions Men', 'Ocassions Women', 'Casuals Men', 'Casuals Women'].map((cat) => (
                      <li key={cat}>
                        <input
                          type="checkbox"
                          checked={selectedCategory.includes(cat)}
                          onChange={(e) => handleCheckBox(cat, e.target.checked)}
                        />
                        <label>{cat}</label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button className="apply-filter-button" onClick={applyFilter}>
                <IonIcon icon={options} /> Apply Filter
              </button>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default Product;