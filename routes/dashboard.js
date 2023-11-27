const express = require("express")
const router = express.Router()
const User = require("../models/user")


router.get("/", async(req,res)=>{
    const useremail = req.query.name
    let name = res.app.get("name")   
    const user = await User.findOne({username:name})
    if(!req.session.user_id){
      res.redirect("/")
    } 
     res.render("dashboard",{useraccount : user})
    
  })

router.get(`/deposit`, async (req,res)=>{
    const useremail = req.query.name
    let name = res.app.get("name")   
    const user = await User.findOne({username:name})
    if(!req.session.user_id){
      res.redirect("/")
    } 
    res.render("deposit",{useraccount : user})
})

router.get("/withdraw", async(req,res) =>{
    const useremail = req.query.name
    let name = res.app.get("name")   
    const user = await User.findOne({username:name})
    if(!req.session.user_id){
      res.redirect("/")
    } 
    res.render("withdraw",{useraccount : user})
})
router.get("/withdraw_history", async(req,res) =>{
    const useremail = req.query.name
    let name = res.app.get("name")   
    const user = await User.findOne({username:name})
    if(!req.session.user_id){
      res.redirect("/")
    } 
    res.render("withdraw_history",{useraccount : user})
})


  module.exports = router;
