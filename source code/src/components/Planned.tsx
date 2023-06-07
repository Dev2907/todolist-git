/* For page Planned task*/
/*contains
earlier ,today ,later
*/
import React, { memo, useState } from "react";
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

interface planedProp {
  today: taskprop[];
  tomorrow: taskprop[];
  previous: taskprop[];
  setinfobar: Function;
}

function Planned({ today, tomorrow, previous, setinfobar }: planedProp) {
  const plannedIcon = require("../Images/sidebar-box.png");
  const threedots = require("../Images/infobar-threedots.png");
  const [optionmenu, openoptionmenu] = useState(false);

  return (
    <div className="alltask">
      <div className="alltask-heading">
        <div>
          <img src={plannedIcon} alt="planned"></img>
          <div>Important</div>
        </div>
        <div>
          <div>
            <img
              src={threedots}
              alt="options"
              onClick={() => {
                optionmenu ? openoptionmenu(false) : openoptionmenu(true);
              }}
            ></img>
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="alltask-parts">
        <div className="alltask-parts-head">Today {today.length}</div>
        <div>
          {today.map((obj, index) => (
            <>
              <div
                onClick={() => {
                  setinfobar(obj._id);
                }}
              >
                <Task {...obj} setinfobar={setinfobar} />
              </div>
              <br />
            </>
          ))}
        </div>
      </div>
      <br />
      <br />
      <div className="alltask-parts">
        <div className="alltask-parts-head">Later {tomorrow.length}</div>
        <div>
          {tomorrow.map((obj, index) => (
            <>
              <div
                onClick={() => {
                  setinfobar(obj._id);
                }}
              >
                <Task {...obj} setinfobar={setinfobar} />
              </div>
              <br />
            </>
          ))}
        </div>
      </div>
      <br />
      <br />
      <div className="alltask-parts">
        <div className="alltask-parts-head">Earlier {previous.length}</div>
        <div>
          {previous.map((obj, index) => (
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

export default memo(Planned);
