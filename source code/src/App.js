import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loginpage from "./pages/login.tsx";
import Signuppage from "./pages/signup.tsx";
import Dashboard from "./pages/dashboard.tsx";
import { useEffect, useState } from "react";

function App() {
  const [loggedIn, setloggedin] = useState(false);

  const verifySession = async () => {
    try {
      const response = await fetch("api/verifyuser");
      if (response.ok) {
        setloggedin(true);
      } else {
        setloggedin(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    verifySession();
  }, []);
  return (
    <div className="todoBody">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? <Dashboard /> : <Loginpage updatestate={setloggedin} />
            }
          ></Route>
          <Route path="/signup" element={<Signuppage />}></Route>
          <Route
            path="/dashboard/*"
            element={
              loggedIn ? (
                <Dashboard state={loggedIn} updatestate={setloggedin} />
              ) : (
                <Loginpage updatestate={setloggedin} />
              )
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
