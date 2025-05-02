const fs = require("fs");
const { v4: uuid } = require("uuid");
const path = require("path");
const cloudinary = require("cloudinary");
const Book = require("../models/Book");

const AddStory = async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res.status(422).json({ message: "All fields are required" });
    }
    // upload image to clodinary and

    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    //save it to mongo DB
    const newBook = await Book.create({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    return res.status(201).json(newBook);

    // // Check if files are uploaded
    // if (!req.files || !req.files.image) {
    //   return res.status(422).json({ message: "Choose an Image" });
    // }

    // // const { image } = req.files;

    // // Validate image size (limit to 1MB)
    // if (image.size > 1000000) {
    //   return res.status(422).json({ message: "File size is too big" });
    // }

    // // Prepare image file name
    // let fileName = image.name;
    // fileName = fileName.split(".");
    // fileName = fileName[0] + uuid() + "." + fileName[fileName.length - 1];

    // // Move the file to the 'uploads' directory
    // await image.mv(
    //   path.join(__dirname, "..", "uploads", fileName),
    //   async (err) => {
    //     if (err) {
    //       console.error("Error moving file:", err);
    //       return res.status(422).json({ message: "Image upload failed" });
    //     }

    //     // Upload the file to Cloudinary
    //     try {
    //       const result = await cloudinary.uploader.upload(
    //         path.join(__dirname, "..", "uploads", fileName),
    //         { resource_type: "image" }
    //       );

    //       if (!result.secure_url) {
    //         return res
    //           .status(422)
    //           .json({ message: "Could not upload the image" });
    //       }

    //       // Remove the local file after uploading to Cloudinary to avoid residual files
    //       fs.unlink(path.join(__dirname, "..", "uploads", fileName), (err) => {
    //         if (err) {
    //           console.error("Error removing file after upload:", err);
    //         }
    //       });

    //       // Save story details in the database
    //       const newBook = await Book.create({
    //         title,
    //         caption,
    //         rating,
    //         image: result.secure_url,
    //         user: req.user._id,
    //       });

    //     return res.status(201).json(newBook);
    //   } catch (cloudinaryError) {
    //     console.error("Error uploading to Cloudinary:", cloudinaryError);
    //     return res.status(500).json({ message: "Image upload failed" });
    //   }
    // }
    // );
  } catch (error) {
    console.error("Error uploading story:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get all the boooks
// get all stories this is done with pagetions nd a query is needed
const GetStory = async (req, res) => {
  try {
    // paginations =>The infinite loading
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username ProfileImage");

    const total = await Book.countDocuments();
    return res.status(200).json({
      books,
      currentPage: page,
      totalBooks: total,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.error("error in getting all stories", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// The delete of books thats also needed
//delete story // specific id
const DeleteStory = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(500).json({ message: "The story is not found" });
    }
    // check if the user is the owner of the book
    if (book.user.toString() !== req.user_id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    // delete the image  from the cloudinary

    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteErro) {
        console.log("error in deleting image.", deleteErro);
      }
    }

    await book.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }

  // try {
  //   const book = await Book.findById(req.params.id);

  //   const { id } = req.params;
  //   const userId = req.user.id;

  //   console.log("Requested Blog ID:", id);
  //   console.log("User ID from token:", userId);

  //   const book = await Book.findById(id);
  //   console.log("Found Blog:", book);
  //   if (!book) {
  //     return res.status(500).json({ message: "The story is not foun" });
  //   }
  //   console.log("Blog Author:", book.user);
  //   if (!book.user) {
  //     return res
  //       .status(400)
  //       .json({ message: "story does not have an associated Author" });
  //   }
  //   if (book.user.toString() !== userId) {
  //     return res
  //       .status(403)
  //       .json({ message: "You are not authorized to delete this story" });
  //   }
  //   // delete the iimage in cloudinary
  //   if (book.image && book.image.includes("cloudinary")) {
  //     try {
  //       const publicId = book.image.split("/").pop().split(".")[0];
  //       await cloudinary.uploader.destroy(publicId);
  //     } catch (deleteErro) {
  //       console.log("error in deleting image.", deleteErro);
  //     }
  //   }

  //   await book.deleteOne();
  //   res.status(200).json({ message: "Blog deleted successfully" });
  // } catch (error) {
  //   console.error(error);
  //   return res.status(500).json({ message: "Internal server error" });
  // }
};
// not nedded for sahiii cause no upadations is gooing to be done
//update a story specific id
const UpdateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, caption, image, rating } = req.body;
    if (!title || !caption || rating) {
      return res.status(422).json({ message: "fill in all fields " });
    }
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "story not found" });
    }
    if (book.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this blog" });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, caption, rating, image },
      { new: true }
    );

    res.status(200).json({ message: "Blog updated successfully", updatedBook });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get books  story nfor the specific user logged in
// this one also is needed for frotrnd

const GetUserBook = async () => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(books);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal sercver error" });
  }
};

module.exports = { GetStory, AddStory, DeleteStory, UpdateStory, GetUserBook };
