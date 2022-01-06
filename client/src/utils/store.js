import { configureStore } from 'redux/toolkit';
import productReducer from './slice'

export default configureStore({
    reducer: {
        product: productReducer
    }
});