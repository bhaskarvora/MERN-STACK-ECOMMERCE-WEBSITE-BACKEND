import mongoose from "mongoose";
import { trim } from "validator";


const schema = new mongoose.Schema({

name:{
    type: String,
    required :[true, "Pleae enter name"],

},

photo:{
    type: String,
    required :[true, "Pleae add Photo"],

},

price:{
    type: Number,
    required :[true, "Pleae enter Price"],

},
stock:{
    type: Number,
    required :[true, "Pleae enter Stock"],

},

category:{
    type: String,
    required :[true, "Pleae enter Category"],
    trim:true,

},
},

{
    timestamps:true,
}
);

export const Product = mongoose.model("Product", schema);