import React from "react";
import { Link } from "react-router-dom";
import { pluralize } from "../../utils/helpers";
import { idbPromise } from "../../utils/helpers";

import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart, updateCartQuantity } from '../../utils/slice';

function ProductItem(item) {

  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;

  const state = useSelector(state => state.product)
  const { cart } = state
  
  const dispatch = useDispatch()

  const addToCart = () => {
    // find the cart item with the matching id
    const itemInCart = cart.find((cartItem) => cartItem._id === _id);
  
    // if there was a match, call UPDATE w/ a new purchase quantity
    if (itemInCart) {
      dispatch(updateCartQuantity(_id, (itemInCart.purchaseQuantity) + 1))

      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch(addItemToCart({ ...item, purchaseQuantity: 1 }))

      idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
    }
  };

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}

export default ProductItem;
