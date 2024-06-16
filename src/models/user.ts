import mongoose  from "mongoose";
import validator from "validator";


interface IUser extends Document{
    id:string;
    name:string;
    email:string;
    photo:string;
    role:"admin" |"user";
    gender:"male" | "female";
    dob:Date;
    createdAt: Date;
    updatedAt: Date;

    // Virtual Attribute

    age:number;

}


// When u are using typescript here the string (s in lowercase)

// When u are using mongodb here the string is (S in uppercase)

const schema = new mongoose.Schema({


    _id: {
        type:String,
    required:[true, "Please enter ID"],

},

name:{
    type: String,
    required :[true, "Pleae enter name"],

},
email:{
    type: String,
    unique:[true,"Email Already Exists"],
    required :[true, "Pleae enter email"],
    validate:validator.default.isEmail,

},

photo:{
    type: String,
    required :[true, "Pleae add Photo"],

},

role:{
    type: String,
    enum :["admin","user"],
    default:"user",

},

gender:{
    type: String,
    enum :["male","female"],
    required :[true, "Pleae enter gender"],
    

},

dob:{
    type: Date,
    

    required :[true, "Please enter Date fof Birth"],
    

},
},

{
    timestamps:true,
}
);


schema.virtual("age").get(function()
{
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();


    if(today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()))
    {
            age--;
    }

        return age;
});

//Let's use an example to clarify this:

// Example 1
// Date of Birth: 1990-08-25 (25th August 1990)
// Today's Date: 2024-05-22 (22nd May 2024)
// Initial Age Calculation:

// age = 2024 - 1990 = 34
// Adjusting for Birthday Not Yet Reached:

// Check the month and day:
// today.getMonth() = 4 (May, month is 0-indexed)
// dob.getMonth() = 7 (August)
// Since May (4) is less than August (7), the condition today.getMonth() < dob.getMonth() is true.
// Therefore, subtract 1 from age:
// age = 34 - 1 = 33
// So, the correct age for someone born on 25th August 1990 as of 22nd May 2024 is 33 years.

// Example 2
// Date of Birth: 1990-03-15 (15th March 1990)
// Today's Date: 2024-05-22 (22nd May 2024)
// Initial Age Calculation:

// age = 2024 - 1990 = 34
// Adjusting for Birthday Already Passed:

// Check the month and day:
// today.getMonth() = 4 (May, month is 0-indexed)
// dob.getMonth() = 2 (March)
// Since May (4) is greater than March (2), the condition today.getMonth() < dob.getMonth() is false.
// No need to adjust the age since the birthday has already passed this year.
// So, the correct age for someone born on 15th March 1990 as of 22nd May 2024 is 34 year



export const User = mongoose.model<IUser>("User", schema);