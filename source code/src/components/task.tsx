import React, { memo, useEffect, useState } from "react";
import "../CSS/task.css";
import "../App.css";

interface taskProp {
  name: String;
  duedate: Date;
  important: Boolean;
  repeat: Boolean;
  completed: Boolean;
  _id: String;
}

function Task({ name, duedate, important, repeat, completed, _id }: taskProp) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Nov",
    "Dec",
  ];
  const tickimage = require("../Images/task-tick.png");
  const starimage = require("../Images/task-star.png");
  const starONimage = require("../Images/task-star-On.png");
  const repeatImage = require("../Images/task-repeat.png");
  duedate = new Date(duedate);
  const [taskcomplete, setcomplete] = useState(completed);
  const [taskimportant, setimportant] = useState(important);
  useEffect(() => {
    setcomplete(completed);
    setimportant(important);
  }, [completed, important]);
  return (
    <div className="task task-general">
      <div className="task-first-container">
        <div
          className={taskcomplete ? "tick" : "tick tickOff"}
          onClick={() => {
            fetch("/api/updatetask", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: _id,
                query: { completed: !taskcomplete },
              }),
            });
            setcomplete(!taskcomplete);
          }}
        >
          {taskcomplete ? <img src={tickimage} alt="tick" /> : ""}
        </div>
        <div>
          <div className="task-first-container-name">{name}</div>
          <div className="task-first-container-date">
            {duedate
              ? `${days[duedate.getDay()]}, ${duedate.getDate()} ${
                  months[duedate.getMonth()]
                }`
              : ""}
            {repeat ? <img src={repeatImage} alt="repeat" /> : ""}
          </div>
        </div>
      </div>
      <div
        className="task-star"
        onClick={() => {
          fetch("/api/updatetask", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: _id,
              query: { important: !taskimportant },
            }),
          });
          setimportant(!taskimportant);
        }}
      >
        <img src={taskimportant ? starONimage : starimage} alt="star" />
      </div>
    </div>
  );
}

export default memo(Task);
