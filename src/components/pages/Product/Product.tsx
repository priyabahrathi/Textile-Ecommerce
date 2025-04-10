import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonImg,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonLabel,
  IonInput,
  IonRange,
} from '@ionic/react';
import { SiGooglelens } from "react-icons/si";

import { cart, search, options, star } from 'ionicons/icons';
import { Children, useState } from 'react';
import "./Product.css";
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import {easeOut, motion,useAnimation} from "framer-motion";
import { useEffect,useRef } from 'react';
import { useInView } from 'framer-motion';
const MotionCard =({children}:{children:React.ReactNode})=>{
  const ref=useRef(null);
  const inView=useInView(ref,{once:false});
  const controls=useAnimation();
  useEffect(()=>{
    if(inView){
      controls.start({opacity:1,padding:0});
    }
    else{
      controls.start({opacity:0,padding:10})
    }
  },[inView]);
  return(
    <motion.div 
    ref={ref}
    initial={{opacity:0,padding:10}}
    animate={controls}
    transition={{duration:0.5,ease:"easeOut"}}

    >{children}</motion.div>
  )
}
const Product: React.FC = () => {
  const Products = useSelector((state: RootState) => state.product.Products);
  const [searchText, setSearchText] = useState('');
  const [lower, setLower] = useState(500);
  const [upper, setUpper] = useState(5000);
  const handleRangeChange = (e: any) => {
    setLower(e.detail.value.lower);
    setUpper(e.detail.value.upper);
  };
  return (
    <div className="page-product">
      <div className='product-head'>Find Your Match</div>
      <IonGrid>
        <IonRow>
          <IonCol className='col-product ion-padding' sizeMd='12' sizeLg='12' sizeXl='8'>
            <IonRow>
              {filteredItems.length > 0 ? (
                filteredItems.map((product) => (
                  <IonCol className="ion-padding" size="12" sizeMd="6" key={product.id}>
                    <MotionCard>
                      <div className="product-card">
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
                <IonInput
                  className="search-input"
                  placeholder="Search..."
                  value={searchText}
                  onIonChange={(e) => setSearchText(e.detail.value!)}
                />
                <button className="search-button">
                  <IonIcon icon={search} />
                </button>
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
              <div className='card-size'>
                <div className='filter-title'>Sizes</div>
                <div className='size-checkbox'>
                  <ul className='list-pack'>
                    <li className='list'>
                      <input type="checkbox" id="category1" name="category" value="1" />
                      <label>XS</label>
                    </li>
                    <li className='list'>
                      <input type="checkbox" id="category2" name="category" value="2" />
                      <label>S</label>
                    </li>
                    <li className='list'>
                      <input type="checkbox" id="category3" name="category" value="3" />
                      <label>M</label>
                    </li>
                    <li className='list'>
                      <input type="checkbox" id="category4" name="category" value="4" />
                      <label>L</label>
                    </li>
                    <li className='list'>
                      <input type="checkbox" id="category5" name="category" value="5" />
                      <label>XL</label>
                    </li>
                    <li className='list'>
                      <input type="checkbox" id="category5" name="category" value="5" />
                      <label>XXL</label>
                    </li>
                  </ul>
                </div>

              </div>
              <button className='apply-filter-button'><IonIcon icon={options}  /> Apply Filter</button>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default Product;