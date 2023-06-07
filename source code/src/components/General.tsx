/*for Pages : 
lists, myday, alltasks, important
*/
/*contains:
not completed, completed
*/

/* For page Planned task*/
/*contains
earlier ,today ,later
*/
import React, { memo, useState } from "react";
import "../CSS/alltasks.css";
import "../App.css";
import Task from "../components/task.tsx";
import { useLocation, useNavigate } from "react-router-dom";

interface taskprop {
  name: String;
  dueDate: Date;
  important: boolean;
  repeat: boolean;
  completed: boolean;
  _id: String;
}

interface GeneralProp {
  incomplete: taskprop[];
  completed: taskprop[];
  setinfobar: Function;
}

function General({ incomplete, completed, setinfobar }: GeneralProp) {
  const plannedIcon = require("../Images/sidebar-box.png");
  const threedots = require("../Images/infobar-threedots.png");
  const [optionmenu, openoptionmenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const idmatch = location.pathname.match(/\/dashboard\/lists\/([^/]+)/);
  const id = idmatch ? idmatch[1] : null;

  return (
    <div className="alltask">
      <div className="alltask-heading">
        <div>
          <img src={plannedIcon} alt="planned"></img>
          <div>Tasks</div>
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
          <div className={`alltaskmenu ${optionmenu ? "optionMenu" : ""}`}>
            {id !== null ? (
              <div>
                <div>
                  <div>Change Name</div>
                  <div
                    onClick={() => {
                      fetch("/api/deletelist", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id: id }),
                      });
                      navigate("/dashboard/myday");
                    }}
                  >
                    Delete List
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="alltask-parts">
        <div>
          {incomplete.map((obj, index) => (
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
      <br />
      <br />
      <div className="alltask-parts">
        <div className="alltask-parts-head">Completed</div>
        <div>
          {completed.map((obj, index) => (
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

export default memo(General);
