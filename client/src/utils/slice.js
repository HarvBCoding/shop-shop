import { createSlice } from '@reduxjs/toolkit'

export const productSlice = createSlice({
    name: 'productCart',
    initialState: {
        products: [],
        cart: [],
        cartOpen: [],
        categories: [],
        currentCategory: "",
    },
    reducers: {
        updateProducts: (state, action) => {
            state.products = action.payload
        },
        updateCategories: (state, action) => {
            state.categories = action.payload
        },
        updateCurrentCategory: (state, action) => {
            state.currentCategory = action.payload
        },
        addItemToCart: (state, action) => {
            state.cartOpen = true;
            state.cart = state.cart.concat(action.payload)
        },
        addMultipleToCart: (state, action) => {
            state.cart = state.cart.concat(action.payload)
        },
        removeItemFromCart: (state, action) => {
            let newState = state.cart.filter((product) => {
                return product._id !== action.payload;
            });

            state.cartOpen = newState.length > 0;
            state.cart = newState
        },
        updateCartQuantity: (state, action) => {
            state.cartOpen = true;
            state.cart = state.cart.map((product) => {
                const { _id, purchaseQuantity } = action.payload
                if (_id === product._id) {
                    product.purchaseQuantity = purchaseQuantity;
                }
                return product;
            })
        },
        clearCart: (state) => {
            state.cartOpen = false;
            state.cart = []
        },
        toggleUserCart: (state) => {
            state.cartOpen = !state.cartOpen
        }
    }
});

// action creators are generated for each case reducer function
export const { 
    updateProducts, 
    updateCategories, 
    updateCurrentCategory, 
    addItemToCart, 
    addMultipleToCart, 
    removeItemFromCart, 
    updateCartQuantity, 
    clearCart, 
    toggleUserCart } = productSlice.actions

export default productSlice.reducer