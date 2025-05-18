import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../Store/store';
import { clearSelectedProduct } from '../../../../Store/Slice/selectedProductSlice';
import TryOn from '../../Tryon/Tryon';

const ProductDetail: React.FC = () => {
  const selectedProduct = useSelector((state: RootState) => state.selectedProduct.product);
  const dispatch = useDispatch();

  if (!selectedProduct) return <div>No product selected.</div>;

  return (
    <div className="product-detail-page">
      <button onClick={() => dispatch(clearSelectedProduct())}>Back</button>
      <h2>{selectedProduct.name}</h2>
      <img src={selectedProduct.img} alt={selectedProduct.name} style={{ maxWidth: 300 }} />
      <p>Price: &#8377;{selectedProduct.price}</p>
      <p>Category: {selectedProduct.category}</p>
      <p>Outfit Type: {selectedProduct.outfitType || 'Not Defined'}</p>
      
      {/* Add Buy button and other details here */}
    </div>
  );
};

export default ProductDetail;