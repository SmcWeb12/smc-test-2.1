// src/components/Timer.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Timer = ({ onTimeOut }) => {
  const [secondsLeft, setSecondsLeft] = useState(null);

  useEffect(() => {
    const fetchTimer = async () => {
      const timerDoc = await getDoc(doc(db, "settings", "timer"));
      if (timerDoc.exists()) {
        const sec = parseInt(timerDoc.data().timer) * 60; // minutes to seconds
        setSecondsLeft(sec);
      }
    };

    fetchTimer();
  }, []);

  useEffect(() => {
    if (secondsLeft === null) return;

    if (secondsLeft === 0) {
      onTimeOut(); // Call when time is up
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onTimeOut]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (secondsLeft === null) return <div>⏳ Loading Timer...</div>;

  return (
    <div className="text-xl font-bold text-center text-red-600">
      ⏱ Time Left: {formatTime(secondsLeft)}
    </div>
  );
};

export default Timer;
