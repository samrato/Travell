
const Book =require("../models/Story")
const { v4: uuid } = require("uuid");
const cloudinary=require("../utils/cloudinary")

// create a story
const AddStory=async(req,res)=>{
    try {
        const{title,caption ,rating}=req.body
        if(!title ||!caption  ||!rating){
            return res.status(422).json({message:"All field are required "})
        }
        // upload image to cloudinary 
        if(req.files.image){
            return res.status(422).json({message:"Choose an Image"})}
         const{image}=req.files;
         if (image.size > 1000000) {
            return res.status(403).json({message:"File size is so big"})}
            
            let fileName = image.name;
    fileName = fileName.split(".");
    fileName = fileName[0] + uuid() + "." + fileName[fileName.length - 1];
    // upload files to upload folder
    await image.mv(
      path.join(__dirname, "..", "uploads", fileName),
      async (err) => {
        if (err) {
            console.error(err)
          return res.status(422).json({message:"Image failed"})
        }
        // store image on cloudinary
        const result = await cloudinary.uploader.upload(
          path.join(__dirname, "..", "uploads", fileName),
          { resource_type: "image" }
        );
        if (!result.secure_url) {
            return res.status(422).json({message:"Could not upload the image"})
        }
        // if succs saves the election to Db
        const newBook= await Book.create({
          title,
          caption,
          rating,
          image: result.secure_url,
          user:req.user._id
        });
        return res.status(201).json(newBook);
      }
    );
        // save to DB
    } catch (error) {
       console.error("Error Uploading story",error) 
       return res.status(500).json({message:"Internal server error"})
    }
}




//delete story // specific id
const DeleteStory=async(req,res)=>{

    try {
        
    } catch (error) {
       console.error(error) 
    }
}


//update a story specific id
const UpdateStory=async(req,res)=>{

    try {
        
    } catch (error) {
       console.error(error) 
    }
}
