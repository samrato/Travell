const { Router } = require("express");
const { RegisterUser, LoginUser } = require("../controllers/User.controllers");
const {
  GetStory,
  AddStory,
  DeleteStory,
  UpdateStory,
  GetUserBook,
} = require("../controllers/Books.controllers");
const authMiddleware = require("../middleware/authMiddleware");

const routes = Router();
// the login and registrations routes

routes.post("/register", RegisterUser);
routes.post("/login", LoginUser);
// the routes are updated
routes.get("/books",authMiddleware, GetStory);

// create a post
routes.post("/books", authMiddleware, AddStory);

routes.delete("/story/:id", DeleteStory);
routes.get("/story/:id", GetUserBook);
routes.patch("/story/:id", UpdateStory);

module.exports = routes;
