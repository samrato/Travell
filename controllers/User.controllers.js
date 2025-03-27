const User=require("../models/User")
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')

const RegisterUser=async(req,res)=>{
    try {
        const{name ,email , password }=req.body
        if (!name || !email || !password ) {
            return res.status(422).json({message:"All field are required "})
        }
        if(name.length<3){
            return res.status(422).json({message:"Userbshould be atleast 3 characters lon"})
        }
        if((password.trim().length)<6){
            return res.status(422).json({message:"Password should be atleast 6 characters "})}
            // check user availability
            const existingUser=await User.findOne({email})
            if(existingUser){
                return res.status(400).json({message:"User already exists"})
            }
            const existingEmail=await User.findOne({name})
            if(existingEmail){
                res.status(400).json({message:"Email already exist"})
            }
            // hash password
        const salt =await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt)

            // get the avater
            const ProfileImage =`https://api.dicebear.com/9.x/avataaar/svg?seed=${name}`

            const newUser = await User.create({ name, email, password: hashedPassword,ProfileImage });
            console.log(newUser)
          return  res.status(201).json({ message: "User registered successfully "});


    } catch (error) {
        console.error("Registrationerroe",error)
        return res.status(500).json({message:"User registration failed"});
    }
}
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};



const LoginUser=async(req,res)=>{
    try {
        const email = req.body.email ? req.body.email.toLowerCase() : "";
        const { password } = req.body;

        if (!email || !password) {
            return res.status(422).json({message:"fill in all fields "})
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(422).json({message:"Invalid credentials"})
           
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(422).json({message:"Invalid credentials"})
        }

        const token = generateToken({ id: user._id });

      return res.status(200).json({ token,user:{
            userId: user._id ,
            name:user.name,
            email:user.email,
            ProfileImage:user.ProfileImage,
            createdAt:user.createdAt
        }});
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal server error"})
    }
}




module.exports = { RegisterUser, LoginUser};