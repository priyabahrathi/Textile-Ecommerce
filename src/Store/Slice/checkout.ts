// Store/Slice/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BuyItem {
  id: string;
  name: string;
  price: number;
  img: string;
  quantity: number;
}

interface BuyState {
  items: BuyItem[];
}

const initialState: BuyState = {
  items: [],
};

const buySlice = createSlice({
  name: 'buy',
  initialState,
  reducers: {
    clearBuy: (state) => {
      state.items = [];
    },
    addToBuy: (state, action: PayloadAction<BuyItem>) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.quantity++;
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity--;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  }
});

export const { addToBuy,clearBuy, increaseQuantity, decreaseQuantity, removeFromCart } = buySlice.actions;
export default buySlice.reducer;
