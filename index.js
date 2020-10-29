const express = require('express');
const bodyParser = require("body-parser")
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}))
const password = '9juzaJ7qgziJEdvG'
const uri = "mongodb+srv://imran-hossain:9juzaJ7qgziJEdvG@cluster0.e30mt.mongodb.net/organicdb?retryWrites=true&w=majority";

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.htm')
})



const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");
   
  app.get("/products", (req, res)=>{
      productCollection.find({})
      .toArray( (err, documents)=>{
          res.send(documents)
      })
  })
  
  app.post("/addProduct", (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)

        .then(result =>{
            console.log('add to')
            res.redirect('/')
        })
    })
    app.get('/product/:id', (req, res)=>{
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents)=>{
            res.send(documents[0])
        })
    })
    app.patch('/update/:id', (req, res)=>{
        productCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: {price: req.body.price, quantity: req.body.quantity}
          
        }
        )
        .then(result => {
            res.send(result.modifiedCount > 0)
        })
    })

    app.delete('/delet/:id', (req, res)=>{
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result=>{
                res.send(result.deletedCount > 0)
        })
    })
});


app.listen(4000)