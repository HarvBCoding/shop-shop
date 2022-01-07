import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';

import { useSelector, useDispatch } from 'react-redux';
import { updateProducts } from '../../utils/slice';

import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from "../../utils/helpers";
import spinner from '../../assets/spinner.gif';

function ProductList() {
  // select currentCategiry & products from state
  const currentCategory = useSelector(state => state.product.currentCategory);
  const products = useSelector(state => state.product.products)
  const dispatch = useDispatch()

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    // if there's data to be stored
    if (data) {
      // let's store it in the global state object
      dispatch(updateProducts(data.products))
      // but let's also take each product & save it to IndexedDB using the helper function
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
      // add else if to check if 'loading' is undefined in 'useQuery()'
    } else if (!loading) {
      // since offline, get all of the data from the 'products' store
      idbPromise('products', 'get').then((products) => {
        // use retrieved data to set global state for offline browsing
        dispatch(updateProducts(products));
      });
    }
  }, [data, loading, dispatch]);
  
  function filterProducts() {
    if (!currentCategory) {
      return products;
    }

    return products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
