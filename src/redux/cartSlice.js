import { createSlice } from '@reduxjs/toolkit';

const getAllCart = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const saveCartToLocalStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.log(error);
  }
};

const initialState = {
  cart: getAllCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cart.push(item);
      }

      saveCartToLocalStorage(state.cart);
    },
    removeItem: (state, action) => {
      const id = action.payload;

      state.cart = state.cart.filter((cartItem) => cartItem.id !== id);

      saveCartToLocalStorage(state.cart);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find((cartItem) => cartItem.id === id);

      if (item) {
        item.quantity = quantity;
      }

      saveCartToLocalStorage(state.cart);
    },
    clearCart: (state) => {
      state.cart = [];

      saveCartToLocalStorage(state.cart);
    },
    checkout: (state, action) => {
      const selectedItems = action.payload; // Array berisi ID item yang dipilih
      state.cart = state.cart.filter((item) => !selectedItems.includes(item.id));
      saveCartToLocalStorage(state.cart);
    },
  },
});

export const { addToCart, removeItem, updateQuantity, clearCart, checkout } = cartSlice.actions;
export default cartSlice.reducer;
