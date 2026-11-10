import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Contexts/CartContext";
import { authFetch } from "../utils/auth";

const Checkout = () => {
  const { cartItem,fetchCart } = useCart();

  const navigate = useNavigate();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    payment_method: "cod",
  });
  const isFromValid =
    formData.phone.trim() !== "" &&
    formData.address.trim() !== "" &&
    formData.payment_method.trim() !== "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate total amount
  const totalAmount = cartItem.reduce(
    (total, item) => total + Number(item.product_price) * item.quantity,
    0,
  );

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Place order
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItem.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await authFetch(`${BASEURL}/create-order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order!");
      }

      await fetchCart();

      alert("Your order has been placed successfully!");

      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>

          <p className="text-gray-500 mt-2">
            Complete your information to place your order.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Customer Information
                </h2>

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Phone and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="01XXXXXXXXX"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@gmail.com"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address *
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your full delivery address"
                      rows="4"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-5">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {[
                    { value: "cod", label: "Cash on Delivery" },
                    { value: "bkash", label: "bKash" },
                    { value: "nagad", label: "Nagad" },
                    { value: "card", label: "Credit / Debit Card" },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition ${
                        formData.payment_method === method.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.value}
                        checked={formData.payment_method === method.value}
                        onChange={handleChange}
                        className="accent-blue-600"
                      />

                      <span className="font-medium text-gray-700">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>

                {formData.payment_method === "cod" && (
                  <p className="text-sm text-gray-500 mt-4">
                    Pay with cash when your order is delivered.
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-5">
                  Order Summary
                </h2>

                {/* Products */}
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {cartItem.map((item) => {
                    const imageUrl = item.product_image
                      ? item.product_image.startsWith("http")
                        ? item.product_image
                        : `http://127.0.0.1:8000${item.product_image}`
                      : null;

                    return (
                      <div key={item.id} className="flex gap-3">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.product_name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 truncate">
                            {item.product_name}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Qty: {item.quantity}
                          </p>

                          <p className="text-sm font-semibold text-gray-800 mt-1">
                            ৳
                            {(
                              Number(item.product_price) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {cartItem.length === 0 && (
                    <p className="text-gray-500 text-sm">Your cart is empty.</p>
                  )}
                </div>

                <div className="border-t border-gray-200 my-5" />

                {/* Total */}
                <div className="flex justify-between text-gray-600 mb-3">
                  <span>Subtotal</span>
                  <span>৳{totalAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600 mb-4">
                  <span>Delivery Charge</span>
                  <span>৳0.00</span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Total</span>

                  <span className="text-xl font-bold text-blue-600">
                    ৳{totalAmount.toFixed(2)}
                  </span>
                </div>

                {/* Error */}
                {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || cartItem.length === 0 || !isFromValid}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-6 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>

                <p className="text-xs text-gray-400 text-center mt-4">
                  Your order information will be processed securely.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
