const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Shopping corner server is running')
})

const password = "DlcadOI7D0fJmRWX"

const uri = `mongodb+srv://rukonbds:${password}@shoppingcorner.rbwvgww.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const database = client.db("shopping-corner");
        const products = database.collection("products");
        const users = database.collection("users");

        // Get all Products
        app.get('/products/category/All', async (req, res) => {
            const result = await products.find({}).toArray();
            res.json(result);
        })

        //Search products by query
        app.get('/products', async (req, res) => {
            const limit=req.query.limit;
            const result = await products.find().limit(parseInt(limit)).toArray()
            res.send(result)


        })

        //Get products by category
        app.get('/products/category/:category', async (req, res) => {
            const params = req.params;
            const result = await products.find(params).toArray()
            res.json(result);
        })

        //Get a product by id
        app.get('/products/:id([0-9a-fA-F]{24})', async (req, res) => {
            const id = req.params.id;
            const objectId=new ObjectId(id)
            const query={_id:objectId}
            const result = await products.findOne(query)
            res.json(result);
        })

        app.get('/users', async (req, res) => {
            const cursor = products.find({});
        })
    } finally {
        //await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Shopping corner app listening on port ${port}`)
})