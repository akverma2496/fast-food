import { useEffect, useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import IngredientFields from '../../components/recipes/IngredientFields';
import ImageUploader from '../../components/recipes/ImageUploader';
import { toast } from 'react-toastify';

export default function RecipeCreate() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState(['']);
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, 'categories'));
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(fetched);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !price || ingredients.length === 0 || images.length === 0) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, `recipes/${uuidv4()}`);
          await uploadBytes(imageRef, image);
          return await getDownloadURL(imageRef);
        })
      );

      await addDoc(collection(db, 'recipes'), {
        name,
        category,
        ingredients,
        price: parseFloat(price),
        images: imageUrls,
        createdAt: Date.now()
      });

      toast.success('Recipe created successfully');
      navigate('/admin/recipes');
    } catch (err) {
      toast.error('Error creating recipe');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <h2 className="mb-4">Create New Recipe</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Recipe Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <IngredientFields ingredients={ingredients} setIngredients={setIngredients} />

            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>

            <ImageUploader images={images} setImages={setImages} />

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : 'Create Recipe'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
