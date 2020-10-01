import React, { useReducer, useCallback, useMemo, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.newIngredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.ingredientId);
    default:
      throw new Error('Should not get there!');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { loading, data, error, sendRequest, extra, identifier, clear } = useHttp();

  useEffect(() => {
    if (!loading && !error && identifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', ingredientId: extra });
    } else if (!loading && !error && identifier === 'ADD_INGREDIENT') {
      dispatch({ type: 'ADD', newIngredient: { id: data.name, ...extra } });
    }
  }, [data, extra, identifier, loading, error]);

  const addIngredientHandler = useCallback(newIngredient => {
    sendRequest(
      'https://react-hook-practice-c5e6c.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(newIngredient),
      newIngredient,
      'ADD_INGREDIENT'
    );
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(
      `https://react-hook-practice-c5e6c.firebaseio.com/ingredients/${ingredientId}.json`,
      'DELETE',
      null,
      ingredientId,
      'REMOVE_INGREDIENT'
    );
  }, [sendRequest]);

  // useCallback: cache the function so the function will not be changed / re-created
  // the component that receives this function must be using React.memo, otherwise it will re-render no matter this function is re-created or not
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []); //the only dependency is setUserIngredients and it is setState function so no need to list in dependency list

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    )
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm addIngredient={addIngredientHandler} loading={loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
