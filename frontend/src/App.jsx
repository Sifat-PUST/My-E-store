import Navbar from './components/Navbar';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AddProduct from './pages/AddProduct';
import ProductList from './pages/ProductLists';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import Checkout from './pages/CheckOut';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <main className='pt-16'>
          <Routes >
          <Route path="/" element={<ProductList/>} />
          <Route path="/product/add" element={<AddProduct/>} />
          <Route path="/product/:id" element={<ProductDetails/>} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/signup" element={<RegisterPage/>} /> 
          </Routes>
        </main>
        </Router>
    </div>
  );
};

export default App;