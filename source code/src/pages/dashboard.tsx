import React, { memo, useEffect } from "react";
import { useState } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Sidebar from "../components/sidebar.tsx";
import Important from "../components/important.tsx";
import AddTask from "../components/addTask.tsx";
import Infobar from "../components/infobar.tsx";
import General from "../components/General.tsx";
import Planned from "../components/Planned.tsx";
import Searchres from "../components/searchresult.tsx";
import sidebar from "../components/sidebar.tsx";

function Dashboard({ state, updatestate }) {
  const navigate = useNavigate();
  const [listobj, setList] = useState({});
  const location = useLocation();
  const id = useParams();
  const [infobarid, setinfobarstate] = useState("-1");
  const setinfobarid = (newID) => {
    setinfobarstate(newID);
  };
  const [accountObj, setAccount] = useState({
    userId: "-1",
    accountName: "",
    emailId: "",
    profilepic: "sidebar-tempProfilepic.png",
  });
  const [generaldata, setgeneral] = useState({
    incomplete: [],
    completed: [],
    setinfobar: setinfobarid,
  });
  const [importantdata, setimportant] = useState({
    tasks: [],
    setinfobar: setinfobarid,
  });
  const [planneddata, setplanned] = useState({
    today: [],
    tomorrow: [],
    previous: [],
    setinfobar: setinfobarid,
  });
  const [infobarObj, setinfobar] = useState({
    genClass: "infoBar infobar-general",
    name: "",
    steps: [""],
    remind: null,
    dueDate: null,
    repeat: null,
    note: "",
    createdOn: null,
    important: false,
    listnames: {},
  });
  const [searchtaskname, settaskname] = useState("");
  const setsearchtaskname = (val) => {
    settaskname(val);
  };
  const [searchresdata, setsearcdata] = useState({
    tasks: [],
  });
  const getListname = async () => {
    try {
      const response = await fetch("api/getLists");
      if (response.ok) {
        return await response.json();
      } else {
        return {};
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getAccountinfo = async () => {
    try {
      const response = await fetch("api/getUser");
      if (response.ok) {
        return await response.json();
      } else {
        return {};
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getData = async () => {
    try {
      const match = location.pathname.match(/\/dashboard\/(.*)/);
      const page = match ? match[1] : null;
      const idmatch = location.pathname.match(/\/dashboard\/lists\/([^/]+)/);
      const id = idmatch ? idmatch[1] : null;
      if (page === "important") {
        let response = await fetch("api/getimportant");
        response = await response.json();
        setimportant({
          tasks: response,
          setinfobar: setinfobarid,
        });
      } else if (page === "myday") {
        let response = await fetch("api/getmyday");
        response = await response.json();
        response["setinfobar"] = setinfobarid;
        setgeneral(response);
      } else if (page === "planned") {
        let response = await fetch("api/getplanned");
        response = await response.json();
        response["setinfobar"] = setinfobarid;
        setplanned(response);
      } else if (page === "tasks") {
        let response = await fetch("api/gettasks");
        response = await response.json();
        response["setinfobar"] = setinfobarid;
        setgeneral(response);
      } else if (page === "searchres") {
        let response = await fetch("api/searchtask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: searchtaskname }),
        });
        if (response.ok) {
          response = await response.json();
          response["setinfobar"] = setinfobarid;
          setsearcdata(response);
        }
      } else if (id) {
        try {
          let response = await fetch("api/getlistdata", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }),
          });

          if (response.ok) {
            response = await response.json();
            response["setinfobar"] = setinfobarid;
            setgeneral(response);
          } else {
            console.log("Request failed with status:", response.status);
          }
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const verifySession = async () => {
    try {
      const response = await fetch("/api/verifyuser");
      if (response.ok) {
        updatestate(true);
      } else {
        updatestate(false);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getinfobarobj = async () => {
    if (infobarid !== "-1") {
      try {
        const response = await fetch("api/gettaskdetail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: infobarid }),
        });
        if (response.ok) {
          const data = await response.json();
          data["genClass"] = "infoBar infobar-general";
          data["listnames"] = listobj;
          setinfobar(data);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const triggerdashboard = () => {
    verifySession();
    getData();
  };
  useEffect(() => {
    getListname().then((res) => {
      setList(res);
    });
    getAccountinfo().then((res) => {
      setAccount(res);
    });
  }, []);
  useEffect(() => {
    triggerdashboard();
  }, [id, location]);
  useEffect(() => {
    getinfobarobj();
  }, [infobarid]);
  return (
    <>
      <Sidebar
        genClass="sidebar-general"
        userLists={listobj}
        accountInfo={accountObj}
        setsearchtaskname={setsearchtaskname}
      />
      <div className="mainContent-general">
        <div className="mainContent-general-tasklist">
          <Routes>
            <Route path="/myday" element={<General {...generaldata} />} />
            <Route
              path="/important"
              element={
                <Important {...importantdata} setinfobar={setinfobarid} />
              }
            />
            <Route
              path="/planned"
              element={<Planned {...planneddata} setinfobar={setinfobarid} />}
            ></Route>
            <Route
              path="/tasks"
              element={<General {...generaldata} setinfobar={setinfobarid} />}
            ></Route>
            <Route
              path="/lists/:id"
              element={<General {...generaldata} setinfobar={setinfobarid} />}
            ></Route>
            <Route
              path="/searchres"
              element={
                <Searchres {...searchresdata} setinfobar={setinfobarid} />
              }
            ></Route>
          </Routes>
        </div>
        <div className="mainContent-general-addTask">
          <AddTask />
        </div>
      </div>
      <Infobar {...infobarObj} />
    </>
  );
}

export default memo(Dashboard);
