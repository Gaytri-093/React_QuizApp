import React, { useState } from "react";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    const storedUser = JSON.parse(localStorage.getItem("userAccount"));

    if (!storedUser) {
      setError("No account found. Please create an account first.");
      return;
    }

    if (email === storedUser.email && password === storedUser.password) {
      alert("Login Successful!");
      onLoginSuccess({ name: email, email }); // Using email as the user's name for simplicity
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <div className="mb-4 text-left">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className="w-full p-3 rounded bg-gray-700 text-white"
        />
      </div>
      <div className="mb-4 text-left">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          className="w-full p-3 rounded bg-gray-700 text-white"
        />
      </div>
      <button
        onClick={handleLogin}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
    </div>
  );
};

// Ensure onLoginSuccess is always a function to prevent errors.
Login.defaultProps = {
  onLoginSuccess: () => {}
};

export default Login;
