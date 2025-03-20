const { Router } = require("express");
const { RegisterUser, LoginUser } = require("../controllers/User.controllers");

const routes=Router()
// the login and registrations routes


routes.post("/register",RegisterUser)
routes.post("/login",LoginUser)







module.exports=routes