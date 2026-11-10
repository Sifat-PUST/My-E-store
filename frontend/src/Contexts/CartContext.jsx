import { useContext,createContext,useState,useEffect,useRef } from "react";
import { authFetch } from "../utils/auth";

const CartContext=createContext();

export const CartProvider=({children})=>{
    const [cartItem, setCartItem] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const BASEURL=import.meta.env.VITE_DJANGO_BASE_URL;
    const debounceTimers=useRef({});
    const latestQuantities=useRef({});

    const fetchCart=async()=>{
        try {
            const res=await authFetch(`${BASEURL}/cart/`);
            const data=await res.json();
            console.log("Cart API Response:", data);
            if(!res.ok){
                throw new Error("Network response was not ok");
            }
            setCartItem(data.items || []);
            setTotalPrice(data.total_price || 0);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        fetchCart();
    },[])

    const addToCart=async(product)=>{
        try{
            const res=await authFetch(`${BASEURL}/add-to-cart/`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    product_id:product.id,
                    quantity:1
                })
            })

            if(!res.ok){
                throw new Error("Network response was not ok");
            }
            await fetchCart();
        }catch(err){
            console.log(err);
        }
    }

    const removeFromCart=async(id)=>{
        try{
            const res=await authFetch(`${BASEURL}/remove-from-cart/`,{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    product_id:id
                })
            })

            if(!res.ok){
                throw new Error("Network response was not ok");
            }
        }catch(err){
            console.log(err);
        }
        await fetchCart();
    }

    // todo: we use debouncing:[reduct concurrent api calls] to use this method need to use useRef
    const updateCart=(id,change)=>{
        // ! id= item.product(from cart page)
        // todo: until time out we need to update UI as well
        const currentQuantity =
        latestQuantities.current[id] ??
        cartItem.find(item => item.product === id)?.quantity;

    if (currentQuantity === undefined) return;

    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) return;

    // Store latest quantity
    latestQuantities.current[id] = newQuantity;

    // Immediately update UI
    setCartItem(prev =>
        prev.map(item =>
            item.product === id
                ? { ...item, quantity: newQuantity }
                : item
        )
    );

        // আগের timer থাকলে cancel করবে
        clearTimeout(debounceTimers.current[id]);

         // নতুন timer তৈরি করবে
        debounceTimers.current[id]=setTimeout(async()=>{
            try{
            const res=await authFetch(`${BASEURL}/update-cart/`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    product_id:id,
                    quantity:newQuantity
                })
            })
            const data=await res.json();
            console.log("Cart API Response after Update:", data);
            if(!res.ok){
                throw new Error("Network response was not ok");
            }
            await fetchCart();
            }catch(err){
                console.log(err);
            }
        },1000);
        
    }



    return(
        <CartContext.Provider value={{cartItem,addToCart,totalPrice,removeFromCart,updateCart,fetchCart}}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart=()=>useContext(CartContext);
