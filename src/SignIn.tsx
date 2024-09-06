import React, { useState } from "react";
import "./SignIn.css";

interface SignInProps {
  onSignIn: (username: string) => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (username === "admin" && password === "123") ||
      (username === "admin2" && password === "1234")
    ) {
      onSignIn(username);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <h1>Welcome Back</h1>
        <h2>Sign in to Gas Station Management</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="remember-forgot">
            <div>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#">Forgot your password?</a>
          </div>
          <button type="submit">Sign in</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="signup-link">
          Not a member? <a href="#">Start a 14 day free trial</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
