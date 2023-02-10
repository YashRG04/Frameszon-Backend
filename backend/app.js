const express = require("express");
const app=express();

const errorMiddleware = require("./middleware/error");

app.use(express.json());

//route imports
const product=require("./routes/productRoute");
const user = require("./routes/orderRoute");
const order = require("./routes/orderRoute");

app.use("/api/v1",product);

//Middleware for errors
app.use(errorMiddleware);

module.exports=app;
