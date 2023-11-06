const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bezlu4y.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});






async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const assignmentCollection = client.db("assignmentDB").collection("assignment");
    const assignmentSubmission = client.db("assignmentDB").collection("submission");


    app.get("/assignment", async (req, res) => {
      const cursor = assignmentCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })


    app.post("/assignment", async (req, res) => {
      const newAssignment = req.body;
      const result = await assignmentCollection.insertOne(newAssignment);
      res.send(result);
    })


    app.get("/assignment/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await assignmentCollection.findOne(query);
      res.send(result);
    })


    app.put("/assignment/:id", async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert:true};
      const updatedAssignment = req.body;
      const assignment = {
        $set: {
          title: updatedAssignment.title, 
          marks: updatedAssignment.marks, 
          image: updatedAssignment.image, 
          difficulty: updatedAssignment.difficulty, 
          description: updatedAssignment.description, 
          date: updatedAssignment.date
        }
      }
      const result = await assignmentCollection.updateOne(filter, assignment, options);
      res.send(result);
    })


    app.delete("/assignment/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await assignmentCollection.deleteOne(query)
      res.send(result);
    })


    // submit assignment API

    app.post("/submission", async (req, res) => {
      const newSubmission = req.body;
      const result = await assignmentSubmission.insertOne(newSubmission);
      res.send(result);
    })








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send("server is running");
  })
  
  app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
  })