const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterbase.o3yqpur.mongodb.net/?retryWrites=true&w=majority&appName=Clusterbase`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const userCollection = client.db("PulsefitDB").collection("users");
    const classCollection = client.db("PulsefitDB").collection("classes");
    const testimonialCollection = client
      .db("PulsefitDB")
      .collection("testimonials");
    const communityCollection = client.db("PulsefitDB").collection("community");
    const subscribeCollection = client
      .db("PulsefitDB")
      .collection("subscribes");
    // User Collection
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    // Class Collection
    app.get("/classes", async (req, res) => {
      const classes = await classCollection.find().toArray();
      res.send(classes);
    });
    app.get("/classes/totalBookings", async (req, res) => {
      const classes = await classCollection
        .find()
        .sort({ totalBookings: -1 })
        .toArray();
      res.send(classes);
    });

    // Testimonials Collection
    app.get("/testimonials", async (req, res) => {
      const testimonials = await testimonialCollection.find().toArray();
      res.send(testimonials);
    });

    // Community Collection
    app.get("/community", async (req, res) => {
      const community = await communityCollection.find().toArray();
      res.send(community);
    });
    app.get("/community/upvotes", async (req, res) => {
      const community = await communityCollection
        .find()
        .sort({ upvotes: -1 })
        .toArray();
      res.send(community);
    });

    // Community Collection
    app.post("/subscribes", async (req, res) => {
      const subscribe = req.body;
      const result = await subscribeCollection.insertOne(subscribe);
      res.send(result);
    });
    app.get("/subscribes", async (req, res) => {
      const subscribe = await subscribeCollection.find().toArray();
      res.send(subscribe);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Pulsfit is running");
});

app.listen(port, () => {
  console.log(`Pulsefit is in port: ${port}`);
});
