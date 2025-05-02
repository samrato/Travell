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
routes.get("/books", authMiddleware, GetStory);
// create a post
routes.post("/books", authMiddleware, AddStory);
// Delete a poooks
routes.delete("/books/:id", authMiddleware, DeleteStory);
// the useer of specific stoery
routes.get("/books/user", authMiddleware, GetUserBook);

// not needed for known cause updates its not actulaa lly implimented in the drotend
routes.patch("/books/:id", authMiddleware, UpdateStory);

module.exports = routes;
