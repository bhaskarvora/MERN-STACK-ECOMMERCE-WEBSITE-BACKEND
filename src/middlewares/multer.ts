import multer from "multer";

import {v4 as uuid} from 'uuid'

// This file is saved into RAM

// multer().single("file");

const storage = multer.diskStorage({

    destination(req,file,callback)

    {
        callback(null,"uploads");
    },

    filename(req,file,callback)
    {

        const id = uuid();

        // in this we are splitting the image name for example macbook.jpg so we are poping the .jpg
        // so by this by creating the product we will get different id for photo
        const extName = file.originalname.split(".").pop();

       
        callback(null,`${id}.${extName}`);
    }

});

export const singleUpload = multer({storage}).single("photo")