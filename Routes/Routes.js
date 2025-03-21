const { Router } = require("express");
const { RegisterUser, LoginUser } = require("../controllers/User.controllers");
const{GetStory,AddStory,DeleteStory,UpdateStory,GetUserBook}=require("../controllers/Books.controllers")

const routes=Router()
// the login and registrations routes


routes.post("/register",RegisterUser)
routes.post("/login",LoginUser)


routes.get("/story",GetStory)
routes.post("/story",AddStory)
routes.delete("/story/:id",DeleteStory)
routes.get("/story",GetUserBook)
routes.patch("/story/:id",UpdateStory)




module.exports=routes