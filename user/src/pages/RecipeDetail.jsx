import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { Container, Row, Col, Button, Spinner, Image } from "react-bootstrap";
import { useCart } from "../context/CartContext";

export default function RecipeDetail() {

    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({
            id: recipe.id,
            name: recipe.name,
            price: recipe.price,
            image: Array.isArray(recipe.images) ? recipe.images[0] : "",
        });
    }

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const docRef = doc(db, "recipes", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setRecipe({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching recipe:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
        );
    }

    if (!recipe) {
        return <p className="text-center">Recipe not found.</p>;
    }

    return (
        <Container className="py-4">
            <Row>
                <Col md={6}>
                    <Image
                        src={
                            Array.isArray(recipe.images) && recipe.images.length > 0
                                ? recipe.images[0]
                                : "https://via.placeholder.com/400x300?text=No+Image"
                        }
                        alt={recipe.name}
                        fluid
                        rounded
                    />
                </Col>
                <Col md={6}>
                    <h2>{recipe.name}</h2>
                    <h4 className="text-success">₹ {recipe.price}</h4>
                    <p><strong>Ingredients:</strong></p>
                    <ul>
                        {Array.isArray(recipe.ingredients) ? (
                            recipe.ingredients.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))
                        ) : (
                            <li>{recipe.ingredients || "Not specified"}</li>
                        )}
                    </ul>
                    <Button variant="primary" onClick={handleAddToCart}>Add to Cart</Button>
                </Col>
            </Row>
        </Container>
    );
}
