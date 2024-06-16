import express from "express";
import {  deleteUser, getAllUsers, getUser, newUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";


const app = express.Router();


//route - /api/v1/user/new

app.post("/new" , newUser);


//route - /api/v1/user/all

app.get("/all",adminOnly,getAllUsers);

//route - /api/v1/user/dynamicID
// This function is used for getting particular user


// we can also do the chaining here

app.route("/:id").get(getUser).delete(adminOnly,deleteUser);

// app.get("/:id",getUser);

// app.delete("/:id",deleteUser);

export default app;