import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/loginpage.css";
import "../App.css";

function Loginpage({ updatestate }) {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    console.log(formData);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        updatestate(true);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <h1 className="title">Sign in</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="input-field"
            name="username"
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            name="password"
          />
          <button type="submit" className="login-button">
            Sign in
          </button>
        </form>
        {/* Other elements */}
        <div className="separator"></div>
        <a href="/signup" className="create-account">
          Create a new account
        </a>
      </div>
    </div>
  );
}

export default memo(Loginpage);
