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
  IonRange
} from '@ionic/react';
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
    <div className='page-product'>
      <IonGrid >
        <IonRow>
          <IonCol className='col-product ion-padding' sizeMd='12' sizeLg='12' sizeXl='8'>
            <IonRow>
              {Products.map((product) => (
                <IonCol className='ion-padding' size='12'sizeMd='6' sizeLg='6' key={product.id}>
                  <MotionCard>
                  <IonCard className='product-card'>
                    <IonImg className='product-image' src={product.img} />
                    <IonCardContent>
                      <div className='product-data'>
                        <div className='product-title'>{product.name}</div>
                        <div className='product-price'>${product.price}</div>
                      </div>
                      <p className='product-category' style={{fontFamily:"sans-serif",fontSize:"20px"}}>{product.category}</p>
                      <div className='rate-buy'>
                      <div className='ratings'>
                      <i className="bi bi-star-fill"></i>
                      <IonIcon className='buy-button' size='meduim' icon={star} />
                      <IonIcon className='buy-button' size='meduim' icon={star} />
                      <IonIcon className='buy-button' size='meduim' icon={star} />
                      <IonIcon className='buy-button' size='meduim' icon={star} />
                      <IonIcon className='buy-button' size='meduim' icon={star} />
                      </div>
                      <button className='btn-buy'>
                        <IonIcon className='buy-button' slot="start" icon={cart} /> Buy Now
                      </button>
                      </div>
                    </IonCardContent>
                  </IonCard>
                  </MotionCard>
                </IonCol>
              ))}
            </IonRow>
          </IonCol>
          <IonCol className='sidebar' sizeMd='12' size='12' sizeLg='12' sizeXl='4'>
            <IonCard className='card-search'>
              <div className='search-bar'>
                <IonInput className='search-input' placeholder="Search..." value={searchText} onIonChange={e => setSearchText(e.detail.value!)} />
                <IonButton className='search-button'><IonIcon icon={search} /></IonButton></div>
            </IonCard>
            <IonCard className='card-range'>
              <h1 className='range-title'>Price Range</h1>
              <IonRange
                dualKnobs={true}
                min={500}
                max={5000}
                value={{ lower, upper }}
                onIonChange={handleRangeChange}
              ></IonRange>
              <div className='range-values'>
                <IonLabel>Min Price: {lower}</IonLabel>
                <IonLabel>Max Price: {upper}</IonLabel>
              </div>
            </IonCard>
            <div className='filter-section'>
              <div className='card-filter'>
                <div className='filter-title'>Categories</div>
                <div className='filter-checkbox'>
                  <ul>
                    <li>
                      <input type="checkbox" id="category1" name="category" value="1" />
                      <label>Category 1</label>
                    </li>
                    <li>
                      <input type="checkbox" id="category2" name="category" value="2" />
                      <label>Category 2</label>
                    </li>
                    <li>
                      <input type="checkbox" id="category3" name="category" value="3" />
                      <label>Category 3</label>
                    </li>
                    <li>
                      <input type="checkbox" id="category4" name="category" value="4" />
                      <label>Category 4</label>
                    </li>
                    <li>
                      <input type="checkbox" id="category5" name="category" value="5" />
                      <label>Category 5</label>
                    </li>
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
