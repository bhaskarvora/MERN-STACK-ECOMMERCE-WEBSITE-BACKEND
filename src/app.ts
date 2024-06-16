import express from "express";





import { connectDB } from "./utils/features.js";
import { Error } from "mongoose";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import {config} from "dotenv";

// dotenv is an environment which makes the environment env means environment variable
import morgan from "morgan";
// morgan is used to know which request is passed and we wil get to know 
import Stripe from "stripe";
// for payment integration we use stripe

import cors from "cors"


// Importing Routes


import userRoute from "./routes/user.js";


import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";

import dashboardRoute from "./routes/stats.js";



config({
    path:"./.env",
});




const port = process.env.PORT || 4000;

const mongoURI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";

connectDB(mongoURI);

export const stripe = new Stripe(stripeKey);

export const myCache = new NodeCache();

//whAT IS Cache: to Store data in RAM memory 
// The basic purpose of this is to make teh system more faster then mongodb

//by passing the argumnet in the NodeCache for example 200 seconds it will be closed after that time 
//otherwise if we donot pass any argument it will be opened infinetly it will not start server or donot validate

const app = express();

//middleware 

app.use(express.json());

app.use(morgan("dev"));

app.use(cors());

app.get("/",(req,res) =>
{
    res.send("API Working with /api/v1");
});

// Using Routes

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);

app.use("/api/v1/payment", paymentRoute);

app.use("/api/v1/dashboard",dashboardRoute);


//last middleware

// why next function so it basically passes to next middleware function if there are more middleware function 

// here we are declaring static folder of uploads
app.use("/uploads",express.static("uploads"));

app.use(errorMiddleware);

app.listen(port, ()=>
{
    console.log(`Express is working on http://localhost:${port}`)
});