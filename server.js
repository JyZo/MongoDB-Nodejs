const express = require("express");
const app = express();
const methodOverride = require("method-override");

// const MongoClient = require("mongodb").MongoClient;
// MongoClient.connect(
//   "mongodb://atlas-sql-66706bb3f1ab551d6babc9cd-thyq6.a.query.mongodb.net/todoapp?ssl=true&authSource=admin",
//   function (err, client) {
//     app.listen(8080, function () {
//       console.log("hello server");
//     });
//   }
// );
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use(methodOverride("_method"));
app.listen(8080, function () {
  console.log("hello server");
});
app.set("view engine", "ejs");

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://qwer:1q2w3e4r@cluster0.qilgr0f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

app.get("/beauty", function (request, response) {
  response.send("뷰티용품을 쇼핑할 수 있는 페이지입니다.");
});

app.get("/pet", function (request, response) {
  response.send("pet을 쇼핑할 수 있는 페이지입니다.");
});

app.get("/", function (request, response) {
  response.render("index.ejs");
});

app.get("/write", function (request, response) {
  response.render("write.ejs");
});

app.get("/list", async function (request, response) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("todoapp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const myDB = client.db("todoapp");
    const myColl = myDB.collection("post");

    await myColl.find().toArray(function (err, result) {
      response.render("list.ejs", { posts: result });
    });
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("connect close");
  }
});

app.get("/detail/:idx", async function (request, response) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("todoapp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const myDB = client.db("todoapp");
    const myColl = myDB.collection("post");

    const getData = await myColl.findOne(
      { _id: parseInt(request.params.idx) },
      function (err, result) {
        console.log(result);
        response.render("detail.ejs", { detailNum: result });
      }
    );
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("connect close");
  }
});

app.get("/edit/:idx", async function (request, response) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("todoapp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const myDB = client.db("todoapp");
    const myColl = myDB.collection("post");

    const getData = await myColl.findOne(
      { _id: parseInt(request.params.idx) },
      function (err, result) {
        console.log(result);
        response.render("edit.ejs", { editNum: result });
      }
    );
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("connect close");
  }
});

app.put("/edit", async function (request, response) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("todoapp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const myDB = client.db("todoapp");
    const myColl = myDB.collection("post");

    await myColl.updateOne(
      { _id: parseInt(request.body.id) },
      { $set: { 제목: request.body.title, 날짜: request.body.date } },
      function (err, result) {
        console.log("edit fin");
        response.redirect("/list");
      }
    );
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("connect close");
  }
});

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

app.use(
  session({ secret: "secretcode", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/login", function (request, response) {
  response.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/fail",
  }),
  function (request, response) {
    response.redirect("/");
  }
);

app.get("/mypage", checkLogin, function (request, response) {
  console.log("mypage");
  console.log(request.user);
  response.render("mypage.ejs");
});

function checkLogin(request, response, next) {
  if (request.user) {
    next();
  } else {
    response.send("not login");
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pw",
      session: true,
      passReqToCllback: false,
    },
    async function (inputID, inputPW, done) {
      console.log(inputID, inputPW);
      const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("todoapp").command({ ping: 1 });
        console.log(
          "Pinged your deployment. You successfully connected to MongoDB!"
        );

        const myDB = client.db("todoapp");
        const myColl = myDB.collection("login");

        await myColl.findOne({ id: inputID }, function (err, result) {
          console.log(err);
          console.log(result);
          if (err) return done(err);
          if (!result) return done(null, false, { msg: "ID is not exist" });
          if (inputPW == result.pw) {
            return done(null, result);
          } else {
            return done(null, false, { msg: "PW is incorrect" });
          }
        });
      } catch (err) {
        console.log(err.stack);
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        console.log("connect close");
      }
    }
  )
);

//session 만들어줌
passport.serializeUser(function (user, done) {
  console.log(user);
  done(null, user.id);
});

//session 찾을때 실행함수
passport.deserializeUser(async function (ID, done) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("todoapp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const myDB = client.db("todoapp");
    const myColl = myDB.collection("login");

    await myColl.findOne({ id: ID }, function (err, result) {
      done(null, result);
    });
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("connect close");
  }
});

app.get("/search", async function (request, response) {
  console.log(request.query);

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("todoapp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const myDB = client.db("todoapp");
    const myColl = myDB.collection("post");

    await myColl.aggregate(searchC).toArray(function (err, result) {
      console.log(result);
      response.render("searchresult.ejs", { searchresult: result });
    });
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("connect close");
  }
});

app.post("/register", async (request, response) => {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("todoapp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const myDB = client.db("todoapp");
    const myColl = myDB.collection("login");

    await myColl.insertOne(
      {
        id: request.body.id,
        pw: request.body.pw,
      },
      function (err, result) {
        response.redirect("/");
      }
    );
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("connect close");
  }
});

