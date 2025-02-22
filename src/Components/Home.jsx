import React from "react";

const Home = ({ onStartQuiz }) => {
  return (
    <div className="text-center p-6">
      <h2 className="text-2xl font-semibold">Quiz Instructions</h2>
      <ul className="text-left mt-4 space-y-2">
        <li>1. For multiple-choice questions, select the one best answer (A, B, C, or D).</li>
        <li>2. For integer-type questions, write your numerical answer clearly.</li>
        <li>3. No calculators unless specified.</li>
        <li>4. You have 30 minutes to complete this quiz.</li>
      </ul>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
        onClick={onStartQuiz}
      >
        Start Quiz
      </button>
    </div>
  );
};

export default Home;
