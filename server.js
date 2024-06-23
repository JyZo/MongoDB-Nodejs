const express = require("express");
const app = express();

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

async function run() {
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

    const result = await myColl.insertOne({
      이름: "john",
      나이: 20,
    });

    console.log("save fin");
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    console.log("connect close");
    await client.close();
  }
}
// run().catch(console.dir);
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

    const result = await myColl.insertOne({
      _id: totalCount + 1,
      제목: request.body.title,
      날짜: request.body.date,
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

    const getData = await myColl.findOne(
      { name: "개시물갯수" },
      function (err, result) {
        console.log("totalPost");
        console.log(result.totalPost);
        totalCount = result.totalPost;
      }
    );
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

    const getData = await myColl.find().toArray(function (err, result) {
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

    myColl.deleteOne(request.body, function (err, result) {
      console.log(response.statusCode);
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
