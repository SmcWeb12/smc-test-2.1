
// LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const LoginPage = () => {
  const [name, setName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const images = [
    "/WhatsApp Image 2025-03-23 at 11.39.11_3681570b.jpg",
    "/WhatsApp Image 2025-03-25 at 11.25.24_38bc41ba.jpg",
    "/WhatsApp Image 2025-03-25 at 11.34.10_1066775c.jpg",
    "/WhatsApp Image 2025-03-25 at 11.38.51_62809e97.jpg",
    "/WhatsApp Image 2025-04-13 at 11.15.57_800d728b.jpg",
    "/WhatsApp Image 2025-03-30 at 11.50.12_fa1d50d2.jpg",
  ];

  // 🔄 Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Please enter your data");
      return;
    }

    try {
      await addDoc(collection(db, "users"), {
        userData: name,
        createdAt: new Date(),
      });
      localStorage.setItem("testUser", JSON.stringify({ userData: name }));
      navigate("/disclaimer");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <h1 className="text-3xl font-bold text-center mb-6">📝 Start Your Test</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              placeholder={`Your Data:\nName: Mukesh\nClass: 12th\nBatch Time: 1-2\nPhone: 0000000000`}
              className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 h-32 resize-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              Continue
            </button>
          </form>
        </div>

        {/* Image Slider Section */}
        <div className="w-full md:w-1/2 relative">
          <img
            src={images[currentIndex]}
            alt="Slider"
            className="w-full h-full object-cover"
          />
          {/* Dots Indicator */}
          <div className="absolute bottom-4 w-full flex justify-center gap-2">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === currentIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


