import React, { memo, useState } from "react";
import "../CSS/addtask.css";
import "../App.css";
import { useNavigate } from "react-router-dom";

function AddTask() {
  const plus = require("../Images/sidebar-plus.png");
  const [inputvalue, setinputvalue] = useState("");
  const navigate = useNavigate();
  const handleinputtask = (event) => {
    if (event.key === "Enter") {
      fetch("/api/addtask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: inputvalue }),
      });
      setinputvalue("");
      navigate("/dashboard/tasks");
    }
  };
  const onChange = (event) => {
    setinputvalue(event.target.value);
  };
  return (
    <div className="addtask">
      <div className="addtaskflexContainer">
        <div>
          <img src={plus} alt="addtask" />
        </div>
        <div className="addtask-input">
          <input
            placeholder="Add Task"
            value={inputvalue}
            onKeyDown={handleinputtask}
            onChange={onChange}
          ></input>
        </div>
      </div>
    </div>
  );
}

export default memo(AddTask);
