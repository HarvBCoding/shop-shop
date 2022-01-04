// used by the ProductList component; store the data retrieved for products
export const UPDATE_PRODUCTS = "UPDATE_PRODUCTS";
// list of categories retrieved from the server
export const UPDATE_CATEGORIES = "UPDATE_CATEGORIES";
// connecting piece; select category from UPDATE_CATEGORIES;
// display products for that category from UPDATE_PRODUCTS
export const UPDATE_CURRENT_CATEGORY = "UPDATE_CURRENT_CATEGORY";

// Global State for cart
export const ADD_TO_CART = 'ADD_TO_CART';
export const ADD_MULTIPLE_TO_CART = 'ADD_MULTIPLE_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY';
export const CLEAR_CART = 'CLEAR_CART';
export const TOGGLE_CART ='TOGGLE_CART';