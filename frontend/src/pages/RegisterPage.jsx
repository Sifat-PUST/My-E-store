import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const initalFormState = {
        username: "",
        email: "",
        password: "",
        password2: "",
    };
    const [formData, setFormData] = useState(initalFormState);
    const isFormValid = formData.username.trim() !== "" && formData.email.trim() !== "" && formData.password.trim() !== "" && formData.password2.trim() !== "" && formData.password === formData.password2;
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();
    
    const handelChange=(e)=>{
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${BASEURL}/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to register!");
            }

            alert("Registration successful!");
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-600">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="username"
                            value={formData.name}
                            onChange={handelChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-600">Name</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handelChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">   
                        <label htmlFor="password" className="block text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handelChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password2" className="block text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            id="password2"
                            name="password2"
                            value={formData.password2}
                            onChange={handelChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className={` w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isFormValid ? "" : "opacity-50 cursor-not-allowed"}`}
                        disabled={!isFormValid}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>  
    );
};

export default RegisterPage;