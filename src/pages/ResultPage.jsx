import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js"; // Import the html2pdf.js library

const ResultPage = () => {
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [rank, setRank] = useState(0);
  const [allScores, setAllScores] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const calculateResult = async () => {
      const answers = JSON.parse(localStorage.getItem("testAnswers") || "[]");
      const currentUser = JSON.parse(localStorage.getItem("testUser") || "{}");

      setUser(currentUser);

      if (!currentUser.name) return;

      const qSnap = await getDocs(collection(db, "questions"));
      const questions = qSnap.docs.map((doc) => doc.data());
      const total = questions.length;

      let correct = 0;
      questions.forEach((q, i) => {
        if (answers[i] === q.correctOption) correct += 1;
      });

      setScore(correct);
      setTotalQuestions(total);

      // Save result to Firebase
      await addDoc(collection(db, "studentResults"), {
        name: currentUser.name,
        score: correct,
        timestamp: serverTimestamp(),
      });

      // Get all scores
      const scoreSnap = await getDocs(collection(db, "studentResults"));
      const rawScores = scoreSnap.docs.map((doc) => doc.data());

      const uniqueScores = Array.from(
        new Map(
          rawScores.map((item) => [`${item.name}-${item.score}`, item])
        ).values()
      );

      const sortedScores = uniqueScores.sort((a, b) => b.score - a.score);
      setAllScores(sortedScores);

      const userRank =
        sortedScores.findIndex(
          (s) => s.name === currentUser.name && s.score === correct
        ) + 1;

      setRank(userRank);
    };

    calculateResult();
  }, []);

  const handleRestartTest = () => {
    localStorage.clear();
    navigate("/test");
  };

  const handleDownloadPage = () => {
    const element = document.getElementById("result-page"); // The ID of the main result page div
    const options = {
      filename: "result-page.pdf", // PDF filename
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save(); // Trigger the download as PDF
  };

  const getHighlightClass = (s, index) => {
    if (s.name === user.name && s.score === score) return "bg-yellow-100 font-bold";
    if (index === 0) return "bg-blue-100 font-bold";
    if (index === 1) return "bg-blue-50";
    if (index === 2) return "bg-blue-200";
    return "bg-white";
  };

  return (
    <div className="bg-white min-h-screen text-black px-4 sm:px-8 py-6" id="result-page">
      <div className="text-center space-y-4 mb-6">
        <h2 className="text-2xl sm:text-4xl font-bold text-green-600">
          🎉 Your Score: {score} / {totalQuestions}
        </h2>
        <p className="text-lg sm:text-xl font-semibold text-blue-600">
          🏆 Rank: {rank} / {allScores.length}
        </p>
        <p className="text-md sm:text-lg">
          👤 Name: <strong>{user.name}</strong>
        </p>
      </div>

      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold text-blue-600">
          🏅 Top 3 Scorers:
        </h3>
        <div className="space-y-2">
          {allScores.slice(0, 3).map((s, index) => (
            <p
              key={index}
              className={`${
                s.name === user.name ? "font-bold text-green-600" : ""
              }`}
            >
              {index + 1}. {s.name} - {s.score} points
            </p>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm sm:text-base text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 border">Rank</th>
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Score</th>
            </tr>
          </thead>
          <tbody>
            {allScores.map((s, index) => (
              <tr
                key={index}
                className={`${getHighlightClass(s, index)} transition-all duration-200`}
              >
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{s.name}</td>
                <td className="py-2 px-4 border">{s.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <button
          onClick={handleRestartTest}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Restart Test
        </button>
        <button
          onClick={handleDownloadPage}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Download Result Page
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
