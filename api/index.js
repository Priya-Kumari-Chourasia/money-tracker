const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express();
const Transaction = require('./models/transaction.js');
const { default: mongoose } = require('mongoose');

app.use(cors());
app.use(express.json());
app.get('/api/test', (req,res) => {
    res.json('test ok');

});

app.post('/api/transaction', async(req, res) => {
    try{
        console.log("Connecting to MongoDB database...");

    
    //console.log(process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL)
    console.log("MongoDB database connected successfully!");

    // Check if all required fields are present in the request body
    if (
        !req.body.name ||
        !req.body.description ||
        !req.body.datetime ||
        !req.body.price
      ) {
        res.status(400).send("Missing required fields");
        return;
      }

    const {name,description,datetime,price} = req.body;
    const tran = await Transaction.create({
        name,description,datetime,price,
    });
    res.json(tran);
}catch (error) {
    console.error("Error connecting to MongoDB database:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get('/api/transactions',async(req,res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find();
    res.json(transactions);
})
app.listen(4000);
