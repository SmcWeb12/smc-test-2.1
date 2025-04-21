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
          alert("Test time is over! Submitting...");
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
    <div
      className="relative min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('Untitled design.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

      <div className="relative z-10 bg-white w-full max-w-2xl p-6 rounded-2xl shadow-2xl space-y-4">
        <div className="text-right text-lg font-semibold text-red-600">
          Time Left: {formatTime(timer)}
        </div>

        <div className="text-gray-700 text-sm">
          Question {current + 1} of {questions.length}
        </div>

        <img
          src={q.imageUrl}
          alt={`Question ${current + 1}`}
          className="w-full max-h-96 object-contain border rounded-xl cursor-pointer"
          onClick={() => setFullscreenImg(q.imageUrl)}
        />

        <div className="grid grid-cols-2 gap-4">
          {["A", "B", "C", "D"].map((opt) => (
            <label
              key={opt}
              className={`p-3 border rounded-xl flex items-center space-x-2 cursor-pointer ${
                answers[current] === opt ? "bg-blue-100 border-blue-500" : ""
              }`}
            >
              <input
                type="radio"
                name={`q${current}`}
                value={opt}
                checked={answers[current] === opt}
                onChange={() => handleOptionSelect(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={handlePrevious}
            className="bg-gray-400 text-white px-4 py-2 rounded-xl disabled:opacity-50"
            disabled={current === 0}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            {current === questions.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>

      {fullscreenImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setFullscreenImg(null)}
        >
          <img src={fullscreenImg} alt="Full View" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
};

export default TestPage;