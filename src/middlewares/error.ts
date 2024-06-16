
import { NextFunction,Request,Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";

export const errorMiddleware = (err:ErrorHandler,req:Request,res:Response,next:NextFunction) =>{

    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;


    if(err.name==="CastError") err.message= "Invalid ID"

    // why the above we used because if the id is same and we added or decrease the digit of id then this error should be shown
    // Otherwise the error which we mentioned in the specific query will be executed.


    return res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
};


export const TryCatch = (func:ControllerType) => 
    (req: Request,res: Response,next:NextFunction) =>{

        // As we know Promise is a fancy way of writing Try Catch and in this resolve and reject are there 
        return Promise.resolve(func(req,res,next)).catch(next);
        ;

};
