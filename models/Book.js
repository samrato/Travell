const mongoose =require("mongoose")


const bookSchema=new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Title is required"]
    },
    caption:{
        type: String,
        required: [true, "Caption is required"]
    },
    image:{
        type: String,
        required: [true, "Image is required"]
    },
    rating:{
        type: Number,
        required: [true, "Rating is required"],
        min:1,
        max:5
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Name is required"],
        ref:"User"
    },


},{timestamps:true})

const Book=mongoose.model("Book",bookSchema)
module.exports=Book