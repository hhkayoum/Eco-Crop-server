const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: ["https://nimble-gumption-67423c.netlify.app"],
    credentials: true,
  })
);
app.use(express.json());

console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lt8lz60.mongodb.net/?retryWrites=true&w=majority`;

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
    const foodsCollection = client.db("foodsDB").collection("foods");
    const requestedFoodsCollection = client
      .db("foodsDB")
      .collection("requestedFood");
    //request collection
    app.post("/requestedFood", async (req, res) => {
      const foodRequest = req.body;
      const result = await requestedFoodsCollection.insertOne(foodRequest);
      res.send(result);
    });
    app.get("/requestedFood/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const result = await requestedFoodsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/requestedFood", async (req, res) => {
      const result = await requestedFoodsCollection.find().toArray();
      res.send(result);
    });
    app.get("/requestedFoods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await requestedFoodsCollection.findOne(query);
      res.send(result);
    });
    //food request match
    app.get("/Food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { food_id: id };
      console.log(query);
      const result = await requestedFoodsCollection.findOne(query);
      res.send(result);
    });

    //update code
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;

      const filter = { _id: new ObjectId(id) };
      const upDateProducts = req.body;
      const options = { upsert: true };
      const product = {
        $set: {
          food_img: upDateProducts.food_img,
          food_name: upDateProducts.food_name,
          food_qty: upDateProducts.food_qty,
          pickup_location: upDateProducts.pickup_location,
          expired_date: upDateProducts.expired_date,
          additional_notes: upDateProducts.additional_notes,
          user: upDateProducts.user,
          donor_name: upDateProducts.donor_name,
          donor_image: upDateProducts.donor_image,
        },
      };
      console.log(product);
      const result = await foodsCollection.updateOne(filter, product, options);
      res.send(result);
    });

    // foods collection
    app.post("/foods", async (req, res) => {
      const foodItem = req.body;
      const result = await foodsCollection.insertOne(foodItem);
      res.send(result);
    });
    app.get("/requestFood/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await foodsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/getFoods", async (req, res) => {
      let sortObj = {};
      const sortField = req.query.sortField;
      const sortOrder = req.query.sortOrder;
      if (sortField && sortOrder) {
        sortObj[sortField] = sortOrder;
      }
      const result = await foodsCollection
        .find()
        .sort(sortObj)
        .limit(8)
        .toArray();
      res.send(result);
    });
    app.get("/searchFood/:search", async (req, res) => {
      const search = req.params.search;
      console.log(search);
      const query = { food_name: search };
      const result = await foodsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/searchFood/:search", async (req, res) => {
      const search = req.params.search;
      const query = { food_name: search };
      const result = await foodsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/foods", async (req, res) => {
      const cursor = foodsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodsCollection.findOne(query);
      res.send(result);
    });
    app.get("/addFood/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await foodsCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodsCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/sortingFoods", async (req, res) => {
      let sortObj = {};
      const sortField = req.query.sortField;
      const sortOrder = req.query.sortOrder;
      if (sortField && sortOrder) {
        sortObj[sortField] = sortOrder;
      }
      const result = await foodsCollection.find().sort(sortObj).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //     await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});
app.listen(port, () => {
  console.log(`port is running ${port}`);
});
