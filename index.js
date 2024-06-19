const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const trainerCollection = client.db("PulsefitDB").collection("trainers");
    const applyCollection = client.db("PulsefitDB").collection("apply");
    const bookedCollection = client.db("PulsefitDB").collection("booked");

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
    app.patch("/user/email/:email", async (req, res) => {
      const email = req.params.email;
      const userData = req.body;
      const result = await userCollection.updateOne(
        { email: email },
        { $set: userData }
      );
      res.json(result);
    });
    app.get("/users/email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
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
    app.post("/classes", async (req, res) => {
      const classData = req.body;
      const result = await classCollection.insertOne(classData);
      res.send(result);
    });
    app.delete("/classes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classCollection.deleteOne(query);
      res.send(result);
    });
    app.patch("/classes/:id", async (req, res) => {
      const id = req.params.id;
      const classData = req.body;
      const result = await classCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: classData }
      );
      res.json(result);
    });
    app.get("/classes/detail/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classCollection.findOne(query);
      res.send(result);
    });

    // Testimonials Collection
    app.get("/testimonials", async (req, res) => {
      const testimonials = await testimonialCollection
        .find()
        .sort({ ratings: -1 })
        .toArray();
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
    app.post("/community", async (req, res) => {
      const forum = req.body;
      const result = await communityCollection.insertOne(forum);
      res.send(result);
    });
    app.delete("/community/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await communityCollection.deleteOne(query);
      res.send(result);
    });
    app.patch("/community/:id", async (req, res) => {
      const id = req.params.id;
      const forumData = req.body;
      const result = await communityCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: forumData }
      );
      res.json(result);
    });

    // Subscribe Collection
    app.post("/subscribes", async (req, res) => {
      const subscribe = req.body;
      const result = await subscribeCollection.insertOne(subscribe);
      res.send(result);
    });
    app.get("/subscribes", async (req, res) => {
      const subscribe = await subscribeCollection.find().toArray();
      res.send(subscribe);
    });

    // Trainer Collection
    app.get("/trainers", async (req, res) => {
      const trainer = await trainerCollection.find().toArray();
      res.send(trainer);
    });
    app.get("/trainers/experience", async (req, res) => {
      const trainer = await trainerCollection
        .find()
        .sort({ experience: -1 })
        .toArray();
      res.send(trainer);
    });
    app.get("/trainers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await trainerCollection.findOne(query);
      res.send(result);
    });
    app.post("/trainers", async (req, res) => {
      const trainer = req.body;
      const result = await trainerCollection.insertOne(trainer);
      res.send(result);
    });
    app.delete("/trainers/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await trainerCollection.deleteOne(query);
      res.send(result);
    });

    // Apply Trainer Collection
    app.post("/apply", async (req, res) => {
      const apply = req.body;
      const result = await applyCollection.insertOne(apply);
      res.send(result);
    });
    app.get("/apply", async (req, res) => {
      const apply = await applyCollection.find().toArray();
      res.send(apply);
    });
    app.get("/apply/email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const apply = await applyCollection.findOne(query);
      res.send(apply);
    });
    app.get("/apply/detail/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await applyCollection.findOne(query);
      res.send(result);
    });
    app.patch("/apply/email/:email", async (req, res) => {
      const email = req.params.email;
      const applyData = req.body;
      const result = await applyCollection.updateOne(
        { email: email },
        { $set: applyData }
      );
      res.json(result);
    });

    // subscription Trainer Collection
    app.post("/booked", async (req, res) => {
      const booked = req.body;
      const result = await bookedCollection.insertOne(booked);
      res.send(result);
    });
    app.get("/booked", async (req, res) => {
      const booked = await bookedCollection.find().sort({ _id: -1 }).toArray();
      res.send(booked);
    });

    app.get("/booked/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookedCollection.findOne(query);
      res.send(result);
    });
    app.patch("/booked/:id", async (req, res) => {
      const id = req.params.id;
      const { packageName, price, payment, cardName, cardNumber } = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          packageName,
          price,
          payment,
          cardName,
          cardNumber,
        },
      };
      const result = await bookedCollection.updateOne(query, update);
      res.send(result);
    });
    app.delete("/booked/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookedCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Pulsefit is running");
});

app.listen(port, () => {
  console.log(`Pulsefit is in port: ${port}`);
});
