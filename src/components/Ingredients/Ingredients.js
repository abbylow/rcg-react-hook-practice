import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const addIngredientHandler = newIngredient => {
    setIsLoading(true);
    // axios will automatically convert everything to JSON, but using fetch, we need to convert by ourselves
    fetch('https://react-hook-practice-c5e6c.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(newIngredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...newIngredient }
      ]);
    });
  }

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://react-hook-practice-c5e6c.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      setIsLoading(false);
      setUserIngredients(prevIngredients =>
        prevIngredients.filter(ing => ing.id !== ingredientId)
      );
    }).catch(error => {
      setError(error.message);
      setIsLoading(false);
    });
  }

  // useCallback: cache the function so the function will not be changed / re-created
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []); //the only dependency is setUserIngredients and it is setState function so no need to list in dependency list

  const cleanError = () => {
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={cleanError}>{error}</ErrorModal>}

      <IngredientForm addIngredient={addIngredientHandler} loading={isLoading} />

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
