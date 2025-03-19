const express =require("express")
const dotenv=require("dotenv")
const ConnectDB = require("./config/db")
const app=express()
dotenv.config();
app.use(express.json())
const PORT=process.env.PORT ||5000



app.listen(PORT,async()=>{
    try {
        await ConnectDB()
        console.log(`server running ${PORT}`)
    } catch (error) {
       console.error(error) 
    }
   
})