import React, { memo } from "react";
import "../CSS/alltasks.css";
import "../App.css";
import Task from "../components/task.tsx";

interface taskprop {
  name: String;
  dueDate: Date;
  important: boolean;
  repeat: boolean;
  completed: boolean;
  _id: String;
}

interface Searchresprop {
  tasks: taskprop[];
  setinfobar: Function;
}

function Searchres({ tasks, setinfobar }: Searchresprop) {
  const plannedIcon = require("../Images/sidebar-box.png");

  return (
    <div className="alltask">
      <div className="alltask-heading">
        <div>
          <img src={plannedIcon} alt="planned"></img>
          <div>Search results:</div>
        </div>
      </div>
      <br />
      <br />
      <div className="alltask-parts">
        <div>
          {tasks.map((obj, index) => (
            <>
              <div
                onClick={() => {
                  setinfobar(obj._id);
                }}
              >
                <Task {...obj} />
              </div>
              <br />
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(Searchres);
