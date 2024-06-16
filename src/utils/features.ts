import mongoose,{Document}  from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

export const connectDB = (uri:string) =>{

    mongoose.connect(uri,{
        dbName: "Ecommerce_24",
    }).then((c) => console.log(`DB Connected to ${c.connection.host}`)).catch((e)=> console.log(e));
};


export const invalidateCache = ({product,order,admin,userId,orderId,productId}:InvalidateCacheProps)=>
{
    if(product)
        {
            const productKeys: string[] = ["latest-products","categories","all-products",`product-${productId}`];


            // `product-${id}`
           
            if(typeof productId ==="string") productKeys.push(`product-${productId}`);

            if(typeof productId ==="object") 
                
                    productId.forEach((i) => productKeys.push(`product-${i}`));
                    
                

                // In the above if condition we are using productID as array and thats why we have to make it to object
            myCache.del(productKeys);
        }

    if(order)
        {

            const ordersKeys: string[] = ["all-orders",`my-orders-${userId}`,`order-${orderId}`];
            

           

            myCache.del(ordersKeys);

        }

    if(admin)
        {
            myCache.del(["admin-stats","admin-pie-charts","admin-bar-charts","admin-line-charts"]);
        }
};

export const reduceStock =async(orderItems:OrderItemType[]) =>{

    for (let i = 0; i < orderItems.length; i++) {
        
        const order = orderItems[i];
        const product = await Product.findById(order.productId);

        if(!product) throw new Error("Product Not Found");
        product.stock -= order.quantity;
        //here we are decreasng the order from quantity
        await product.save();


    }

};


// the formula is for relative percentage change means change percent + previous value 
// 300% of 2 is 6 , so change is 6 so 6+2 =8


export const calculatePercentage =(thisMonth:number,lastMonth:number) =>{

    if(lastMonth === 0) return thisMonth * 100;

    const percent =(thisMonth/lastMonth) * 100;
    return Number(percent.toFixed(0));
};

export const getInventories = async({categories,productsCount}:{categories:string[];productsCount:number}) =>{

    const categoriesCountPromise =  categories.map((category) => Product.countDocuments({category}));

    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount : Record<string,number>[]=[];
    
    categories.forEach((category,i) => {

     categoryCount.push({
         [category]: Math.round((categoriesCount[i]/productsCount) * 100),
     });

    });

    return categoryCount;

};


interface MyDocument  extends Document{
    createdAt:Date; 
    discount?: number;
    total?: number;

    // ?: means mismatch
};

type FuncProps = {
    length:number;
    docArr:MyDocument[];
    today:Date;
    property?: "discount" | "total";
};


export const getChartData = ({length,docArr,today,property} : FuncProps ) => {

    


    const data = new Array(length).fill(0);

    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;


        if(monthDiff < length)
            {
                

                if(property)
                    {
              data[length - monthDiff -1] += i[property]!;
                    }

                    else{
                        data[length - monthDiff -1] += 1;
                    }
                    

                // For example creation month is 8 and current month is 10 so 6 -2 -1 = 3 so it will be  on third index
               
                
            }
    });

    return data;
};