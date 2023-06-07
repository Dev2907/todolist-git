const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const multer = require("multer"); //to handle image uploads
const path = require("path");
const {
  getFromDB,
  insertToDB,
  updateDB,
  deletefromDB,
  updatemanyDB,
  pushtasklist,
} = require("./DBpipe.js");
const { ObjectId } = require("mongodb");
const bodyParser = require("body-parser");

const collections = { Users: 0, Lists: 1, "all-tasks": 2, group: 3, steps: 4 };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./todolist/DBImages");
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));
app.use(
  session({
    key: "myKey",
    secret: "pass",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);
app.use(bodyParser.json());
/*app.get("/", (req, res) => {
  if (req.session.user && req.cookie.myKey) {
    res.redirect("/app/myday");
  } else {
    res.redirect("/login");
  }
});*/

/*app.get("/login", (req, res) => {
  if (req.session.user && req.cookie.myKey) {
    res.redirect("/app/myday");
  } else {
    res.redirect("/login");
  }
});*/

app.get("*/api/verifyuser", (req, res) => {
  if (req.session.user && req.cookies.myKey) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.post("*/api/login", upload.single("file"), (req, res) => {
  getFromDB(
    { name: req.body.username, password: req.body.password },
    collections["Users"]
  ).then((user) => {
    if (user.length > 0) {
      req.session.user = user[0]._id;
      res.cookie("myKey", "loggedIn", {
        SameSite: "None",
        secure: true,
        httpOnly: true,
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });
});

app.post("*/api/signup", upload.single("profilepic"), (req, res) => {
  let filepath = `${req.file.filename}`;
  insertToDB(
    {
      name: req.body.name,
      email: req.body.email,
      profilepic: filepath,
      password: req.body.password,
    },
    0
  ).then(() => {
    res.sendStatus(200);
  });
});

app.get("*/api/getLists", (req, res) => {
  getFromDB(
    { userid: new ObjectId(req.session.user) },
    collections["Lists"],
    1
  ).then((lists) => {
    let out = {};
    lists.forEach((item) => {
      out[item.name] = item._id;
    });
    res.json(out);
  });
});

app.get("*/api/getUser", (req, res) => {
  getFromDB({ _id: new ObjectId(req.session.user) }, collections["Users"]).then(
    (user) => {
      if (user.length > 0) {
        res.json(user[0]);
      } else {
        res.sendStatus(401);
      }
    }
  );
});

app.get("*/api/getimportant", (req, res) => {
  getFromDB(
    {
      userid: new ObjectId(req.session.user),
      completed: false,
      important: true,
    },
    collections["all-tasks"]
  ).then((tasks) => {
    tasks.forEach((task) => {
      task._id = task._id.toString();
    });
    res.json(tasks);
  });
});

app.get("*/api/getmyday", (req, res) => {
  let out = {};
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  let tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  getFromDB(
    {
      userid: new ObjectId(req.session.user),
      duedate: { $gte: today.toISOString(), $lt: tomorrow.toISOString() },
    },
    collections["all-tasks"]
  ).then((tasks) => {
    tasks.forEach((task) => {
      task._id = task._id.toString();
    });
    out["incomplete"] = tasks.filter((task) => !task.completed);
    out["completed"] = tasks.filter((task) => task.completed);
    res.json(out);
  });
});

app.get("*/api/getplanned", (req, res) => {
  getFromDB(
    { userid: new ObjectId(req.session.user) },
    collections["all-tasks"]
  ).then((tasks) => {
    const today = new Date(); // Get today's date in the format "YYYY-MM-DD"
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const out = {
      today: [],
      tomorrow: [],
      previous: [],
    };

    tasks.forEach((task) => {
      task._id = task._id.toString();
      if (
        (task.duedate >= today.toISOString() &&
          task.duedate < tomorrow.toISOString()) ||
        task.duedate === null
      ) {
        out.today.push(task);
      } else if (task.duedate > tomorrow.toISOString()) {
        out.tomorrow.push(task);
      } else {
        out.previous.push(task);
      }
    });

    res.json(out);
  });
});

app.get("*/api/gettasks", (req, res) => {
  const out = {};
  getFromDB(
    { userid: new ObjectId(req.session.user) },
    collections["all-tasks"]
  ).then((tasks) => {
    out["incomplete"] = tasks.filter((task) => !task.completed);
    out["completed"] = tasks.filter((task) => task.completed);
    res.json(out);
  });
});

//app.post("*/api/getlistdata", (req, res) => {
/*  const out = {
    incomplete: [],
    completed: [],
  };
  getFromDB({ _id: new ObjectId(`${req.body.id}`) }, collections["Lists"])
    .then((lists) => {
      const promises = lists[0].contents.map((taskid) =>
        getFromDB({ _id: taskid }, collections["all-tasks"])
      );

      return Promise.all(promises);
    })
    .then((tasks) => {
      tasks.forEach((task) => {
        if (task[0].completed) {
          out.completed.push(task[0]);
        } else {
          out.incomplete.push(task[0]);
        }
      });
      res.json(out);
    });
});*/

app.post("*/api/getlistdata", (req, res) => {
  const out = {
    incomplete: [],
    completed: [],
  };
  getFromDB({ _id: new ObjectId(`${req.body.id}`) }, collections["Lists"])
    .then((lists) => {
      const promises = lists[0].contents.map((taskid) =>
        getFromDB({ _id: new ObjectId(taskid) }, collections["all-tasks"])
      );

      return Promise.all(promises);
    })
    .then((tasks) => {
      tasks.forEach((task) => {
        if (task[0] && task[0].completed) {
          // Add check for task[0] existence
          out.completed.push(task[0]);
        } else if (task[0]) {
          // Add check for task[0] existence
          out.incomplete.push(task[0]);
        }
      });
      res.json(out);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post("*/api/gettaskdetail", (req, res) => {
  if (req.body.id) {
    getFromDB(
      { _id: new ObjectId(`${req.body.id}`) },
      collections["all-tasks"]
    ).then((tasks) => {
      res.json(tasks[0]);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post("*/api/searchtask", (req, res) => {
  getFromDB(
    {
      userid: new ObjectId(req.session.user),
      name: `${req.body.name}`,
    },
    collections["all-tasks"]
  ).then((task) => {
    let out = { tasks: task };
    res.json(out);
  });
});

app.post("*/api/newlist", (req, res) => {
  insertToDB(
    {
      name: req.body.name,
      userid: new ObjectId(req.session.user),
      contents: [],
    },
    collections["Lists"]
  ).then(() => {
    res.sendStatus(200);
  });
});

app.post("*api/addtask", (req, res) => {
  const today = new Date();
  insertToDB(
    {
      name: req.body.name,
      steps: [],
      remindme: null,
      duedate: null,
      repeat: null,
      important: false,
      note: "",
      createdon: today.toISOString(),
      completed: false,
      userid: new ObjectId(req.session.user),
    },
    collections["all-tasks"]
  ).then(() => {
    res.sendStatus(200);
  });
});

app.post("*api/deletelist", (req, res) => {
  deletefromDB(
    {
      _id: new ObjectId(req.body.id),
      userid: new ObjectId(req.session.user),
    },
    collections["Lists"]
  ).then(() => {
    res.sendStatus(200);
  });
});

app.post("*api/updatetask", (req, res) => {
  updateDB(
    new ObjectId(req.body.id),
    req.body.query,
    collections["all-tasks"]
  ).then(() => {
    res.sendStatus(200);
  });
});

app.post("*api/deletetask", async (req, res) => {
  await deletefromDB(
    {
      _id: new ObjectId(req.body.id),
      userid: new ObjectId(req.session.user),
    },
    collections["all-tasks"]
  );
  await updatemanyDB(
    {
      taskid: req.body.id,
    },
    collections["Lists"]
  );
});

app.post("*api/updatelist", (req, res) => {
  pushtasklist(
    { id: req.body.id, taskid: req.body.taskid },
    collections["Lists"]
  ).then(res.sendStatus(200));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});
