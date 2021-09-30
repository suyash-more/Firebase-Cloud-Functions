const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const serviceAccount = require("../credentials.json");

app.use(cors({origin: true}));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Routes
app.get("/", function(req, res) {
  return res.status(200).send("Hello World..!!");
});


// Create
app.post("/api/create", (req, res) => {
  (async() => {
    try{
        await admin.firestore().collection('users').doc(`${req.body.id}`).create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    });
    return res.status(200).send("Called post create..!!");
  }catch(error){
      console.log(error);
      return res.status(500).send(error);
  }
  })();
});


// Read
app.get("/api/read/:id", (req, res) => {
  (async() => {
    try{
        const documents = admin.firestore().collection('users').doc(`${req.params.id}`);
        let product = await documents.get();
        let response = product.data();
        return res.status(200).send(response);
    }catch(error){
        console.log(error);
        return res.status(500).send(error);
    }
  })();
});

// Read all
app.get("/api/readall", (req, res) => {
  (async() => {
    try{
        let lst= [];
        const documents = admin.firestore().collection("users");
        await documents.get().then(products =>{
          products.forEach(product =>{
              const item = {
                id: product.id,
                name: product.data().name,
                description: product.data().description,
                price: product.data().price
              }
              lst.push(item);
          })
          return lst;
        });
        return res.status(200).send(lst);
    }catch(error){
        console.log(error);
        return res.status(500).send(error);
    }
  })();
});

// Update

app.put("/api/update/:id", (req, res) => {
  (async () => {
    try{
      const document = admin.firestore().collection("users").doc(`${req.params.id}`);
      await document.update({ 
        name: `${req.body.name}`,
        description: `${req.body.description}`,
        price: `${req.body.price}`
      });
      return res.status(200).send("Updated successfully..!!");
    }catch(error){
      console.log(error);
      return res.status(500).send(error);
    }
  })();

});

// Delete

app.delete("/api/delete/:id", (req, res) => {
  (async () => {
    try{
      const document = admin.firestore().collection("users").doc(`${req.params.id}`);
      await document.delete();
      return res.status(200).send("Deleted successfully..!!");
    }catch(error){
      console.log(error);
      return res.status(500).send(error);
    }
  })();

});


// Delete all

app.delete("/api/deleteall", (req, res) => {
  (async () => {
    try{
      await admin.firestore().collection("users").listDocuments().then(products =>{
        products.forEach(product =>{product.delete();});
      });
      return res.status(200).send("Deleted all successfully..!!");
    }catch(error){
      console.log(error);
      return res.status(500).send(error);
    }
  })();

});

exports.app = functions.https.onRequest(app);
