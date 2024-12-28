import express from "express"


import authRoutes from "./routes/auth.route.js"
import { ENV_VARS } from "./config/envVars.js"

import { connectDB } from "./config/db.js"


const PORT=ENV_VARS.PORT
const app=express()

app.use(express.json())

 
app.use("/api/v1/auth",authRoutes)

app.listen(PORT,()=>{
    console.log("server is running at http://localhost:"+PORT)
    connectDB()
})

//
//mongodb+srv://achantatarak:<db_password>@cluster0.gize8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0