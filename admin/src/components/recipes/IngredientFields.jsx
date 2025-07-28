// src/components/recipes/IngredientFields.jsx
import { Button, Form } from 'react-bootstrap';

export default function IngredientFields({ ingredients, setIngredients }) {
  const handleChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  return (
    <>
      <Form.Label>Ingredients</Form.Label>
      {ingredients.map((item, index) => (
        <div key={index} className="d-flex gap-2 mb-2">
          <Form.Control
            type="text"
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder="e.g., Cheese"
            required
          />
          <Button variant="danger" onClick={() => removeIngredient(index)}>-</Button>
        </div>
      ))}
      <Button variant="secondary" onClick={addIngredient}>Add Ingredient</Button>
    </>
  );
}
