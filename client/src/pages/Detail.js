import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Cart from '../components/Cart';

import { useSelector, useDispatch } from 'react-redux';
import { 
  updateProducts,
  updateCartQuantity,
  addItemToCart,
  removeItemFromCart
 } from '../utils/slice';

import { QUERY_PRODUCTS } from '../utils/queries';
import { idbPromise } from '../utils/helpers';
import spinner from '../assets/spinner.gif';

function Detail() {

  const dispatch = useDispatch();
  const state = useSelector(state => state.product)
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({})

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const { products, cart } = state;

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);

    if (itemInCart) {
      dispatch(updateCartQuantity(id, (itemInCart.purchaseQuantity) + 1))

      // if updating quantity, use existing item data & increment purchaseQuantity value by 1
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch(addItemToCart({ ...itemInCart, purchaseQuantity: 1}))

      // if product isn't in cart, add it to current shopping cart in IndexedDb
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1});
    }
  };

  const removeFromCart = () => {
    dispatch(removeItemFromCart(currentProduct._id));

    //upon removal from cart, delete the item from IndexedDB using currentProduct._id to locate what to remove
    idbPromise('cart', 'delete', { ...currentProduct });
  };

  useEffect(() => {
    // already in global store
    if (products.length) {
      setCurrentProduct(products.find(product => product._id === id));

     //retrieved from server 
    } else if (data) {
      dispatch(updateProducts(data.products));

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
     // get cache from idb 
    } else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch(updateProducts(indexedProducts))

      });
    }
  }, [products, data, loading, dispatch, id]);

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              disabled={!cart.find(p => p._id === currentProduct._id)}
              onClick={removeFromCart}>
                Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
