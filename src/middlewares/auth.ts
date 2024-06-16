

//  Middleware to make sure that only admin is alowed

import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

export const adminOnly = TryCatch(async(req,res,next) =>{

    const {id} = req.query;

    if(!id) return next(new ErrorHandler("Do Login First",401));

    const user = await User.findById(id);

    if(!user) return next(new ErrorHandler("ID given is not correct",401));

    if(user.role!=="admin")
        return next(new ErrorHandler("You are not allowed to access",403));

    next();
    // so in the chain whichever is there 


});


// lets understand the difference between params and query 
// what is params "api/v1/user/ahsaddj"
// what is query: the question mark which we use

//"api/v1/user/assjus?key=24"