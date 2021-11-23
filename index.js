const express = require('express')
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y5fcu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('travelWorld').collection('services');
        const orderCollection = client.db('travelWorld').collection('orders')


        // GET SERVICE API
        app.get('/services', async (req, res) => {
            const result = await serviceCollection.find({}).toArray();
            res.send(result);
        })


        // GET SINGLE SERVICE API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query)
            res.send(result);
        })



        // GET ORDERS API
        app.get('/orders', async (req, res) => {
            const result = await orderCollection.find({}).toArray();
            console.log(result);
            res.send(result);
        })




        // MY ORDER API
        app.get("/myorders/:email", async (req, res) => {
            const result = await orderCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });


        // ORDER SERVICE API
        app.post('/order', async (req, res) => {
            console.log(req.body);
            const result = await orderCollection.insertOne(req.body);
            res.send(result);
        })


        // ADD SERVICE API
        app.post('/addService', async (req, res) => {
            console.log(req.body);
            const result = await serviceCollection.insertOne(req.body);
            res.send(result);
        })






        // UPDATE STATUS API
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedUser.status
                },
            }
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            console.log('updating user', id);
            res.send(result)

        })



        // DELETE ORDER API
        app.delete("/deleteOrders/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await orderCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });





    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})