const mongoose =require("mongoose")

const ConnectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL,{
           
        });
        console.log("Database connected successfully");
    } catch (error) {
       console.error( "Database is not connected",error) 
       process.exit(1)
    }
}

module.exports=ConnectDB