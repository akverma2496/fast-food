import { useEffect, useState } from 'react';
import { Table, Button, Image, Container, Row, Col } from 'react-bootstrap';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(list);
      } catch (err) {
        toast.error('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await deleteDoc(doc(db, 'recipes', id));
      setRecipes(prev => prev.filter(r => r.id !== id));
      toast.success('Recipe deleted');
    } catch (err) {
      toast.error('Failed to delete recipe');
    }
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col><h2>Recipes</h2></Col>
        <Col className="text-end">
          <Button onClick={() => navigate('/admin/recipes/create')}>Add New Recipe</Button>
        </Col>
      </Row>

      {loading ? (
        <p>Loading...</p>
      ) : recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map(recipe => (
              <tr key={recipe.id}>
                <td>
                  <Image
                    src={recipe.images?.[0] || 'https://via.placeholder.com/80'}
                    alt={recipe.name}
                    thumbnail
                    style={{ maxWidth: '80px' }}
                  />
                </td>
                <td>{recipe.name}</td>
                <td>{recipe.category}</td>
                <td>{recipe.price}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/admin/recipes/${recipe.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(recipe.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
