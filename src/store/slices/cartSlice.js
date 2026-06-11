import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  totalAmount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload
      state.totalAmount = action.payload.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      )
    },
    clearCart: (state) => {
      state.items = []
      state.totalAmount = 0
    },
  },
})

export const { setCart, clearCart } = cartSlice.actions
export default cartSlice.reducer