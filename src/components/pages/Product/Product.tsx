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
import { useState } from 'react';
import "./Product.css";


const products = [
  { id: 1, name: 'Black Tee', price: 29.99, category: "Men's", img: '../assets/shoe.png' },
  { id: 2, name: 'Smart Watch', price: 199.99, category: 'Accessories', img: '../assets/shoe.png' },
  { id: 3, name: 'Blue Tee', price: 19.99, category: "Women's", img: '../assets/shoe.png' },
  { id: 4, name: 'LT Bag', price: 49.99, category: "Women's", img: '../assets/shoe.png' },
  { id: 5, name: 'Running Shoes', price: 89.99, category: "Men's", img: '../assets/shoe.png' },
  { id: 6, name: 'CL Watch', price: 99.99, category: 'Accessories', img: '../assets/shoe.png' }
];

const Product: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  const [lower, setLower] = useState(20);
  const [upper, setUpper] = useState(80);

  const handleRangeChange = (e: any) => {
    setLower(e.detail.value.lower);
    setUpper(e.detail.value.upper);
  };
  return (
    <div className='page-product'>
      <IonGrid>
        <IonRow>
          <IonCol size="8">
            <IonRow>
              {products.map((product, index) => (
                <IonCol size="6" key={product.id}>
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
                      <IonIcon className='buy-button' size='large' icon={star} />
                      <IonIcon className='buy-button' size='large' icon={star} />
                      <IonIcon className='buy-button' size='large' icon={star} />
                      <IonIcon className='buy-button' size='large' icon={star} />
                      <IonIcon className='buy-button' size='large' icon={star} />
                      </div>
                      <IonButton className='btn-buy'>
                        <IonIcon className='buy-button' slot="start" icon={cart} /> Buy Now
                      </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonCol>
          <IonCol className='sidebar' size="4">
            <IonCard className='card-search'>
              <div className='search-bar'>
                <IonInput className='search-input' placeholder="Search..." value={searchText} onIonChange={e => setSearchText(e.detail.value!)} />
                <IonButton className='search-button'><IonIcon icon={search} /></IonButton></div>
            </IonCard>
            <IonCard className='card-range'>
              <h1 className='range-title'>Price Range</h1>
              <IonRange
                aria-label="Dual Knobs Range"
                dualKnobs={true}
                min={2000}
                max={20000}
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
                <h1 className='filter-title'>Categories</h1>
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
                <h1 className='filter-title'>Sizes</h1>
                <div className='size-checkbox'>
                  <ul>
                    <li>
                      <input type="checkbox" id="category1" name="category" value="1" />
                      <label>XS</label>
                    </li>
                    <li>
                      <input type="checkbox" id="category2" name="category" value="2" />
                      <label>S</label>
                    </li>
                    <li>
                      <input type="checkbox" id="category3" name="category" value="3" />
                      <label>M</label>
                    </li>
                    <li>
                      <input type="checkbox" id="category4" name="category" value="4" />
                      <label>L</label>
                    </li>
                    <li>
                      <input type="checkbox" id="category5" name="category" value="5" />
                      <label>XL</label>
                    </li>
                    <li>
                      <input type="checkbox" id="category5" name="category" value="5" />
                      <label>XXL</label>
                    </li>
                  </ul>
                </div>

              </div>
              <IonButton className='apply-filter-button' expand="full"><IonIcon icon={options} /> Apply Filter</IonButton>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>



  );
};

export default Product;
