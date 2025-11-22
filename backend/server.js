// requires
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// initializing server
const server = express();
const port = 3000;
const { DB_URI } = process.env;
const Product = require("./models/product");

// middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

// database connection and server listening
mongoose
  .connect(DB_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`Database is connected\nServer is listening on port ${port}`);
    });
  })
  .catch((error) => console.log(error.message));

// routes
// root route
server.get("/", (request, response) => {
  response.send("Server is live");
});

// to get all the data from the products collection
server.get("/products", async (request, response) => {
  try {
    const products = await Product.find();
    response.send(products);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// delete a product from db by id
server.delete("/products/:id", async (request, response) => {
  const { id } = request.params;
  try {
    await Product.findByIdAndDelete(id);
    response.send({ message: `Product is deleted with the id ${id}` });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

// post route
server.post("/products", async (request, response) => {
  const newProduct = new Product({
    productName: request.body.productName,
    brand: request.body.brand,
    image: request.body.image,
    price: request.body.price,
  });
  try {
    await newProduct.save();
    response.send({
      message: `Product is created with the id ${newProduct._id}`,
    });
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

server.get("/products/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const productToEdit = await Product.findById(id);
    response.send(productToEdit);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

server.patch("/products/:id", async (request, response) => {
  const { id } = request.params;
  const { productName, brand, image, price } = request.body;
  try {
    await Product.findByIdAndUpdate(id, {
      productName: productName,
      brand: brand,
      image: image,
      price: price,
    });
    response.send({ message: `Product has been updated with id ${id}` });
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});
