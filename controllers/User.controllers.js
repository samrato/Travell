const User=require("../models/User")
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')

const RegisterUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(422).json({ message: "All fields are required" });
        }
        if (name.length < 3) {
            return res.status(422).json({ message: "Username should be at least 3 characters long" });
        }
        if (password.trim().length < 6) {
            return res.status(422).json({ message: "Password should be at least 6 characters" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const ProfileImage = `https://api.dicebear.com/9.x/avataaar/svg?seed=${name}`;

        const newUser = await User.create({ name, email, password: hashedPassword, ProfileImage });

        // Generate JWT token
        const token = generateToken({ id: newUser._id });

        return res.status(201).json({
            token,
            user: {
                userId: newUser._id,
                name: newUser.name,
                email: newUser.email,
                ProfileImage: newUser.ProfileImage,
                createdAt: newUser.createdAt,
            }
        });
    } catch (error) {
        console.error("Registration error", error);
        return res.status(500).json({ message: "User registration failed" });
    }
};

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
