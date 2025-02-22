import React, { useState } from "react";
import AccountCreate from "./Components/AccountCreate";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Quiz from "./Components/Quiz";
import Results from "./Components/Results";

const App = () => {
  // Phases: "account" → "login" → "home" → "quiz" → "results"
  const [phase, setPhase] = useState("account");
  const [user, setUser] = useState(null);
  const [quizData, setQuizData] = useState({ score: 0, wrongAnswers: 0, timeTaken: 0 });

  // Called when account is created successfully.
  const handleAccountCreated = (userData) => {
    setUser(userData);
    setPhase("login");
  };

  // Called when login is successful.
  // Change phase to "home" so the Home (instructions) page is shown.
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPhase("home");
  };

  // Called when "Start Quiz" is clicked on the Home page.
  const handleStartQuiz = () => {
    setPhase("quiz");
  };

  // Called when the quiz is complete. It receives final quiz results.
  const handleQuizComplete = (results) => {
    setQuizData(results);
    setPhase("results");
  };

  const handleRestart = () => {
    setPhase("quiz");
  };

  const handleGoHome = () => {
    setPhase("home");
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center text-white p-6">
      <div className="w-full max-w-lg p-6 rounded-2xl shadow-xl bg-gray-800">
        {phase === "account" && (
          <AccountCreate onAccountCreated={handleAccountCreated} />
        )}
        {phase === "login" && <Login onLoginSuccess={handleLoginSuccess} />}
        {phase === "home" && <Home onStartQuiz={handleStartQuiz} />}
        {phase === "quiz" && <Quiz user={user} onQuizComplete={handleQuizComplete} />}
        {phase === "results" && (
          <Results
            user={user}
            score={quizData.score}
            wrongAnswers={quizData.wrongAnswers}
            timeTaken={quizData.timeTaken}
            onRestart={handleRestart}
            onGoHome={handleGoHome}
          />
        )}
      </div>
    </div>
  );
};

export default App;
