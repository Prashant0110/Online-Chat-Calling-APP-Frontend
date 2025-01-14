import React from "react";
import LoginForm from "../components/forms/LoginForm"; // Import LoginForm

const LoginPage = () => {
  return (
    <div className="login-page">
      <h2>Login to Your Account</h2>
      <LoginForm /> {/* Using LoginForm component */}
    </div>
  );
};

export default LoginPage;
