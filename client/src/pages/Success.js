import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Jumbotron from '../components/Jumbotron';
import { ADD_ORDER } from '../utils/mutations';
import { idbPromise } from '../utils/helpers';

function Success() {
    const [addOrder] = useMutation(ADD_ORDER);

    useEffect(() => {
        async function saveOrder() {
            // get all items in cart
            const cart = await idbPromise('cart', 'get');
            // map the items in cart variable
            const products = cart.map((item) => item._id);

            if (products.length) {
                // order added to database
                const { data } = await addOrder({ variables: { products } });
                const productData = data.addOrder.products;
                // items deleted from cart
                productData.forEach((item) => {
                    idbPromise('cart', 'delete', item);
                });
            }

            setTimeout(() => {
                window.location.assign('/');
            }, 3000);
        }

        saveOrder();
    }, [addOrder]);

    return (
        <div>
            <Jumbotron>
                <h1>Success!</h1>
                <h2>
                    Thank you for your purchase!
                </h2>
                <h2>
                    You will now be redirected to the homepage
                </h2>
            </Jumbotron>
        </div>
    );
};

export default Success;