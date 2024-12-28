

import { ENV_VARS } from "./envVars.js";
import mongoose from "mongoose";
export const connectDB =async()=>{
    try {
       const conn=  await mongoose.connect(ENV_VARS.MONGO_URI)
       console.log("mongoconnected:"+conn.connection.host);
        
    } catch (error) {
        console.error("error connection to  mongodb"+error.message);

        process.exit(1);
        
    }
}