async function addparam(request, totalCount) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("todoapp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const myDB = client.db("todoapp");
    const myColl = myDB.collection("post");

    await myColl.insertOne({
      _id: totalCount + 1,
      제목: request.body.title,
      날짜: request.body.date,
      작성자: request.user._id,
    });

    await myDB
      .collection("counter")
      .updateOne(
        { name: "개시물갯수" },
        { $inc: { totalPost: +1 } },
        function (err, result) {
          console.log(result.totalPost);
          console.log("counter update fin");
        }
      );

    console.log("save fin");
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("connect close");
  }
}

app.post("/add", async function (request, response) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  let totalCount;
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("todoapp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const myDB = client.db("todoapp");
    const myColl = myDB.collection("counter");

    await myColl.findOne({ name: "개시물갯수" }, function (err, result) {
      console.log("totalPost");
      console.log(result.totalPost);
      totalCount = result.totalPost;
    });
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("connect close");
  }
  response.send("send fin");
  console.log(request.body);
  addparam(request, totalCount).catch(console.dir);
});

app.delete("/delete", async function (request, response) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("todoapp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const myDB = client.db("todoapp");
    const myColl = myDB.collection("post");

    console.log(request.body._id);
    request.body._id = parseInt(request.body._id);

    const delData = { _id: request.body._id, 작성자: request.user._id };

    await myColl.deleteOne(delData, function (err, result) {
      console.log(response.statusCode);
      if (err) {
        console.log("delete fail");
      }
      response.status(200).send({ msg: "delete suc!!" });
      console.log("delete fin");
    });
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("connect close");
  }
});

// app.get("/shop/shirts", function (request, response) {
//   response.send("shirt!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
// });

// app.get("/shop/pants", function (request, response) {
//   response.send("pants!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
// });

app.use("/", require("./routes/shop"));

// app.get("/sports", function (request, response) {
//   response.send("sports!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
// });

// app.get("/game", function (request, response) {
//   response.send("game!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
// });

app.use("/board/sub/", require("./routes/board"));

let multer = require("multer");
var storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "./public/img");
  },
  filename: function (request, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

app.get("/upload", function (request, response) {
  response.render("upload.ejs");
});

app.post("/upload", upload.single("profile"), function (request, response) {
  response.send("upload fin");
});

app.get("/image/:imgname", function (request, response) {
  response.sendFile(__dirname + "/public/img/" + request.params.imgname);
});

app.get("/chat", checkLogin, async function (request, response) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("todoapp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const myDB = client.db("todoapp");
    const myColl = myDB.collection("chatroom");

    await myColl
      .find({ member: request.user._id })
      .toArray()
      .then((result) => {
        console.log(result);
        response.render("chat.ejs", { data: result });
      });
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("connect close");
  }
});

app.post("/chat", checkLogin, async (request, response) => {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("todoapp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const myDB = client.db("todoapp");
    const myColl = myDB.collection("chatroom");
    const { ObjectId } = require("mongodb");

    var savedData = {
      title: "하하",
      member: [ObjectId(request.body.servemanID), request.user._id],
      date: new Date(),
    };

    await myColl.insertOne(savedData, function (err, result) {
      response.send("chat room make");
    });
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("connect close");
  }
});

app.post("/message", checkLogin, async function (request, response) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("todoapp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const myDB = client.db("todoapp");
    const myColl = myDB.collection("message");

    var msgData = {
      parent: request.body.parent,
      content: request.body.content,
      userid: request.user._id,
      date: new Date(),
    };

    await myColl.insertOne(msgData, function (err, result) {
      console.log("msg saved suc");
      response.send("msg saved suc");
    });
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("connect close");
  }
});

app.get("/message/:id", checkLogin, async function (request, response) {
  response.writeHead(200, {
    connection: "Keep-alive",
    "Content-type": "text/event-stream",
    "cache-control": "no-cache",
  });

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("todoapp").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const myDB = client.db("todoapp");
    const myColl = myDB.collection("message");

    await myColl
      .find({ parent: request.params.id })
      .toArray()
      .then((result) => {
        console.log(result);
        response.write("event: test\n");
        response.write("data:" + JSON.stringify(result) + "\n\n");
      });

    const pipeline = [{ $match: { "fullDocument.parent": request.params.id } }];
    const collection = myDB.collection("message");
    const changeStream = collection.watch(pipeline);
    changeStream.on("change", (result) => {
      console.log(result.fullDocument);
      response.write("event: test\n");
      response.write("data:" + JSON.stringify([result.fullDocument]) + "\n\n");
    });
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("connect close");
  }
});
