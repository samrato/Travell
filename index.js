const express =require("express")
const dotenv=require("dotenv")
const ConnectDB = require("./config/db");
const routes = require("./Routes/Routes");
const app=express()
dotenv.config();
app.use(express.json())
app.use("/api",routes)
const PORT=process.env.PORT ||5000



app.listen(PORT,async()=>{
    try {
        await ConnectDB()
        console.log(`server running ${PORT}`)
    } catch (error) {
       console.error(error) 
    }
   
})