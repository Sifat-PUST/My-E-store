import { Link } from "react-router-dom";
import { ShoppingCart,Trash2,Plus,Minus,ArrowLeft, } from "lucide-react";
import { useCart } from "../Contexts/CartContext";

const CartPage = () => {
    const { cartItem,totalPrice,removeFromCart,updateCart} = useCart();
  // Empty Cart UI
  if (cartItem.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-10 rounded-xl shadow-sm max-w-md w-full">
          <ShoppingCart size={65} className="mx-auto text-gray-300" />

          <h2 className="text-2xl font-bold text-gray-800 mt-5">
            Your Cart is Empty
          </h2>

          <p className="text-gray-500 mt-2">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>

          <p className="text-gray-500 mt-2">
            You have {cartItem.length} items in your cart.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItem.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-4 md:p-5 flex flex-col sm:flex-row gap-5"
              >
                {/* Product Image */}
                <img
                  src={`http://127.0.0.1:8000${item.product_image}`}
                  alt={item.product_name}
                  className="w-full sm:w-32 h-40 sm:h-32 object-cover rounded-lg"
                />

                {/* Product Information */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.product_name}
                    </h2>

                    <p className="text-blue-600 font-bold mt-2">
                      ৳{item.product_price}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
                    {/* Quantity Controls */}
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => updateCart(item.product, -1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="px-4 font-medium">{item.quantity}</span>

                      <button
                        onClick={() => updateCart(item.product, +1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="flex items-center gap-5">
                      <span className="font-semibold text-gray-800">
                        ৳{item.product_price * item.quantity}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.product)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mt-4"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between text-gray-600 mb-4">
                <span>Subtotal</span>
                <span>৳{totalPrice}</span>
              </div>

              <div className="flex justify-between text-gray-600 mb-4">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>

              <div className="border-t pt-4 mt-4 flex justify-between">
                <span className="font-bold text-gray-800">Total</span>

                <span className="text-xl font-bold text-blue-600">
                  ৳{totalPrice}
                </span>
              </div>

              <Link
                to="/checkout"
                className="block text-center w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
