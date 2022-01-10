import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';

import { useSelector, useDispatch } from 'react-redux';
import { updateCategories, updateCurrentCategory } from '../../utils/slice';
import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {

  // const [state, dispatch] = useStoreContext();
  const dispatch = useDispatch()
  const state = useSelector(state => state.product)
  const { categories } = state
  
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    // if categoryData exists or has changed from the response of useQuery, then run dispatch()
    if (categoryData) {
      // execute our dispatch function w/ the action object indicating the type of action & the data to set the state for categories
      dispatch(updateCategories(categoryData.categories))

      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch(updateCategories(categories));

      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = id => {
    dispatch(updateCurrentCategory(id))

  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
