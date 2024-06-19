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
app.listen(8080, function () {
  console.log("hello server");
});

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://qwer:1q2w3e4r@cluster0.qilgr0f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

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
    await client.close();
  }
}
// run().catch(console.dir);
async function addparam(request) {
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
      제목: request.body.title,
      날짜: request.body.date,
    });

    console.log("save fin");
  } catch (err) {
    console.log(err.stack);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

app.get("/beauty", function (request, response) {
  response.send("뷰티용품을 쇼핑할 수 있는 페이지입니다.");
});

app.get("/pet", function (request, response) {
  response.send("pet을 쇼핑할 수 있는 페이지입니다.");
});

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get("/write", function (request, response) {
  response.sendFile(__dirname + "/write.html");
});

app.post("/add", function (request, response) {
  response.send("send fin");
  console.log(request.body);
  addparam(request).catch(console.dir);
});
