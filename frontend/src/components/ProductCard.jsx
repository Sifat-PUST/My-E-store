import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../Contexts/CartContext";
import { Link } from "react-router-dom";
const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const inStock = product.stock > 0 && product.available;

  const { addToCart } = useCart();
  // console.log(product)

  return (
    <div className="group w-full max-w-[280px] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition duration-300">
      {/* Product Image */}
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        <Link to={`/product/${product.id}`}>
            <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />

            {/* Stock Status */}
            <span
            className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${
                inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}
            >
            {inStock ? "In Stock" : "Out of Stock"}
            </span>
        </Link>
        {/* Favourite Icon */}
            <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110 transition"
            aria-label="Toggle favourite"
            >
            <Heart
                size={20}
                className={
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }
            />
            </button>
      </div>

      {/* Product Information */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h3>

        <p className="text-xl font-bold text-blue-600 mt-2">
          ৳ {product.price}
        </p>

        {/* Add to Cart */}
        <button
          onClick={() => addToCart(product)}
          disabled={!inStock}
          className={`w-full mt-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition ${
            inStock
              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          <ShoppingCart size={18} />

          {inStock ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
