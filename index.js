const express = require("express")
var cron = require(`node-cron`);
var nodemailer = require('nodemailer');
const app = express()
const path = require("path")
const mongoose = require('mongoose');
const flash = require("connect-flash")
const User =require("./models/user")
var bodyParser = require('body-parser');
var session = require('express-session')
const dashboard = require("./routes/dashboard")
const dbURL = "mongodb+srv://davidmiller4504:LTSVp7IMEBKNMcUf@cluster0.zhgo4fr.mongodb.net/?retryWrites=true&w=majority" 
//'mongodb://localhost:27017/swift'     
const MongoDBStore = require("connect-mongo")
const functions = require("firebase-functions")
mongoose.connect( dbURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(()=>{
    console.log("connection open")
  } )
  .catch((error)=>{
    console.log(error,"oh no error")
  })
// const store = new MongoDBStore({
//     url: dbURL,
//     secret: "this should be a secret",
//     touchAfter: 24 * 60 * 60 
//   });
var myemail = 'kvjp gdmf hdym cmcb'
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'b71809244@gmail.com',
    pass: myemail
  }
});


app.use(bodyParser());
app.use(session({
  secret: 'dashboard',
  store: new MongoDBStore({
    mongoUrl: dbURL, 
    touchAfter: 24 * 60 * 60 

})
}))
app.use(flash()) 
app.use((req,res,next)=>{
  res.locals.error = req.flash("error")
  next()
})
app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  next()
})
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.raw());
// parse text
app.use(bodyParser.text());
app.use(express.static("public"))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views",))
app.use("/account", dashboard)

app.get("/", (req,res)=>{
    res.render("index")
})

app.get("/login", (req,res)=>{
    res.render("login")
}) 

app.post("/login", async(req,res)=>{
  const {username,password} = req.body
 const user = await User.findOne({username,password})
 req.app.set("name", username) 
 if (user) {
   var email = user.email 
   req.session.user_id = user._id
  console.log(user)
  res.redirect(`/account`)
 }
 else { 
  req.flash("error", "incorrect details")
  res.redirect("/login")
 }

})
app.get("/forgot_password", (req,res)=>{
  res.render("forgot")
})
app.post("/forgot", async(req,res)=>{
  const {useremail} = req.body
  const user = await User.findOne({useremail})   
   console.log(user.email)
  if (user) {
    var mailOptions = {
      from: myemail,
      to: user.email,
      subject: 'account recovery',
      text: `Click on the link below to change email address 
      
      https://swift-akud.onrender.com/change_password`
       };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  }
})

app.get("/change_password", async(req,res)=>{
   res.render("password")
})

app.post("/change_password", async(req,res)=>{
  const {useremail,password} = req.body
  const user = await User.findOne({useremail})
  user.password = password
  console.log(user.password)
  await user.save()
  res.redirect("/login")
})

app.get("/signup", (req,res)=>{
    res.render("signup")
})

app.post("/signup", async(req,res)=>{
  const {fullname,username,email,password} = req.body
  const user = new User({
    fullname,
    username,
    email,
    password
  })
  await user.save()
  req.flash("success", "signup success, you can now login")
  res.redirect("/login")
})

app.post("/logout", (req,res)=>{
  req.session.user_id = null
  res.redirect("/login")
})

app.get("/arbitrage", (req,res)=>{
  res.render("arbitrage")
}) 
app.get("/news", (req,res)=>{
  res.render("news")
}) 
app.get("/partnership", (req,res)=>{
  res.render("partnership")
}) 
app.get("/about_us", (req,res)=>{
  res.render("about-us")
}) 
app.get("/help", (req,res)=>{
  res.render("support")
}) 



app.listen(4000, ()=>{
    console.log("Listening")
})

exports.api = functions.https.onRequest(app)

