import { useState,useEffect } from "react";
import ProductCard from "../components/ProductCard";


const ProductList =()=>{
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const BASEURL=import.meta.env.VITE_DJANGO_BASE_URL

    useEffect(() => {
        const getProducts =async()=>{
            try {
                const res = await fetch(`${BASEURL}/product/`); 
                const data = await res.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        getProducts();
    },[])
    return(
        <div className="grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4
    gap-5
    p-4
    md:p-6">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error.message}</p>
            ) : (
                    products.map((product) => (
                    <div key={product.id}>
                        <ProductCard product={product} />
                    </div>
                )) 
            )}

        </div>
    );
}
export default ProductList
