import React, { useState } from "react";  
import { useNavigate } from "react-router-dom";  
import { collection, addDoc } from "firebase/firestore";  
import { db } from "../firebase";  
  
const LoginPage = () => {  
  const [name, setName] = useState("");  
  const [batch, setBatch] = useState("");  
  const [phone, setPhone] = useState("");  
  const navigate = useNavigate();  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
  
    if (!name || !batch || !phone) {  
      alert("Please fill all fields");  
      return;  
    }  
  
    try {  
      await addDoc(collection(db, "users"), {  
        name,  
        batch,  
        phone,  
        createdAt: new Date(),  
      });  
  
      localStorage.setItem("testUser", JSON.stringify({ name, batch, phone }));  
      navigate("/disclaimer");  
    } catch (error) {  
      console.error("Error adding user:", error);  
    }  
  };  
  
  return (  
    <div  
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-between px-4 pt-10 pb-6"  
      style={{  
        backgroundImage: `url('/bg-login.jpg')`, // 🔁 Replace with your background image path  
      }}  
    >  
      {/* Dark Overlay (optional for better readability) */}  
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>  
  
      {/* Content */}  
      <div className="relative z-10">  
        {/* Heading */}  
        <h1 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-md">  
          📝 Start Your Test  
        </h1>  
  
        {/* Form */}  
        <form  
          onSubmit={handleSubmit}  
          className="w-full max-w-md mx-auto flex flex-col gap-4"  
        >  
          <input  
            type="text"  
            placeholder="Name"  
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white bg-opacity-90"  
            value={name}  
            onChange={(e) => setName(e.target.value)}  
          />  
  
          <input  
            type="text"  
            placeholder="Batch Time"  
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white bg-opacity-90"  
            value={batch}  
            onChange={(e) => setBatch(e.target.value)}  
          />  
  
          <input  
            type="tel"  
            placeholder="Phone Number"  
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white bg-opacity-90"  
            value={phone}  
            onChange={(e) => setPhone(e.target.value)}  
          />  
  
          <button  
            type="submit"  
            className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"  
          >  
            Continue  
          </button>  
        </form>  
  
        {/* Image Frame Section */}  
        <div className="mt-10 overflow-x-auto flex gap-4 px-2">  
          {[  
            "/WhatsApp Image 2025-03-23 at 11.39.11_3681570b.jpg",  
            "/WhatsApp Image 2025-03-23 at 11.41.08_7ef05505.jpg",  
            "/WhatsApp Image 2025-03-25 at 11.25.24_38bc41ba.jpg",  
            "/WhatsApp Image 2025-03-25 at 11.34.10_1066775c.jpg",  
            "/WhatsApp Image 2025-03-25 at 11.38.51_62809e97.jpg",  
            "/WhatsApp Image 2025-04-13 at 11.15.57_800d728b.jpg",  
            "/WhatsApp Image 2025-03-30 at 11.50.12_fa1d50d2.jpg",  
          ].map((src, i) => (  
            <img  
              key={i}  
              src={src}  
              alt={`Slide ${i + 1}`}  
              className="w-48 h-32 object-cover rounded-xl border flex-shrink-0"  
            />  
          ))}  
        </div>  
      </div>  
    </div>  
  );  
};  
  
export default LoginPage;  
