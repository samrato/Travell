const mongoose=require('mongoose')
const UserSchema=new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Name is required"], 
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true, 
        trim: true,
        lowercase: true,
        
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        // select: false 
    },
    ProfileImage:{
        type: String,
        default:""
    }

},{ timestamps: true })

const User=mongoose.model("User",UserSchema)
module.exports=User