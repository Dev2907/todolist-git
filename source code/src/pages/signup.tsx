import React, { memo } from "react";
import "../CSS/signuppage.css";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Signuppage() {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    console.log(formData);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="signup-container">
        <h1 className="title">Sign up for an account</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="UserName"
            className="input-field"
            name="username"
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            name="email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            name="password"
            required
          />
          <div className="profile-upload">
            <label htmlFor="profile-picture" className="profile-label">
              Profile Picture:
            </label>
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              className="profile-input"
              name="profilepic"
              required
            />
          </div>
          <button type="submit" className="signup-button">
            Sign up
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default memo(Signuppage);
