import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientHandler = newIngredient => {
    setUserIngredients(prevIngredients => [
      ...prevIngredients,
      { id: Math.random().toString(), ...newIngredient }
    ]);
  }

  const removeIngredientHandler = ingredientId => {
    setUserIngredients(prevIngredients => {
      const newIngredients = prevIngredients.filter(ing => ing.id !== ingredientId);
      setUserIngredients(newIngredients);
    });
  }

  return (
    <div className="App">
      <IngredientForm addIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
