import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DisclaimerPage from "./pages/DisclaimerPage"; // banaenge next
import TestPage from "./pages/TestPage"; // banaenge baad me
import ResultPage from "./pages/ResultPage"; // banaenge baad me

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/result" element={<ResultPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
