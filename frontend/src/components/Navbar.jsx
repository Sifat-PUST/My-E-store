import { Link } from "react-router-dom";
import { useCart } from "../Contexts/CartContext";
import { logout } from './../utils/auth';

export default function Navbar() {
    const { cartItem } = useCart();

    const cartCount = cartItem.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <nav className="bg-white shadow-md fixed top-0 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <Link to="/" className="text-2xl font-bold text-blue-600">
                        .Sifat
                    </Link>

                    <Link to="/product/add" className="text-2xl font-bold text-blue-600">
                        Add Product
                    </Link>
                    <Link to="/login" className="text-2xl font-bold text-blue-600">
                        Login
                    </Link>
                    <Link to="/signup" className="text-2xl font-bold text-blue-600">
                        Register
                    </Link>
                    <button onClick={logout} className="text-2xl font-bold text-blue-600">
                        Logout
                    </button>

                    <Link
                        to="/cart"
                        className="relative flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                    >
                        <span className="text-2xl">🛒</span>
                        <span className="font-medium">Cart</span>

                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                </div>
            </div>
        </nav>
    );
}