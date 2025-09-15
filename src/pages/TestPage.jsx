import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullscreenImg, setFullscreenImg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const timerDoc = await getDoc(doc(db, "settings", "timer"));
      const timerData = timerDoc.exists() ? timerDoc.data().timer : null;

      const questionSnapshot = await getDocs(collection(db, "questions"));
      const questionList = questionSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.questionNumber - b.questionNumber);

      setQuestions(questionList);
      setTimer(timerData);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (timer === null) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          alert("⏰ Test time is over! Submitting...");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [current]: option });
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleSubmit = () => {
    localStorage.setItem("testAnswers", JSON.stringify(answers));
    localStorage.setItem("testQuestions", JSON.stringify(questions));
    navigate("/result");
  };

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}h : ${m
      .toString()
      .padStart(2, "0")}m : ${s.toString().padStart(2, "0")}s`;
  };

  if (loading) return <div className="text-center mt-10">⏳ Loading test...</div>;
  if (questions.length === 0) return <div className="text-center mt-10">No questions found!</div>;

  const q = questions[current];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start p-4 bg-gray-100">
      {/* Top Header */}
      <div className="w-full max-w-5xl flex justify-between items-center bg-white shadow px-6 py-4 mb-4 border-b border-gray-200">
        <h2 className="font-bold text-xl text-gray-700">
          Question {current + 1} / {questions.length}
        </h2>
        <div className="text-lg font-bold text-red-600">
          ⏳ {formatTime(timer)}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 bg-white w-full max-w-5xl p-6 shadow-lg border border-gray-200">
        {/* Question Image */}
        <div className="mb-6">
          <img
            src={q.imageUrl}
            alt={`Question ${current + 1}`}
            className="w-full max-h-[400px] object-cover border border-gray-300 cursor-pointer"
            onClick={() => setFullscreenImg(q.imageUrl)}
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {["A", "B", "C", "D"].map((opt) => (
            <label
              key={opt}
              className={`p-4 border text-lg font-medium cursor-pointer transition ${
                answers[current] === opt
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name={`q${current}`}
                value={opt}
                checked={answers[current] === opt}
                onChange={() => handleOptionSelect(opt)}
                className="hidden"
              />
              {opt}
            </label>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={handlePrevious}
            className="bg-gray-500 text-white px-6 py-3 font-semibold hover:bg-gray-600 transition disabled:opacity-50"
            disabled={current === 0}
          >
            ⬅ Previous
          </button>

          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700 transition"
          >
            {current === questions.length - 1 ? "✅ Submit" : "Next ➡"}
          </button>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
          onClick={() => setFullscreenImg(null)}
        >
          <img
            src={fullscreenImg}
            alt="Full View"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default TestPage;
