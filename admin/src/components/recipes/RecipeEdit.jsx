import { useEffect, useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import IngredientFields from '../../components/recipes/IngredientFields';
import ImageUploader from '../../components/recipes/ImageUploader';

export default function RecipeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, 'recipes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setCategory(data.category || '');
          setIngredients(data.ingredients || ['']);
          setPrice(data.price || '');
          setImages(data.images || []);
        } else {
          toast.error('Recipe not found');
          navigate('/admin/recipes');
        }
      } catch (err) {
        toast.error('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !price || ingredients.length === 0 || images.length === 0) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await updateDoc(doc(db, 'recipes', id), {
        name,
        category,
        ingredients,
        price,
        images,
      });
      toast.success('Recipe updated');
      navigate('/admin/recipes');
    } catch (err) {
      toast.error('Failed to update recipe');
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h2 className="mb-4 text-center">Edit Recipe</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Recipe Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </Form.Group>

                <IngredientFields ingredients={ingredients} setIngredients={setIngredients} />

                <Form.Group className="mb-3">
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Form.Group>

                <ImageUploader images={images} setImages={setImages} />

                <div className="text-center mt-4">
                  <Button type="submit" variant="success" className="px-5">
                    Update Recipe
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
