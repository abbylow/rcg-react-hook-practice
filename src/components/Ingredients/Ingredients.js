import React, { useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

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

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...currentHttpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...currentHttpState, error: null };
    default:
      throw new Error('Should not get there!');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });

  const addIngredientHandler = useCallback(newIngredient => {
    dispatchHttp({ type: 'SEND' });
    // axios will automatically convert everything to JSON, but using fetch, we need to convert by ourselves
    fetch('https://react-hook-practice-c5e6c.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(newIngredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });
      return response.json();
    }).then(responseData => {
      dispatch({ type: 'ADD', newIngredient: { id: responseData.name, ...newIngredient } });
    });
  }, []);

  const removeIngredientHandler = useCallback(ingredientId => {
    dispatchHttp({ type: 'SEND' });
    fetch(`https://react-hook-practice-c5e6c.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });
      dispatch({ type: 'DELETE', ingredientId });
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', errorMessage: error.message });
    });
  }, []);

  // useCallback: cache the function so the function will not be changed / re-created
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []); //the only dependency is setUserIngredients and it is setState function so no need to list in dependency list

  const cleanError = () => {
    dispatchHttp({ type: 'CLEAR' });
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={cleanError}>{httpState.error}</ErrorModal>}

      <IngredientForm addIngredient={addIngredientHandler} loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
