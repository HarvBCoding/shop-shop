import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slice'

export default configureStore({
    reducer: {
        product: productReducer
    }
});