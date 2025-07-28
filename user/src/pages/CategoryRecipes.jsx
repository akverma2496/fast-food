import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { db } from "../firebase.config";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";

export default function CategoryRecipes() {
  const { id } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  const { addToCart } = useCart();

  const handleAddToCart = (recipe) => {

    addToCart({
      id: recipe.id,
      name: recipe.name,
      price: recipe.price,
      image: Array.isArray(recipe.images) ? recipe.images[0] : "",
    });
  };

  useEffect(() => {
    const fetchCategoryNameAndRecipes = async () => {
      try {
        // Fetch category name using the ID
        const categoryRef = doc(db, "categories", id);
        const categorySnap = await getDoc(categoryRef);
        if (categorySnap.exists()) {
          const catName = categorySnap.data().name;
          setCategoryName(catName);

          // Fetch recipes that match category name
          const recipeQuery = query(
            collection(db, "recipes"),
            where("category", "==", catName)
          );
          const querySnapshot = await getDocs(recipeQuery);
          const recipeList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRecipes(recipeList);
        } else {
          console.error("Category not found");
        }
      } catch (error) {
        console.error("Error fetching category or recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryNameAndRecipes();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center mb-4">{categoryName} Recipes</h2>
      {recipes.length === 0 ? (
        <p className="text-center">No recipes found in this category.</p>
      ) : (
        <Row>
          {recipes.map(recipe => (
            <Col key={recipe.id} xs={12} md={6} lg={4} className="mb-4">
              <Card>
              <Link to={`/recipe/${recipe.id}`} className="text-decoration-none text-dark">

                <Card.Img
                  variant="top"
                  src={
                    Array.isArray(recipe.images) && recipe.images.length > 0
                      ? recipe.images[0]
                      : "https://via.placeholder.com/400x200?text=No+Image"
                  }
                  alt={recipe.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              </Link>

              
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Card.Title className="mb-1">{recipe.name}</Card.Title>
                      <Card.Text className="mb-0">₹ {recipe.price}</Card.Text>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => { handleAddToCart(recipe) }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
