const express = require("express");
var cron = require(`node-cron`);
var nodemailer = require("nodemailer");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const User = require("./models/user");
var bodyParser = require("body-parser");
var session = require("express-session");
const dashboard = require("./routes/dashboard");
const dbURL =
  "mongodb+srv://davidmiller4504:LTSVp7IMEBKNMcUf@cluster0.zhgo4fr.mongodb.net/?retryWrites=true&w=majority";
//'mongodb://localhost:27017/swift'
const MongoDBStore = require("connect-mongo");
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection open");
  })
  .catch((error) => {
    console.log(error, "oh no error");
  });
// const store = new MongoDBStore({
//     url: dbURL,
//     secret: "this should be a secret",
//     touchAfter: 24 * 60 * 60
//   });
var myemail = "kvjp gdmf hdym cmcb";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "b71809244@gmail.com",
    pass: myemail,
  },
});

app.use(
  session({
    secret: "dashboard",
    store: new MongoDBStore({
      mongoUrl: dbURL,
      touchAfter: 24 * 60 * 60,
    }),
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
});
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
// parse text
app.use(bodyParser.text());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use("/account", dashboard);

// app.get('*', (req, res) => {
//   res.redirect(301, 'https://tradecryptexchange.com' + req.originalUrl);
// });

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  req.app.set("email", email);
  if (user) {
    var useremail = user.email;
    req.session.user_id = user._id;
    console.log(user);
    res.redirect(`/account`);
  } else {
    req.flash("error", "incorrect details");
    res.redirect("/login");
  }
});

app.get("/forgot_password", (req, res) => {
  res.render("forgot");
});
app.post("/forgot", async (req, res) => {
  const { useremail } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email: useremail });
  if (user) {
    var mailOptions = {
      from: myemail,
      to: user.email,
      subject: "account recovery",
      text: `Click on the link below to change email address 
      
      https://tradecryptexchange.com/change_password`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/checkmail");
        console.log("Email sent: " + info.response);
      }
    });
  }
});

app.get("/change_password", async (req, res) => {
  res.render("password");
});
app.get("/checkmail", async (req, res) => {
  res.render("checkmail");
});

app.post("/change_password", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  user.password = password;
  console.log(user.password);
  await user.save();
  res.redirect("/login");
  console.log(email);
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { fullname, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      req.flash("error", "email already exists");
      return res.redirect("/signup");
    } else if (existingUser) {
      req.flash("error", "Username already exists");
      return res.redirect("/signup");
    }
    const user = new User({
      fullname,
      username,
      email,
      password,
    });
    await user.save();
    req.flash("success", "signup success, you can now login");
    res.redirect("/login");
  } catch {
    req.flash("error", "signup failure, please try again later");
  }
});

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
});

app.get("/arbitrage", (req, res) => {
  res.render("arbitrage");
});
app.get("/news", (req, res) => {
  res.render("news");
});
app.get("/partnership", (req, res) => {
  res.render("partnership");
});
app.get("/about_us", (req, res) => {
  res.render("about-us");
});
app.get("/help", (req, res) => {
  res.render("support");
});
app.get("/faq", (req, res) => {
  res.render("faq");
});
app.get("/support", (req, res) => {
  res.render("request");
});
app.get("/asdfjduadminusers", async (req, res) => {
  try {
    const users = await User.find({}); // Exclude password
    res.render("admin", { users });
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});
app.post("/admin/update", async (req, res) => {
  const { userId, profit, deposit } = req.body;
  console.log(req.body, userId, profit, deposit);
  try {
    await User.findByIdAndUpdate(userId, { profit, deposit });
    res.redirect("/asdfjduadminusers");
  } catch (err) {
    res.status(500).send("Error updating user");
  }
});

app.post("/admin/delete", async (req, res) => {
  const userId = req.body;
  try {
    console.log(userId);
    await User.findByIdAndDelete(userId);
    res.redirect("/asdfjduadminusers");
  } catch (err) {
    res.status(500).send("Error deleting user");
  }
});

app.delete("/del/users", async (req, res) => {
  const arrUsers = await User.find();
  try {
    for (var user of arrUsers) {
      var userLength = arrUsers.filter(
        (element) => element.username === user.username
      ).length;
      if (userLength > 1) {
        var delUser = await User.deleteMany({ username: user.username });
        console.log(delUser);
      }
    }
    const newUsers = await User.find();
    res.json({ newUsers });
  } catch (error) {
    console.log(error);
  }
});

app.listen(4000, () => {
  console.log("Listening");
});
