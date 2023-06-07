/*Sidebar to all pages*/
/*contains:
account info, predefined lists, user defined lists/ groups, make newlist/groups
 */
import React, { memo, useState } from "react";
import "../CSS/sidebar.css";
import "../App.css";
import { useNavigate } from "react-router-dom";

interface sidebarProp {
  genClass: "sidebar-general";
  userLists: {};
  accountInfo: {
    _id: String;
    name: String;
    email: String;
    profilepic: String;
  };
  setsearchtaskname: Function;
}
function Sidebar({
  genClass,
  userLists,
  accountInfo,
  setsearchtaskname,
}: sidebarProp) {
  const [selectedIndex, setselectedIndex] = useState(1);
  const navigate = useNavigate();
  const [searchtask, setsearchtask] = useState("");
  const [newlist, setnewlist] = useState("");

  const profilePic = require(`../../DBImages/${accountInfo.profilepic}`);
  const searchicon = require("../Images/sidebar-search.png");
  const myDaySun = require("../Images/sidebar-myDaySun.png");
  const star = require("../Images/sidebar-star.png");
  const box = require("../Images/sidebar-box.png");
  const task = require("../Images/sidebar-task.png");
  const horizontallines = require("../Images/sidebar-horizontallines.png");
  const plus = require("../Images/sidebar-plus.png");
  const newgroup = require("../Images/sidebar-newgroup.png");

  let generalClassname = `${genClass} sidebar`;
  const handleSearch = (event) => {
    if (event.key === "Enter") {
      setsearchtaskname(searchtask);
      navigate(`/dashboard/searchres`);
    }
  };
  const handlechangesearch = (event) => {
    setsearchtask(event.target.value);
  };
  const handlechangenewlist = (event) => {
    setnewlist(event.target.value);
  };
  const handlenewlist = (event) => {
    if (event.key === "Enter") {
      fetch("/api/newlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newlist }),
      });
      setnewlist("");
    }
  };
  return (
    <div className={generalClassname}>
      <div>
        <div className="sidebar-account">
          <div className="sidebar-profile-pic">
            <img src={profilePic} alt="profile pic" />
          </div>
          <div className="sidebar-account-info">
            <div className="sidebar-account-Name">{accountInfo.name}</div>
            <div className="sidebar-account-details">
              <div>{accountInfo.email}</div>
            </div>
          </div>
        </div>
        <br />
        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Search"
            onKeyDown={handleSearch}
            onChange={handlechangesearch}
            value={searchtask}
          />
          <img src={searchicon} alt="search" />
        </div>
        <br />
        <div className="sidebar-Lists">
          <ul>
            <li
              className={
                "sidebar-Lists-listitem" +
                (selectedIndex === 1 ? " sidebar-Lists-listitem-active" : "")
              }
              onClick={() => {
                setselectedIndex(1);
                navigate("/dashboard/myday");
              }}
            >
              <img src={myDaySun} alt="myday" /> My Day
            </li>
            <li
              className={
                "sidebar-Lists-listitem" +
                (selectedIndex === 2 ? " sidebar-Lists-listitem-active" : "")
              }
              onClick={() => {
                setselectedIndex(2);
                navigate("/dashboard/important");
              }}
            >
              <img src={star} alt="star" /> Important
            </li>
            <li
              className={
                "sidebar-Lists-listitem" +
                (selectedIndex === 3 ? " sidebar-Lists-listitem-active" : "")
              }
              onClick={() => {
                setselectedIndex(3);
                navigate("/dashboard/planned");
              }}
            >
              <img src={box} alt="box" /> Planned
            </li>
            <li
              className={
                "sidebar-Lists-listitem" +
                (selectedIndex === 4 ? " sidebar-Lists-listitem-active" : "")
              }
              onClick={() => {
                setselectedIndex(4);
                navigate("/dashboard/tasks");
              }}
            >
              <img src={task} alt="task" /> Tasks
            </li>
          </ul>
        </div>
        <br />
        <hr />
        <br />
        <div>
          <ul>
            {Object.entries(userLists).map(([listName, id], index) => (
              <li
                className={
                  "sidebar-Lists-listitem" +
                  (selectedIndex === 5 + index
                    ? " sidebar-Lists-listitem-active"
                    : "")
                }
                onClick={() => {
                  setselectedIndex(5 + index);
                  navigate(`/dashboard/lists/${id}`);
                }}
              >
                <img src={horizontallines} alt="list" /> {listName}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-footer-div">
          <img src={plus} alt="newList" />{" "}
          <div>
            <input
              placeholder="New List"
              value={newlist}
              onKeyDown={handlenewlist}
              onChange={handlechangenewlist}
            />
          </div>
        </div>
        <div className="sidebar-footer-div-img">
          <img src={newgroup} alt="newGroup" />
        </div>
      </div>
    </div>
  );
}

export default memo(Sidebar);
