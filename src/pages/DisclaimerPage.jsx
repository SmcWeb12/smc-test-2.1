import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const DisclaimerPage = () => {
  const navigate = useNavigate();
  const [disclaimer, setDisclaimer] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisclaimer = async () => {
      try {
        const ref = doc(db, "config", "disclaimer");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setDisclaimer(snap.data().text || "");
        } else {
          setDisclaimer("No disclaimer set by admin.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching disclaimer:", error);
        setDisclaimer("Failed to load disclaimer.");
        setLoading(false);
      }
    };

    fetchDisclaimer();
  }, []);

  const handleStart = () => {
    navigate("/test");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 via-white to-green-50 px-4 pt-8 pb-24 text-gray-800 relative">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        📘 Test Instructions
      </h1>

      {/* Disclaimer Content */}
      <div className="flex-grow overflow-y-auto max-w-3xl mx-auto text-lg leading-relaxed whitespace-pre-wrap text-justify">
        {loading ? (
          <p className="text-center text-gray-500">Loading disclaimer...</p>
        ) : (
          <div className="space-y-2">{disclaimer}</div>
        )}
      </div>

      {/* Start Button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4">
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full max-w-md bg-green-600 text-white py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default DisclaimerPage;
