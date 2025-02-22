import React, { useEffect, useState } from "react";
import Results from "./Results.jsx"; // Ensure correct import path

const Quiz = ({ user, onQuizComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  // Overall quiz timer: 30 minutes = 1800 seconds
  const [timeLeft, setTimeLeft] = useState(1800);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const quizQuestions = [
    // Multiple-Choice Questions (Type: "mcq")
    { 
      question: "Which planet is closest to the Sun?", 
      options: ["A. Venus", "B. Mercury", "C. Earth", "D. Mars"], 
      correct: "B. Mercury",
      type: "mcq"
    },
    { 
      question: "Which data structure organizes items in a First-In, First-Out (FIFO) manner?", 
      options: ["A. Stack", "B. Queue", "C. Tree", "D. Graph"], 
      correct: "B. Queue",
      type: "mcq"
    },
    { 
      question: "Which of the following is primarily used for structuring web pages?", 
      options: ["A. Python", "B. Java", "C. HTML", "D. C++"], 
      correct: "C. HTML",
      type: "mcq"
    },
    { 
      question: "What is the chemical symbol for Gold?", 
      options: ["A. Go", "B. Au", "C. Ag", "D. Gd"], 
      correct: "B. Au",
      type: "mcq"
    },
    { 
      question: "Which of these processes is not typically involved in refining petroleum?", 
      options: ["A. Fractional distillation", "B. Cracking", "C. Polymerization", "D. Filtration"], 
      correct: "D. Filtration",
      type: "mcq"
    },
    // Integer-Type Questions (Type: "integer")
    { question: "What is the value of 12 + 28?", correct: "40", type: "integer" },
    { question: "How many states are there in the United States?", correct: "50", type: "integer" },
    { question: "In which year was the Declaration of Independence signed?", correct: "1776", type: "integer" },
    { question: "What is the value of pi rounded to the nearest integer?", correct: "3", type: "integer" },
    { question: "If a car travels at 60 mph for 2 hours, how many miles does it travel?", correct: "120", type: "integer" },
  ];

  // Format the overall timer as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNext();
    }
  }, [timeLeft, quizCompleted]);

  const checkAnswer = (userAnswer) => {
    const correct = quizQuestions[currentQuestion].correct;
    if (userAnswer.trim() === correct.trim()) {
      setScore(score + 1);
      setFeedback("Correct! ✅ This is the right answer.");
    } else {
      setWrongAnswers(wrongAnswers + 1);
      setFeedback(`Wrong ❌ The correct answer is: ${correct}`);
    }
  };

  const handleAnswerMCQ = (selectedOption) => {
    setSelectedAnswer(selectedOption);
    checkAnswer(selectedOption);
  };

  const handleSubmitInteger = () => {
    checkAnswer(inputAnswer);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setInputAnswer("");
    setFeedback("");
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      // Do not reset the overall timer (timeLeft)
    } else {
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      onQuizComplete({ score, wrongAnswers, timeTaken });
      setQuizCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return !quizCompleted ? (
    <div className="text-center">
      <h2 className="text-2xl font-semibold">Welcome, {user?.name}!</h2>
      <h2 className="text-xl font-semibold mt-4">{quizQuestions[currentQuestion].question}</h2>
      
      {quizQuestions[currentQuestion].type === "mcq" ? (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {quizQuestions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                selectedAnswer === option ? "bg-gray-400" : ""
              }`}
              onClick={() => handleAnswerMCQ(option)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter your answer"
            value={inputAnswer}
            onChange={(e) => setInputAnswer(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleSubmitInteger}
            disabled={!inputAnswer}
          >
            Submit Answer
          </button>
        </div>
      )}
      
      {feedback && <p className="text-lg mt-4 font-bold">{feedback}</p>}
      <p className="text-yellow-400 mt-4">Time Left: {formatTime(timeLeft)}</p>
      
      <div className="flex justify-between mt-6">
        <button
          className={`bg-gray-500 text-white font-bold py-2 px-4 rounded ${
            currentQuestion === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
          }`}
          onClick={handleBack}
          disabled={currentQuestion === 0}
        >
          Back
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleNext}
          disabled={
            (quizQuestions[currentQuestion].type === "mcq" && selectedAnswer === null) ||
            (quizQuestions[currentQuestion].type === "integer" && !inputAnswer)
          }
        >
          Next
        </button>
      </div>
      <p className="mt-4">
        Question {currentQuestion + 1} of {quizQuestions.length}
      </p>
    </div>
  ) : null;
};

export default Quiz;
