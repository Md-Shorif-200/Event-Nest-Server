const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



// middleware
app.use(express.json());
app.use(cors());


// !Mongodb Database 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.56yvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // ! database collections 
    const db =  client.db('Event-Nest-Db');
    const userCollections = db.collection('users') // usercollection
    const eventCollections = db.collection('events') // event collection


    // user post api

    app.post('/api/users', async(req,res) => {
        const  newUserData = req.body;
        const email = newUserData.email;  
        
        // varify user
        if(!email){
            return res.status(400).send({meassage : 'Email not found'})
        }

        // if User is already exist
        const existingUser = await userCollections.findOne({email});

        if(existingUser){
            return res.status(200).send({meassage : 'User Already Exist in database'})
        }



        const  result = await userCollections.insertOne(newUserData);
             res.send(result)
    })


      // user get api
      app.get('/api/users', async(req,res) => {
  
        const  result = await userCollections.find().toArray();
             res.send(result)
    })


    // ! event post api
     app.post('/api/events', async(req,res) => {
                 const eventData = req.body;
                 
                 const  result = await eventCollections.insertOne(eventData);
                 res.send(result)
     })

    //  event get api

    app.get('/api/events', async(req,res) => {
                const result  = await eventCollections.find().toArray();
                res.send(result)
    })

    // event delete api
    app.delete('/api/events/delete/:id', async(req,res) => {
           const id  =  req.params.id;
             console.log(id);
             
           const query = {_id : new ObjectId(id)};

           const result = await eventCollections.deleteOne(query);
           res.send(result);
    })

    // event update api
    app.patch('/api/events/update/:id', async(req,res) => {
        const id = req.params.id;
        const data = req.body;
        const query = {_id : new ObjectId(id)};
        
        const updatedDoc = {
           $set : {
                 eventTitle : data.title,
                 eventDate : data.date,
                 eventTime : data.time,
                 location : data.eventLoacation,
                 description : data.eventDescription
           }
        }

        const result = await eventCollections.updateOne(query,updatedDoc);
        res.send(result)
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











app.get('/',async(req,res) => {
     res.send('event-nest server is running')
})

app.listen(port,() => {
     console.log('event-nest server is running on port',port);
     
})