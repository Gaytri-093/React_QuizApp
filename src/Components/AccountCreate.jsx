import React, { useState } from "react";
import Login from "./Login"; // Import the Login component

const AccountCreate = ({ onAccountCreated }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  const handleCreateAccount = () => {
    if (!fullName || !email || !phone || !password) {
      setError("All fields are required.");
      return;
    }

    // Save user credentials to localStorage
    localStorage.setItem(
      "userAccount",
      JSON.stringify({ fullName, email, phone, password })
    );
    alert("Account Created Successfully! Please Log In.");
    
    setAccountCreated(true);
    // Optionally, call the parent function to pass user data:
    if (onAccountCreated) {
      onAccountCreated({ fullName, email, phone });
    }
  };

  // Once the account is created, show the Login component.
  if (accountCreated) {
    return <Login />;
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Create Account</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <div className="mb-4 text-left">
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          placeholder="Enter Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white"
        />
      </div>
      <div className="mb-4 text-left">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white"
        />
      </div>
      <div className="mb-4 text-left">
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white"
        />
      </div>
      <div className="mb-4 text-left">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white"
        />
      </div>
      <button
        onClick={handleCreateAccount}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create Account
      </button>
    </div>
  );
};

export default AccountCreate;
