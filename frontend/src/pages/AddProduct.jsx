import { useState, useEffect } from "react";
const AddProduct = () => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [catagory, setCatagory] = useState([]);
  const [loadSubmit, setLoadSubmit] = useState(false);

  //take cause: after form submit reset
  const initialFormState = {
    name: "",
    catagory: "",
    image: null,
    description: "",
    price: "",
    stock: 1,
    available: true,
  }
  const [formData, setFormData] = useState(initialFormState);

  //take cause: disable submit button until all input are not filled
  const isFormValid = formData.name.trim() !=="" && formData.catagory.trim() !=="" && formData.price!=="" && Number(formData.price) > 0 && formData.stock !==""  && Number(formData.stock) > 0;


  useEffect(() => {
    const getCatagory = async () => {
      const res = await fetch(`${BASEURL}/catagory/`);
      const data = await res.json();
      setCatagory(data);
    };
    getCatagory();
  }, [BASEURL]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData({...formData,[name]: type === "file" ? files[0]:type === "checkbox" ? checked : value,})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loadSubmit) {
      return;
    }
    setLoadSubmit(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("catagory", formData.catagory);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("available", formData.available);
    if(formData.image){
      data.append("image", formData.image);
    }

    try{
      const res = await fetch(`${BASEURL}/product/`, {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    console.log(result);

    if(res.ok){
      alert("Product Added Successfully");
      //take cause: reset form value
      setFormData(initialFormState);
      //take cause: reset form files
      e.target.reset();
    }

    }catch(error){
      console.log(error);
    }finally{
      //finally block always run whether error or not
      setLoadSubmit(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block mb-1 font-medium">Product Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category</label>

          <select
            name="catagory"
            value={formData.catagory}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg"
          >
            <option value="">Select Category</option>

            {catagory.map((catagory)=>{
                return <option key={catagory.id} value={catagory.id}>{catagory.name}</option>
            })}
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1 font-medium">Product Image</label>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price</label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block mb-1 font-medium">Stock</label>

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* Available */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
          />

          <label>Available</label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loadSubmit || !isFormValid }
          className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loadSubmit ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};
export default AddProduct;
