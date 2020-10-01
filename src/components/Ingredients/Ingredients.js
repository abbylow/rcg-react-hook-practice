import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientHandler = newIngredient => {
    // axios will automatically convert everything to JSON, but using fetch, we need to convert by ourselves
    fetch('https://react-hook-practice-c5e6c.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(newIngredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...newIngredient }
      ]);
    });
  }

  const removeIngredientHandler = ingredientId => {
    setUserIngredients(prevIngredients => {
      const newIngredients = prevIngredients.filter(ing => ing.id !== ingredientId);
      setUserIngredients(newIngredients);
    });
  }

  // useCallback: cache the function so the function will not be changed / re-created
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []); //the only dependency is setUserIngredients and it is setState function so no need to list in dependency list

  return (
    <div className="App">
      <IngredientForm addIngredient={addIngredientHandler} />

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
