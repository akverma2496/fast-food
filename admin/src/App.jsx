import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Categories from './pages/Categories';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import RecipeList from './components/recipes/RecipeList';
import RecipeCreate from './components/recipes/RecipeCreate';
import RecipeEdit from './components/recipes/RecipeEdit';
import Orders from './pages/Orders';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >

          <Route index element={<div>Welcome to the Admin Panel</div>} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="recipes" element={<RecipeList />} />
          <Route path="recipes/create" element={<RecipeCreate />} />
          <Route path="recipes/:id/edit" element={<RecipeEdit />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
