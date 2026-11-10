import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../Contexts/CartContext";
import {
    ShoppingCart,
    RefreshCw,
    Zap,
} from "lucide-react";

const ProductDetails =()=>{
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {addToCart} = useCart();
    const BASEURL=import.meta.env.VITE_DJANGO_BASE_URL
    useEffect(() => {
        const getProduct =async()=>{
            try {
                const res = await fetch(`${BASEURL}/product/${id}/`); 
                const data = await res.json();
                if(!res.ok){
                    throw new Error("Network response was not ok");
                }
                setProduct(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        getProduct();
    },[id,BASEURL])


    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">
                    Loading product details...
                </p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    Oops! Something went wrong.
                </h2>

                <p className="text-red-500 mt-3">{error}</p>

                <button
                    // onClick={fetchProduct}
                    className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    <RefreshCw size={18} />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-5 md:p-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* Product Image */}
                    <div className="overflow-hidden rounded-xl bg-gray-100">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-[350px] md:h-[450px] object-cover transition-transform duration-500 ease-in-out hover:scale-125 cursor-zoom-in"
                        />
                    </div>

                    {/* Product Information */}
                    <div className="flex flex-col justify-center">

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            {product.name}
                        </h1>

                        <p className="text-gray-600 leading-7 mt-4">
                            {product.description}
                        </p>

                        {/* Price */}
                        <div className="mt-6">
                            <span className="text-3xl font-bold text-blue-600">
                                ৳{product.price}
                            </span>
                        </div>

                        {/* Stock Status */}
                        <div className="mt-4">
                            {product.stock > 0 ? (
                                <span className="text-green-600 font-medium">
                                    ● In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="text-red-600 font-medium">
                                    ● Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mt-6">
                            <span className="font-medium text-gray-700">
                                Quantity:
                            </span>

                            <div className="flex items-center border rounded-lg">
                                <button
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    className="px-4 py-2 hover:bg-gray-100"
                                >
                                    -
                                </button>

                                <span className="px-4 py-2 font-medium">
                                    {quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        setQuantity(
                                            Math.min(product.stock, quantity + 1)
                                        )
                                    }
                                    disabled={quantity >= product.stock}
                                    className="px-4 py-2 hover:bg-gray-100 disabled:opacity-40"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">

                            <button
                                onClick={() => addToCart(product)}
                                disabled={product.stock <= 0}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>

                            <button
                                // onClick={}
                                disabled={product.stock <= 0}
                                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <Zap size={20} />
                                Buy Now
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductDetails