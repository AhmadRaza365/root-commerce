import { CartProduct } from '@/types/Product';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface CartState {
  products: CartProduct[];
}

const initialState: CartState = {
  products: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    addProductToCard: (state, action: PayloadAction<CartProduct>) => {
      state.products.push(action.payload);
    },
    removeProductFromCard: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((product) => product.id !== action.payload);
    },
    clearCart: (state) => {
      state.products = [];
    },
    updateProductQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const product = state.products.find((product) => product.id === action.payload.id);
      if (product) {
        product.quantity = action.payload.quantity;
      }
    },
  },
});

export const { addProductToCard, removeProductFromCard, clearCart, updateProductQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
