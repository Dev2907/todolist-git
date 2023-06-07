import React, { memo, useEffect, useState } from "react";
import "../CSS/infobar.css";
import "../App.css";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

interface infoBarprop {
  genClass: String;
  _id: string;
  name: String;
  steps: string[];
  remindme: null | Date;
  duedate: null | Date;
  repeat: null | { freq: String; on: [String] };
  note: String;
  createdOn: null | Date;
  important: boolean;
  completed: Boolean;
  listnames: { string: string };
}

function Infobar({
  genClass,
  name,
  steps,
  remindme,
  duedate,
  repeat,
  note,
  createdOn,
  important,
  listnames,
  completed,
  _id,
}: infoBarprop) {
  const crossimg = require("../Images/rightSidebar-cross.png");
  const starON = require("../Images/task-star-On.png");
  const starOff = require("../Images/task-star.png");
  const myDaySun = require("../Images/infobar-myDaySun.png");
  const alarmimg = require("../Images/rightSidebar-alarm.png");
  const latertodayimg = require("../Images/infobar-latertoday.png");
  const tomorowimg = require("../Images/infobar-tomorow.png");
  const nextweekimg = require("../Images/infobar-nextweek.png");
  const calenderimg = require("../Images/rightsidebar-calender.png");
  const repeatimg = require("../Images/task-repeat.png");
  const deleteimg = require("../Images/infobar-delete.png");
  const threelines = require("../Images/sidebar-horizontallines.png");
  const addtolist = require("../Images/infobar-addtolist.png");
  const tickimage = require("../Images/task-tick.png");
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
  const today = new Date();
  const navigate = useNavigate();
  const location = useLocation();
  const [infobardynamicWidth, setwidth] = useState("390px");
  const [remindmemenu, setremindmemenu] = useState(false);
  const [duedateMenu, setduedatemenu] = useState(false);
  const [repeatmenu, setrepeatmenu] = useState(false);
  const [addtolistMenu, openaddtolistmenu] = useState(false);
  const [taskname, settaskname] = useState(name);
  const [taskcomplete, setcomplete] = useState(completed);
  const [taskimportant, setimportant] = useState(completed);
  const [duedatestate, setduedatestate] = useState(duedate);
  const [remindmestate, setremindmestate] = useState(remindme);
  const [notestate, setnotestate] = useState(note);
  useEffect(() => {
    settaskname(name);
    setimportant(important);
    setcomplete(completed);
    setduedatestate(duedate ? new Date(duedate) : null);
    setremindmestate(remindme ? new Date(remindme) : null);
    setnotestate(note);
  }, [name, important, completed, duedate, remindme, note]);
  const handlechange = (event) => {
    settaskname(event.target.value);
  };
  const makerequest = (queryobj) => {
    fetch("/api/updatetask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: _id,
        query: queryobj,
      }),
    });
  };
  const changetaskname = (event) => {
    if (event.key === "Enter") {
      makerequest({ name: taskname });
      navigate(`/dashboard/${page}`);
    }
  };
  createdOn = createdOn ? new Date(createdOn) : null;
  const match = location.pathname.match(/\/dashboard\/(.*)/);
  const page = match ? match[1] : null;
  return (
    <div className={genClass} style={{ width: infobardynamicWidth }}>
      <div>
        <div className="infobar-firstflex-container">
          <div className="addtolisticon">
            <img
              src={addtolist}
              alt="add to list"
              onClick={() => {
                openaddtolistmenu(!addtolistMenu);
              }}
            ></img>
            <div
              className={`addtolist ${addtolistMenu ? "addtolistmenu" : ""}`}
            >
              <>
                {Object.entries(listnames).map(([item, id]) => (
                  <>
                    <div
                      onClick={() => {
                        fetch("/api/updatelist", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ id: id, taskid: _id }),
                        });
                        openaddtolistmenu(false);
                      }}
                    >
                      {item}
                    </div>
                    <hr />
                  </>
                ))}
              </>
            </div>
          </div>
          <div className="infoBar-close">
            <div
              onClick={() => {
                infobardynamicWidth === "0px"
                  ? setwidth("390px")
                  : setwidth("0px");
              }}
            >
              <img
                src={infobardynamicWidth === "0px" ? threelines : crossimg}
                alt="cross"
              />
            </div>
          </div>
        </div>
        <div className="infoBar-heading">
          <div className="infoBar-heading-firstContainer">
            <div className="infoBar-heading-first">
              <div
                className={taskcomplete ? "tick" : "tick tickOff"}
                onClick={() => {
                  makerequest({ completed: !taskcomplete });
                  setcomplete(!taskcomplete);
                  navigate(`/dashboard/${page}`);
                }}
              >
                {taskcomplete ? <img src={tickimage} alt="tick" /> : ""}
              </div>
              <div className="infobar-taskname">
                <input
                  name="Taskname"
                  value={taskname}
                  onChange={handlechange}
                  onKeyDown={changetaskname}
                ></input>
              </div>
            </div>
            <div className="infoBar-star">
              <img
                src={taskimportant ? starON : starOff}
                alt="star"
                onClick={() => {
                  makerequest({ important: !taskimportant });
                  setimportant(!taskimportant);
                  navigate(`/dashboard/${page}`);
                }}
              />
            </div>
          </div>
          <div className="infoBar-heading-second">
            <div className="infoBar-tick infoBar-tickOff"></div>
            <div>
              <input placeholder="Add Step" />
            </div>
          </div>
        </div>
        <div className="infoBar-addMyDay">
          <div>
            <img src={myDaySun} alt="sun" />
          </div>
          <div
            onClick={() => {
              if (duedatestate !== today) {
                makerequest({ duedate: today.toISOString() });
                setduedatestate(today);
                navigate(`/dashboard/${page}`);
              }
            }}
          >
            Add to My Day
          </div>
        </div>
        <div className="infoBar-otherDetails">
          <div>
            <div className="infoBar-otherDetails-first">
              <div>
                <img src={alarmimg} alt="alarm" />
              </div>
              <div className="animation">
                <div
                  onClick={() => {
                    setremindmemenu(true);
                  }}
                >
                  <div>
                    Remind me
                    {remindmestate != null
                      ? ` at ${remindmestate.getHours()}:00`
                      : ""}
                  </div>
                  <div>
                    {remindmestate
                      ? `${
                          days[remindmestate.getDay()]
                        }, ${remindmestate.getDate()} ${
                          months[remindmestate.getMonth()]
                        } `
                      : ""}
                  </div>
                </div>
                <div className={`menu ${remindmemenu ? "remindmeMenu" : ""}`}>
                  <div
                    onClick={() => {
                      let tempdate = new Date();
                      tempdate.setHours(22, 0, 0, 0);
                      makerequest({ remindme: tempdate.toISOString() });
                      setremindmestate(tempdate);
                      setremindmemenu(false);
                    }}
                  >
                    <div>
                      <div>
                        <img src={latertodayimg} alt="latertoday" />
                      </div>
                      <div>Later Today</div>
                    </div>
                    <div>{`${days[today.getDay()]}, 22:00`}</div>
                  </div>
                  <div
                    onClick={() => {
                      let tempdate = new Date();
                      tempdate.setDate(tempdate.getDate() + 1);
                      tempdate.setHours(0, 0, 0, 0);
                      makerequest({ remindme: tempdate.toISOString() });
                      setremindmestate(tempdate);
                      setremindmemenu(false);
                    }}
                  >
                    <div>
                      <div>
                        <img src={tomorowimg} alt="tommorow" />
                      </div>
                      <div>Tomorow</div>
                    </div>
                    <div>{`${
                      days[today.getDay() + 1]
                    }, ${today.getHours()}:00`}</div>
                  </div>
                  <div
                    onClick={() => {
                      let tempdate = new Date();
                      tempdate = new Date(
                        tempdate.getTime() + 7 * 24 * 60 * 60 * 1000
                      );
                      makerequest({ remindme: tempdate.toISOString() });
                      setremindmestate(tempdate);
                      setremindmemenu(false);
                    }}
                  >
                    <div>
                      <div>
                        <img src={nextweekimg} alt="nextweek" />
                      </div>
                      <div>Next Week</div>
                    </div>
                    <div>Sun, 9:00</div>
                  </div>
                  <hr />
                  <div>
                    <div>
                      <div>
                        <img src={calenderimg} alt="calender" />
                      </div>
                      <div>Pick a date and time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="infoBar-otherDetails-second"
              onClick={() => {
                setremindmemenu(false);
              }}
            >
              <img src={crossimg} alt="cross" />
            </div>
          </div>
          <hr />
          <div>
            <div className="infoBar-otherDetails-first">
              <div>
                <img src={calenderimg} alt="calender" />
              </div>
              <div
                onClick={() => {
                  setduedatemenu(true);
                }}
              >
                {duedatestate != null
                  ? `${
                      days[duedatestate.getDay()]
                    }, ${duedatestate.getDate()} ${
                      months[duedatestate.getMonth()]
                    }`
                  : "Add a due date"}
              </div>
              <div className={`menu ${duedateMenu ? "duedateMenu" : ""}`}>
                <div
                  onClick={() => {
                    let tempdate = new Date();
                    makerequest({ duedate: tempdate.toISOString() });
                    setduedatestate(tempdate);
                    setduedatemenu(false);
                    navigate(`/dashboard/${page}`);
                  }}
                >
                  <div>
                    <div>
                      <img src={latertodayimg} alt="latertoday" />
                    </div>
                    <div>Today</div>
                  </div>
                  <div>{`${days[today.getDay()]}, 22:00`}</div>
                </div>
                <div
                  onClick={() => {
                    let tempdate = new Date();
                    tempdate.setDate(tempdate.getDate() + 1);
                    tempdate.setHours(0, 0, 0, 0);
                    makerequest({ duedate: tempdate.toISOString() });
                    setduedatestate(tempdate);
                    setduedatemenu(false);
                    navigate(`/dashboard/${page}`);
                  }}
                >
                  <div>
                    <div>
                      <img src={tomorowimg} alt="tommorow" />
                    </div>
                    <div>Tomorow</div>
                  </div>
                  <div>{`${days[today.getDay() + 1]}, 22:00`}</div>
                </div>
                <div
                  onClick={() => {
                    let tempdate = new Date();
                    tempdate = new Date(
                      tempdate.getTime() + 7 * 24 * 60 * 60 * 1000
                    );
                    makerequest({ duedate: tempdate.toISOString() });
                    setduedatestate(tempdate);
                    setduedatemenu(false);
                    navigate(`/dashboard/${page}`);
                  }}
                >
                  <div>
                    <div>
                      <img src={nextweekimg} alt="nextweek" />
                    </div>
                    <div>Next Week</div>
                  </div>
                  <div>Sun, 9:00</div>
                </div>
                <hr />
                <div>
                  <div>
                    <div>
                      <img src={calenderimg} alt="calender" />
                    </div>
                    <div>Pick a date and time</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="infoBar-otherDetails-second"
              onClick={() => {
                setduedatemenu(false);
              }}
            >
              <img src={crossimg} alt="cross" />
            </div>
          </div>
          <hr />
          <div>
            <div className="infoBar-otherDetails-first">
              <div>
                <img src={repeatimg} alt="repeat" />
              </div>
              <div>
                <div
                  onClick={() => {
                    setrepeatmenu(true);
                  }}
                >
                  {repeat ? `${repeat.freq}` : "Repeat"}
                </div>
                <div>{repeat ? `${repeat.on.join(", ")}` : ""}</div>
                <div className={`menu ${repeatmenu ? "weeklyMenu" : ""}`}>
                  <div>
                    <div>
                      <div>
                        <img src={latertodayimg} alt="latertoday" />
                      </div>
                      <div>Daily</div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div>
                        <img src={tomorowimg} alt="tommorow" />
                      </div>
                      <div>Weekdays</div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div>
                        <img src={nextweekimg} alt="nextweek" />
                      </div>
                      <div>Weekly</div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div>
                        <img src={nextweekimg} alt="nextweek" />
                      </div>
                      <div>Monthly</div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div>
                        <img src={nextweekimg} alt="nextweek" />
                      </div>
                      <div>Yearly</div>
                    </div>
                  </div>
                  <hr />
                  <div>
                    <div>
                      <div>
                        <img src={calenderimg} alt="calender" />
                      </div>
                      <div>Custom</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="infoBar-otherDetails-second"
              onClick={() => {
                setrepeatmenu(false);
              }}
            >
              <img src={crossimg} alt="cross" />
            </div>
          </div>
        </div>
        <div className="infoBar-note">
          <textarea
            placeholder="Add note"
            value={notestate}
            onChange={(event) => {
              setnotestate(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && event.shiftKey) {
                event.preventDefault();
                makerequest({ note: notestate });
              }
            }}
          ></textarea>
        </div>
      </div>
      <div className="infoBar-footer">
        <div className="infoBar-footer-text">
          {createdOn
            ? `Created on ${createdOn.getDate()} ${
                months[createdOn.getMonth()]
              }`
            : ""}
        </div>
        <div
          className="infoBar-footer-image"
          onClick={() => {
            fetch("/api/deletetask", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: _id }),
            });
            setwidth("0px");
            navigate(`/dashboard/${page}`);
          }}
        >
          <img src={deleteimg} alt="delete" />
        </div>
      </div>
    </div>
  );
}

export default memo(Infobar);
