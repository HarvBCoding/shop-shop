import React, { useEffect } from "react";
import CartItem from "../CartItem";
import Auth from "../../utils/auth";
import "./style.css";
import { idbPromise } from "../../utils/helpers";
import { QUERY_CHECKOUT } from '../../utils/queries';
import { useLazyQuery } from '@apollo/client';

import { useSelector, useDispatch } from "react-redux";
import { toggleUserCart, addMultipleToCart } from '../../utils/slice';

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {

  const dispatch = useDispatch();
  const state = useSelector(state => state.product)
  const { cart } = state
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  useEffect(() => {
      if (data) {
          stripePromise.then((res) => {
              res.redirectToCheckout({ sessionId: data.checkout.session });
          });
      }
  }, [data]);

  useEffect(() => {
      async function getCart() {
          const indexCart = await idbPromise('cart', 'get');
          dispatch(addMultipleToCart([...indexCart]))

      };

      if (!cart.length) {
          getCart();
      }
  }, [cart.length, dispatch]);

  function toggleCart() {
      dispatch(toggleUserCart())

  }

  function calculateTotal() {
      let sum = 0;
      cart.forEach(item => {
          sum += item.price * item.purchaseQuantity;
      });
      return sum.toFixed(2);
  }

  function submitCheckout() {
      const productIds = [];

      state.cart.forEach((item) => {
          for (let i = 0; i < item.purchaseQuantity; i++) {
              productIds.push(item._id);
          }
      });

      console.log('productIds:', productIds);

      getCheckout({
          variables: { products: productIds }
      });
  }

  if (!state.cartOpen) {
      return (
          <div className="cart-closed" onClick={toggleCart}>
              <span
                role="img"
                aria-label="trash"
              >🛒</span>
          </div>
      )
  }

  console.log(cart);

  return (
    <div className="cart">
    <div className="close" onClick={toggleCart}>[close]</div>
    <h2>Shopping Cart</h2>
    {cart.length ? (
        <div>
        {cart.map(item => (
            <CartItem key={item._id} item={item} />
        ))}
        <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>
            {
            Auth.loggedIn() ?
                <button onClick={submitCheckout}>
                Checkout
                </button>
                :
                <span>(log in to check out)</span>
            }
        </div>
        </div>
    ) : (
        <h3>
        <span role="img" aria-label="shocked">
            😱
        </span>
        You haven't added anything to your cart yet!
        </h3>
    )}
    </div>
  );
};

export default Cart;