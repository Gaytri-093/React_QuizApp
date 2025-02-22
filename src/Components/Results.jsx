// import React, { useEffect, useState } from "react";

// const Results = ({ user, score, wrongAnswers, timeTaken, onRestart, onGoHome }) => {
//   const [attempts, setAttempts] = useState([]);

//   useEffect(() => {
//     if (!user?.email) return;

//     const storedAttempts = JSON.parse(localStorage.getItem("quizAttempts")) || [];
//     // Prevent storing more than 3 attempts
//     if (storedAttempts.length >= 3) {
//       setAttempts(storedAttempts);
//       return;
//     }
    
//     const newAttempt = { 
//       user: user?.name, 
//       score, 
//       wrongAnswers, 
//       timeTaken, 
//       date: new Date().toLocaleString() 
//     };
//     const updatedAttempts = [...storedAttempts, newAttempt];
//     localStorage.setItem("quizAttempts", JSON.stringify(updatedAttempts));
//     setAttempts(updatedAttempts);
//   }, [score, wrongAnswers, timeTaken, user]);

//   const removeAttempt = (index) => {
//     const updatedAttempts = attempts.filter((_, i) => i !== index);
//     localStorage.setItem("quizAttempts", JSON.stringify(updatedAttempts));
//     setAttempts(updatedAttempts);
//   };

//   const clearHistory = () => {
//     localStorage.removeItem("quizAttempts");
//     setAttempts([]);
//   };

//   return (
//     <div className="text-center">
//       <h2 className="text-2xl font-semibold">Quiz Completed!</h2>
//       <h3 className="text-lg font-semibold mt-4">User: {user?.name}</h3>
      
//       <p className="text-green-400 mt-4 text-lg">Correct Answers: {score}</p>
//       <p className="text-red-400 text-lg">Incorrect Answers: {wrongAnswers}</p>
//       <p className="text-yellow-400 text-lg">Total Time Taken: {timeTaken} seconds</p>

//       <div className="mt-6">
//         <h3 className="text-xl font-semibold">Attempt History</h3>
//         <ul className="mt-2 text-left">
//           {attempts.length > 0 ? (
//             attempts.map((attempt, index) => (
//               <li key={index} className="border p-2 mb-2 rounded bg-gray-700 text-white">
//                 <p><strong>Date:</strong> {attempt.date}</p>
//                 <p><strong>Score:</strong> {attempt.score} / {attempt.score + attempt.wrongAnswers}</p>
//                 <p><strong>Time Taken:</strong> {attempt.timeTaken} sec</p>
//                 <button
//                   className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2"
//                   onClick={() => removeAttempt(index)}
//                 >
//                   Remove
//                 </button>
//               </li>
//             ))
//           ) : (
//             <p className="text-gray-400">No attempt history found.</p>
//           )}
//         </ul>
//         {attempts.length > 0 && (
//           <button
//             className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded mt-4"
//             onClick={clearHistory}
//           >
//             Clear All History
//           </button>
//         )}
//       </div>

//       {attempts.length < 3 ? (
//         <button
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
//           onClick={onRestart}
//         >
//           Restart Quiz
//         </button>
//       ) : (
//         <p className="text-red-500 mt-4 font-bold">Maximum of 3 attempts reached. No more retries allowed.</p>
//       )}

//       <button
//         className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6 ml-4"
//         onClick={onGoHome}
//       >
//         Go To Home
//       </button>
//     </div>
//   );
// };

// export default Results;

import React, { useEffect, useState } from "react";
import { openDB } from "idb";

const Results = ({ user, score, wrongAnswers, timeTaken, onRestart, onGoHome }) => {
  const [attempts, setAttempts] = useState([]);

  // Save the attempt in IndexedDB and load all attempts.
  useEffect(() => {
    if (!user?.email) return;

    const saveAndLoadAttempts = async () => {
      // Open (or create) the IndexedDB database "QuizDB" with version 1.
      const db = await openDB("QuizDB", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("attempts")) {
            db.createObjectStore("attempts", { keyPath: "timestamp" });
          }
        },
      });
      
      // Create new attempt record with a timestamp.
      const newAttempt = {
        user: user?.name,
        score,
        wrongAnswers,
        timeTaken,
        date: new Date().toLocaleString(),
        timestamp: Date.now(),
      };

      // Prevent storing more than 3 attempts.
      const allAttempts = await db.getAll("attempts");
      if (allAttempts.length < 3) {
        await db.add("attempts", newAttempt);
      }
      const updatedAttempts = await db.getAll("attempts");
      setAttempts(updatedAttempts);
    };

    saveAndLoadAttempts();
  }, [score, wrongAnswers, timeTaken, user]);

  // Remove a specific attempt from IndexedDB.
  const removeAttempt = async (timestamp) => {
    const db = await openDB("QuizDB", 1);
    await db.delete("attempts", timestamp);
    const updatedAttempts = await db.getAll("attempts");
    setAttempts(updatedAttempts);
  };

  // Clear all attempt history from IndexedDB.
  const clearHistory = async () => {
    const db = await openDB("QuizDB", 1);
    const tx = db.transaction("attempts", "readwrite");
    await tx.objectStore("attempts").clear();
    await tx.done;
    setAttempts([]);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold">Quiz Completed!</h2>
      <h3 className="text-lg font-semibold mt-4">User: {user?.name}</h3>
      
      <p className="text-green-400 mt-4 text-lg">Correct Answers: {score}</p>
      <p className="text-red-400 text-lg">Incorrect Answers: {wrongAnswers}</p>
      <p className="text-yellow-400 text-lg">Total Time Taken: {timeTaken} seconds</p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Attempt History</h3>
        <ul className="mt-2 text-left">
          {attempts.length > 0 ? (
            attempts.map((attempt) => (
              <li key={attempt.timestamp} className="border p-2 mb-2 rounded bg-gray-700 text-white">
                <p><strong>Date:</strong> {attempt.date}</p>
                <p>
                  <strong>Score:</strong> {attempt.score} /{" "}
                  {attempt.score + attempt.wrongAnswers}
                </p>
                <p><strong>Time Taken:</strong> {attempt.timeTaken} sec</p>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2"
                  onClick={() => removeAttempt(attempt.timestamp)}
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No attempt history found.</p>
          )}
        </ul>
        {attempts.length > 0 && (
          <button
            className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={clearHistory}
          >
            Clear All History
          </button>
        )}
      </div>

      {attempts.length < 3 ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
          onClick={onRestart}
        >
          Restart Quiz
        </button>
      ) : (
        <p className="text-red-500 mt-4 font-bold">
          Maximum of 3 attempts reached. No more retries allowed.
        </p>
      )}

      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6 ml-4"
        onClick={onGoHome}
      >
        Go To Home
      </button>
    </div>
  );
};

export default Results;
